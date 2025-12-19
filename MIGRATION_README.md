# Migration de Supabase vers WAMP (MySQL) + API Node.js

## Instructions de migration

### 1. Configuration de la base de données

1. Démarrez WAMP (Apache et MySQL doivent être actifs)
2. Ouvrez phpMyAdmin (http://localhost/phpmyadmin)
3. Créez une nouvelle base de données ou importez le fichier `database/schema.sql`
4. Configurez les identifiants dans `backend/.env` :
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=(votre mot de passe MySQL, vide par défaut)
   DB_NAME=hospital_management
   DB_PORT=3306
   JWT_SECRET=votre-secret-jwt-changez-moi
   PORT=3001
   ```

### 2. Installation et démarrage du backend

```bash
cd backend
npm install
npm start
```

Le serveur API devrait démarrer sur http://localhost:3001

### 3. Configuration du frontend

Ajoutez dans votre fichier `.env` (ou `.env.local`) à la racine du projet React :

```
VITE_API_URL=http://localhost:3001/api
```

### 4. Modifications effectuées

✅ **Tous les hooks ont été migrés vers l'API :**
- ✅ `use-auth.ts` - Migré
- ✅ `use-incidents.ts` - Migré
- ✅ `use-visitors.ts` - Migré
- ✅ `use-biomedical-equipment.ts` - Migré
- ✅ `use-notifications.ts` - Migré
- ✅ `use-bookings.ts` - Migré
- ✅ `use-planned-tasks.ts` - Migré
- ✅ `use-user-management.ts` - Migré
- ✅ `App.tsx` - Migré

**Note :** Les listeners temps réel Supabase ont été remplacés par un polling périodique (toutes les 10-30 secondes selon les hooks).

### 6. Modifications dans App.tsx

Remplacez l'appel à `supabase.functions.invoke('ensure-superadmin')` par `apiClient.ensureSuperadmin()`

### 7. Compte superadmin par défaut

Un compte superadmin est créé automatiquement avec :
- Email: `admin@hospital.com`
- Mot de passe: `admin123`

**⚠️ Changez le mot de passe immédiatement en production !**

### 8. Stockage de fichiers

Les images sont maintenant stockées dans `backend/uploads/incident_photos/` et servies via l'API sur `/uploads/incident_photos/`

### Notes importantes

- Les listeners temps réel de Supabase sont remplacés par un polling périodique (vous pouvez ajouter des websockets plus tard)
- L'authentification utilise maintenant JWT au lieu de Supabase Auth
- Le stockage de fichiers est local au lieu de Supabase Storage

