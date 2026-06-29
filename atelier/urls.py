from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FournisseurViewSet, CommandeFournisseurViewSet, BonCommandeViewSet, AchatFournisseurViewSet

router = DefaultRouter()
router.register(r'fournisseurs', FournisseurViewSet, basename='fournisseur')
router.register(r'commandes', CommandeFournisseurViewSet, basename='commande')
router.register(r'bons', BonCommandeViewSet, basename='bon')
router.register(r'achats', AchatFournisseurViewSet, basename='achat')

urlpatterns = [
    path('', include(router.urls)),
]
