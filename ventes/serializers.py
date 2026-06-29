from rest_framework import serializers
from .models import Vente, LigneVente, Encaissement


class EncaissementSerializer(serializers.ModelSerializer):
    mode_display = serializers.CharField(source='get_mode_display', read_only=True)

    class Meta:
        model = Encaissement
        fields = '__all__'


class LigneVenteSerializer(serializers.ModelSerializer):
    total_ligne = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = LigneVente
        fields = '__all__'


class VenteListSerializer(serializers.ModelSerializer):
    patient_nom = serializers.CharField(source='patient.nom_complet', read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    reste_a_payer = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    est_solde = serializers.BooleanField(read_only=True)

    class Meta:
        model = Vente
        fields = [
            'id', 'numero', 'type_document', 'statut', 'statut_display',
            'patient', 'patient_nom', 'date', 'total_ttc',
            'total_paye', 'reste_a_payer', 'est_solde'
        ]


class VenteDetailSerializer(serializers.ModelSerializer):
    patient_nom = serializers.CharField(source='patient.nom_complet', read_only=True)
    lignes = LigneVenteSerializer(many=True, read_only=True)
    encaissements = EncaissementSerializer(many=True, read_only=True)
    reste_a_payer = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    est_solde = serializers.BooleanField(read_only=True)

    class Meta:
        model = Vente
        fields = '__all__'


class VenteCreateSerializer(serializers.ModelSerializer):
    lignes = LigneVenteSerializer(many=True, required=False)

    class Meta:
        model = Vente
        fields = '__all__'
        read_only_fields = ['numero', 'sous_total', 'remise_montant', 'total_ttc', 'total_paye']

    def create(self, validated_data):
        lignes_data = validated_data.pop('lignes', [])
        vente = Vente.objects.create(**validated_data)
        for ligne_data in lignes_data:
            LigneVente.objects.create(vente=vente, **ligne_data)
        vente.calcul_totaux()
        vente.save()
        return vente
