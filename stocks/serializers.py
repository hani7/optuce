from rest_framework import serializers
from .models import Marque, Monture, Verre, Lentille, Accessoire, Categorie


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'


class MarqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marque
        fields = '__all__'


class MontureSerializer(serializers.ModelSerializer):
    marque_nom = serializers.CharField(source='marque.nom', read_only=True)
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)
    sexe_display = serializers.CharField(source='get_sexe_display', read_only=True)
    alerte_stock = serializers.BooleanField(read_only=True)
    
    # Allow writing via names
    marque_name_input = serializers.CharField(write_only=True, required=False)
    categorie_name_input = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Monture
        fields = '__all__'
        extra_kwargs = {
            'marque': {'required': False},
            'couleur': {'required': False, 'allow_blank': True}
        }

    def _handle_relations(self, validated_data):
        marque_name = validated_data.pop('marque_name_input', None)
        categorie_name = validated_data.pop('categorie_name_input', None)
        
        if marque_name:
            marque, _ = Marque.objects.get_or_create(nom=marque_name)
            validated_data['marque'] = marque
            
        if categorie_name:
            categorie, _ = Categorie.objects.get_or_create(nom=categorie_name)
            validated_data['categorie'] = categorie
            
        return validated_data

    def create(self, validated_data):
        validated_data = self._handle_relations(validated_data)
        if 'marque' not in validated_data:
            marque, _ = Marque.objects.get_or_create(nom='Sans marque')
            validated_data['marque'] = marque
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._handle_relations(validated_data)
        return super().update(instance, validated_data)


class VerreSerializer(serializers.ModelSerializer):
    indice_display = serializers.CharField(source='get_indice_display', read_only=True)
    traitement_display = serializers.CharField(source='get_traitement_display', read_only=True)
    type_display = serializers.CharField(source='get_type_verre_display', read_only=True)
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)
    alerte_stock = serializers.BooleanField(read_only=True)
    
    categorie_name_input = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Verre
        fields = '__all__'

    def create(self, validated_data):
        categorie_name = validated_data.pop('categorie_name_input', None)
        if categorie_name:
            categorie, _ = Categorie.objects.get_or_create(nom=categorie_name)
            validated_data['categorie'] = categorie
        return super().create(validated_data)

    def update(self, instance, validated_data):
        categorie_name = validated_data.pop('categorie_name_input', None)
        if categorie_name:
            categorie, _ = Categorie.objects.get_or_create(nom=categorie_name)
            validated_data['categorie'] = categorie
        return super().update(instance, validated_data)


class LentilleSerializer(serializers.ModelSerializer):
    type_port_display = serializers.CharField(source='get_type_port_display', read_only=True)
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)
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
