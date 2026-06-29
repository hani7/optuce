from django.contrib import admin
from .models import (
    ProgrammeFidelite, CompteFidelite, TransactionFidelite,
    GroupeFamilial, ModeleMessage, MessageEnvoye, Rappel
)


@admin.register(ProgrammeFidelite)
class ProgrammeFideliteAdmin(admin.ModelAdmin):
    list_display = ['nom', 'points_par_dinar', 'valeur_point_da', 'taux_remise_familiale', 'actif']


class TransactionFideliteInline(admin.TabularInline):
    model = TransactionFidelite
    extra = 0
    readonly_fields = ['date']


@admin.register(CompteFidelite)
class CompteFideliteAdmin(admin.ModelAdmin):
    list_display = ['patient', 'points_cumules', 'points_utilises', 'points_disponibles_display']
    search_fields = ['patient__nom', 'patient__prenom']
    inlines = [TransactionFideliteInline]

    def points_disponibles_display(self, obj):
        return f'{obj.points_disponibles} pts'
    points_disponibles_display.short_description = 'Disponibles'


@admin.register(GroupeFamilial)
class GroupeFamilialAdmin(admin.ModelAdmin):
    list_display = ['nom', 'taux_remise', 'nb_membres_display']
    filter_horizontal = ['membres']

    def nb_membres_display(self, obj):
        return obj.membres.count()
    nb_membres_display.short_description = 'Membres'


@admin.register(ModeleMessage)
class ModeleMessageAdmin(admin.ModelAdmin):
    list_display = ['nom', 'type_canal', 'categorie', 'actif']
    list_filter = ['type_canal', 'categorie', 'actif']


@admin.register(MessageEnvoye)
class MessageEnvoyeAdmin(admin.ModelAdmin):
    list_display = ['patient', 'canal', 'statut', 'date_envoi']
    list_filter = ['canal', 'statut']
    readonly_fields = ['date_creation', 'date_envoi']


@admin.register(Rappel)
class RappelAdmin(admin.ModelAdmin):
    list_display = ['patient', 'type_rappel', 'date_prevue', 'statut', 'canal']
    list_filter = ['type_rappel', 'statut', 'canal']
    date_hierarchy = 'date_prevue'
