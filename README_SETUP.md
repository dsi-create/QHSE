# Guide de Configuration - Migration Supabase vers WAMP

## 🎯 Migration complète effectuée !

Tous les fichiers ont été migrés de Supabase vers WAMP (MySQL) + API Node.js/Express.

## 📋 Étapes de configuration

### 1. Configuration de la base de données MySQL (WAMP)

1. **Démarrez WAMP** (Apache et MySQL doivent être actifs - icône verte dans la barre des tâches)

2. **Ouvrez phpMyAdmin** :
   - Aller sur http://localhost/phpmyadmin
   - Ou cliquer sur l'icône WAMP → phpMyAdmin

3. **Créez la base de données** :
   - Cliquez sur "Nouvelle base de données"
   - Nom : `hospital_management`
   - Interclassement : `utf8mb4_unicode_ci`
   - Cliquez sur "Créer"

4. **Importez le schéma** :
   - Sélectionnez la base `hospital_management`
   - Allez dans l'onglet "Importer"
   - Sélectionnez le fichier `database/schema.sql`
   - Cliquez sur "Exécuter"

### 2. Configuration du backend API

1. **Créez le fichier `.env`** dans le dossier `backend/` :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hospital_management
DB_PORT=3306
JWT_SECRET=votre-secret-jwt-changez-moi-pour-la-production
PORT=3001
UPLOAD_BASE_URL=http://localhost:3001/uploads
```

**⚠️ Important :** Si vous avez un mot de passe MySQL, mettez-le dans `DB_PASSWORD`. Par défaut, WAMP n'a pas de mot de passe.

2. **Installez les dépendances** :

```bash
cd backend
npm install
```

3. **Démarrez le serveur API** :

```bash
npm start
```

Le serveur devrait démarrer sur http://localhost:3001

### 3. Configuration du frontend

1. **Créez un fichier `.env.local`** à la racine du projet (à côté de `package.json`) :

```env
VITE_API_URL=http://localhost:3001/api
```

2. **Le frontend devrait déjà fonctionner** - le serveur Vite tourne sur http://localhost:8080

### 4. Test de l'application

1. **Ouvrez** http://localhost:8080 dans votre navigateur

2. **Compte superadmin par défaut** :
   - Email : `admin@hospital.com`
   - Mot de passe : `admin123`

**⚠️ Changez le mot de passe immédiatement en production !**

## 🔧 Dépannage

### Le backend ne démarre pas

- Vérifiez que MySQL est démarré dans WAMP
- Vérifiez que le port 3001 n'est pas utilisé : `netstat -ano | findstr :3001`
- Vérifiez les logs dans la console

### Erreur de connexion à la base de données

- Vérifiez que MySQL est actif dans WAMP (icône verte)
- Vérifiez les identifiants dans `backend/.env`
- Testez la connexion dans phpMyAdmin

### Erreur CORS

- Vérifiez que `VITE_API_URL` dans `.env.local` pointe vers `http://localhost:3001/api`
- Le backend est configuré pour accepter les requêtes de `http://localhost:8080`

### Images ne s'affichent pas

- Les images sont servies depuis `backend/uploads/incident_photos/`
- Vérifiez que le dossier existe et que les fichiers y sont bien uploadés

## 📁 Structure des fichiers

```
projet/
├── backend/
│   ├── server.js          # API Express
│   ├── package.json       # Dépendances backend
│   ├── .env              # Configuration (à créer)
│   └── uploads/           # Dossier pour les images (créé automatiquement)
├── database/
│   └── schema.sql        # Schéma MySQL
├── src/
│   ├── integrations/
│   │   └── api/
│   │       └── client.ts # Client API (remplace Supabase)
│   └── hooks/            # Tous les hooks migrés vers API
└── .env.local            # Configuration frontend (à créer)
```

## ✨ Fonctionnalités migrées

- ✅ Authentification JWT (remplace Supabase Auth)
- ✅ Gestion des utilisateurs et profils
- ✅ Incidents et tickets QHSE
- ✅ Visiteurs
- ✅ Équipements biomédicaux
- ✅ Réservations de salles
- ✅ Tâches planifiées
- ✅ Notifications
- ✅ Upload d'images (stockage local)

## 🔄 Différences avec Supabase

- **Temps réel** : Remplacé par polling périodique (10-30 secondes)
- **Stockage** : Images stockées localement au lieu de Supabase Storage
- **Authentification** : JWT au lieu de Supabase Auth
- **Base de données** : MySQL au lieu de PostgreSQL

## 🚀 Prochaines étapes (optionnel)

Pour améliorer les performances, vous pouvez :
- Ajouter WebSockets pour le temps réel
- Migrer vers un stockage cloud (AWS S3, etc.)
- Ajouter la mise en cache Redis
- Configurer HTTPS en production


