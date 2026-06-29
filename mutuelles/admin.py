from django.contrib import admin
from .models import OrganismePayeur, CarteChifa, TiersPayant


@admin.register(OrganismePayeur)
class OrganismePayeurAdmin(admin.ModelAdmin):
    list_display = ['nom', 'type_organisme', 'taux_remboursement_verres', 'taux_remboursement_montures', 'delai_remboursement_jours', 'actif']
    list_filter = ['type_organisme', 'actif']
    search_fields = ['nom', 'code']


@admin.register(CarteChifa)
class CarteChifaAdmin(admin.ModelAdmin):
    list_display = ['numero_carte', 'patient', 'organisme', 'date_expiration', 'actif']
    list_filter = ['organisme', 'actif']
    search_fields = ['numero_carte', 'patient__nom', 'patient__prenom']
    raw_id_fields = ['patient']


@admin.register(TiersPayant)
class TiersPayantAdmin(admin.ModelAdmin):
    list_display = ['vente', 'organisme', 'statut', 'montant_pris_en_charge', 'ticket_moderateur', 'solde_restant_display', 'date_creation']
    list_filter = ['statut', 'organisme']
    search_fields = ['vente__numero', 'numero_bon_prise_en_charge']
    raw_id_fields = ['vente']
    readonly_fields = ['date_creation', 'date_modification']

    def solde_restant_display(self, obj):
        s = obj.solde_restant
        return f'{s:.2f} DA' if s > 0 else '✅ Soldé'
    solde_restant_display.short_description = 'Solde restant'
