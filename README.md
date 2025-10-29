# Gestion de Cabinet Médical avec Django et Angular

## Description

Ce projet est une application web complète pour la gestion d'un cabinet médical. Il combine **Django** pour le backend et **Angular** pour le frontend, permettant ainsi une gestion fluide des rendez-vous, des dossiers médicaux, des patients et des médecins. L'application vise à simplifier les processus administratifs et à améliorer l'expérience des utilisateurs tout en garantissant la sécurité et la confidentialité des données médicales.

## Fonctionnalités

### Gestion des patients
- Enregistrement des patients avec informations personnelles et historiques médicaux.
- Consultation des dossiers médicaux et suivi des traitements.
- Ajout de nouvelles consultations avec des notes médicales.

### Gestion des rendez-vous
- Planification et gestion des rendez-vous entre médecins et patients.
- Notifications automatiques par email ou SMS pour rappeler les rendez-vous.
- Affichage d'un calendrier interactif pour les médecins.

### Gestion des médecins
- Création de profils de médecins avec spécialités, horaires de consultation et disponibilités.
- Attribution de rendez-vous aux médecins en fonction de leurs disponibilités.

### Gestion des facturations et paiements
- Suivi des paiements des patients et génération des factures.
- Gestion des types de paiement (en espèces, carte, assurances).

## Technologies utilisées

- **Frontend** : Angular, HTML5, CSS3, Bootstrap
- **Backend** : Django, Django Rest Framework (DRF), PostgreSQL
- **Sécurité** : JWT pour l'authentification, SSL/TLS pour la sécurité des échanges
- **Envoi de notifications** : Email (via SMTP), SMS (via une API tierce)

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/nom-utilisateur/gestion-cabinet-medical.git
2. Créez un environnement virtuel et activez-le :
   ```bash
   python -m venv venv
   source venv/bin/activate  # Sur Windows : venv\Scripts\activate
3. Installez les dépendances Backend (Django) :
   ```bash
   pip install -r backend/requirements.txt
4. Accédez au dossier Angular :
    ```bash
    cd myapp-frontend

5. Installez les dépendances Frontend (Angular) :
   ```bash
   npm install
   
6. Lancez le backend Django :
    ```bash
    python manage.py runserver
    
7. Lancez le frontend Angular :
```bash
    ng serve



   
   



