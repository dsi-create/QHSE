# 🚀 GUIDE D'INITIALISATION COMPLÈTE

## ✅ Tout est prêt pour être connecté à votre base de données MySQL !

Ce guide vous permet de configurer entièrement l'application en **3 étapes simples**.

---

## 📋 PRÉREQUIS

### 1. Vérifier que WAMP/XAMPP est démarré

- ✅ **WAMP** : Vérifiez que les services MySQL et Apache sont démarrés (icône verte)
- ✅ **XAMPP** : Vérifiez que MySQL et Apache sont démarrés

### 2. Vérifier les ports disponibles

- **MySQL** : Port `3306` (par défaut)
- **Backend** : Port `3001`
- **Frontend** : Port `8080`

---

## 🗄️ ÉTAPE 1 : CRÉER LA BASE DE DONNÉES

### Via PhpMyAdmin (Recommandé)

1. **Ouvrez PhpMyAdmin** : http://localhost/phpmyadmin

2. **Onglet SQL**

3. **Copiez-collez** le contenu complet de `database/schema.sql`

4. **Cliquez sur "Exécuter"**

5. **Vérifiez** que :
   - La base `hospital_management` existe
   - 10 tables sont créées
   - L'utilisateur Super Admin est créé

---

## 👥 ÉTAPE 2 : CRÉER TOUS LES UTILISATEURS

### Via PhpMyAdmin

1. **Sélectionnez** la base `hospital_management`

2. **Onglet SQL**

3. **Copiez-collez** le contenu complet de `database/init_all_users.sql`

4. **Cliquez sur "Exécuter"**

5. **Vérifiez** que 10 utilisateurs sont créés :
   ```sql
   SELECT username, email, role FROM profiles ORDER BY role;
   ```

---

## ⚙️ ÉTAPE 3 : CONFIGURER LE BACKEND

### 1. Créer le fichier `.env`

