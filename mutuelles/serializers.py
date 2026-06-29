from rest_framework import serializers
from .models import OrganismePayeur, CarteChifa, TiersPayant


class OrganismePayeurSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_organisme_display', read_only=True)
    nb_prises_en_charge = serializers.SerializerMethodField()
    total_creance = serializers.SerializerMethodField()

    class Meta:
        model = OrganismePayeur
        fields = '__all__'

    def get_nb_prises_en_charge(self, obj):
        return obj.prises_en_charge.exclude(statut__in=['rembourse', 'rejete', 'annule']).count()

    def get_total_creance(self, obj):
        from django.db.models import Sum, F
        result = obj.prises_en_charge.exclude(
            statut__in=['rembourse', 'rejete']
        ).aggregate(
            total=Sum(F('montant_pris_en_charge') - F('montant_rembourse_reel'))
        )
        return result['total'] or 0


class CarteChifaSerializer(serializers.ModelSerializer):
    patient_nom = serializers.CharField(source='patient.nom_complet', read_only=True)
    organisme_nom = serializers.CharField(source='organisme.nom', read_only=True)
    est_expiree = serializers.BooleanField(read_only=True)
    taux_effectif_verres = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    taux_effectif_montures = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = CarteChifa
        fields = '__all__'


class TiersPayantSerializer(serializers.ModelSerializer):
    vente_numero = serializers.CharField(source='vente.numero', read_only=True)
    organisme_nom = serializers.CharField(source='organisme.nom', read_only=True)
    patient_nom = serializers.SerializerMethodField()
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    solde_restant = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = TiersPayant
        fields = '__all__'

    def get_patient_nom(self, obj):
        if obj.vente and obj.vente.patient:
            return obj.vente.patient.nom_complet
        return '—'


class TiersPayantCalculerSerializer(serializers.Serializer):
    """Sérialiseur pour calculer automatiquement un tiers-payant"""
    vente_id = serializers.IntegerField()
    organisme_id = serializers.IntegerField()
    carte_chifa_id = serializers.IntegerField(required=False)
    taux_verres = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    taux_montures = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
