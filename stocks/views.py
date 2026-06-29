from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Marque, Monture, Verre, Lentille, Accessoire, Categorie
from .serializers import (
    MarqueSerializer, MontureSerializer, VerreSerializer,
    LentilleSerializer, AccessoireSerializer, CategorieSerializer
)


class MarqueViewSet(viewsets.ModelViewSet):
    queryset = Marque.objects.all()
    serializer_class = MarqueSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom']


class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom']


class MontureViewSet(viewsets.ModelViewSet):
    queryset = Monture.objects.select_related('marque').filter(actif=True)
    serializer_class = MontureSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['marque', 'sexe', 'couleur', 'materiau']
    search_fields = ['modele', 'couleur', 'code_barres', 'reference', 'marque__nom']
    ordering_fields = ['prix_vente', 'stock', 'date_creation']

    @action(detail=False, methods=['get'])
    def alertes_stock(self, request):
        """Retourne les montures avec stock bas"""
        alertes = [m for m in self.get_queryset() if m.alerte_stock]
        serializer = self.get_serializer(alertes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def matrice(self, request):
        """Retourne la matrice Marque > Modèle > Sexe > Couleur > Taille"""
        from itertools import groupby
        montures = self.get_queryset().order_by('marque__nom', 'modele', 'sexe', 'couleur')
        data = {}
        for m in montures:
            marque = m.marque.nom
            if marque not in data:
                data[marque] = {}
            if m.modele not in data[marque]:
                data[marque][m.modele] = {}
            sexe = m.get_sexe_display()
            if sexe not in data[marque][m.modele]:
                data[marque][m.modele][sexe] = []
            data[marque][m.modele][sexe].append({
                'id': m.id,
                'couleur': m.couleur,
                'taille': m.taille,
                'stock': m.stock,
                'prix_vente': str(m.prix_vente),
                'alerte': m.alerte_stock,
            })
        return Response(data)


class VerreViewSet(viewsets.ModelViewSet):
    queryset = Verre.objects.filter(actif=True)
    serializer_class = VerreSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['indice', 'traitement', 'type_verre', 'fournisseur']
    search_fields = ['reference']

    @action(detail=False, methods=['get'])
    def grille(self, request):
        """Retourne la grille verres par indice / traitement"""
        verres = self.get_queryset()
        data = {}
        for v in verres:
            indice = v.indice
            traitement = v.traitement
            if indice not in data:
                data[indice] = {}
            if traitement not in data[indice]:
                data[indice][traitement] = []
            data[indice][traitement].append(VerreSerializer(v).data)
        return Response(data)


class LentilleViewSet(viewsets.ModelViewSet):
    queryset = Lentille.objects.filter(actif=True)
    serializer_class = LentilleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['marque', 'type_port']
    search_fields = ['marque', 'reference', 'numero_lot']

    @action(detail=False, methods=['get'])
    def alertes_dlc(self, request):
        """Retourne les lentilles avec DLC proche (< 90 jours)"""
        alertes = [l for l in self.get_queryset() if l.alerte_dlc]
        serializer = self.get_serializer(alertes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def alertes_stock(self, request):
        alertes = [l for l in self.get_queryset() if l.alerte_stock]
        serializer = self.get_serializer(alertes, many=True)
        return Response(serializer.data)


class AccessoireViewSet(viewsets.ModelViewSet):
    queryset = Accessoire.objects.filter(actif=True)
    serializer_class = AccessoireSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['categorie']
    search_fields = ['nom', 'reference', 'code_barres']
