from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProgrammeFideliteViewSet, CompteFideliteViewSet, GroupeFamilialViewSet,
    ModeleMessageViewSet, MessageEnvoyeViewSet, RappelViewSet
)

router = DefaultRouter()
router.register(r'programme-fidelite', ProgrammeFideliteViewSet, basename='programme')
router.register(r'comptes-fidelite', CompteFideliteViewSet, basename='compte')
router.register(r'groupes-familiaux', GroupeFamilialViewSet, basename='groupe')
router.register(r'modeles-messages', ModeleMessageViewSet, basename='modele')
router.register(r'messages', MessageEnvoyeViewSet, basename='message')
router.register(r'rappels', RappelViewSet, basename='rappel')

urlpatterns = [path('', include(router.urls))]
