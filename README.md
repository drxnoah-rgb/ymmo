# Ymmo — Plateforme immobilière full-stack

Application de gestion et consultation de biens immobiliers, composée d'une API REST, d'un frontend React et d'un module d'analyse de données.

📄 Documentation complète (fonctionnelle, technique DEV et infrastructure réseau) : [DOCUMENTATION.md](./DOCUMENTATION.md)

## Stack technique

| Couche | Technologie |
|---|---|
| API | Java 17 · Spring Boot · Spring Security · JWT |
| Base de données | PostgreSQL |
| Frontend | React 19 · React Router · Axios · Vite |
| Analytics | Python · pandas · matplotlib · psycopg2 |

## Structure du projet

```
ymmo/
├── ymmo-api/        # API REST Spring Boot (port 8080)
├── ymmo-frontend/   # Interface React (port 5173)
└── ymmo-analytics/  # Scripts d'analyse de données
```

## Prérequis

- Java 17+
- Maven
- Node.js 18+
- PostgreSQL 14+
- Python 3.10+

## Installation & lancement

### 1. Base de données

Créer la base PostgreSQL :
```sql
CREATE DATABASE ymmo;
```

### 2. API Spring Boot

```bash
cd ymmo-api/ymmo-api
cp .env.example .env   # renseigner les variables
mvn spring-boot:run
```

L'API démarre sur `http://localhost:8080`.

Variables d'environnement (`.env`) :
```
DB_URL=jdbc:postgresql://localhost:5432/ymmo
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_cle_secrete
```

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
```

## Endpoints API

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion (retourne un JWT) |
| GET | `/api/biens` | Liste tous les biens |
| GET | `/api/biens/{id}` | Détail d'un bien |
| GET | `/api/biens/ville/{ville}` | Biens par ville |
| GET | `/api/biens/type/{type}` | Biens par type |
| GET | `/api/biens/statut/{statut}` | Biens par statut |
| GET | `/api/biens/prix` | Biens filtrés par prix |
| POST | `/api/biens` | Créer un bien |
| PUT | `/api/biens/{id}` | Modifier un bien |
| DELETE | `/api/biens/{id}` | Supprimer un bien |
