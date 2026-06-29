"""
URL configuration for Optuce project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth JWT
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Modules API
    path('api/ventes/', include('ventes.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/stocks/', include('stocks.urls')),
    path('api/atelier/', include('atelier.urls')),
    path('api/mutuelles/', include('mutuelles.urls')),
    path('api/crm/', include('crm.urls')),
    path('api/statistiques/', include('statistiques.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Admin site customization
admin.site.site_header = '🔭 Optuce Administration'
admin.site.site_title = 'Optuce'
admin.site.index_title = 'Gestion Optique'
