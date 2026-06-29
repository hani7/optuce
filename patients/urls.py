from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, OrdonnanceViewSet, CorrectionViewSet

router = DefaultRouter()
router.register(r'', PatientViewSet, basename='patient')
router.register(r'ordonnances', OrdonnanceViewSet, basename='ordonnance')
router.register(r'corrections', CorrectionViewSet, basename='correction')

urlpatterns = [
    path('', include(router.urls)),
]
