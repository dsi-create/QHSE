# 🔐 Comment se connecter en tant que Superviseur QHSE

## 📋 Options de Connexion

Il existe **deux méthodes** pour se connecter en tant que Superviseur QHSE :

---

## Méthode 1 : Créer l'utilisateur via l'interface (Recommandé)

### ✅ En tant que Super Admin

1. **Connectez-vous** en tant que Super Admin :
   - **Email** : `admin@hospital.com`
   - **Mot de passe** : `admin123`

2. **Allez dans** : **Menu → Gestion Utilisateurs**

3. **Cliquez sur** : **"Ajouter un utilisateur"**

4. **Remplissez le formulaire** :
   - **Identifiant** : `superviseur_qhse` (ou un autre nom)
   - **Email** : `qhse@hospital.com` (ou votre email)
   - **Mot de passe** : Choisissez un mot de passe sécurisé
   - **Prénom** : `Superviseur`
   - **Nom** : `QHSE`
   - **Civilité** : `M.`, `Mme` ou `Mlle`
   - **Rôle** : Sélectionnez **"Superviseur QHSE"**
   - **Service** : `Qualité, Hygiène, Sécurité et Environnement`

5. **Cliquez sur** : **"Créer l'utilisateur"**

6. **Déconnectez-vous** et reconnectez-vous avec les nouvelles identifiants.

---

## Méthode 2 : Créer l'utilisateur via SQL

### 📝 Via PhpMyAdmin ou MySQL

1. **Ouvrez** PhpMyAdmin ou votre client MySQL

2. **Sélectionnez** la base de données `hospital_management`

3. **Exécutez** le script SQL suivant :

```sql
USE hospital_management;

INSERT INTO profiles (
    id, 
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    civility, 
    role,
    service
) VALUES (
    UUID(),
    'superviseur_qhse',
    'qhse@hospital.com',
    '$2a$10$QAKZ5a/n7raPrBo6RJh3euS6u3yRRNXP/xNIhXrC2k4vN877UkQRq', -- Mot de passe : qhse123
    'Superviseur',
    'QHSE',
    'M.',
    'superviseur_qhse',
    'Qualité, Hygiène, Sécurité et Environnement'
) ON DUPLICATE KEY UPDATE username=username;
```

### ✅ Identifiants de connexion

Après avoir exécuté le script SQL, utilisez :

- **Email** : `qhse@hospital.com`
- **Mot de passe** : `qhse123`

---

## 🎯 Permissions du Superviseur QHSE

Une fois connecté, vous aurez accès à :

- ✅ **Dashboard QHSE** : Vue d'ensemble de tous les tickets
- ✅ **Gestion Tickets** : Assignation et suivi des incidents
- ✅ **Biomédical** : Gestion des équipements biomédicaux
- ✅ **Planning des Salles** : Gestion complète du planning
- ✅ **Annuaire Médecins** : Consultation de l'annuaire
- ✅ **Gestion Utilisateurs** : Création et gestion des agents et techniciens
- ✅ **Planning Tâches** : Création et assignation de tâches planifiées
- ✅ **KPIs** : Indicateurs de performance
- ✅ **Vue Globale Salles** : Vue d'ensemble des salles

---

## 🔄 Changer le mot de passe

### Via l'interface Super Admin

1. Connectez-vous en tant que Super Admin
2. Allez dans **Gestion Utilisateurs**
3. Trouvez l'utilisateur Superviseur QHSE
4. Cliquez sur **"MDP"** (Reset Mot de Passe)
5. Entrez le nouveau mot de passe

### Via SQL

```sql
-- Générer un nouveau hash pour votre mot de passe
-- Remplacez 'nouveau_mot_de_passe' par votre mot de passe
UPDATE profiles 
SET password_hash = '$2a$10$...' -- Nouveau hash généré
WHERE username = 'superviseur_qhse';
```

---

## 📝 Fichier SQL Disponible

Un fichier SQL pré-configuré est disponible dans :
- `database/create_qhse_user.sql`

Vous pouvez l'exécuter directement dans PhpMyAdmin ou MySQL.

---

## ⚠️ Important

- **Sécurité** : Changez le mot de passe par défaut après la première connexion
- **Email unique** : Chaque utilisateur doit avoir un email unique
- **Username unique** : Chaque utilisateur doit avoir un identifiant unique
- **Permissions** : Le Superviseur QHSE peut gérer les agents et techniciens, mais pas les autres superviseurs

---

## 🆘 Dépannage

### Si vous ne pouvez pas vous connecter :

1. **Vérifiez** que l'utilisateur existe dans la base de données :
   ```sql
   SELECT * FROM profiles WHERE role = 'superviseur_qhse';
   ```

2. **Vérifiez** que le mot de passe est correct

3. **Vérifiez** que l'email est correct (pas de fautes de frappe)

4. **Videz le cache** du navigateur et réessayez

---

**Bon à savoir** : Le Superviseur QHSE a un niveau d'accès élevé, juste en dessous du Super Admin. Il peut gérer la plupart des aspects opérationnels du système.



