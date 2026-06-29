from django.contrib import admin
from .models import Patient, Ordonnance, Correction


class CorrectionInline(admin.StackedInline):
    model = Correction
    extra = 0
    classes = ['collapse']


class OrdonnanceInline(admin.TabularInline):
    model = Ordonnance
    extra = 0
    show_change_link = True
    fields = ['date', 'medecin', 'specialite']


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['nom_complet', 'telephone', 'age', 'profession', 'date_creation']
    search_fields = ['nom', 'prenom', 'telephone', 'email']
    list_filter = ['sexe', 'date_creation']
    inlines = [OrdonnanceInline]
    fieldsets = [
        ('Informations personnelles', {
            'fields': ['nom', 'prenom', 'sexe', 'date_naissance', 'telephone', 'telephone2', 'email']
        }),
        ('Informations complémentaires', {
            'fields': ['profession', 'adresse', 'notes'],
            'classes': ['collapse']
        }),
    ]


@admin.register(Ordonnance)
class OrdonnanceAdmin(admin.ModelAdmin):
    list_display = ['patient', 'date', 'medecin', 'specialite']
    search_fields = ['patient__nom', 'patient__prenom', 'medecin']
    list_filter = ['date', 'specialite']
    inlines = [CorrectionInline]
    raw_id_fields = ['patient']


@admin.register(Correction)
class CorrectionAdmin(admin.ModelAdmin):
    list_display = ['ordonnance', 'vl_od_sphere', 'vl_og_sphere', 'addition']
