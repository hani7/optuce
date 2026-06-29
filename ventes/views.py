from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Sum, Count, Q
from datetime import date, timedelta
from .models import Vente, LigneVente, Encaissement
from .serializers import (
    VenteListSerializer, VenteDetailSerializer, VenteCreateSerializer,
    LigneVenteSerializer, EncaissementSerializer
)


class VenteViewSet(viewsets.ModelViewSet):
    queryset = Vente.objects.select_related('patient', 'vendeur').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'type_document', 'patient', 'vendeur']
    search_fields = ['numero', 'patient__nom', 'patient__prenom']
    ordering_fields = ['date', 'total_ttc']
    ordering = ['-date']

    def get_serializer_class(self):
        if self.action == 'list':
            return VenteListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return VenteCreateSerializer
        return VenteDetailSerializer

    @action(detail=True, methods=['post'])
    def ajouter_ligne(self, request, pk=None):
        """Ajouter une ligne à une vente existante"""
        vente = self.get_object()
        serializer = LigneVenteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(vente=vente)
            vente.calcul_totaux()
            vente.save()
            return Response(VenteDetailSerializer(vente).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def ajouter_encaissement(self, request, pk=None):
        """Ajouter un paiement/acompte à une vente"""
        vente = self.get_object()
        serializer = EncaissementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(vente=vente)
            vente.calcul_totaux()
            vente.save()
            return Response(VenteDetailSerializer(vente).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def finaliser(self, request, pk=None):
        """Finaliser une vente brouillon"""
        vente = self.get_object()
        vente.statut = 'finalisee'
        vente.save()
        return Response(VenteDetailSerializer(vente).data)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """KPIs pour le tableau de bord"""
        today = date.today()
        debut_mois = today.replace(day=1)
        debut_semaine = today - timedelta(days=today.weekday())

        ventes_finalisees = Vente.objects.filter(statut='finalisee')

        return Response({
            'ca_aujourd_hui': ventes_finalisees.filter(
                date__date=today
            ).aggregate(total=Sum('total_ttc'))['total'] or 0,
            'ca_semaine': ventes_finalisees.filter(
                date__date__gte=debut_semaine
            ).aggregate(total=Sum('total_ttc'))['total'] or 0,
            'ca_mois': ventes_finalisees.filter(
                date__date__gte=debut_mois
            ).aggregate(total=Sum('total_ttc'))['total'] or 0,
            'nb_ventes_aujourd_hui': ventes_finalisees.filter(date__date=today).count(),
            'nb_ventes_mois': ventes_finalisees.filter(date__date__gte=debut_mois).count(),
            'ventes_non_soldees': Vente.objects.filter(
                statut='finalisee', total_paye__lt=models.F('total_ttc')
            ).count() if hasattr(Vente, 'objects') else 0,
        })


class LigneVenteViewSet(viewsets.ModelViewSet):
    queryset = LigneVente.objects.all()
    serializer_class = LigneVenteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['vente', 'type_article']


class EncaissementViewSet(viewsets.ModelViewSet):
    queryset = Encaissement.objects.all()
    serializer_class = EncaissementSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['vente', 'mode', 'est_acompte']
    ordering = ['-date']
