from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganismePayeurViewSet, CarteChifaViewSet, TiersPayantViewSet

router = DefaultRouter()
router.register(r'organismes', OrganismePayeurViewSet, basename='organisme')
router.register(r'cartes-chifa', CarteChifaViewSet, basename='carte-chifa')
router.register(r'tiers-payants', TiersPayantViewSet, basename='tiers-payant')

urlpatterns = [path('', include(router.urls))]
