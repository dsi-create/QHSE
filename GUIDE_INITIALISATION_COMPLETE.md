# 🔧 GUIDE D'INITIALISATION COMPLÈTE DE LA BASE DE DONNÉES

## 🎯 Objectif

Ce guide vous permet de configurer entièrement votre application avec tous les utilisateurs par défaut et de vous assurer que tout est connecté à votre base de données MySQL.

---

## 📋 PRÉREQUIS

### 1. Vérifier que WAMP/XAMPP est démarré

- ✅ **WAMP** : Vérifiez que les services MySQL et Apache sont démarrés (icône verte)
- ✅ **XAMPP** : Vérifiez que MySQL et Apache sont démarrés

### 2. Vérifier la configuration de la base de données

Assurez-vous que votre base de données MySQL fonctionne :
- **Host** : `localhost`
- **Port** : `3306` (par défaut)
- **Utilisateur** : `root` (par défaut)
- **Mot de passe** : (vide par défaut sur WAMP/XAMPP)

---

## 🗄️ ÉTAPE 1 : CRÉER LA BASE DE DONNÉES ET LES TABLES

### Option A : Via PhpMyAdmin (Recommandé)

1. **Ouvrez PhpMyAdmin** : http://localhost/phpmyadmin

2. **Créez la base de données** :
   - Cliquez sur **"Nouvelle base de données"**
   - Nom : `hospital_management`
   - Interclassement : `utf8mb4_unicode_ci`
   - Cliquez sur **"Créer"**

3. **Exécutez le script de schéma** :
   - Sélectionnez la base `hospital_management`
   - Allez dans l'onglet **"SQL"**
   - Copiez-collez le contenu de `database/schema.sql`
   - Cliquez sur **"Exécuter"**

### Option B : Via MySQL en ligne de commande

```bash
mysql -u root -p < database/schema.sql
```

---

## 👥 ÉTAPE 2 : CRÉER TOUS LES UTILISATEURS PAR DÉFAUT

### Méthode 1 : Script SQL complet (Recommandé)

1. **Ouvrez PhpMyAdmin** : http://localhost/phpmyadmin

2. **Sélectionnez** la base `hospital_management`

3. **Allez dans l'onglet SQL**

4. **Exécutez le script complet** :
   - Ouvrez le fichier `database/init_all_users.sql`
   - Copiez-collez tout le contenu dans PhpMyAdmin
   - Cliquez sur **"Exécuter"**

5. **Vérifiez** que tous les utilisateurs sont créés :
   - Allez dans la table `profiles`
   - Vous devriez voir 10 utilisateurs créés

### Méthode 2 : Scripts individuels

Si vous préférez créer les utilisateurs un par un :

1. **Super Admin** : Déjà créé dans `schema.sql`
2. **Superviseur QHSE** : Exécutez `database/create_qhse_user.sql`
3. **Secrétaire** : Exécutez `database/create_secretaire_user.sql`
4. **Agent de Sécurité** : Exécutez `database/create_agent_securite_user.sql`
5. **Superviseur Sécurité** : Exécutez `database/create_superviseur_securite_user.sql`
6. **Agent d'Entretien** : Créez-le via l'interface Super Admin
7. **Technicien** : Créez-le via l'interface Super Admin
8. **Superviseur Entretien** : Créez-le via l'interface Super Admin
9. **Superviseur Technicien** : Créez-le via l'interface Super Admin
10. **Médecin** : Créez-le via l'interface Super Admin

---

## ⚙️ ÉTAPE 3 : CONFIGURER LE BACKEND

### 1. Créer le fichier `.env` dans le dossier `backend`

Créez un fichier `.env` dans `backend/.env` avec le contenu suivant :

```env
# Configuration de la base de données MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hospital_management
DB_PORT=3306

# Configuration JWT
JWT_SECRET=votre-clé-secrète-changez-cela-en-production

# Configuration du serveur
PORT=3001

# Configuration CORS (pour le frontend)
FRONTEND_URL=http://localhost:8080
```

**⚠️ IMPORTANT** :
- Si votre MySQL a un mot de passe, ajoutez-le dans `DB_PASSWORD`
- Changez `JWT_SECRET` par une clé secrète forte en production

### 2. Vérifier les dépendances

Assurez-vous que toutes les dépendances sont installées :

```bash
cd backend
npm install
```

### 3. Tester la connexion à la base de données

```bash
cd backend
node -e "const mysql = require('mysql2/promise'); const pool = mysql.createPool({host: 'localhost', user: 'root', password: '', database: 'hospital_management'}); pool.execute('SELECT COUNT(*) as count FROM profiles').then(([rows]) => console.log('✅ Connexion réussie! Utilisateurs trouvés:', rows[0].count)).catch(err => console.error('❌ Erreur:', err.message));"
```

---

## 🚀 ÉTAPE 4 : DÉMARRER L'APPLICATION

### 1. Démarrer le backend

```bash
cd backend
npm start
```

Vous devriez voir :
```
✅ Serveur démarré sur le port 3001
✅ Connexion à MySQL réussie
```

### 2. Démarrer le frontend

Dans un nouveau terminal :

```bash
npm install  # Si pas encore fait
npm run dev
```

Vous devriez voir :
```
VITE vX.X.X ready in XXX ms
➜  Local:   http://localhost:8080/
```

### 3. Tester la connexion

