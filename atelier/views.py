from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Fournisseur, CommandeFournisseur, BonCommande, AchatFournisseur
from .serializers import (
    FournisseurSerializer,
    CommandeFournisseurListSerializer, CommandeFournisseurDetailSerializer,
    BonCommandeSerializer, AchatFournisseurSerializer
)


class FournisseurViewSet(viewsets.ModelViewSet):
    queryset = Fournisseur.objects.filter(actif=True)
    serializer_class = FournisseurSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom', 'email', 'contact_nom']


class CommandeFournisseurViewSet(viewsets.ModelViewSet):
    queryset = CommandeFournisseur.objects.select_related('fournisseur', 'patient').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'fournisseur', 'priorite', 'patient']
    search_fields = ['numero', 'description', 'patient__nom', 'patient__prenom']
    ordering_fields = ['date_creation', 'date_livraison_prevue', 'priorite']
    ordering = ['-date_creation']

    def get_serializer_class(self):
        if self.action == 'list':
            return CommandeFournisseurListSerializer
        return CommandeFournisseurDetailSerializer

    @action(detail=False, methods=['get'])
    def kanban(self, request):
        """Retourne les commandes groupées par statut pour le tableau Kanban"""
        qs = self.get_queryset()
        statuts = CommandeFournisseur.STATUT_CHOICES
        kanban_data = {}
        for code, label in statuts:
            commandes = qs.filter(statut=code)
            kanban_data[code] = {
                'label': label,
                'count': commandes.count(),
                'commandes': CommandeFournisseurListSerializer(commandes, many=True).data
            }
        return Response(kanban_data)

    @action(detail=False, methods=['get'])
    def retards(self, request):
        """Retourne les commandes en retard"""
        today = timezone.now().date()
        retards = [
            c for c in self.get_queryset()
            if c.est_en_retard
        ]
        serializer = CommandeFournisseurListSerializer(retards, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def changer_statut(self, request, pk=None):
        """Changer le statut d'une commande (pour le glisser-déposer Kanban)"""
        commande = self.get_object()
        nouveau_statut = request.data.get('statut')
        statuts_valides = [s[0] for s in CommandeFournisseur.STATUT_CHOICES]
        if nouveau_statut not in statuts_valides:
            return Response({'error': 'Statut invalide'}, status=status.HTTP_400_BAD_REQUEST)
        commande.statut = nouveau_statut
        if nouveau_statut == 'commande' and not commande.date_commande:
            commande.date_commande = timezone.now().date()
            # Calculer date prévue
            if not commande.date_livraison_prevue and commande.fournisseur:
                from datetime import timedelta
                delai = commande.fournisseur.delai_livraison_jours
                commande.date_livraison_prevue = commande.date_commande + timedelta(days=delai)
        if nouveau_statut == 'livre':
            commande.date_livraison_reelle = timezone.now().date()
        commande.save()
        return Response(CommandeFournisseurDetailSerializer(commande).data)


class BonCommandeViewSet(viewsets.ModelViewSet):
    queryset = BonCommande.objects.all()
    serializer_class = BonCommandeSerializer


class AchatFournisseurViewSet(viewsets.ModelViewSet):
    queryset = AchatFournisseur.objects.select_related('fournisseur').all()
    serializer_class = AchatFournisseurSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'fournisseur']
    search_fields = ['numero', 'notes']
    ordering_fields = ['date_creation', 'date_commande']
    ordering = ['-date_creation']
