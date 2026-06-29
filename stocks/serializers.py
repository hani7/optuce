from rest_framework import serializers
from .models import Marque, Monture, Verre, Lentille, Accessoire


class MarqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marque
        fields = '__all__'


class MontureSerializer(serializers.ModelSerializer):
    marque_nom = serializers.CharField(source='marque.nom', read_only=True)
    sexe_display = serializers.CharField(source='get_sexe_display', read_only=True)
    alerte_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Monture
        fields = '__all__'


class VerreSerializer(serializers.ModelSerializer):
    indice_display = serializers.CharField(source='get_indice_display', read_only=True)
    traitement_display = serializers.CharField(source='get_traitement_display', read_only=True)
    type_display = serializers.CharField(source='get_type_verre_display', read_only=True)
    alerte_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Verre
        fields = '__all__'


class LentilleSerializer(serializers.ModelSerializer):
    type_port_display = serializers.CharField(source='get_type_port_display', read_only=True)
    alerte_stock = serializers.BooleanField(read_only=True)
    alerte_dlc = serializers.BooleanField(read_only=True)
    jours_avant_dlc = serializers.IntegerField(read_only=True)

    class Meta:
        model = Lentille
        fields = '__all__'


class AccessoireSerializer(serializers.ModelSerializer):
    categorie_display = serializers.CharField(source='get_categorie_display', read_only=True)
    alerte_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Accessoire
        fields = '__all__'
