from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MarqueViewSet, MontureViewSet, VerreViewSet, LentilleViewSet, AccessoireViewSet

router = DefaultRouter()
router.register(r'marques', MarqueViewSet, basename='marque')
router.register(r'montures', MontureViewSet, basename='monture')
router.register(r'verres', VerreViewSet, basename='verre')
router.register(r'lentilles', LentilleViewSet, basename='lentille')
router.register(r'accessoires', AccessoireViewSet, basename='accessoire')

urlpatterns = [
    path('', include(router.urls)),
]
