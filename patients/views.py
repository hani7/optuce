from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Patient, Ordonnance, Correction
from .serializers import (
    PatientListSerializer, PatientDetailSerializer,
    OrdonnanceSerializer, OrdonnanceCreateSerializer,
    CorrectionSerializer
)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'prenom', 'telephone', 'email']
    ordering_fields = ['nom', 'prenom', 'date_creation']
    ordering = ['-date_creation']

    def get_serializer_class(self):
        if self.action == 'list':
            return PatientListSerializer
        return PatientDetailSerializer

    @action(detail=True, methods=['get'])
    def ordonnances(self, request, pk=None):
        """Retourne toutes les ordonnances d'un patient"""
        patient = self.get_object()
        ordonnances = patient.ordonnances.all()
        serializer = OrdonnanceSerializer(ordonnances, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def derniere_ordonnance(self, request, pk=None):
        """Retourne la dernière ordonnance du patient"""
        patient = self.get_object()
        ordonnance = patient.ordonnances.first()
        if ordonnance:
            serializer = OrdonnanceSerializer(ordonnance)
            return Response(serializer.data)
        return Response({'detail': 'Aucune ordonnance trouvée.'}, status=status.HTTP_404_NOT_FOUND)


class OrdonnanceViewSet(viewsets.ModelViewSet):
    queryset = Ordonnance.objects.select_related('patient', 'correction').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['patient']
    search_fields = ['medecin', 'patient__nom', 'patient__prenom']
    ordering = ['-date']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return OrdonnanceCreateSerializer
        return OrdonnanceSerializer


class CorrectionViewSet(viewsets.ModelViewSet):
    queryset = Correction.objects.select_related('ordonnance__patient').all()
    serializer_class = CorrectionSerializer
