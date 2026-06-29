from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VenteViewSet, LigneVenteViewSet, EncaissementViewSet

router = DefaultRouter()
router.register(r'', VenteViewSet, basename='vente')
router.register(r'lignes', LigneVenteViewSet, basename='ligne')
router.register(r'encaissements', EncaissementViewSet, basename='encaissement')

urlpatterns = [
    path('', include(router.urls)),
]
