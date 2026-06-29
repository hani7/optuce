from django.contrib import admin
from .models import Marque, Monture, Verre, Lentille, Accessoire


@admin.register(Marque)
class MarqueAdmin(admin.ModelAdmin):
    list_display = ['nom']
    search_fields = ['nom']


@admin.register(Monture)
class MontureAdmin(admin.ModelAdmin):
    list_display = ['marque', 'modele', 'couleur', 'sexe', 'taille', 'stock', 'prix_vente', 'alerte_stock']
    list_filter = ['marque', 'sexe', 'materiau', 'actif']
    search_fields = ['modele', 'couleur', 'code_barres', 'reference', 'marque__nom']
    list_editable = ['stock', 'prix_vente']

    def alerte_stock(self, obj):
        return obj.alerte_stock
    alerte_stock.boolean = True
    alerte_stock.short_description = '⚠ Stock bas'


@admin.register(Verre)
class VerreAdmin(admin.ModelAdmin):
    list_display = ['reference', 'type_verre', 'indice', 'traitement', 'stock', 'prix_vente']
    list_filter = ['indice', 'traitement', 'type_verre', 'fournisseur']
    search_fields = ['reference']


@admin.register(Lentille)
class LentilleAdmin(admin.ModelAdmin):
    list_display = ['marque', 'reference', 'type_port', 'stock', 'date_limite_consommation', 'alerte_dlc_display']
    list_filter = ['marque', 'type_port']
    search_fields = ['marque', 'reference', 'numero_lot']

    def alerte_dlc_display(self, obj):
        return obj.alerte_dlc
    alerte_dlc_display.boolean = True
    alerte_dlc_display.short_description = '⚠ DLC proche'


@admin.register(Accessoire)
class AccessoireAdmin(admin.ModelAdmin):
    list_display = ['nom', 'categorie', 'reference', 'stock', 'prix_vente']
    list_filter = ['categorie']
    search_fields = ['nom', 'reference']
