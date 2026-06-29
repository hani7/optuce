from rest_framework import serializers
from .models import Patient, Ordonnance, Correction


class CorrectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Correction
        exclude = ['ordonnance']


class OrdonnanceSerializer(serializers.ModelSerializer):
    correction = CorrectionSerializer(read_only=True)
    patient_nom = serializers.CharField(source='patient.nom_complet', read_only=True)

    class Meta:
        model = Ordonnance
        fields = '__all__'


class OrdonnanceCreateSerializer(serializers.ModelSerializer):
    correction = CorrectionSerializer(required=False)

    class Meta:
        model = Ordonnance
        fields = '__all__'

    def create(self, validated_data):
        correction_data = validated_data.pop('correction', None)
        ordonnance = Ordonnance.objects.create(**validated_data)
        if correction_data:
            Correction.objects.create(ordonnance=ordonnance, **correction_data)
        return ordonnance

    def update(self, instance, validated_data):
        correction_data = validated_data.pop('correction', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if correction_data:
            Correction.objects.update_or_create(
                ordonnance=instance, defaults=correction_data
            )
        return instance


class PatientListSerializer(serializers.ModelSerializer):
    age = serializers.IntegerField(read_only=True)
    nombre_ordonnances = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = ['id', 'nom', 'prenom', 'nom_complet', 'telephone', 'age',
                  'profession', 'date_creation', 'nombre_ordonnances']

    def get_nombre_ordonnances(self, obj):
        return obj.ordonnances.count()


class PatientDetailSerializer(serializers.ModelSerializer):
    age = serializers.IntegerField(read_only=True)
    ordonnances = OrdonnanceSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'
