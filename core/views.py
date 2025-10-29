from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .models import (
    User, PatientProfile, MedecinProfile,
    Appointment, MedicalRecord, Notification,
    Specialite, MedecinSpecialite
)
from .serializers import (
    UserSerializer, PatientProfileSerializer, MedecinProfileSerializer,
    AppointmentSerializer, MedicalRecordSerializer, NotificationSerializer,
    SpecialiteSerializer, MedecinSpecialiteSerializer
)
from .permissions import (
    IsAdmin, IsOwnerOrAdmin, IsMedecin, IsMedecinOrReadOnly, IsRelatedAppointmentUser
)
from .tokens import CustomTokenObtainPairSerializer

User = get_user_model()

# -----------------------------
# Vue JWT personnalisée
# -----------------------------
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# -----------------------------
# Récupération du profil patient connecté
# -----------------------------
class PatientMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if hasattr(request.user, 'patient_profile'):
            serializer = PatientProfileSerializer(request.user.patient_profile)
            return Response(serializer.data)
        return Response({'detail': 'Profil patient introuvable.'}, status=404)

# -----------------------------
# Vue de statistiques (admin)
# -----------------------------
@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_statistics(request):
    return Response({
        "total_users": User.objects.count(),
        "total_appointments": Appointment.objects.count(),
        "total_records": MedicalRecord.objects.count()
    })

# -----------------------------
# ViewSets
# -----------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

class MedecinProfileViewSet(viewsets.ModelViewSet):
    queryset = MedecinProfile.objects.all()
    serializer_class = MedecinProfileSerializer
    permission_classes = [IsAuthenticated]

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()  # <-- Ceci est requis
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsRelatedAppointmentUser]
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.statut == 'en_attente':
            instance.statut = 'annule'
            instance.save()
            return Response({'status': 'Annulé'}, status=status.HTTP_200_OK)
        return Response({'error': 'Impossible d’annuler'}, status=status.HTTP_400_BAD_REQUEST)
    def get_queryset(self):
        patient_id = self.request.query_params.get('patient')
        if patient_id:
            return Appointment.objects.filter(patient_id=patient_id)
        return Appointment.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Erreur de création rendez-vous:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        patient = instance.patient
        medecin = instance.medecin
        date_rdv = instance.date_heure.strftime('%d/%m/%Y à %H:%M')

        self.perform_destroy(instance)

        # Notifications automatiques
        Notification.objects.bulk_create([
            Notification(
                user=patient.user,
                titre="Rendez-vous annulé",
                message=f"Votre rendez-vous avec le Dr. {medecin.user.get_full_name()} prévu le {date_rdv} a été annulé."
            ),
            Notification(
                user=medecin.user,
                titre="Rendez-vous annulé",
                message=f"Le rendez-vous avec le patient {patient.user.get_full_name()} prévu le {date_rdv} a été annulé."
            )
        ])

        return Response(status=status.HTTP_204_NO_CONTENT)


class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated, IsMedecinOrReadOnly]

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class SpecialiteViewSet(viewsets.ModelViewSet):
    queryset = Specialite.objects.all()
    serializer_class = SpecialiteSerializer
    permission_classes = [IsAuthenticated]

class MedecinSpecialiteViewSet(viewsets.ModelViewSet):
    queryset = MedecinSpecialite.objects.all()
    serializer_class = MedecinSpecialiteSerializer
    permission_classes = [IsAuthenticated]
