from django.urls import path
from .views import StatistiquesCAView, StatistiquesTopVentesView, StatistiquesMargesView

urlpatterns = [
    path('ca/', StatistiquesCAView.as_view(), name='stats-ca'),
    path('top-ventes/', StatistiquesTopVentesView.as_view(), name='stats-top-ventes'),
    path('marges/', StatistiquesMargesView.as_view(), name='stats-marges'),
]
