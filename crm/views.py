from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import timedelta
from .models import (
    ProgrammeFidelite, CompteFidelite, TransactionFidelite,
    GroupeFamilial, ModeleMessage, MessageEnvoye, Rappel
)
from .serializers import (
    ProgrammeFideliteSerializer, CompteFideliteSerializer, CompteFideliteListSerializer,
    TransactionFideliteSerializer, GroupeFamilialSerializer,
    ModeleMessageSerializer, MessageEnvoyeSerializer, RappelSerializer,
    EnvoiMessageSerializer
)


class ProgrammeFideliteViewSet(viewsets.ModelViewSet):
    queryset = ProgrammeFidelite.objects.all()
    serializer_class = ProgrammeFideliteSerializer


class CompteFideliteViewSet(viewsets.ModelViewSet):
    queryset = CompteFidelite.objects.select_related('patient').all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['patient__nom', 'patient__prenom', 'patient__telephone']
    ordering_fields = ['points_cumules', 'date_modification']
    ordering = ['-points_cumules']

    def get_serializer_class(self):
        if self.action == 'list':
            return CompteFideliteListSerializer
        return CompteFideliteSerializer

    @action(detail=True, methods=['post'])
    def ajouter_points(self, request, pk=None):
        compte = self.get_object()
        points = int(request.data.get('points', 0))
        description = request.data.get('description', 'Ajout manuel')
        if points == 0:
            return Response({'error': 'Points requis'}, status=status.HTTP_400_BAD_REQUEST)
        TransactionFidelite.objects.create(
            compte=compte,
            type_transaction='bonus' if points > 0 else 'correction',
            points=points,
            description=description,
            cree_par=request.user if request.user.is_authenticated else None,
        )
        compte.points_cumules += max(0, points)
        if points < 0:
            compte.points_utilises += abs(points)
        compte.save()
        return Response(CompteFideliteSerializer(compte).data)

    @action(detail=True, methods=['post'])
    def utiliser_points(self, request, pk=None):
        compte = self.get_object()
        points = int(request.data.get('points', 0))
        if points <= 0:
            return Response({'error': 'Nombre de points invalide'}, status=status.HTTP_400_BAD_REQUEST)
        if points > compte.points_disponibles:
            return Response({'error': 'Points insuffisants'}, status=status.HTTP_400_BAD_REQUEST)
        TransactionFidelite.objects.create(
            compte=compte,
            type_transaction='utilisation',
            points=-points,
            description=request.data.get('description', 'Utilisation points'),
            cree_par=request.user if request.user.is_authenticated else None,
        )
        compte.points_utilises += points
        compte.save()
        prog = ProgrammeFidelite.objects.filter(actif=True).first()
        remise = points * float(prog.valeur_point_da) if prog else 0
        return Response({'points_utilises': points, 'remise_accordee': remise})


class GroupeFamilialViewSet(viewsets.ModelViewSet):
    queryset = GroupeFamilial.objects.prefetch_related('membres').all()
    serializer_class = GroupeFamilialSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom']

    @action(detail=True, methods=['post'])
    def ajouter_membre(self, request, pk=None):
        groupe = self.get_object()
        patient_id = request.data.get('patient_id')
        from patients.models import Patient
        try:
            patient = Patient.objects.get(id=patient_id)
            groupe.membres.add(patient)
            groupe.calculer_remise()
            return Response(GroupeFamilialSerializer(groupe).data)
        except Patient.DoesNotExist:
            return Response({'error': 'Patient non trouvé'}, status=status.HTTP_404_NOT_FOUND)


class ModeleMessageViewSet(viewsets.ModelViewSet):
    queryset = ModeleMessage.objects.filter(actif=True)
    serializer_class = ModeleMessageSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type_canal', 'categorie']
    search_fields = ['nom']


class MessageEnvoyeViewSet(viewsets.ModelViewSet):
    queryset = MessageEnvoye.objects.select_related('patient', 'modele').all()
    serializer_class = MessageEnvoyeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['canal', 'statut', 'patient']
    search_fields = ['patient__nom', 'patient__prenom', 'contenu']
    ordering = ['-date_creation']

    @action(detail=False, methods=['post'])
    def envoyer(self, request):
        """Envoyer un message à un ou plusieurs patients"""
        ser = EnvoiMessageSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        from patients.models import Patient
        patients = Patient.objects.filter(id__in=ser.validated_data['patient_ids'])
        canal = ser.validated_data['canal']
        modele_id = ser.validated_data.get('modele_id')
        modele = None
        if modele_id:
            try:
                modele = ModeleMessage.objects.get(id=modele_id)
            except ModeleMessage.DoesNotExist:
                pass

        messages_crees = []
        for patient in patients:
            # Générer le contenu
            if modele:
                contenu = modele.render({
                    'patient_nom': patient.prenom,
                    'patient_nom_complet': patient.nom_complet,
                    'date_rappel': timezone.now().strftime('%d/%m/%Y'),
                    'opticien_nom': 'Optuce',
                })
            else:
                contenu = ser.validated_data.get('contenu_personnalise', '')

            numero = patient.telephone if canal != 'email' else patient.email
            if not numero:
                continue

            msg = MessageEnvoye.objects.create(
                patient=patient,
                modele=modele,
                canal=canal,
                numero_destinataire=numero,
                contenu=contenu,
                statut='envoye',
                date_envoi=timezone.now(),
                cree_par=request.user if request.user.is_authenticated else None,
            )
            messages_crees.append(msg.id)

        return Response({
            'success': True,
            'messages_envoyes': len(messages_crees),
            'ids': messages_crees,
        })


class RappelViewSet(viewsets.ModelViewSet):
    queryset = Rappel.objects.select_related('patient', 'modele').all()
    serializer_class = RappelSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'type_rappel', 'canal', 'patient']
    search_fields = ['patient__nom', 'patient__prenom']
    ordering = ['date_prevue']

    @action(detail=False, methods=['get'])
    def du_jour(self, request):
        """Rappels à envoyer aujourd'hui"""
        rappels = self.get_queryset().filter(
            statut='programme',
            date_prevue=timezone.now().date()
        )
        return Response(RappelSerializer(rappels, many=True).data)

    @action(detail=False, methods=['get'])
    def en_retard(self, request):
        rappels = [r for r in self.get_queryset().filter(statut='programme') if r.est_en_retard]
        return Response(RappelSerializer(rappels, many=True).data)

    @action(detail=False, methods=['post'])
    def generer_rappels_controle(self, request):
        """
        Génère automatiquement des rappels de contrôle de vue
        pour les patients dont la dernière ordonnance date de 2 ans ou plus
        """
        from patients.models import Patient, Ordonnance
        from datetime import date
        seuil = date.today() - timedelta(days=730)  # 2 ans

        # Patients avec dernière ordonnance > 2 ans
        patients_anciens = Patient.objects.filter(
            ordonnances__date__lte=seuil
        ).exclude(
            rappels__type_rappel='controle_vue',
            rappels__statut='programme'
        ).distinct()

        rappels_crees = 0
        modele = ModeleMessage.objects.filter(
            categorie='rappel_visite', actif=True
        ).first()

        for patient in patients_anciens:
            Rappel.objects.get_or_create(
                patient=patient,
                type_rappel='controle_vue',
                statut='programme',
                defaults={
                    'date_prevue': date.today(),
                    'canal': 'sms',
                    'modele': modele,
                    'note': 'Généré automatiquement — dernière visite > 2 ans',
                }
            )
            rappels_crees += 1

        return Response({
            'rappels_crees': rappels_crees,
            'message': f'{rappels_crees} rappel(s) de contrôle générés.'
        })
