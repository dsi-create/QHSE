# 🚀 GUIDE D'ACCÈS AU PORTAIL QHSE

## 📋 Comment accéder au Portail QHSE

---

## 🔐 ÉTAPE 1 : SE CONNECTER

### Option A : Se connecter en tant que Superviseur QHSE

**Identifiants par défaut** (si l'utilisateur existe déjà) :
- **Email** : `qhse@hospital.com`
- **Mot de passe** : `qhse123`

### Option B : Créer le compte Superviseur QHSE (si nécessaire)

#### Méthode 1 : Via l'interface Super Admin

1. **Connectez-vous** en tant que Super Admin :
   - Email : `admin@hospital.com`
   - Mot de passe : `admin123`

2. **Allez dans** : **Menu → Gestion Utilisateurs** (icône Settings)

3. **Cliquez sur** : **"Ajouter un utilisateur"**

4. **Remplissez le formulaire** :
   - **Identifiant** : `superviseur_qhse`
   - **Email** : `qhse@hospital.com`
   - **Mot de passe** : `qhse123` (ou votre mot de passe)
   - **Prénom** : `Superviseur`
   - **Nom** : `QHSE`
   - **Civilité** : `M.`, `Mme` ou `Mlle`
   - **Rôle** : Sélectionnez **"Superviseur QHSE"**
   - **Service** : `Qualité, Hygiène, Sécurité et Environnement`

5. **Cliquez sur** : **"Créer l'utilisateur"**

6. **Déconnectez-vous** et reconnectez-vous avec les nouveaux identifiants

#### Méthode 2 : Via SQL (base de données)

Exécutez le script SQL disponible dans `database/create_qhse_user.sql` :

```sql
USE hospital_management;

INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
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

---

## 🎯 ÉTAPE 2 : ACCÉDER AU PORTAIL QHSE

Une fois connecté en tant que **Superviseur QHSE**, vous verrez automatiquement votre **Portail QHSE** comme page d'accueil !

### 🏠 Le Portail QHSE s'affiche automatiquement

- **Au chargement** : Le portail QHSE s'affiche automatiquement après connexion
- **Menu de navigation** : Le premier élément du menu est **"Mon Portail"** (icône Home)
- **En-tête violet** : Vous verrez "Portail QHSE" avec votre nom et rôle

---

## 📊 CONTENU DU PORTAIL QHSE

Le Portail QHSE affiche :

### 📈 Statistiques principales
- **Tickets Total** : Nombre total de tickets
- **Nouveaux Tickets** : Tickets en attente de traitement
- **En Cours** : Tickets actuellement traités
- **Résolus** : Tickets terminés

### 📊 Statistiques secondaires
- **Visiteurs Aujourd'hui** : Nombre de visiteurs du jour
- **Réservations Actives** : Salles actuellement réservées
- **Tâches à Planifier** : Tâches en attente

### ⚡ Accès rapides
- **Gestion Tickets** : Assigner et suivre les tickets
- **Biomédical** : Gérer les équipements médicaux
- **Planning Salles** : Gérer les réservations de salles
- **Utilisateurs** : Gérer les comptes (agents, techniciens)

---

## 🧭 NAVIGATION DANS LE PORTAIL QHSE

### Menu de navigation disponible :

1. **Mon Portail** (Home) - Page d'accueil QHSE
2. **Dashboard QHSE** - Vue d'ensemble complète
3. **Gestion Tickets** - Assignation et suivi des incidents
4. **Biomédical** - Équipements médicaux
5. **Planning Salles** - Réservations de salles
6. **Annuaire Médecins** - Liste des médecins
7. **Gestion Utilisateurs** - Création et gestion des comptes
8. **Planning Tâches** - Création de tâches planifiées
9. **KPIs** - Indicateurs de performance
10. **Vue Globale Salles** - Vue d'ensemble des salles
11. **Mes Infos** - Profil personnel

---

## 👥 AUTRES RÔLES QUI ONT ACCÈS AU MODULE QHSE

Les utilisateurs suivants ont également accès au **Dashboard QHSE** et aux **Tickets QHSE** :

- ✅ **Agent d'Entretien** : Accès au Dashboard QHSE et Tickets QHSE
- ✅ **Technicien** : Accès au Dashboard QHSE et Tickets QHSE
- ✅ **Superviseur Agent d'Entretien** : Accès complet au module QHSE
- ✅ **Superviseur Technicien** : Accès complet au module QHSE
- ✅ **Super Admin** : Accès à tout

---

## 🔍 ACCÈS DIRECT AU DASHBOARD QHSE

Pour accéder directement au **Dashboard QHSE** depuis n'importe quelle page :

1. **Cliquez sur** le menu de navigation en haut
2. **Sélectionnez** : **"Dashboard QHSE"** (icône UserCog)
3. Ou utilisez les **cartes cliquables** dans le portail QHSE

---

## 📱 CARACTÉRISTIQUES DU PORTAIL QHSE

### ✅ Interface moderne
- Design avec gradient violet/indigo
- Cartes interactives et cliquables
- Animations fluides
- Responsive (mobile et desktop)

### ✅ Informations en temps réel
- Statistiques mises à jour automatiquement
- Alertes visuelles pour les tickets urgents
- Compteurs dynamiques

### ✅ Navigation intuitive
- Accès rapide aux fonctionnalités principales
- Menu de navigation clair
- Cartes cliquables pour navigation directe

---

## 🆘 DÉPANNAGE

### Si vous ne voyez pas le Portail QHSE :

1. **Vérifiez votre rôle** :
   - Allez dans **Mes Infos**
   - Vérifiez que votre rôle est bien **"Superviseur QHSE"**

2. **Vérifiez vos permissions** :
   - Le Super Admin peut vérifier vos permissions dans **Gestion Utilisateurs**

3. **Rafraîchissez la page** :
   - Appuyez sur **F5** ou **Ctrl+R**

4. **Déconnectez-vous et reconnectez-vous** :
   - Cela recharge vos permissions

---

## 📞 INFORMATIONS DE CONNEXION

### Superviseur QHSE par défaut :
- **Email** : `qhse@hospital.com`
- **Mot de passe** : `qhse123`
- **Rôle** : `superviseur_qhse`

### Super Admin (pour créer un Superviseur QHSE) :
- **Email** : `admin@hospital.com`
- **Mot de passe** : `admin123`
- **Rôle** : `superadmin`

---

## ✨ AVANTAGES DU PORTAIL QHSE

- 🎯 **Vue d'ensemble complète** : Toutes les informations importantes en un seul endroit
- ⚡ **Accès rapide** : Navigation directe vers les fonctionnalités principales
- 📊 **Statistiques en temps réel** : Suivi de l'activité en direct
- 🎨 **Interface moderne** : Design professionnel et ergonomique
- 📱 **Responsive** : Accessible sur tous les appareils

---

**Le Portail QHSE est votre centre de commande pour gérer la Qualité, l'Hygiène, la Sécurité et l'Environnement ! 🎉**



