# 🗄️ CONFIGURATION COMPLÈTE DE LA BASE DE DONNÉES

## ✅ Scripts SQL Créés

Tous les scripts nécessaires pour initialiser votre base de données sont maintenant disponibles :

### 📁 Fichiers SQL disponibles :

1. **`database/schema.sql`** ✅
   - Crée la base de données `hospital_management`
   - Crée toutes les tables (10 tables)
   - Crée l'utilisateur Super Admin par défaut

2. **`database/init_all_users.sql`** ✅ NOUVEAU
   - Crée TOUS les utilisateurs par défaut (10 utilisateurs)
   - Script complet et prêt à l'emploi

3. **`database/fix_schema_enums.sql`** ✅ NOUVEAU
   - Corrige les ENUMs si nécessaire
   - À exécuter si vous avez déjà créé les tables

4. **Scripts individuels** (optionnels) :
   - `database/create_qhse_user.sql`
   - `database/create_secretaire_user.sql`
   - `database/create_agent_securite_user.sql`
   - `database/create_superviseur_securite_user.sql`

---

## 🚀 INITIALISATION RAPIDE (3 ÉTAPES)

### ÉTAPE 1 : Créer la base de données et les tables

1. Ouvrez **PhpMyAdmin** : http://localhost/phpmyadmin
2. Onglet **"SQL"**
3. Copiez-collez le contenu de **`database/schema.sql`**
4. Cliquez sur **"Exécuter"**

### ÉTAPE 2 : Créer tous les utilisateurs

1. Dans PhpMyAdmin, sélectionnez la base `hospital_management`
2. Onglet **"SQL"**
3. Copiez-collez le contenu de **`database/init_all_users.sql`**
4. Cliquez sur **"Exécuter"**

### ÉTAPE 3 : Configurer le backend

1. Créez le fichier **`backend/.env`** :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hospital_management
DB_PORT=3306
JWT_SECRET=votre-clé-secrète-changez-cela-en-production
PORT=3001
```

2. Démarrer le backend :
```bash
cd backend
npm install
npm start
```

3. Démarrer le frontend :
```bash
npm install
npm run dev
```

---

## 📊 UTILISATEURS PAR DÉFAUT CRÉÉS

Le script `init_all_users.sql` crée automatiquement :

| # | Rôle | Email | Mot de passe | Username |
|---|------|-------|--------------|----------|
| 1 | Super Admin | admin@hospital.com | admin123 | superadmin |
| 2 | Superviseur QHSE | qhse@hospital.com | qhse123 | superviseur_qhse |
| 3 | Secrétaire | secretaire@hospital.com | secretaire123 | secretaire |
| 4 | Agent Sécurité | agent.securite@hospital.com | agent_securite123 | agent_securite |
| 5 | Superviseur Sécurité | superviseur.securite@hospital.com | superviseur_securite123 | superviseur_securite |
| 6 | Agent Entretien | agent.entretien@hospital.com | agent_entretien123 | agent_entretien |
| 7 | Superviseur Entretien | superviseur.entretien@hospital.com | superviseur_entretien123 | superviseur_entretien |
| 8 | Technicien | technicien@hospital.com | technicien123 | technicien |
| 9 | Superviseur Technicien | superviseur.technicien@hospital.com | superviseur_technicien123 | superviseur_technicien |
| 10 | Médecin | medecin@hospital.com | medecin123 | medecin |

---

## ✅ VÉRIFICATION

### Vérifier que tout fonctionne :

1. **Vérifier les utilisateurs** :
```sql
SELECT username, email, role FROM profiles ORDER BY role;
```
Vous devriez voir 10 utilisateurs.

2. **Vérifier les tables** :
```sql
SHOW TABLES;
```
Vous devriez voir 10 tables.

3. **Tester la connexion** :
- Connectez-vous avec `admin@hospital.com` / `admin123`
- Vous devriez voir le Portail Super Admin

---

## 🔧 CORRECTIONS APPLIQUÉES

### Schéma SQL corrigé :

- ✅ **statut** : `ENUM('nouveau', 'attente', 'cours', 'traite', 'resolu')`
- ✅ **priorite** : `ENUM('faible', 'moyenne', 'haute', 'critique')`

Ces valeurs correspondent maintenant exactement aux types TypeScript.

---

## 📝 FICHIER .ENV À CRÉER

Créez `backend/.env` avec ce contenu :

```env
# Configuration MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hospital_management
DB_PORT=3306

# JWT Secret (changez en production!)
JWT_SECRET=votre-clé-secrète-changez-cela-en-production

# Port du serveur
PORT=3001
```

**⚠️ Si votre MySQL a un mot de passe**, ajoutez-le dans `DB_PASSWORD`.

---

## 🎯 CHECKLIST FINALE

- [ ] Base de données `hospital_management` créée
- [ ] Toutes les tables créées (exécuté `schema.sql`)
- [ ] Tous les utilisateurs créés (exécuté `init_all_users.sql`)
- [ ] Fichier `backend/.env` créé et configuré
- [ ] Backend démarré sans erreur
- [ ] Frontend démarré sans erreur
- [ ] Connexion réussie avec Super Admin
- [ ] Tous les portails fonctionnent

---

## 🆘 DÉPANNAGE

### Erreur : "Cannot connect to MySQL"
- Vérifiez que MySQL est démarré dans WAMP/XAMPP
- Vérifiez les paramètres dans `backend/.env`

### Erreur : "Access denied"
- Vérifiez le mot de passe MySQL dans `backend/.env`
- Par défaut WAMP/XAMPP n'a pas de mot de passe

### Erreur : "Table doesn't exist"
- Exécutez `database/schema.sql` pour créer toutes les tables

### Erreur : "ENUM value not valid"
- Exécutez `database/fix_schema_enums.sql` pour corriger les ENUMs

---

**Une fois ces étapes terminées, votre application est 100% fonctionnelle et connectée à votre base de données MySQL ! 🎉**



