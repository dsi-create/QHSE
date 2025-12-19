# 🚀 GUIDE D'ACCÈS AU PORTAIL SÉCURITÉ

## 📋 Comment accéder au Portail Sécurité

Il existe **deux types** d'utilisateurs Sécurité :
- **Agent de Sécurité** : Agent sur le terrain
- **Superviseur Agent de Sécurité** : Superviseur qui gère l'équipe

---

## 🔐 ÉTAPE 1 : SE CONNECTER

### Option A : Agent de Sécurité

**Identifiants par défaut** (si l'utilisateur existe déjà) :
- **Email** : `agent.securite@hospital.com`
- **Mot de passe** : `agent_securite123`

### Option B : Superviseur Agent de Sécurité

**Identifiants par défaut** (si l'utilisateur existe déjà) :
- **Email** : `superviseur.securite@hospital.com`
- **Mot de passe** : `superviseur_securite123`

---

## 🛠️ CRÉER LES COMPTES (si nécessaire)

### Méthode 1 : Via l'interface Super Admin

1. **Connectez-vous** en tant que Super Admin :
   - Email : `admin@hospital.com`
   - Mot de passe : `admin123`

2. **Allez dans** : **Menu → Gestion Utilisateurs** (icône Settings)

3. **Cliquez sur** : **"Ajouter un utilisateur"**

4. **Pour Agent de Sécurité**, remplissez :
   - **Identifiant** : `agent_securite` (ou un autre nom)
   - **Email** : `agent.securite@hospital.com`
   - **Mot de passe** : `agent_securite123`
   - **Prénom** : `Agent`
   - **Nom** : `Sécurité`
   - **Civilité** : `M.`, `Mme` ou `Mlle`
   - **Rôle** : Sélectionnez **"Agent de Sécurité"**
   - **Service** : `Sécurité & Accueil`

5. **Pour Superviseur Agent de Sécurité**, remplissez :
   - **Identifiant** : `superviseur_securite` (ou un autre nom)
   - **Email** : `superviseur.securite@hospital.com`
   - **Mot de passe** : `superviseur_securite123`
   - **Prénom** : `Superviseur`
   - **Nom** : `Sécurité`
   - **Civilité** : `M.`, `Mme` ou `Mlle`
   - **Rôle** : Sélectionnez **"Superviseur Agent de Sécurité"**
   - **Service** : `Sécurité & Accueil`

6. **Cliquez sur** : **"Créer l'utilisateur"**

7. **Déconnectez-vous** et reconnectez-vous avec les nouveaux identifiants

### Méthode 2 : Via SQL (base de données)

#### Pour Agent de Sécurité
Exécutez le script SQL disponible dans `database/create_agent_securite_user.sql`

#### Pour Superviseur Agent de Sécurité
Exécutez le script SQL disponible dans `database/create_superviseur_securite_user.sql`

---

## 🎯 ÉTAPE 2 : ACCÉDER AU PORTAIL SÉCURITÉ

Une fois connecté, vous verrez automatiquement votre **Portail Sécurité** comme page d'accueil !

### 🏠 Le Portail Sécurité s'affiche automatiquement

- **Au chargement** : Le portail Sécurité s'affiche automatiquement après connexion
- **Menu de navigation** : Le premier élément du menu est **"Mon Portail"** (icône Home)
- **En-tête bleu** : Vous verrez "Portail Sécurité" avec votre nom

---

## 📊 CONTENU DU PORTAIL SÉCURITÉ

### Pour Agent de Sécurité :

#### Statistiques principales
- **Incidents Aujourd'hui** : Nombre d'incidents signalés aujourd'hui
- **En Cours** : Incidents actuellement en cours de traitement
- **Visiteurs Aujourd'hui** : Nombre de visiteurs enregistrés aujourd'hui
- **Mes Tâches** : Tâches qui vous ont été assignées

#### Actions rapides
- **Signaler un Incident** : Déclarer un incident de sécurité
- **Registre Visiteurs** : Enregistrer entrée/sortie des visiteurs
- **Liste des Incidents** : Consulter tous les incidents

#### Informations importantes
- Alertes pour incidents urgents
- Alertes pour incidents en cours
- Alertes pour tâches assignées

---

### Pour Superviseur Agent de Sécurité :

#### Statistiques principales
- **Total Incidents** : Nombre total d'incidents
- **Nouveaux** : Incidents nouveaux à traiter
- **Mes Agents** : Nombre d'agents dans votre équipe
- **Visiteurs Aujourd'hui** : Nombre de visiteurs du jour

#### Accès rapides
- **Dashboard Sécurité** : Vue d'ensemble complète
- **Gestion Incidents** : Assigner et suivre les incidents
- **Planning Tâches** : Créer des tâches pour les agents
- **Gestion Agents** : Gérer les comptes des agents

---

## 🧭 NAVIGATION DANS LE PORTAIL SÉCURITÉ

### Menu de navigation pour Agent de Sécurité :

1. **Mon Portail** (Home) - Page d'accueil Sécurité
2. **Dashboard Sécurité** - Vue d'ensemble des incidents
3. **Signaler Incident** - Déclarer un incident de sécurité
4. **Liste Incidents Sécurité** - Consulter tous les incidents
5. **Registre Visiteurs** - Enregistrer entrées/sorties
6. **Mes Tâches** - Voir les tâches assignées
7. **Mes Infos** - Profil personnel

---

### Menu de navigation pour Superviseur Agent de Sécurité :

1. **Mon Portail** (Home) - Page d'accueil Superviseur Sécurité
2. **Dashboard Sécurité** - Vue d'ensemble complète
3. **Liste Incidents Sécurité** - Gestion des incidents
4. **Registre Visiteurs** - Consultation du registre
5. **Planning Tâches** - Création et gestion de tâches
6. **Gestion Utilisateurs** - Gérer les agents de sécurité
7. **Signaler Incident** - Déclarer un incident
8. **Mes Infos** - Profil personnel

---

## 📝 FONCTIONNALITÉS DISPONIBLES

### ✅ Signaler un Incident de Sécurité

**Capacités** :
- ✅ Déclarer un incident de sécurité
- ✅ Ajouter des photos
- ✅ Définir la priorité (faible, moyenne, haute, critique)
- ✅ Définir le type d'incident
- ✅ Indiquer le lieu exact

**Comment utiliser** :
1. Cliquez sur **"Signaler Incident"** dans le menu ou le portail
2. Remplissez le formulaire :
   - **Type** : Sélectionnez le type d'incident
   - **Description** : Décrivez l'incident en détail
   - **Lieu** : Indiquez où l'incident s'est produit
   - **Priorité** : Sélectionnez la priorité
   - **Photos** : Ajoutez des photos si nécessaire
3. Cliquez sur **"Signaler l'incident"**

### ✅ Registre Visiteurs

**Capacités** :
- ✅ Enregistrer l'entrée d'un visiteur
- ✅ Enregistrer la sortie d'un visiteur
- ✅ Consulter l'historique
- ✅ Voir les visiteurs actuellement dans l'établissement

**Comment utiliser** :
1. Cliquez sur **"Registre Visiteurs"** dans le menu
2. Pour enregistrer une entrée : Cliquez sur **"Ajouter un visiteur"**
3. Remplissez le formulaire (nom, prénom, destination, raison)
4. Pour enregistrer une sortie : Trouvez le visiteur et cliquez sur **"Enregistrer la sortie"**

### ✅ Gestion des Incidents (Superviseur uniquement)

**Capacités** :
- ✅ Voir tous les incidents
- ✅ Assigner des incidents aux agents
- ✅ Suivre l'évolution des incidents
- ✅ Filtrer par statut, priorité, type

### ✅ Planning Tâches (Superviseur uniquement)

**Capacités** :
- ✅ Créer des tâches pour les agents
- ✅ Assigner des tâches à des agents spécifiques
- ✅ Définir des dates d'échéance
- ✅ Suivre l'avancement des tâches

---

## 🎨 CARACTÉRISTIQUES DU PORTAIL SÉCURITÉ

### ✅ Interface moderne
- Design avec gradient bleu/indigo
- Cartes interactives et cliquables
- Animations fluides
- Responsive (mobile et desktop)
- Badge "Poste de Garde - Actif" pour les agents

### ✅ Informations en temps réel
- Statistiques mises à jour automatiquement
- Alertes visuelles pour incidents urgents
- Compteurs dynamiques
- Vue d'ensemble de l'activité du jour

### ✅ Navigation intuitive
- Accès rapide aux fonctionnalités principales
- Menu de navigation clair
- Cartes cliquables pour navigation directe

---

## 📊 STATISTIQUES AFFICHÉES

### Pour Agent de Sécurité :

1. **Incidents Aujourd'hui** 🔴
   - Nombre total d'incidents signalés aujourd'hui
   - Cliquez pour voir la liste complète

2. **En Cours** 🟡
   - Incidents actuellement en cours de traitement
   - Cliquez pour voir les détails

3. **Visiteurs Aujourd'hui** 🟢
   - Nombre total de visiteurs enregistrés aujourd'hui
   - Cliquez pour voir la liste complète

4. **Mes Tâches** 🟣
   - Tâches qui vous ont été assignées
   - Cliquez pour voir vos tâches

---

### Pour Superviseur Agent de Sécurité :

1. **Total Incidents** 🔴
   - Nombre total d'incidents dans le système
   - Cliquez pour voir tous les incidents

2. **Nouveaux** 🟠
   - Incidents nouveaux à traiter
   - Cliquez pour voir les nouveaux incidents

3. **Mes Agents** 🔵
   - Nombre d'agents dans votre équipe
   - Cliquez pour gérer les agents

4. **Visiteurs Aujourd'hui** 🟢
   - Nombre total de visiteurs enregistrés aujourd'hui
   - Cliquez pour voir le registre

---

## 🔍 ACCÈS DIRECT AUX MODULES

Pour accéder directement aux modules depuis n'importe quelle page :

1. **Dashboard Sécurité** :
   - Cliquez sur **"Dashboard Sécurité"** dans le menu
   - Vue d'ensemble avec graphiques et statistiques

2. **Signaler Incident** :
   - Cliquez sur **"Signaler Incident"** dans le menu ou le portail
   - Formulaire de déclaration d'incident

3. **Liste Incidents Sécurité** :
   - Cliquez sur **"Liste Incidents Sécurité"** dans le menu
   - Voir tous les incidents avec filtres

4. **Registre Visiteurs** :
   - Cliquez sur **"Registre Visiteurs"** dans le menu
   - Gérer les entrées/sorties

---

## 🆘 DÉPANNAGE

### Si vous ne voyez pas le Portail Sécurité :

1. **Vérifiez votre rôle** :
   - Allez dans **Mes Infos**
   - Vérifiez que votre rôle est bien **"Agent de Sécurité"** ou **"Superviseur Agent de Sécurité"**

2. **Vérifiez vos permissions** :
   - Le Super Admin peut vérifier vos permissions dans **Gestion Utilisateurs**

3. **Rafraîchissez la page** :
   - Appuyez sur **F5** ou **Ctrl+R**

4. **Déconnectez-vous et reconnectez-vous** :
   - Cela recharge vos permissions

---

## 📞 INFORMATIONS DE CONNEXION

### Agent de Sécurité par défaut :
- **Email** : `agent.securite@hospital.com`
- **Mot de passe** : `agent_securite123`
- **Rôle** : `agent_securite`

### Superviseur Agent de Sécurité par défaut :
- **Email** : `superviseur.securite@hospital.com`
- **Mot de passe** : `superviseur_securite123`
- **Rôle** : `superviseur_agent_securite`

### Super Admin (pour créer les comptes) :
- **Email** : `admin@hospital.com`
- **Mot de passe** : `admin123`
- **Rôle** : `superadmin`

---

## ✨ AVANTAGES DU PORTAIL SÉCURITÉ

- 🎯 **Vue d'ensemble complète** : Toutes les informations importantes en un seul endroit
- ⚡ **Accès rapide** : Navigation directe vers les fonctionnalités principales
- 📊 **Statistiques en temps réel** : Suivi de l'activité en direct
- 🎨 **Interface moderne** : Design professionnel et ergonomique
- 📱 **Responsive** : Accessible sur tous les appareils
- 🔔 **Alertes visuelles** : Notifications pour incidents urgents
- 🛡️ **Poste de Garde** : Indicateur visuel pour les agents

---

## 📋 RÉSUMÉ DES PERMISSIONS

### Pour Agent de Sécurité :

✅ **Dashboard Sécurité** - Vue d'ensemble des incidents
✅ **Signaler Incident** - Déclarer un incident de sécurité
✅ **Liste Incidents Sécurité** - Consulter tous les incidents
✅ **Registre Visiteurs** - Enregistrer entrées/sorties
✅ **Mes Tâches** - Voir les tâches assignées
✅ **Mes Infos** - Profil personnel

❌ **Non accessible** :
- Gestion des utilisateurs
- Planning de tâches (création)
- Dashboard QHSE

---

### Pour Superviseur Agent de Sécurité :

✅ **Dashboard Sécurité** - Vue d'ensemble complète
✅ **Liste Incidents Sécurité** - Gestion des incidents
✅ **Registre Visiteurs** - Consultation du registre
✅ **Planning Tâches** - Création et gestion de tâches
✅ **Gestion Utilisateurs** - Gérer les agents de sécurité
✅ **Signaler Incident** - Déclarer un incident
✅ **Mes Infos** - Profil personnel

❌ **Non accessible** :
- Gestion des autres types d'utilisateurs
- Dashboard QHSE (sauf si permissions spéciales)

---

**Le Portail Sécurité est votre centre de commande pour gérer la sécurité et l'accueil ! 🛡️**



