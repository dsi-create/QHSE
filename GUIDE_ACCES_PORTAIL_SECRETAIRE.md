# 🚀 GUIDE D'ACCÈS AU PORTAIL SECRÉTAIRE

## 📋 Comment accéder au Portail Secrétaire

---

## 🔐 ÉTAPE 1 : SE CONNECTER

### Option A : Se connecter en tant que Secrétaire

**Identifiants par défaut** (si l'utilisateur existe déjà) :
- **Email** : `secretaire@hospital.com`
- **Mot de passe** : `secretaire123`

### Option B : Créer le compte Secrétaire (si nécessaire)

#### Méthode 1 : Via l'interface Super Admin

1. **Connectez-vous** en tant que Super Admin :
   - Email : `admin@hospital.com`
   - Mot de passe : `admin123`

2. **Allez dans** : **Menu → Gestion Utilisateurs** (icône Settings)

3. **Cliquez sur** : **"Ajouter un utilisateur"**

4. **Remplissez le formulaire** :
   - **Identifiant** : `secretaire` (ou un autre nom)
   - **Email** : `secretaire@hospital.com` (ou votre email)
   - **Mot de passe** : `secretaire123` (ou votre mot de passe)
   - **Prénom** : `Secrétaire`
   - **Nom** : `Administrative` (ou votre nom)
   - **Civilité** : `Mme`, `M.` ou `Mlle`
   - **Rôle** : Sélectionnez **"Secrétaire"**
   - **Service** : `Secrétariat` (ou votre service)

5. **Cliquez sur** : **"Créer l'utilisateur"**

6. **Déconnectez-vous** et reconnectez-vous avec les nouveaux identifiants

#### Méthode 2 : Via SQL (base de données)

Exécutez le script SQL disponible dans `database/create_secretaire_user.sql` :

```sql
USE hospital_management;

INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'secretaire',
    'secretaire@hospital.com',
    '$2a$10$Lk99gn0FmP0MyEoCma3Kz.GpSbEuxwdKsV8JhpGreVC1A19cwfC/O', -- Mot de passe : secretaire123
    'Secrétaire',
    'Administrative',
    'Mme',
    'secretaire',
    'Secrétariat'
) ON DUPLICATE KEY UPDATE username=username;
```

---

## 🎯 ÉTAPE 2 : ACCÉDER AU PORTAIL SECRÉTAIRE

Une fois connecté en tant que **Secrétaire**, vous verrez automatiquement votre **Portail Secrétaire** comme page d'accueil !

### 🏠 Le Portail Secrétaire s'affiche automatiquement

- **Au chargement** : Le portail Secrétaire s'affiche automatiquement après connexion
- **Menu de navigation** : Le premier élément du menu est **"Mon Portail"** (icône Home)
- **En-tête rose** : Vous verrez "Portail Secrétaire" avec votre nom

---

## 📊 CONTENU DU PORTAIL SECRÉTAIRE

Le Portail Secrétaire affiche :

### 📈 Statistiques principales
- **Visiteurs Aujourd'hui** : Nombre de visiteurs enregistrés aujourd'hui
- **Visiteurs Actifs** : Visiteurs actuellement dans l'établissement
- **Réservations Aujourd'hui** : Nombre de réservations prévues aujourd'hui
- **Réservations Actives** : Salles actuellement réservées ou en cours d'utilisation

### ⚡ Accès rapides
- **Registre Visiteurs** : Gérer l'entrée et la sortie des visiteurs
- **Planning des Salles** : Gérer les réservations de salles

---

## 🧭 NAVIGATION DANS LE PORTAIL SECRÉTAIRE

### Menu de navigation disponible :

1. **Mon Portail** (Home) - Page d'accueil Secrétaire
2. **Planning Salles** - Gestion complète des réservations de salles
3. **Registre Visiteurs** - Enregistrement des entrées/sorties
4. **Annuaire Médecins** - Consultation de l'annuaire des médecins
5. **Vue Globale Salles** - Vue d'ensemble de toutes les salles
6. **Mes Infos** - Profil personnel et modification du mot de passe

---

## 📝 FONCTIONNALITÉS DISPONIBLES

### ✅ Registre Visiteurs

**Capacités** :
- ✅ Enregistrer l'entrée d'un visiteur
- ✅ Enregistrer la sortie d'un visiteur
- ✅ Consulter l'historique des visiteurs
- ✅ Filtrer et rechercher des visiteurs
- ✅ Voir les visiteurs actuellement dans l'établissement

**Comment utiliser** :
1. Cliquez sur **"Registre Visiteurs"** dans le menu
2. Pour enregistrer une entrée : Cliquez sur **"Ajouter un visiteur"**
3. Remplissez le formulaire (nom, prénom, destination, raison de visite)
4. Pour enregistrer une sortie : Trouvez le visiteur et cliquez sur **"Enregistrer la sortie"**

### ✅ Planning des Salles

**Capacités** :
- ✅ Créer des réservations de salles
- ✅ Modifier des réservations existantes
- ✅ Annuler des réservations
- ✅ Voir le planning de toutes les salles
- ✅ Filtrer par date, salle, médecin
- ✅ Voir les réservations en cours et à venir

**Comment utiliser** :
1. Cliquez sur **"Planning Salles"** dans le menu
2. Sélectionnez une salle et une date
3. Cliquez sur **"Nouvelle réservation"**
4. Remplissez le formulaire (titre, médecin, heure de début/fin, raison)
5. Cliquez sur **"Créer la réservation"**

### ✅ Annuaire Médecins

**Capacités** :
- ✅ Consulter la liste des médecins
- ✅ Voir les informations de contact
- ✅ Créer des réservations pour les médecins
- ✅ Voir les réservations des médecins

### ✅ Vue Globale Salles

**Capacités** :
- ✅ Vue d'ensemble de toutes les salles
- ✅ Statut de chaque salle (libre, réservée, en cours)
- ✅ Navigation rapide vers le planning détaillé

---

## 🎨 CARACTÉRISTIQUES DU PORTAIL SECRÉTAIRE

### ✅ Interface moderne
- Design avec gradient rose/pink
- Cartes interactives et cliquables
- Animations fluides
- Responsive (mobile et desktop)

### ✅ Informations en temps réel
- Statistiques mises à jour automatiquement
- Compteurs dynamiques
- Vue d'ensemble de l'activité du jour

### ✅ Navigation intuitive
- Accès rapide aux fonctionnalités principales
- Menu de navigation clair
- Cartes cliquables pour navigation directe

---

## 📊 STATISTIQUES AFFICHÉES

### Dans le Portail Secrétaire :

1. **Visiteurs Aujourd'hui** 🟢
   - Nombre total de visiteurs enregistrés aujourd'hui
   - Cliquez pour voir la liste complète

2. **Visiteurs Actifs** 🔵
   - Visiteurs actuellement dans l'établissement (pas encore sortis)
   - Cliquez pour voir qui est encore présent

3. **Réservations Aujourd'hui** 🟣
   - Nombre de réservations prévues aujourd'hui
   - Cliquez pour voir le planning du jour

4. **Réservations Actives** 🟠
   - Salles actuellement réservées ou en cours d'utilisation
   - Cliquez pour voir les détails

---

## 🔍 ACCÈS DIRECT AUX MODULES

Pour accéder directement aux modules depuis n'importe quelle page :

1. **Planning Salles** :
   - Cliquez sur **"Planning Salles"** dans le menu
   - Ou cliquez sur la carte "Planning des Salles" dans le portail

2. **Registre Visiteurs** :
   - Cliquez sur **"Registre Visiteurs"** dans le menu
   - Ou cliquez sur la carte "Registre Visiteurs" dans le portail

3. **Annuaire Médecins** :
   - Cliquez sur **"Annuaire Médecins"** dans le menu

---

## 🆘 DÉPANNAGE

### Si vous ne voyez pas le Portail Secrétaire :

1. **Vérifiez votre rôle** :
   - Allez dans **Mes Infos**
   - Vérifiez que votre rôle est bien **"Secrétaire"**

2. **Vérifiez vos permissions** :
   - Le Super Admin peut vérifier vos permissions dans **Gestion Utilisateurs**

3. **Rafraîchissez la page** :
   - Appuyez sur **F5** ou **Ctrl+R**

4. **Déconnectez-vous et reconnectez-vous** :
   - Cela recharge vos permissions

### Si vous ne pouvez pas créer de réservation :

1. **Vérifiez** que la salle est disponible
2. **Vérifiez** que l'heure de début est avant l'heure de fin
3. **Vérifiez** que le médecin existe dans l'annuaire

### Si vous ne pouvez pas enregistrer un visiteur :

1. **Vérifiez** que tous les champs requis sont remplis
2. **Vérifiez** que l'email est valide (si fourni)

---

## 📞 INFORMATIONS DE CONNEXION

### Secrétaire par défaut :
- **Email** : `secretaire@hospital.com`
- **Mot de passe** : `secretaire123`
- **Rôle** : `secretaire`

### Super Admin (pour créer un Secrétaire) :
- **Email** : `admin@hospital.com`
- **Mot de passe** : `admin123`
- **Rôle** : `superadmin`

---

## ✨ AVANTAGES DU PORTAIL SECRÉTAIRE

- 🎯 **Vue d'ensemble complète** : Toutes les informations importantes en un seul endroit
- ⚡ **Accès rapide** : Navigation directe vers les fonctionnalités principales
- 📊 **Statistiques en temps réel** : Suivi de l'activité en direct
- 🎨 **Interface moderne** : Design professionnel et ergonomique
- 📱 **Responsive** : Accessible sur tous les appareils
- 👥 **Gestion simplifiée** : Outils intuitifs pour gérer visiteurs et réservations

---

## 📋 RÉSUMÉ DES PERMISSIONS

En tant que Secrétaire, vous avez accès à :

✅ **Planning Salles** - Gestion complète des réservations
✅ **Registre Visiteurs** - Enregistrement des entrées/sorties
✅ **Annuaire Médecins** - Consultation de l'annuaire
✅ **Vue Globale Salles** - Vue d'ensemble des salles
✅ **Mes Infos** - Profil personnel

❌ **Non accessible** :
- Gestion des utilisateurs
- Gestion des tickets QHSE
- Dashboard QHSE
- Biomédical
- KPIs

---

**Le Portail Secrétaire est votre centre de commande pour gérer les réservations et les visiteurs ! 🎉**



