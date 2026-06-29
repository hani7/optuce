from django.contrib import admin
from .models import Fournisseur, CommandeFournisseur, BonCommande


@admin.register(Fournisseur)
class FournisseurAdmin(admin.ModelAdmin):
    list_display = ['nom', 'email', 'telephone', 'contact_nom', 'delai_livraison_jours', 'actif']
    search_fields = ['nom', 'email', 'contact_nom']
    list_filter = ['actif']


@admin.register(CommandeFournisseur)
class CommandeFournisseurAdmin(admin.ModelAdmin):
    list_display = [
        'numero', 'fournisseur', 'patient', 'statut', 'priorite',
        'date_livraison_prevue', 'retard_display', 'date_creation'
    ]
    list_filter = ['statut', 'priorite', 'fournisseur']
    search_fields = ['numero', 'patient__nom', 'patient__prenom', 'description']
    raw_id_fields = ['patient', 'vente']
    readonly_fields = ['numero', 'date_creation', 'date_modification']

    def retard_display(self, obj):
        if obj.est_en_retard:
            return f'⚠ {obj.jours_retard}j de retard'
        return '✓'
    retard_display.short_description = 'Retard'


@admin.register(BonCommande)
class BonCommandeAdmin(admin.ModelAdmin):
    list_display = ['numero_bon', 'commande', 'date_emission', 'envoye_par_email']
    list_filter = ['envoye_par_email']
