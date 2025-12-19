# 👥 Rôles et Types d'Utilisateurs Disponibles

## 📋 Liste Complète des Rôles

Le système **Centre Diagnostic Libreville** compte **10 types d'utilisateurs** différents, chacun avec des permissions et responsabilités spécifiques.

### 1. 👑 **Super Admin** (`superadmin`)

**Accès complet** : Tous les droits et fonctionnalités du système.

**Permissions** :
- ✅ Dashboard Global Superadmin
- ✅ Gestion complète de tous les utilisateurs
- ✅ Accès à toutes les fonctionnalités
- ✅ Réinitialisation des données (zone de danger)
- ✅ Configuration système

**Utilisation** : Administration complète du système hospitalier.

---

### 2. 🛡️ **Superviseur QHSE** (`superviseur_qhse`)

**Rôle** : Superviseur Qualité, Hygiène, Sécurité et Environnement.

**Permissions** :
- ✅ Dashboard QHSE
- ✅ Gestion des Tickets (tous types)
- ✅ Biomédical (gestion équipements)
- ✅ Planning des Salles
- ✅ Annuaire Médecins
- ✅ Gestion Utilisateurs (agents et techniciens)
- ✅ Planning Tâches
- ✅ KPIs
- ✅ Vue Globale Salles

**Utilisation** : Supervision globale de la qualité, sécurité et hygiène.

---

### 3. 👮 **Superviseur Agent de Sécurité** (`superviseur_agent_securite`)

**Rôle** : Responsable de l'équipe de sécurité.

**Permissions** :
- ✅ Dashboard Sécurité
- ✅ Liste Incidents Sécurité
- ✅ Registre Visiteurs
- ✅ Planning Tâches (pour agents sécurité)
- ✅ Gestion Utilisateurs (agents sécurité uniquement)
- ✅ Signaler Incident
- ✅ Mes Infos

**Utilisation** : Supervision et gestion de l'équipe de sécurité.

---

### 4. 🚪 **Agent de Sécurité** (`agent_securite`)

**Rôle** : Agent sur le terrain pour la sécurité.

**Permissions** :
- ✅ Dashboard Sécurité
- ✅ Signaler Incident
- ✅ Liste Incidents Sécurité
- ✅ Registre Visiteurs
- ✅ Mes Tâches (assignées)
- ✅ Mes Infos

**Utilisation** : Intervention terrain, signalement d'incidents, gestion des visiteurs.

---

### 5. 🧹 **Superviseur Agent d'Entretien** (`superviseur_agent_entretien`)

**Rôle** : Responsable de l'équipe d'entretien.

**Permissions** :
- ✅ Dashboard Entretien
- ✅ Gestion Tickets
- ✅ Historique Entretien
- ✅ Planning Tâches (pour agents entretien)
- ✅ Gestion Utilisateurs (agents entretien uniquement)
- ✅ Signaler Incident
- ✅ Mes Infos

**Utilisation** : Supervision et gestion de l'équipe d'entretien.

---

### 6. 🧼 **Agent d'Entretien** (`agent_entretien`)

**Rôle** : Agent sur le terrain pour l'entretien.

**Permissions** :
- ✅ Dashboard Entretien
- ✅ Signaler Incident
- ✅ Historique Entretien
- ✅ Mes Tâches (assignées)
- ✅ Mes Infos

**Utilisation** : Intervention terrain, signalement de problèmes, réalisation des tâches d'entretien.

---

### 7. 🔧 **Superviseur Technicien** (`superviseur_technicien`)

**Rôle** : Responsable de l'équipe technique.

**Permissions** :
- ✅ Dashboard Technicien
- ✅ Gestion Tickets
- ✅ Planning Tâches (pour techniciens)
- ✅ Gestion Utilisateurs (techniciens uniquement)
- ✅ Mes Infos

**Utilisation** : Supervision et gestion de l'équipe technique.

---

### 8. ⚙️ **Technicien** (`technicien`)

**Rôle** : Technicien sur le terrain pour interventions techniques.

