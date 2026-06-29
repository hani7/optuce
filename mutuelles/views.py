from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, F, Q, Count
from django.utils import timezone
from .models import OrganismePayeur, CarteChifa, TiersPayant
from .serializers import (
    OrganismePayeurSerializer, CarteChifaSerializer,
    TiersPayantSerializer, TiersPayantCalculerSerializer
)


class OrganismePayeurViewSet(viewsets.ModelViewSet):
    queryset = OrganismePayeur.objects.filter(actif=True)
    serializer_class = OrganismePayeurSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type_organisme']
    search_fields = ['nom', 'code', 'contact_nom']

    @action(detail=False, methods=['get'])
    def creances(self, request):
        """Tableau des créances par organisme"""
        organismes = self.get_queryset()
        data = []
        for org in organismes:
            creances = TiersPayant.objects.filter(
                organisme=org
            ).exclude(statut__in=['rembourse', 'rejete'])

            total_du = creances.aggregate(
                total=Sum(F('montant_pris_en_charge') - F('montant_rembourse_reel'))
            )['total'] or 0

            en_attente = creances.filter(statut='en_attente').aggregate(Sum('montant_pris_en_charge'))['montant_pris_en_charge__sum'] or 0
            soumis = creances.filter(statut='soumis').aggregate(Sum('montant_pris_en_charge'))['montant_pris_en_charge__sum'] or 0

            data.append({
                'id': org.id,
                'nom': org.nom,
                'type': org.get_type_organisme_display(),
                'nb_dossiers_ouverts': creances.count(),
                'total_du': total_du,
                'en_attente': en_attente,
                'soumis': soumis,
                'tiers_payants': TiersPayantSerializer(creances.order_by('-date_creation')[:5], many=True).data,
            })

        data.sort(key=lambda x: x['total_du'], reverse=True)
        return Response(data)


class CarteChifaViewSet(viewsets.ModelViewSet):
    queryset = CarteChifa.objects.select_related('patient', 'organisme').all()
    serializer_class = CarteChifaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['organisme', 'actif']
    search_fields = ['numero_carte', 'patient__nom', 'patient__prenom']

    @action(detail=False, methods=['get'])
    def expirees(self, request):
        expirees = [c for c in self.get_queryset() if c.est_expiree]
        return Response(CarteChifaSerializer(expirees, many=True).data)


class TiersPayantViewSet(viewsets.ModelViewSet):
    queryset = TiersPayant.objects.select_related(
        'vente', 'vente__patient', 'organisme', 'carte_chifa'
    ).all()
    serializer_class = TiersPayantSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'organisme']
    search_fields = ['vente__numero', 'vente__patient__nom', 'numero_bon_prise_en_charge']
    ordering = ['-date_creation']

    @action(detail=False, methods=['post'])
    def calculer(self, request):
        """
        Calcule automatiquement les montants d'un tiers-payant
        à partir d'une vente et d'un organisme/carte Chifa
        """
        ser = TiersPayantCalculerSerializer(data=request.data)
        if not ser.is_valid():
            return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

        from ventes.models import Vente, LigneVente
        vente_id = ser.validated_data['vente_id']
        organisme_id = ser.validated_data['organisme_id']
        carte_id = ser.validated_data.get('carte_chifa_id')

        try:
            vente = Vente.objects.prefetch_related('lignes').get(id=vente_id)
            organisme = OrganismePayeur.objects.get(id=organisme_id)
        except (Vente.DoesNotExist, OrganismePayeur.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

        carte = None
        if carte_id:
            try:
                carte = CarteChifa.objects.get(id=carte_id)
            except CarteChifa.DoesNotExist:
                pass

        # Calcul des montants par type de ligne
        montant_montures = sum(
            l.total_ligne for l in vente.lignes.filter(type_article='monture')
        )
        montant_verres = sum(
            l.total_ligne for l in vente.lignes.filter(
                type_article__in=['verre_od', 'verre_og']
            )
        )

        # Taux effectifs
        if carte:
            taux_m = float(carte.taux_effectif_montures)
            taux_v = float(carte.taux_effectif_verres)
        else:
            taux_m = float(ser.validated_data.get('taux_montures', organisme.taux_remboursement_montures))
            taux_v = float(ser.validated_data.get('taux_verres', organisme.taux_remboursement_verres))

        pec_montures = montant_montures * taux_m / 100
        pec_verres = montant_verres * taux_v / 100

        # Appliquer plafonds
        if organisme.plafond_montures:
            pec_montures = min(pec_montures, float(organisme.plafond_montures))
        if organisme.plafond_verres:
            pec_verres = min(pec_verres, float(organisme.plafond_verres))

        montant_pec = pec_montures + pec_verres
        ticket_moderateur = float(vente.total_ttc) - montant_pec

        return Response({
            'montant_total_vente': vente.total_ttc,
            'detail': {
                'montures': {
                    'montant': montant_montures,
                    'taux': taux_m,
                    'prise_en_charge': round(pec_montures, 2),
                },
                'verres': {
                    'montant': montant_verres,
                    'taux': taux_v,
                    'prise_en_charge': round(pec_verres, 2),
                },
            },
            'montant_pris_en_charge': round(montant_pec, 2),
            'ticket_moderateur': round(ticket_moderateur, 2),
        })

    @action(detail=True, methods=['post'])
    def changer_statut(self, request, pk=None):
        tp = self.get_object()
        nouveau_statut = request.data.get('statut')
        valides = [s[0] for s in TiersPayant.STATUT_CHOICES]
        if nouveau_statut not in valides:
            return Response({'error': 'Statut invalide'}, status=status.HTTP_400_BAD_REQUEST)
        tp.statut = nouveau_statut
        if nouveau_statut == 'soumis' and not tp.date_soumission:
            tp.date_soumission = timezone.now().date()
        if nouveau_statut == 'rembourse':
            tp.date_remboursement_reel = timezone.now().date()
            montant = request.data.get('montant_rembourse')
            if montant:
                tp.montant_rembourse_reel = montant
        tp.save()
        return Response(TiersPayantSerializer(tp).data)

    @action(detail=False, methods=['get'])
    def tableau_bord(self, request):
        """KPIs tiers-payant"""
        qs = TiersPayant.objects.all()
        return Response({
            'total_en_attente': qs.filter(statut='en_attente').aggregate(
                s=Sum('montant_pris_en_charge'))['s'] or 0,
            'total_soumis': qs.filter(statut='soumis').aggregate(
                s=Sum('montant_pris_en_charge'))['s'] or 0,
            'total_rembourse_ce_mois': qs.filter(
                statut='rembourse',
                date_remboursement_reel__month=timezone.now().month
            ).aggregate(s=Sum('montant_rembourse_reel'))['s'] or 0,
            'nb_rejets': qs.filter(statut='rejete').count(),
            'nb_litiges': qs.filter(statut='litige').count(),
            'total_creances': qs.exclude(
                statut__in=['rembourse', 'rejete']
            ).aggregate(
                s=Sum(F('montant_pris_en_charge') - F('montant_rembourse_reel'))
            )['s'] or 0,
        })
