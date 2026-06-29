from rest_framework import serializers
from .models import (
    ProgrammeFidelite, CompteFidelite, TransactionFidelite,
    GroupeFamilial, ModeleMessage, MessageEnvoye, Rappel
)


class ProgrammeFideliteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgrammeFidelite
        fields = '__all__'


class TransactionFideliteSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_transaction_display', read_only=True)

    class Meta:
        model = TransactionFidelite
        fields = '__all__'


class CompteFideliteSerializer(serializers.ModelSerializer):
    patient_nom = serializers.CharField(source='patient.nom_complet', read_only=True)
    points_disponibles = serializers.IntegerField(read_only=True)
    transactions = TransactionFideliteSerializer(many=True, read_only=True)

    class Meta:
        model = CompteFidelite
        fields = '__all__'


class CompteFideliteListSerializer(serializers.ModelSerializer):
    patient_nom = serializers.CharField(source='patient.nom_complet', read_only=True)
    patient_telephone = serializers.CharField(source='patient.telephone', read_only=True)
    points_disponibles = serializers.IntegerField(read_only=True)

    class Meta:
        model = CompteFidelite
        fields = ['id', 'patient', 'patient_nom', 'patient_telephone',
                  'points_cumules', 'points_utilises', 'points_disponibles', 'date_modification']


class GroupeFamilialSerializer(serializers.ModelSerializer):
    membres_noms = serializers.SerializerMethodField()
    nb_membres = serializers.SerializerMethodField()

    class Meta:
        model = GroupeFamilial
        fields = '__all__'

    def get_membres_noms(self, obj):
        return [m.nom_complet for m in obj.membres.all()]

    def get_nb_membres(self, obj):
        return obj.membres.count()


class ModeleMessageSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_canal_display', read_only=True)
    categorie_display = serializers.CharField(source='get_categorie_display', read_only=True)

    class Meta:
        model = ModeleMessage
        fields = '__all__'


class MessageEnvoyeSerializer(serializers.ModelSerializer):
    patient_nom = serializers.CharField(source='patient.nom_complet', read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)

    class Meta:
        model = MessageEnvoye
        fields = '__all__'


class RappelSerializer(serializers.ModelSerializer):
    patient_nom = serializers.CharField(source='patient.nom_complet', read_only=True)
    patient_telephone = serializers.CharField(source='patient.telephone', read_only=True)
    type_display = serializers.CharField(source='get_type_rappel_display', read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    est_en_retard = serializers.BooleanField(read_only=True)

    class Meta:
        model = Rappel
        fields = '__all__'


class EnvoiMessageSerializer(serializers.Serializer):
    """Pour envoyer un message à un ou plusieurs patients"""
    patient_ids = serializers.ListField(child=serializers.IntegerField())
    modele_id = serializers.IntegerField(required=False)
    canal = serializers.ChoiceField(choices=['sms', 'whatsapp', 'email'])
    contenu_personnalise = serializers.CharField(required=False)
