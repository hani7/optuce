from django.contrib import admin
from .models import Vente, LigneVente, Encaissement


class LigneVenteInline(admin.TabularInline):
    model = LigneVente
    extra = 0
    fields = ['designation', 'type_article', 'quantite', 'prix_unitaire', 'remise']


class EncaissementInline(admin.TabularInline):
    model = Encaissement
    extra = 0
    fields = ['mode', 'montant', 'date', 'est_acompte', 'reference']


@admin.register(Vente)
class VenteAdmin(admin.ModelAdmin):
    list_display = [
        'numero', 'type_document', 'patient', 'date',
        'total_ttc', 'total_paye', 'statut', 'solde_display'
    ]
    list_filter = ['statut', 'type_document', 'date', 'vendeur']
    search_fields = ['numero', 'patient__nom', 'patient__prenom']
    raw_id_fields = ['patient']
    readonly_fields = ['numero', 'sous_total', 'remise_montant', 'total_ttc', 'total_paye']
    inlines = [LigneVenteInline, EncaissementInline]

    def solde_display(self, obj):
        return '✅ Soldé' if obj.est_solde else f'⚠ Reste: {obj.reste_a_payer:.2f} DA'
    solde_display.short_description = 'Règlement'


@admin.register(Encaissement)
class EncaissementAdmin(admin.ModelAdmin):
    list_display = ['vente', 'mode', 'montant', 'date', 'est_acompte']
    list_filter = ['mode', 'est_acompte', 'date']
