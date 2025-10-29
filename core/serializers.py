from django.utils import timezone
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    PatientProfile, MedecinProfile, Appointment,
    MedicalRecord, Notification, Specialite, MedecinSpecialite
)

User = get_user_model()

# --- Utilisateur ---
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

# --- Profil Patient ---
class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PatientProfile
        fields = ['id', 'user']

# --- Profil Médecin ---
class MedecinProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MedecinProfile
        fields = ['id', 'specialite', 'telephone', 'adresse', 'user']

# --- Rendez-vous ---
class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientProfileSerializer(read_only=True)
    medecin = MedecinProfileSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(queryset=PatientProfile.objects.all(), source='patient', write_only=True)
    medecin_id = serializers.PrimaryKeyRelatedField(queryset=MedecinProfile.objects.all(), source='medecin', write_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient', 'medecin',
            'patient_id', 'medecin_id',
            'date_heure',
            'statut',
            'motif'
        ]

    def validate(self, data):
        if data['date_heure'] < timezone.now():
            raise serializers.ValidationError("La date du rendez-vous ne peut pas être dans le passé.")
        return data

# --- Dossier médical ---
class MedicalRecordSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(queryset=PatientProfile.objects.all())
    medecin = serializers.PrimaryKeyRelatedField(queryset=MedecinProfile.objects.all())

    class Meta:
        model = MedicalRecord
        fields = '__all__'

# --- Notification ---
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['id', 'user', 'titre', 'message', 'date_envoyee']

# --- Spécialité ---
class SpecialiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialite
        fields = '__all__'

# --- Lien Médecin ↔ Spécialité ---
class MedecinSpecialiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedecinSpecialite
        fields = '__all__'
