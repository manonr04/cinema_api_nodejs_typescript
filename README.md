# Sample TypeScript API

Une API RESTful construite avec TypeScript et Express, incluant des tests, du linting et des hooks pre-commit.

## Technologies Utilisées

### Core
- **TypeScript** : Langage de programmation typé qui étend JavaScript, offrant un typage statique et des fonctionnalités orientées objet.
- **Express** : Framework web minimaliste et flexible pour Node.js, facilitant la création d'applications web et d'APIs.
- **Node.js** : Environnement d'exécution JavaScript basé sur le moteur V8 de Chrome.

### Documentation API
- **Swagger/OpenAPI** : Standard pour la documentation d'API RESTful, permettant de décrire, produire, consommer et visualiser des services web RESTful.
- **swagger-ui-express** : Middleware pour servir la documentation Swagger UI.
- **swagger-jsdoc** : Génère la documentation Swagger à partir des commentaires JSDoc.

### Sécurité
- **Helmet** : Middleware de sécurité qui aide à protéger l'application en définissant divers en-têtes HTTP.
- **CORS** : Middleware pour gérer le Cross-Origin Resource Sharing, permettant ou restreignant l'accès à l'API depuis différents domaines.
- **bcryptjs** : Bibliothèque pour le hachage sécurisé des mots de passe.
- **jsonwebtoken** : Implémentation de JSON Web Tokens pour l'authentification.

### Validation & Logging
- **express-validator** : Middleware pour la validation des données entrantes.
- **winston** : Bibliothèque de logging flexible et configurable.

### Développement
- **nodemon** : Utilitaire qui surveille les changements dans le code source et redémarre automatiquement le serveur.
- **ts-node** : Exécute TypeScript directement sans compilation préalable.

### Testing
- **Jest** : Framework de test JavaScript avec une API simple et intuitive.
- **Supertest** : Bibliothèque pour tester les applications HTTP, parfaite pour tester les APIs Express.

### Linting & Formatting
- **ESLint** : Outil d'analyse de code statique pour identifier les problèmes dans le code JavaScript/TypeScript.
- **Prettier** : Formateur de code opinionated pour maintenir un style de code cohérent.
- **@typescript-eslint** : Règles ESLint spécifiques à TypeScript.

### Git Hooks
- **Husky** : Outil pour gérer les Git hooks facilement.
- **lint-staged** : Exécute les linters sur les fichiers modifiés avant le commit.

## Architecture

### Services
L'application utilise une architecture en couches avec :
- **Services** : Logique métier et gestion des données
  - `userService` : Gestion des utilisateurs avec stockage en mémoire
  - `authService` : Gestion de l'authentification et des tokens JWT
- **Controllers** : Gestion des requêtes HTTP
- **Routes** : Définition des endpoints de l'API
- **Middleware** : Fonctions intermédiaires (auth, validation, etc.)

### Stockage des Données
Pour simplifier le développement et les tests, l'application utilise :
- Stockage en mémoire avec structure de données TypeScript
- Un utilisateur admin par défaut préchargé
- Pas de persistance des données (les données sont réinitialisées au redémarrage)

## Scripts Disponibles

- `npm run dev` : Lance le serveur en mode développement avec rechargement automatique
- `npm run build` : Compile le code TypeScript
- `npm start` : Lance le serveur en production
- `npm test` : Exécute les tests
- `npm run lint` : Vérifie le code avec ESLint
- `npm run format` : Formate le code avec Prettier

## Structure du Projet

```
src/
  ├── config/        # Configuration (Swagger, etc.)
  ├── controllers/   # Contrôleurs HTTP
  ├── services/     # Services métier
  ├── routes/       # Définition des routes
  ├── middleware/   # Middleware personnalisé
  ├── data/        # Données en mémoire
  └── index.ts     # Point d'entrée de l'application
```

## Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Lancer les tests
npm test
```

## Documentation de l'API

La documentation de l'API est disponible via Swagger UI à l'adresse :
```
http://localhost:3000/api-docs
```

Cette interface interactive permet de :
- Visualiser tous les endpoints disponibles
- Voir les schémas de données attendus
- Tester les endpoints directement depuis le navigateur
- Consulter les codes de réponse et leurs descriptions

## Sécurisation de l'API

L'API implémente plusieurs mécanismes de sécurité :

### Authentification JWT
- Utilisation de JSON Web Tokens (JWT) pour l'authentification
- Deux types de tokens :
  - Access Token (durée de vie : 15 minutes)
  - Refresh Token (durée de vie : 7 jours)
- Stockage sécurisé des tokens avec révocation possible

### Protection des Routes
- Middleware d'authentification pour protéger les routes sensibles
- Validation des tokens à chaque requête
- Gestion des erreurs d'authentification

### Sécurité des Données
- Hachage des mots de passe avec bcrypt
- Validation des données entrantes avec express-validator
- Protection contre les attaques courantes (XSS, CSRF) via Helmet
- Gestion du CORS pour contrôler l'accès à l'API

## API Endpoints

### Authentication
- `POST /api/auth/register` : Créer un nouveau compte
- `POST /api/auth/login` : Se connecter et obtenir un token
- `POST /api/auth/refresh` : Rafraîchir un token d'accès
- `POST /api/auth/logout` : Se déconnecter (révoquer un token)

### Users
- `GET /api/users` : Récupérer tous les utilisateurs (protégé)
- `GET /api/users/:id` : Récupérer un utilisateur par ID (protégé)
- `POST /api/users` : Créer un nouvel utilisateur (protégé)
- `PUT /api/users/:id` : Mettre à jour un utilisateur (protégé)
- `DELETE /api/users/:id` : Supprimer un utilisateur (protégé)

## Exemples d'Utilisation

### Authentification
```bash
# Créer un compte
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe"
  }'

# Se connecter (utilisateur admin par défaut)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Accéder à une route protégée
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
``` 