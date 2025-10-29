from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, PatientProfile, MedecinProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'patient':
            PatientProfile.objects.create(
                user=instance,
                telephone='',
                date_naissance='2000-01-01',  # valeur par défaut (modifiable via le front ensuite)
                adresse=''
            )
        elif instance.role == 'medecin':
            MedecinProfile.objects.create(
                user=instance,
                specialite='Généraliste',  # valeur par défaut
                telephone='',
                adresse=''
            )