Créez le fichier `backend/.env` (copiez depuis `backend/.env.example` si disponible) :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hospital_management
DB_PORT=3306
JWT_SECRET=votre-clé-secrète-changez-cela-en-production
PORT=3001
```

**⚠️ Si votre MySQL a un mot de passe**, ajoutez-le dans `DB_PASSWORD`.

### 2. Tester la connexion

```bash
cd backend
node test-db-connection.js
```

Vous devriez voir :
```
✅ Connexion réussie à MySQL!
✅ 10 table(s) trouvée(s)
✅ 10 utilisateur(s) trouvé(s)
```

### 3. Démarrer le backend

```bash
cd backend
npm install  # Si pas encore fait
npm start
```

Vous devriez voir :
```
✅ Serveur démarré sur le port 3001
```

### 4. Démarrer le frontend

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

---

## 🎯 ÉTAPE 4 : TESTER L'APPLICATION

### 1. Ouvrir l'application

Ouvrez votre navigateur : http://localhost:8080

### 2. Se connecter avec Super Admin

- **Email** : `admin@hospital.com`
- **Mot de passe** : `admin123`

### 3. Vérifier les portails

Testez chaque portail avec les identifiants correspondants :

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

---

## ✅ CHECKLIST DE VÉRIFICATION

### Base de données

- [ ] Base `hospital_management` créée
- [ ] 10 tables créées (profiles, incidents, visitors, etc.)
- [ ] 10 utilisateurs créés (via `init_all_users.sql`)
- [ ] ENUMs corrects (statut: nouveau, attente, cours, traite, resolu)
- [ ] ENUMs corrects (priorite: faible, moyenne, haute, critique)

### Backend

- [ ] Fichier `backend/.env` créé et configuré
- [ ] Test de connexion réussi (`node test-db-connection.js`)
- [ ] Backend démarré sans erreur
- [ ] Messages "✅ Connexion à MySQL réussie" dans la console

### Frontend

- [ ] Frontend démarré sans erreur
- [ ] Application accessible sur http://localhost:8080
- [ ] Connexion réussie avec Super Admin
- [ ] Portail Super Admin s'affiche

### Fonctionnalités

- [ ] Créer un incident → Vérifier dans la base de données
- [ ] Enregistrer un visiteur → Vérifier dans la base de données
- [ ] Créer une réservation → Vérifier dans la base de données
- [ ] Les données persistent après redémarrage

---

## 🔧 DÉPANNAGE

### Erreur : "Cannot connect to MySQL"

**Solutions** :
1. Vérifiez que MySQL est démarré dans WAMP/XAMPP
2. Vérifiez les paramètres dans `backend/.env`
3. Testez avec : `node backend/test-db-connection.js`

### Erreur : "Access denied for user 'root'@'localhost'"

**Solutions** :
1. Vérifiez le mot de passe MySQL dans `backend/.env`
2. Par défaut WAMP/XAMPP n'a pas de mot de passe (laissez vide)
3. Si vous avez un mot de passe, ajoutez-le dans `DB_PASSWORD`

### Erreur : "Unknown database 'hospital_management'"

**Solutions** :
1. Exécutez `database/schema.sql` pour créer la base
2. Vérifiez que vous êtes dans la bonne base dans PhpMyAdmin

### Erreur : "ENUM value not valid"

**Solutions** :
1. Exécutez `database/fix_schema_enums.sql` pour corriger les ENUMs
2. Ou supprimez et recréez les tables avec `schema.sql` (corrigé)

### Erreur : "Port 3001 already in use"

**Solutions** :
1. Changez le port dans `backend/.env` : `PORT=3002`
2. Ou arrêtez le processus qui utilise le port 3001

### Erreur : "JWT_SECRET not found"

**Solutions** :
1. Créez le fichier `backend/.env`
2. Ajoutez `JWT_SECRET=votre-clé-secrète`

---

## 📊 STRUCTURE FINALE DE LA BASE DE DONNÉES

### Tables créées (10 tables) :

1. **profiles** - Utilisateurs (10 utilisateurs par défaut)
2. **incidents** - Incidents signalés
3. **visitors** - Registre des visiteurs
4. **biomedical_equipment** - Équipements biomédicaux
5. **maintenance_tasks** - Tâches de maintenance
6. **rooms** - Salles disponibles
7. **doctors** - Annuaire des médecins
8. **bookings** - Réservations de salles
9. **planned_tasks** - Tâches planifiées
10. **notifications** - Notifications utilisateurs

### Utilisateurs créés (10 utilisateurs) :

1. **superadmin** - Administrateur système
2. **superviseur_qhse** - Superviseur QHSE
3. **secretaire** - Secrétaire
4. **agent_securite** - Agent de Sécurité
5. **superviseur_securite** - Superviseur Sécurité
6. **agent_entretien** - Agent d'Entretien
7. **superviseur_entretien** - Superviseur Entretien
8. **technicien** - Technicien
9. **superviseur_technicien** - Superviseur Technicien
10. **medecin** - Médecin

---

## 🎉 RÉSULTAT FINAL

Une fois ces étapes terminées :

✅ **Base de données** entièrement configurée  
✅ **Tous les utilisateurs** créés et prêts  
✅ **Backend** connecté à MySQL  
✅ **Frontend** connecté au backend  
✅ **Tous les portails** fonctionnels  
✅ **Toutes les fonctionnalités** opérationnelles  

---

## 📝 FICHIERS CRÉÉS

### Scripts SQL :
- ✅ `database/schema.sql` - Schéma complet (corrigé)
- ✅ `database/init_all_users.sql` - Tous les utilisateurs
- ✅ `database/fix_schema_enums.sql` - Correction des ENUMs (si nécessaire)

### Scripts de test :
- ✅ `backend/test-db-connection.js` - Test de connexion

### Guides :
- ✅ `GUIDE_INITIALISATION_COMPLETE.md` - Guide détaillé
- ✅ `CONFIGURATION_BASE_DONNEES.md` - Configuration rapide
- ✅ `GUIDE_ACCES_PORTAIL_QHSE.md` - Accès QHSE
- ✅ `GUIDE_ACCES_PORTAIL_SECRETAIRE.md` - Accès Secrétaire
- ✅ `GUIDE_ACCES_PORTAIL_SECURITE.md` - Accès Sécurité

---

**Votre application est maintenant 100% fonctionnelle et connectée à votre base de données MySQL ! 🎉**

**Tous les portails sont prêts et tous les utilisateurs peuvent se connecter ! 🚀**



