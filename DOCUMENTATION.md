# Documentation Fonctionnelle & Technique — Ymmo

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Architecture globale](#2-architecture-globale)
3. [Documentation fonctionnelle](#3-documentation-fonctionnelle)
4. [Documentation technique — API](#4-documentation-technique--api)
5. [Documentation technique — Frontend](#5-documentation-technique--frontend)
6. [Modèle de données](#6-modèle-de-données)
7. [Sécurité](#7-sécurité)
8. [Analyse de données Python](#8-analyse-de-données-python)
9. [Guide d'installation](#9-guide-dinstallation)

---

## 1. Présentation du projet

### Contexte

Ymmo est un groupe immobilier implanté en France, avec un siège social à Aix-en-Provence et un réseau de 12 agences réparties sur le territoire national. La société est spécialisée dans la vente et l'achat de biens immobiliers résidentiels et professionnels.

### Objectif

Développer une plateforme web centralisée permettant :
- Aux **clients** de consulter, rechercher et contacter une agence pour un bien
- Aux **agents** de gérer le catalogue de biens de leur agence
- Aux **administrateurs** d'administrer l'ensemble de la plateforme
- À l'**équipe data** de produire des rapports d'analyse du marché immobilier

### Périmètre

| Composant | Rôle |
|---|---|
| `ymmo-api` | API REST backend (Spring Boot / Java) |
| `ymmo-frontend` | Interface utilisateur web (React) |
| `ymmo-analytics` | Scripts d'analyse de données (Python) |

---

## 2. Architecture globale

```
┌─────────────────────────────────────────────────────────┐
│                     Navigateur client                    │
│              React 19 — Vite — http://localhost:5173     │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST (Axios)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  API REST Spring Boot                    │
│              Java 17 — Spring Boot 3 — port 8080        │
│                                                         │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │ Controllers │→ │   Services   │→ │ Repositories │  │
│   └─────────────┘  └──────────────┘  └──────┬───────┘  │
│                                             │           │
│   Spring Security + JWT Filter              │           │
└────────────────────────────────────────────┼───────────┘
                                             │ JPA / Hibernate
                                             ▼
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL 18                         │
│         Base de données : ymmo — port 5432              │
│   Tables : users, biens, agences, photos, transactions  │
└───────────────────────┬─────────────────────────────────┘
                        │ psycopg2
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Analytics Python                           │
│         pandas · matplotlib · psycopg2                  │
│         Rapports statistiques + graphiques              │
└─────────────────────────────────────────────────────────┘
```

### Flux d'authentification

```
Client → POST /api/auth/login → Vérification BCrypt → JWT (24h) → Stockage localStorage
Requêtes suivantes → Header Authorization: Bearer <token> → JwtAuthFilter → Accès autorisé
```

---

## 3. Documentation fonctionnelle

### Rôles utilisateurs

| Rôle | Description | Permissions |
|---|---|---|
| `CLIENT` | Visiteur inscrit | Consulter les biens, contacter une agence |
| `AGENT` | Commercial d'agence | Gérer les biens de son agence |
| `ADMIN` | Administrateur | Accès complet à toutes les ressources |

### Cas d'utilisation principaux

#### UC-01 — Consulter les annonces
- **Acteur** : Visiteur (non authentifié ou client)
- **Description** : L'utilisateur accède à la page d'accueil et visualise la liste des biens disponibles
- **Filtres disponibles** : Ville, type de bien (Appartement, Maison, Bureau, Terrain, Commerce)
- **Résultat** : Liste de cards avec titre, ville, prix, surface, nombre de pièces et statut

#### UC-02 — Consulter le détail d'un bien
- **Acteur** : Visiteur
- **Description** : L'utilisateur clique sur un bien et accède à la fiche complète
- **Informations affichées** : Photo, titre, adresse complète, prix, prix/m², surface, pièces, type, statut, description, agence
- **Action possible** : Contacter l'agence (redirige vers la connexion si non authentifié)

#### UC-03 — S'inscrire
- **Acteur** : Visiteur
- **Données requises** : Nom, prénom, email (unique), mot de passe, téléphone (optionnel)
- **Résultat** : Compte créé, JWT retourné, redirection vers l'accueil connecté

#### UC-04 — Se connecter
- **Acteur** : Utilisateur inscrit
- **Données requises** : Email, mot de passe
- **Résultat** : JWT retourné, session active 24h, nom affiché dans la navbar

#### UC-05 — Rechercher un bien
- **Acteur** : Visiteur
- **Description** : L'utilisateur saisit une ville ou un titre dans la barre de recherche du hero
- **Résultat** : Filtrage en temps réel côté frontend, affichage des résultats correspondants

#### UC-06 — Gérer les biens (CRUD)
- **Acteur** : Agent / Admin
- **Description** : Créer, modifier, supprimer un bien via l'API
- **Accès** : Authentification JWT requise

### Pages de l'application

| Page | Route | Accès | Description |
|---|---|---|---|
| Accueil | `/` | Public | Hero, services, annonces, villes, CTA, footer |
| Connexion | `/login` | Public | Formulaire email/mot de passe |
| Inscription | `/register` | Public | Formulaire de création de compte |
| Détail bien | `/biens/:id` | Public | Fiche complète d'un bien immobilier |

---

## 4. Documentation technique — API

### Stack backend

| Technologie | Version | Rôle |
|---|---|---|
| Java | 17 | Langage principal |
| Spring Boot | 3.x | Framework applicatif |
| Spring Security | 6.x | Authentification et autorisation |
| Spring Data JPA | 3.x | Abstraction couche données |
| Hibernate | 6.x | ORM |
| PostgreSQL Driver | — | Connecteur BDD |
| JJWT | — | Génération et validation JWT |
| Lombok | — | Réduction du boilerplate |
| BCrypt | — | Hashage des mots de passe |

### Structure du projet

```
ymmo-api/
└── src/main/java/com/ymmo/ymmo_api/
    ├── config/
    │   └── SecurityConfig.java       # Configuration Spring Security + JWT
    ├── controller/
    │   ├── AuthController.java       # Endpoints /api/auth/**
    │   └── BienController.java       # Endpoints /api/biens/**
    ├── dto/
    │   ├── AuthRequest.java          # Body de login
    │   ├── AuthResponse.java         # Réponse avec token
    │   └── RegisterRequest.java      # Body d'inscription
    ├── entity/
    │   ├── Agence.java               # Entité agence
    │   ├── Bien.java                 # Entité bien (+ enums TypeBien, StatutBien)
    │   ├── Photo.java                # Entité photo
    │   ├── Transaction.java          # Entité transaction
    │   └── User.java                 # Entité utilisateur (+ enum Role)
    ├── repository/
    │   ├── AgenceRepository.java
    │   ├── BienRepository.java
    │   ├── PhotoRepository.java
    │   ├── TransactionRepository.java
    │   └── UserRepository.java
    ├── security/
    │   ├── JwtAuthFilter.java        # Filtre JWT (OncePerRequestFilter)
    │   └── JwtService.java           # Génération / validation des tokens
    ├── service/
    │   ├── AuthService.java          # Logique inscription / connexion
    │   └── BienService.java          # Logique métier des biens
    └── YmmoApiApplication.java       # Point d'entrée Spring Boot
```

### Endpoints API

#### Authentification — `/api/auth`

| Méthode | Route | Auth | Body | Réponse |
|---|---|---|---|---|
| POST | `/api/auth/register` | Non | `RegisterRequest` | `AuthResponse` (token JWT) |
| POST | `/api/auth/login` | Non | `AuthRequest` | `AuthResponse` (token JWT) |

**RegisterRequest**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean@example.com",
  "password": "motdepasse",
  "telephone": "0600000000"
}
```

**AuthResponse**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "jean@example.com",
  "role": "CLIENT"
}
```

#### Biens immobiliers — `/api/biens`

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/biens` | Non | Liste tous les biens |
| GET | `/api/biens/{id}` | Non | Détail d'un bien |
| GET | `/api/biens/ville/{ville}` | Non | Biens filtrés par ville |
| GET | `/api/biens/type/{type}` | Non | Biens filtrés par type |
| GET | `/api/biens/statut/{statut}` | Non | Biens filtrés par statut |
| GET | `/api/biens/prix?min=X&max=Y` | Non | Biens dans une fourchette de prix |
| POST | `/api/biens` | JWT | Créer un bien |
| PUT | `/api/biens/{id}` | JWT | Modifier un bien |
| DELETE | `/api/biens/{id}` | JWT | Supprimer un bien |

**Valeurs possibles — TypeBien** : `APPARTEMENT`, `MAISON`, `BUREAU`, `TERRAIN`, `COMMERCE`

**Valeurs possibles — StatutBien** : `DISPONIBLE`, `EN_COURS`, `VENDU`

---

## 5. Documentation technique — Frontend

### Stack frontend

| Technologie | Version | Rôle |
|---|---|---|
| React | 19 | Framework UI |
| Vite | 8 | Bundler / dev server |
| React Router DOM | 7 | Navigation SPA |
| Axios | 1.x | Appels HTTP vers l'API |

### Structure des pages

```
ymmo-frontend/src/
├── pages/
│   ├── Home.jsx         # Page d'accueil complète
│   ├── Login.jsx        # Page de connexion
│   ├── Register.jsx     # Page d'inscription
│   └── BienDetail.jsx   # Fiche détaillée d'un bien
├── services/
│   └── api.js           # Configuration Axios + services authService / bienService
├── App.jsx              # Routeur principal
└── main.jsx             # Point d'entrée React
```

### Gestion de la session

La session est gérée côté client via `localStorage` :
- `token` : JWT retourné par l'API, injecté dans chaque requête via un intercepteur Axios
- `user` : objet JSON contenant email et rôle

### Design system

| Élément | Valeur |
|---|---|
| Couleur principale | `#1a1a1a` (noir) |
| Fond de page | `#f8f8f6` (blanc cassé) |
| Séparateurs / bordures | `#e8e8e4` |
| Texte secondaire | `#888` |
| Erreur | `#dc2626` |
| Police | Segoe UI, sans-serif |
| Border radius cards | 16px |

---

## 6. Modèle de données

### Schéma relationnel

```
┌─────────────┐        ┌──────────────┐        ┌─────────────┐
│   agences   │        │    biens     │        │    users    │
├─────────────┤        ├──────────────┤        ├─────────────┤
│ id (PK)     │◄──┐    │ id (PK)      │    ┌──►│ id (PK)     │
│ nom         │   │    │ titre        │    │   │ nom         │
│ adresse     │   │    │ description  │    │   │ prenom      │
│ ville       │   └────│ agence_id(FK)│    │   │ email       │
│ telephone   │        │ prix         │    │   │ password    │
│ email       │        │ adresse      │    │   │ role        │
└─────────────┘        │ ville        │    │   │ telephone   │
                       │ codePostal   │    │   │ agence_id   │
                       │ surface      │    │   └─────────────┘
                       │ nbPieces     │    │
                       │ type         │    │   ┌─────────────┐
                       │ statut       │    │   │   photos    │
                       └──────┬───────┘    │   ├─────────────┤
                              │            │   │ id (PK)     │
                    ┌─────────┴─────────┐  │   │ bien_id (FK)│
                    │   transactions    │  │   │ url         │
                    ├───────────────────┤  │   └─────────────┘
                    │ id (PK)           │  │
                    │ bien_id (FK)      │  │
                    │ acheteur_id (FK)──┼──┘
                    │ agent_id (FK)     │
                    │ montant           │
                    │ type              │
                    │ statut            │
                    │ dateCreation      │
                    │ dateFinalisee     │
                    └───────────────────┘
```

### Description des entités

**Bien** — représente un bien immobilier
- `type` : APPARTEMENT | MAISON | BUREAU | TERRAIN | COMMERCE
- `statut` : DISPONIBLE | EN_COURS | VENDU
- Lié à une `Agence` (Many-to-One)
- Contient plusieurs `Photo` et `Transaction` (One-to-Many)

**User** — implémente `UserDetails` de Spring Security
- `role` : ADMIN | AGENT | CLIENT
- Optionnellement rattaché à une `Agence` (pour les agents)
- Mot de passe stocké hashé (BCrypt)

**Agence** — représente une agence physique
- Contient plusieurs `Bien` et plusieurs `User` (agents)

**Transaction** — enregistre une opération de vente ou d'achat
- `type` : VENTE | ACHAT
- `statut` : EN_ATTENTE | EN_COURS | FINALISEE | ANNULEE
- Lie un `Bien`, un acheteur (`User`) et un agent (`User`)

**Photo** — stocke l'URL d'une photo associée à un `Bien`

---

## 7. Sécurité

### Authentification JWT

- Algorithme : **HMAC-SHA256 (HS256)**
- Durée de validité : **24 heures**
- Clé secrète : injectée via variable d'environnement `JWT_SECRET`
- Filtre : `JwtAuthFilter` (extends `OncePerRequestFilter`) — intercepte chaque requête, extrait et valide le token

### Hashage des mots de passe

- Algorithme : **BCrypt** (Spring Security `BCryptPasswordEncoder`)
- Les mots de passe en clair ne sont jamais stockés en base

### Politique d'accès (Spring Security)

| Route | Accès |
|---|---|
| `/api/auth/**` | Public (non authentifié) |
| `/api/biens/**` (GET) | Public |
| `/api/biens/**` (POST/PUT/DELETE) | JWT requis |
| Tout le reste | JWT requis |

### Gestion des secrets

- Les credentials (BDD, JWT) sont externalisés en **variables d'environnement**
- Aucun secret hardcodé dans le code versionné
- Fichier `.env.example` fourni comme template

---

## 8. Analyse de données Python

### Objectif

Le script `ymmo-analytics/analyse.py` se connecte directement à la base PostgreSQL et produit :
- Des **statistiques descriptives** sur le parc immobilier (prix moyen, médian, min/max, surface)
- Une **analyse par ville** (prix moyen, nombre de biens, prix au m²)
- Une **analyse par type de bien** (appartement, maison, bureau…)
- Une **répartition des statuts** (disponible, vendu, en cours)
- Des **prévisions simples** : ville la plus valorisée, la plus abordable, type le plus demandé
- Un **rapport graphique** exporté en PNG (`rapport_ymmo.png`)

### Dépendances

```
psycopg2-binary   # Connecteur PostgreSQL
pandas            # Manipulation et analyse de données
matplotlib        # Génération de graphiques
```

### Graphiques générés

| Graphique | Type | Description |
|---|---|---|
| Prix moyen par ville | Barres verticales | Comparaison des marchés par ville |
| Répartition par type | Camembert | Distribution du parc par catégorie |
| Prix au m² par ville | Barres horizontales | Indicateur de densité de valeur |
| Répartition des statuts | Barres verticales | État du stock disponible |

### Configuration

Les credentials de connexion sont lus depuis les variables d'environnement avec valeurs par défaut :

```python
os.environ.get("DB_HOST", "localhost")
os.environ.get("DB_PORT", "5432")
os.environ.get("DB_NAME", "ymmo")
os.environ.get("DB_USER", "postgres")
os.environ.get("DB_PASSWORD", "root")
```

---

## 9. Guide d'installation

### Prérequis

- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+
- Python 3.10+

### 1. Base de données

```sql
CREATE DATABASE ymmo;
```

Spring Boot crée automatiquement les tables au démarrage (`spring.jpa.hibernate.ddl-auto=update`).

### 2. API Spring Boot

```bash
cd ymmo-api/ymmo-api
cp .env.example .env
# Éditer .env avec vos valeurs
mvn spring-boot:run
```

L'API démarre sur `http://localhost:8080`.

### 3. Frontend React

```bash
cd ymmo-frontend
npm install
npm run dev
```

L'interface démarre sur `http://localhost:5173`.

### 4. Analytics Python

```bash
cd ymmo-analytics
pip install psycopg2-binary pandas matplotlib
python analyse.py
# Génère rapport_ymmo.png
```

### Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `DB_URL` | URL JDBC PostgreSQL | `jdbc:postgresql://localhost:5432/ymmo` |
| `DB_USERNAME` | Utilisateur PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | — |
| `JWT_SECRET` | Clé de signature JWT | — |
| `DB_HOST` | Hôte PostgreSQL (Python) | `localhost` |
| `DB_PORT` | Port PostgreSQL (Python) | `5432` |
| `DB_NAME` | Nom de la base (Python) | `ymmo` |

---

*Documentation rédigée dans le cadre du projet UF INFRA & DEV — Ynov Campus Bachelor 2*
