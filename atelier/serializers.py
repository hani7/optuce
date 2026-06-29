from rest_framework import serializers
from .models import Fournisseur, CommandeFournisseur, BonCommande, AchatFournisseur


class FournisseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fournisseur
        fields = '__all__'


class BonCommandeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonCommande
        fields = '__all__'


class CommandeFournisseurListSerializer(serializers.ModelSerializer):
    fournisseur_nom = serializers.CharField(source='fournisseur.nom', read_only=True)
    patient_nom = serializers.CharField(source='patient.nom_complet', read_only=True)
    est_en_retard = serializers.BooleanField(read_only=True)
    jours_retard = serializers.IntegerField(read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    priorite_display = serializers.CharField(source='get_priorite_display', read_only=True)

    class Meta:
        model = CommandeFournisseur
        fields = [
            'id', 'numero', 'fournisseur', 'fournisseur_nom', 'patient', 'patient_nom',
            'statut', 'statut_display', 'priorite', 'priorite_display',
            'date_livraison_prevue', 'est_en_retard', 'jours_retard',
            'date_creation', 'description'
        ]


class CommandeFournisseurDetailSerializer(serializers.ModelSerializer):
    fournisseur_nom = serializers.CharField(source='fournisseur.nom', read_only=True)
    patient_nom = serializers.CharField(source='patient.nom_complet', read_only=True)
    est_en_retard = serializers.BooleanField(read_only=True)
    jours_retard = serializers.IntegerField(read_only=True)
    bons = BonCommandeSerializer(many=True, read_only=True)

    class Meta:
        model = CommandeFournisseur
        fields = '__all__'


class AchatFournisseurSerializer(serializers.ModelSerializer):
    fournisseur_nom = serializers.CharField(source='fournisseur.nom', read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)

    class Meta:
        model = AchatFournisseur
        fields = '__all__'