**Permissions** :
- ✅ Dashboard Technicien
- ✅ Mes Tâches (assignées)
- ✅ Mes Infos

**Utilisation** : Réalisation des interventions techniques assignées.

---

### 9. 📋 **Secrétaire** (`secretaire`)

**Rôle** : Gestion administrative et organisation.

**Permissions** :
- ✅ Planning des Salles
- ✅ Registre Visiteurs
- ✅ Annuaire Médecins
- ✅ Vue Globale Salles
- ✅ Mes Infos

**Utilisation** : Gestion du planning, enregistrement des visiteurs, coordination administrative.

---

### 10. 👨‍⚕️ **Médecin** (`medecin`)

**Rôle** : Médecin utilisant le système pour consultations.

**Permissions** :
- ✅ Planning des Salles (consultations)
- ✅ Mes Infos

**Fonctionnalités spéciales** :
- Code PIN requis pour démarrer/terminer une consultation
- Accès uniquement à ses propres réservations

**Utilisation** : Gestion de son planning de consultations.

---

### 11. 🏥 **Infirmier** (`Infirmier`)

**Rôle** : Infirmier (défini dans la base de données, à configurer selon besoins).

---

## 📊 Hiérarchie des Permissions

```
Super Admin
    └── Superviseur QHSE
         ├── Superviseur Agent Sécurité
         │    └── Agent Sécurité
         ├── Superviseur Agent Entretien
         │    └── Agent Entretien
         └── Superviseur Technicien
              └── Technicien
    ├── Secrétaire
    └── Médecin
```

## 🎯 Permissions par Catégorie

### Dashboards
- `dashboardSuperadmin` - Vue globale complète
- `dashboardSecurite` - Vue sécurité
- `dashboardEntretien` - Vue entretien
- `dashboardTechnicien` - Vue technique
- `dashboardQHSE` - Vue QHSE

### Gestion
- `settings` - Gestion utilisateurs
- `qhseTickets` - Gestion tickets
- `planningTasks` - Planning tâches
- `planningSalles` - Planning salles

### Opérations
- `reportIncident` - Signaler incident
- `visitorLog` - Registre visiteurs
- `biomedical` - Biomédical
- `myTasks` - Mes tâches assignées

### Consultation
- `doctors` - Annuaire médecins
- `securityIncidents` - Liste incidents
- `maintenanceHistory` - Historique entretien
- `kpiDashboard` - Indicateurs KPIs

## 📝 Création d'Utilisateurs

En tant que **Super Admin**, vous pouvez créer tous les types d'utilisateurs via :
**Menu → Gestion Utilisateurs → Ajouter un utilisateur**

### Champs Requis
- **Nom d'utilisateur** (unique)
- **Email** (unique)
- **Mot de passe** (minimum 6 caractères)
- **Prénom**
- **Nom**
- **Civilité** (M., Mme, Mlle)
- **Rôle** (parmi les 10 disponibles)
- **Service** (position/département)
- **Code PIN** (obligatoire pour les médecins, 4 chiffres)

## 🔍 Où Voir les Utilisateurs

1. **Menu → Gestion Utilisateurs** (accessible en tant que Super Admin)
2. Le tableau affiche tous les utilisateurs avec :
   - Nom complet
   - Identifiant (username)
   - Email
   - Rôle (avec badge coloré)
   - Service
   - Permissions effectives
   - Actions (Gérer, Reset MDP, Supprimer)

## 🎨 Codes Couleurs des Rôles

- **Super Admin** : 🟡 Ambre
- **Superviseur QHSE** : 🟣 Violet
- **Superviseur Sécurité** : 🔵 Bleu
- **Superviseur Entretien** : 🟢 Vert
- **Superviseur Technique** : 🟠 Orange
- **Agent Sécurité** : 🔵 Bleu clair
- **Agent Entretien** : 🟢 Vert clair
- **Technicien** : 🟠 Orange clair
- **Secrétaire** : 🌸 Rose
- **Médecin** : 🔴 Rouge

---

**Note** : En tant que Super Admin, vous avez accès à tous les utilisateurs et pouvez gérer leurs permissions individuellement.



