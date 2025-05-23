# Projet Plateforme de Gestion de Formations en Ligne

---

## Description générale

Ce projet est une plateforme web complète permettant la gestion des étudiants, des départements, des formations, ainsi que des cours suivis.  
Il inclut une architecture backend robuste, des frontends spécifiques pour les étudiants et les administrateurs, ainsi que des microservices avancés pour la gestion des favoris et les recommandations de livres.

---

## Fonctionnalités principales

### 1. Gestion des départements et formations

- Ajout de la structure **`Departement`** :  
  Chaque étudiant est rattaché à un département (ex : Informatique, Management, Technique...).  
  Cette structure permet de regrouper les étudiants et de faciliter les statistiques et la gestion.

- Ajout de la structure **`Formation`** :  
  Une formation correspond à un thème ou un cursus que les étudiants peuvent suivre.  
  Elle comprend des informations comme le nom, la description, le département associé, etc.

- Modifications nécessaires dans le code backend et frontend pour supporter ces entités :
  - Backend : modèles, contrôleurs API, gestion des relations entre étudiants, départements et formations.
  - Frontend : affichage, formulaire d’inscription, sélection des formations, consultation des départements.

---

### 2. Frontend étudiant (Next.js)

- Interface dédiée aux étudiants permettant :
  - Création d’un compte (inscription sur le site)
  - Connexion sécurisée
  - Inscription à une ou plusieurs formations/cours
  - Consultation du profil personnel (données, département, formations suivies)
  - Consultation des formations disponibles et des formations dans lesquelles l’étudiant est inscrit
  - Navigation intuitive avec un design moderne et responsive

---

### 3. Frontend administrateur (Angular)

- Interface dédiée aux administrateurs permettant :
  - Gestion complète des étudiants (CRUD : création, modification, suppression, consultation)
  - Gestion des formations et des départements
  - Consultation et export des statistiques (nombre d’étudiants, répartition par département, formations les plus suivies, etc.)
  - Gestion des accès et rôles utilisateurs
  - Interface conviviale et sécurisée

---

### 4. Base de données

- Choix possibles : PostgreSQL, Neon, MongoDB, MongoDB Atlas  
- **Justification du choix :**  
  Par exemple, PostgreSQL pour sa robustesse, support des relations complexes et SQL standard, ou MongoDB pour la flexibilité du modèle NoSQL si les données sont moins structurées.  
  Le choix doit se faire selon la nature des données, la scalabilité attendue, et les besoins fonctionnels.

- Stockage sécurisé et performant des données utilisateurs, formations, départements, inscriptions, statistiques, et favoris.

---

### 5. Site web complet

- Pages principales :
  - Page d’accueil présentant le projet, ses objectifs et fonctionnalités
  - Page contact avec formulaire pour joindre l’équipe
  - Page services décrivant les formations proposées
  - Navigation cohérente entre les différentes parties du site
  - Design responsive pour une utilisation optimale sur mobiles, tablettes et desktops

---

### 6. Documentation du code

- Chaque fichier, fonction, et composant est documenté
- Explications claires sur le rôle de chaque section de code
- Documentation complète permettant la prise en main facile du projet
- Captures d’écran dans ce README pour illustrer le fonctionnement

---

## Microservice favoris avec Spring Boot

- Développement d’un microservice REST dédié à la gestion des favoris des utilisateurs :
  - Ajout, suppression, récupération des favoris
  - Intégration d’une base de données MongoDB pour le stockage persistant des favoris
  - Optimisation des accès en lecture grâce à un cache Redis
  - Mise à jour du frontend pour gérer les favoris utilisateurs (ajout/suppression dans l’interface)

- Organisation du projet selon une méthodologie Scrum avec suivi dans Jira

- Tests automatisés :
  - Tests unitaires (JUnit, Mockito)
  - Tests d’intégration
  - Tests end-to-end (Selenium, Cypress)

---

## API de recommandation et résumé intelligent de livre

### Partie 1 – Scraping et stockage de livres

- Implémentation d’une route FastAPI qui récupère des livres depuis [books.toscrape.com](https://books.toscrape.com)  
  Données extraites : titre, prix, catégorie, disponibilité

- Création d’une table `recommended_books` dans PostgreSQL pour stocker ces livres

- Route GET `/recommendations` qui affiche les livres stockés  
  Permet le filtrage par :
  - catégorie (`?category=Travel`)
  - prix minimum et maximum (`?price_min=10&price_max=30`)

### Partie 2 – Résumé intelligent d’un livre

- Route GET `/books/summary` qui génère un résumé intelligent d’un livre  
  Ce résumé est généré automatiquement via un modèle LLM (OpenAI, HuggingFace, etc.)

- Cette fonctionnalité permet d’enrichir l’expérience utilisateur avec une description synthétisée du contenu des livres

- Possibilité d’intégrer la génération automatique de plans de cours basés sur ces résumés

---

## Installation et démarrage

### Prérequis

- Node.js (version 16+)
- Java 17+ pour le microservice Spring Boot
- PostgreSQL / MongoDB / Redis installés et configurés
- Python 3.8+ (pour FastAPI backend)

### Backend FastAPI

```bash
pip install -r requirements.txt
uvicorn main:app --reload