1. Ouvrez votre navigateur : http://localhost:8080
2. Connectez-vous avec :
   - **Email** : `admin@hospital.com`
   - **Mot de passe** : `admin123`
3. Vous devriez voir le **Portail Super Admin**

---

## ✅ VÉRIFICATIONS

### 1. Vérifier que tous les utilisateurs existent

Exécutez cette requête SQL dans PhpMyAdmin :

```sql
SELECT username, email, role, service 
FROM profiles 
ORDER BY role;
```

Vous devriez voir **10 utilisateurs** :
- ✅ superadmin
- ✅ superviseur_qhse
- ✅ secretaire
- ✅ agent_securite
- ✅ superviseur_securite
- ✅ agent_entretien
- ✅ superviseur_entretien
- ✅ technicien
- ✅ superviseur_technicien
- ✅ medecin

### 2. Tester chaque portail

Testez la connexion avec chaque utilisateur :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Super Admin | admin@hospital.com | admin123 |
| Superviseur QHSE | qhse@hospital.com | qhse123 |
| Secrétaire | secretaire@hospital.com | secretaire123 |
| Agent Sécurité | agent.securite@hospital.com | agent_securite123 |
| Superviseur Sécurité | superviseur.securite@hospital.com | superviseur_securite123 |
| Agent Entretien | agent.entretien@hospital.com | agent_entretien123 |
| Superviseur Entretien | superviseur.entretien@hospital.com | superviseur_entretien123 |
| Technicien | technicien@hospital.com | technicien123 |
| Superviseur Technicien | superviseur.technicien@hospital.com | superviseur_technicien123 |
| Médecin | medecin@hospital.com | medecin123 |

### 3. Vérifier les tables

Assurez-vous que toutes les tables existent :

```sql
SHOW TABLES;
```

Vous devriez voir :
- ✅ profiles
- ✅ incidents
- ✅ visitors
- ✅ biomedical_equipment
- ✅ maintenance_tasks
- ✅ rooms
- ✅ doctors
- ✅ bookings
- ✅ planned_tasks
- ✅ notifications

---

## 🔧 DÉPANNAGE

### Problème : "Cannot connect to MySQL"

**Solutions** :
1. Vérifiez que MySQL est démarré dans WAMP/XAMPP
2. Vérifiez les paramètres dans `backend/.env`
3. Vérifiez que la base `hospital_management` existe

### Problème : "Access denied for user"

**Solutions** :
1. Vérifiez le mot de passe MySQL dans `backend/.env`
2. Essayez avec `root` sans mot de passe (par défaut WAMP/XAMPP)

### Problème : "Table doesn't exist"

**Solutions** :
1. Exécutez `database/schema.sql` pour créer toutes les tables
2. Vérifiez que vous êtes dans la bonne base de données

### Problème : "Port already in use"

**Solutions** :
1. Changez le port dans `backend/.env` (ex: `PORT=3002`)
2. Ou arrêtez le processus qui utilise le port 3001

### Problème : "JWT_SECRET not found"

**Solutions** :
1. Créez le fichier `backend/.env`
2. Ajoutez `JWT_SECRET=votre-clé-secrète`

---

## 📊 STRUCTURE COMPLÈTE DE LA BASE DE DONNÉES

### Tables créées :

1. **profiles** - Utilisateurs de l'application
2. **incidents** - Incidents signalés (sécurité, entretien, technique)
3. **visitors** - Registre des visiteurs
4. **biomedical_equipment** - Équipements biomédicaux
5. **maintenance_tasks** - Tâches de maintenance
6. **rooms** - Salles disponibles
7. **doctors** - Annuaire des médecins
8. **bookings** - Réservations de salles
9. **planned_tasks** - Tâches planifiées
10. **notifications** - Notifications utilisateurs

---

## 🎯 CHECKLIST FINALE

Avant de considérer que tout est fonctionnel :

- [ ] Base de données `hospital_management` créée
- [ ] Toutes les tables créées (10 tables)
- [ ] Tous les utilisateurs par défaut créés (10 utilisateurs)
- [ ] Fichier `backend/.env` créé et configuré
- [ ] Backend démarré sans erreur
- [ ] Frontend démarré sans erreur
- [ ] Connexion réussie avec Super Admin
- [ ] Tous les portails accessibles selon les rôles
- [ ] Les données s'enregistrent dans la base de données
- [ ] Les données s'affichent depuis la base de données

---

## 📝 NOTES IMPORTANTES

1. **Sécurité** :
   - Changez tous les mots de passe par défaut en production
   - Utilisez une clé JWT_SECRET forte
   - Limitez l'accès à la base de données

2. **Sauvegarde** :
   - Faites des sauvegardes régulières de votre base de données
   - Exécutez `mysqldump hospital_management > backup.sql`

3. **Performance** :
   - La base de données utilise un pool de connexions (max 10)
   - Les index sont créés pour optimiser les requêtes

---

## 🆘 SUPPORT

Si vous rencontrez des problèmes :

1. Vérifiez les logs du backend dans la console
2. Vérifiez les erreurs dans la console du navigateur (F12)
3. Vérifiez que MySQL est bien démarré
4. Vérifiez la configuration dans `backend/.env`

---

**Une fois ces étapes terminées, votre application est entièrement fonctionnelle et connectée à votre base de données MySQL ! 🎉**



