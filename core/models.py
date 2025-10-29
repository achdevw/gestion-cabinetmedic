from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

# --- Constantes de rôle ---
ROLE_CHOICES = (
    ('admin', 'Admin'),
    ('medecin', 'Médecin'),
    ('patient', 'Patient'),
)

# --- Utilisateur personnalisé ---
class User(AbstractUser):
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # Corriger conflits ManyToMany avec Group et Permission
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    def __str__(self):
        return self.get_full_name() or self.username

# --- Profil Médecin ---
class MedecinProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='medecin_profile')
    specialite = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20)
    adresse = models.TextField(blank=True)

    def __str__(self):
        return f"Médecin: {self.user.get_full_name()}"

# --- Profil Patient ---
class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_naissance = models.DateField()
    telephone = models.CharField(max_length=20)
    adresse = models.TextField(blank=True)

    def __str__(self):
        return f"Patient: {self.user.get_full_name()}"

# --- Rendez-vous ---
class Appointment(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='appointments')
    medecin = models.ForeignKey(MedecinProfile, on_delete=models.CASCADE, related_name='appointments')
    date_heure = models.DateTimeField()

    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirme', 'Confirmé'),
        ('annule', 'Annulé'),
    ]
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    motif = models.TextField(blank=True)

    def __str__(self):
        return f"RDV {self.patient.user.get_full_name()} - {self.date_heure.strftime('%d/%m/%Y %H:%M')}"

# --- Dossier Médical ---
class MedicalRecord(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='medical_records')
    medecin = models.ForeignKey(MedecinProfile, on_delete=models.SET_NULL, null=True, related_name='medical_records')
    date = models.DateField(auto_now_add=True)
    notes = models.TextField()
    ordonnance = models.TextField(blank=True)

    def __str__(self):
        return f"Dossier {self.patient.user.get_full_name()} - {self.date.strftime('%d/%m/%Y')}"

# --- Notification ---
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    titre = models.CharField(max_length=255)
    message = models.TextField()
    lu = models.BooleanField(default=False)
    date_envoyee = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notif pour {self.user.username} - {self.titre}"
class Specialite(models.Model):
    nom = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nom

class MedecinSpecialite(models.Model):
    medecin = models.ForeignKey(MedecinProfile, on_delete=models.CASCADE, related_name='specialites')
    specialite = models.ForeignKey(Specialite, on_delete=models.CASCADE, related_name='medecins')

    class Meta:
        unique_together = ('medecin', 'specialite')