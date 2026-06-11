# Documentation Fonctionnelle & Technique — Ymmo

## Table des matières

**Partie DEV — Application**

1. [Présentation du projet](#1-présentation-du-projet)
2. [Architecture globale](#2-architecture-globale)
3. [Documentation fonctionnelle](#3-documentation-fonctionnelle)
4. [Documentation technique — API](#4-documentation-technique--api)
5. [Documentation technique — Frontend](#5-documentation-technique--frontend)
6. [Modèle de données](#6-modèle-de-données)
7. [Sécurité applicative](#7-sécurité-applicative)
8. [Analyse de données Python](#8-analyse-de-données-python)
9. [Guide d'installation](#9-guide-dinstallation)

**Partie INFRA — Infrastructure & réseau**

10. [Architecture réseau](#10-architecture-réseau)
11. [Plan d'adressage IP](#11-plan-dadressage-ip)
12. [Politique de sécurité réseau](#12-politique-de-sécurité-réseau)
13. [Plan de gestion des droits d'accès](#13-plan-de-gestion-des-droits-daccès)
14. [Guide de configuration des serveurs](#14-guide-de-configuration-des-serveurs)
15. [Plan de sauvegarde et de supervision](#15-plan-de-sauvegarde-et-de-supervision)
16. [Proposition d'une solution Cloud](#16-proposition-dune-solution-cloud)
17. [Guide de déploiement infrastructure](#17-guide-de-déploiement-infrastructure)
18. [Liste du matériel et budgétisation](#18-liste-du-matériel-et-budgétisation)

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

## 7. Sécurité applicative

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

## 10. Architecture réseau

### Contexte

Le réseau Ymmo est structuré autour d'un site central situé à Aix-en-Provence (siège social) et de 12 agences réparties sur le territoire national. Le siège héberge l'ensemble des services centraux (Active Directory, DNS, DHCP, hébergement web, base de données, fichiers et sauvegardes). Chaque agence est reliée au siège via un tunnel **VPN/IPSec** chiffré transitant par Internet, garantissant la confidentialité et l'intégrité des communications inter-sites.

### Schéma d'architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    SIÈGE — Aix-en-Provence                        │
│                       Réseau 10.0.0.0/24                          │
│                                                                    │
│  Serveur 1 — 10.0.0.2          Serveur 2 — 10.0.0.3               │
│  AD DS / DNS / DHCP             Web / BDD / Fichiers / Sauvegarde  │
│                                                                    │
│  Routeur / Pare-feu — 10.0.0.1  ──  ~30 postes + 1 imprimante     │
└──────────────────────────────┬───────────────────────────────────┘
                                │ Tunnel VPN / IPSec (chiffré)
                                ▼
                            ┌──────────┐
                            │ Internet │
                            └────┬─────┘
        ┌───────────┬───────────┼───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼
  Agence 1      Agence 2      ...       Agence 11    Agence 12
 10.1.1.0/24   10.1.2.0/24             10.1.11.0/24  10.1.12.0/24
 Routeur + Switch + 5 postes commerciaux + 1 imprimante (x12)
```

### Architecture générale

- 1 siège à Aix-en-Provence
- 12 agences reliées via VPN/IPSec
- Chaque site dispose de son propre sous-réseau en `10.x.x.x`

---

## 11. Plan d'adressage IP

Le plan d'adressage adopte une segmentation en sous-réseaux **/24**, offrant 254 adresses utilisables par site. Les équipements serveurs disposent d'adresses IP statiques, tandis que les postes clients obtiennent leurs adresses dynamiquement via le service **DHCP** centralisé au siège.

| Site | Réseau | Passerelle | Serveur DNS/DHCP | Plage DHCP |
|---|---|---|---|---|
| Siège | 10.0.0.0/24 | 10.0.0.1 | 10.0.0.2 | 10.0.0.50 → 200 |
| Agence 1 | 10.1.1.0/24 | 10.1.1.1 | 10.0.0.2 | 10.1.1.50 → 100 |
| Agence 2 | 10.1.2.0/24 | 10.1.2.1 | 10.0.0.2 | 10.1.2.50 → 100 |
| Agence 3 | 10.1.3.0/24 | 10.1.3.1 | 10.0.0.2 | 10.1.3.50 → 100 |
| ... | ... | ... | ... | ... |
| Agence 12 | 10.1.12.0/24 | 10.1.12.1 | 10.0.0.2 | 10.1.12.50 → 100 |

### Serveurs du siège

| Serveur | IP fixe | Rôle |
|---|---|---|
| Serveur 1 | 10.0.0.2 | Active Directory, DNS, DHCP, contrôleur de domaine |
| Serveur 2 | 10.0.0.3 | Hébergement web, base de données, fichiers, sauvegardes |
| Routeur/Pare-feu | 10.0.0.1 | Passerelle, VPN, NAT |

### Pourquoi ce découpage ?

Un `/24` donne 254 adresses utilisables par site. Le siège en a besoin de plus (30 postes + serveurs + imprimantes + marge). Les agences ont 5 postes + 1 imprimante, donc largement suffisant.

> **Note démonstration** : pour la maquette, seule l'étendue DHCP du siège a été configurée. En production, 12 étendues supplémentaires seraient créées et les requêtes des agences acheminées via un agent de relais DHCP (**DHCP Relay**) configuré sur les routeurs Cisco de chaque agence.

---

## 12. Politique de sécurité réseau

La politique de sécurité du réseau Ymmo repose sur plusieurs niveaux de protection complémentaires :

| Mesure | Détail |
|---|---|
| **Sécurité périmétrique** | Pare-feu déployé au siège, filtrage des flux entrants/sortants. Seuls les ports nécessaires aux services métier sont ouverts (80/443 web, 389/636 AD, 53 DNS, 67/68 DHCP) |
| **Chiffrement des communications** | Tunnels VPN/IPSec entre le siège et chaque agence, garantissant authentification mutuelle et chiffrement des données en transit |
| **Politique de mots de passe** | Domaine `ymmo.local` : longueur minimale 12 caractères, complexité obligatoire (majuscules, minuscules, chiffres, caractères spéciaux), expiration tous les 90 jours, verrouillage après 5 tentatives échouées |
| **Mises à jour** | Serveurs et postes clients soumis à une politique de mise à jour régulière via **WSUS** (Windows Server Update Services) |
| **Antivirus** | Windows Defender activé sur l'ensemble des machines du domaine, géré centralement via GPO |

---

## 13. Plan de gestion des droits d'accès

La gestion des droits d'accès est centralisée via l'**Active Directory** du domaine `ymmo.local`. Cinq Unités d'Organisation (OU) ont été créées, correspondant aux cinq pôles métier de l'entreprise : **Direction**, **Commercial**, **Communication & Marketing**, **Administratif-RH-Juridique** et **IT & Support**.

Chaque utilisateur est rattaché à son OU et au groupe de sécurité correspondant (`GRP-Direction`, `GRP-Commercial`, etc.). Les droits d'accès aux dossiers partagés sont attribués par groupe selon la matrice suivante :

| Dossier partagé \ Pôle | Direction | Commercial | Communication & Marketing | Administratif-RH-Juridique | IT et Support |
|---|---|---|---|---|---|
| **Direction** | Lecture/Écriture | Lecture | Lecture | Lecture | Lecture |
| **Commercial** | Interdit | Lecture/Écriture | Lecture | Interdit | Interdit |
| **Communication & Marketing** | Interdit | Lecture | Lecture/Écriture | Interdit | Interdit |
| **Administratif-RH-Juridique** | Interdit | Lecture | Lecture | Lecture/Écriture | Interdit |
| **IT et Support** | Interdit | Lecture | Lecture | Interdit | Lecture/Écriture |

Les stratégies de groupe (**GPO**) permettent d'appliquer automatiquement ces restrictions à chaque connexion utilisateur, garantissant que les droits sont cohérents sur l'ensemble du parc.

---

## 14. Guide de configuration des serveurs

### Serveur 1 — Contrôleur de domaine (10.0.0.2)

Centralise les services d'annuaire et réseau :

- **Active Directory Domain Services (AD DS)** : gestion centralisée des utilisateurs, groupes et ordinateurs du domaine `ymmo.local`
- **Serveur DNS** : résolution des noms internes au domaine (ex : `serveur.ymmo.local`)
- **Serveur DHCP** : distribution automatique des adresses IP aux postes du réseau siège (plage 10.0.0.50 → 10.0.0.200)
- **Routage et accès distant** : communication entre le réseau siège (10.0.0.0/24) et le réseau agence (10.1.1.0/24), simulant un VPN site-à-site

### Serveur 2 — Serveur applicatif (10.0.0.3)

Héberge les services métier de la plateforme Ymmo :

- Serveur web (IIS ou Apache) pour la plateforme immobilière développée par l'équipe DEV
- Serveur de base de données (SQL Server ou MySQL)
- Serveur de fichiers avec partages réseau sécurisés par groupe AD
- Service de sauvegarde Windows Server Backup

---

## 15. Plan de sauvegarde et de supervision

### Stratégie de sauvegarde

La politique de sauvegarde repose sur la règle **3-2-1** : 3 copies des données, sur 2 supports différents, dont 1 copie externalisée.

- Sauvegarde complète **hebdomadaire** (dimanche 2h00) via Windows Server Backup, conservée 4 semaines
- Sauvegarde **incrémentale quotidienne** (lundi → samedi, 3h00), conservée 7 jours
- **Réplication externe** vers Azure Blob Storage une fois par semaine

Éléments sauvegardés : base Active Directory (System State), dossiers partagés, base de données applicative et fichiers de configuration des serveurs.

### Supervision

Assurée par les outils natifs Windows Server :

- L'**Observateur d'événements** surveille en temps réel les erreurs système et applicatives
- Le **Moniteur de fiabilité et de performances** analyse la charge CPU, RAM et disque
- Des **alertes email** sont configurées en cas d'échec de sauvegarde ou d'événement critique
- Les journaux sont conservés 30 jours et archivés mensuellement

---

## 16. Proposition d'une solution Cloud

Dans une optique d'évolutivité et de résilience, architecture **hybride** combinant l'infrastructure on-premise existante avec les services Microsoft Azure :

- **Azure Active Directory Connect** : synchronisation de l'annuaire AD on-premise avec Azure AD (SSO pour les applications cloud)
- **Azure Blob Storage** : stockage externalisé pour les sauvegardes (~20€/mois pour 1 To)
- **Azure Site Recovery** : reprise après sinistre (PRA). En cas de panne du serveur principal, bascule automatique des VMs vers Azure — RTO estimé à 15 minutes
- **Azure Virtual WAN** : remplacement à terme des VPN IPSec site-à-site par une connectivité managée Azure, simplifiant la gestion des 12 agences

### Estimation budgétaire mensuelle

| Service | Coût estimé/mois |
|---|---|
| Azure AD Connect | Gratuit |
| Azure Blob Storage (1 To) | 20€ |
| Azure Site Recovery | 50€ |
| Azure Virtual WAN | 150€ |
| **Total** | **~220€/mois** |

---

## 17. Guide de déploiement infrastructure

Le déploiement de l'infrastructure Ymmo suit l'ordre suivant :

1. **Configuration réseau** : VLANs, plan d'adressage IP, équipements réseau (routeurs, switches, pare-feu)
2. **Installation du Serveur 1** : Windows Server 2022, IP statique, rôles AD DS / DNS / DHCP, promotion en contrôleur de domaine `ymmo.local`
3. **Configuration Active Directory** : création des OU, groupes, comptes utilisateurs, application des GPO
4. **Installation du Serveur 2** : Windows Server 2022, services web, base de données et fichiers
5. **Déploiement des postes clients** : Windows 10 Professionnel, jonction au domaine `ymmo.local`, vérification des GPO appliquées
6. **Configuration VPN** : tunnels IPSec entre le siège et chaque agence
7. **Tests de validation** : connectivité (ping), authentification AD, accès aux partages réseau, VPN
8. **Déploiement Cloud** : configuration Azure AD Connect et Azure Blob Storage

---

## 18. Liste du matériel et budgétisation

Matériel nécessaire au déploiement complet de l'infrastructure Ymmo, incluant le siège et les 12 agences :

| Matériel | Quantité | Prix unitaire HT | Total HT |
|---|---|---|---|
| Serveur Dell PowerEdge T350 (siège) | 2 | 2 500€ | 5 000€ |
| Routeur/Pare-feu Fortinet FortiGate 60F (siège) | 1 | 800€ | 800€ |
| Switch 24 ports HP Aruba 1820 (siège) | 2 | 400€ | 800€ |
| Routeur agence Cisco RV340 | 12 | 350€ | 4 200€ |
| Switch 8 ports TP-Link (agences) | 12 | 80€ | 960€ |
| Licences Windows Server 2022 Standard | 2 | 1 200€ | 2 400€ |
| Licences Windows 10 Pro (postes) | 90 | 150€ | 13 500€ |
| Disque externe sauvegarde 4 To | 2 | 120€ | 240€ |
| Imprimantes multifonctions (siège + agences) | 13 | 300€ | 3 900€ |
| Câblage et installation | 1 | 2 000€ | 2 000€ |
| **TOTAL** | | | **~33 800€ HT** |

Ce budget couvre l'intégralité du matériel physique nécessaire. Les coûts de maintenance annuelle et les abonnements Cloud (environ 220€/mois, voir [section 16](#16-proposition-dune-solution-cloud)) sont à prévoir en sus.

---

*Documentation rédigée dans le cadre du projet UF INFRA & DEV — Ynov Campus Bachelor 2*
