Description
Ce projet est une application web complète pour la gestion d'un cabinet médical. Il combine Django pour le backend et Angular pour le frontend, permettant ainsi une gestion fluide des rendez-vous, des dossiers médicaux, des patients et des médecins. L'application vise à simplifier les processus administratifs et à améliorer l'expérience des utilisateurs tout en garantissant la sécurité et la confidentialité des données médicales.
Fonctionnalités :
Gestion des patients :
Enregistrement des patients avec informations personnelles et historiques médicaux.
Consultation des dossiers médicaux et suivi des traitements.
Ajout de nouvelles consultations avec des notes médicales.
Gestion des rendez-vous :
Planification et gestion des rendez-vous entre médecins et patients.
Notifications automatiques par email ou SMS pour rappeler les rendez-vous.
Affichage d'un calendrier interactif pour les médecins.
Gestion des médecins :
Création de profils de médecins avec spécialités, horaires de consultation et disponibilités.
Attribution de rendez-vous aux médecins en fonction de leurs disponibilités.
Gestion des facturations et paiements :
Suivi des paiements des patients et génération des factures.
Gestion des types de paiement (en espèces, carte, assurances).
Interface utilisateur (Frontend - Angular) :
Interface moderne, responsive et intuitive permettant aux utilisateurs (patients, médecins, administrateurs) d'interagir facilement avec l'application.
Gestion dynamique des rendez-vous et des données à l'aide d'Angular et des services RESTful.
Backend (Django) :
API RESTful pour une interaction facile entre le frontend Angular et le backend Django.
Authentification et gestion des utilisateurs via JWT (JSON Web Tokens).
Sécurisation des données avec des pratiques de développement sécurisées (cryptage des mots de passe, gestion des permissions).
Technologies utilisées :
Frontend : Angular, HTML5, CSS3, Bootstrap
Backend : Django, Django Rest Framework (DRF), PostgreSQL
Sécurité : JWT pour l'authentification, SSL/TLS pour la sécurité des échanges
Envoi de notifications : Email (via SMTP), SMS (via une API tierce)
Installation :
Clonez ce dépôt :
git clone https://github.com/nom-utilisateur/gestion-cabinet-medical.git
Installez les dépendances Backend (Django) :
Créez un environnement virtuel et activez-le :
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
Installez les dépendances :
pip install -r backend/requirements.txt
Installez les dépendances Frontend (Angular) :
Accédez au dossier Angular :
cd frontend
Installez les dépendances :
npm install
Lancez le backend Django :
python manage.py runserver
Lancez le frontend Angular :
ng serve
Contribuer
Fork ce dépôt.
Créez une branche pour votre fonctionnalité ou correction de bug :
git checkout -b ma-nouvelle-fonctionnalite
Effectuez vos modifications, puis committez-les :
git commit -m "Ajout de la fonctionnalité X"
Poussez vos modifications :
git push origin ma-nouvelle-fonctionnalite
Ouvrez une pull request.
