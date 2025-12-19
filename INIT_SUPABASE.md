# Guide d'Initialisation de la Base de Données Supabase

## 📋 Instructions

Ce guide vous explique comment initialiser complètement votre base de données Supabase avec toutes les tables et données nécessaires.

## 🚀 Étapes

### 1. Accéder au SQL Editor de Supabase

1. Connectez-vous à votre projet Supabase : https://lpaakleuwselpyqjbwao.supabase.co
2. Allez dans **SQL Editor** dans le menu de gauche
3. Cliquez sur **New query**

### 2. Exécuter le script d'initialisation

1. Ouvrez le fichier `supabase/init_complete_database.sql`
2. Copiez tout le contenu du fichier
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter`)

### 3. Vérifier l'exécution

Le script devrait s'exécuter sans erreur. Vous devriez voir :
- ✅ Toutes les tables créées
- ✅ Tous les types ENUM créés
- ✅ Tous les index créés
- ✅ Tous les utilisateurs par défaut créés
- ✅ Les salles initiales créées

## 📊 Tables créées

Le script crée les tables suivantes :

### Tables principales
- `profiles` - Utilisateurs/profils
- `incidents` - Incidents QHSE
- `visitors` - Visiteurs
- `biomedical_equipment` - Équipements biomédicaux
- `maintenance_tasks` - Tâches de maintenance
- `rooms` - Salles
- `doctors` - Médecins
- `bookings` - Réservations
- `planned_tasks` - Tâches planifiées
- `notifications` - Notifications

### Modules QHSE
- `qhse_documents` - Gestion documentaire (GED)
- `document_revisions` - Révisions de documents
- `audits` - Audits et inspections
- `non_conformities` - Non-conformités
- `audit_checklists` - Checklists d'audit
- `trainings` - Formations
- `training_participations` - Participations aux formations
- `competencies` - Compétences et habilitations
- `medical_waste` - Déchets médicaux
- `waste_tracking` - Traçabilité des déchets
- `sterilization_cycles` - Cycles de stérilisation
- `sterilized_items` - Équipements stérilisés
- `laundry_tracking` - Suivi du linge
- `risks` - Gestion des risques
- `risk_actions` - Actions de traitement des risques

## 👥 Utilisateurs créés

Le script crée les utilisateurs suivants avec leurs mots de passe :

| Username | Email | Mot de passe | Rôle |
|----------|-------|--------------|------|
| superadmin | admin@hospital.com | admin123 | Super Admin |
| superviseur_qhse | qhse@hospital.com | qhse123 | Superviseur QHSE |
| secretaire | secretaire@hospital.com | secretaire123 | Secrétaire |
| agent_securite | agent.securite@hospital.com | agent_securite123 | Agent Sécurité |
| superviseur_securite | superviseur.securite@hospital.com | superviseur_securite123 | Superviseur Sécurité |
| agent_entretien | agent.entretien@hospital.com | agent_entretien123 | Agent Entretien |
| superviseur_entretien | superviseur.entretien@hospital.com | superviseur_entretien123 | Superviseur Entretien |
| technicien | technicien@hospital.com | technicien123 | Technicien |
| superviseur_technicien | superviseur.technicien@hospital.com | superviseur_technicien123 | Superviseur Technicien |
| medecin | medecin@hospital.com | medecin123 | Médecin |
| biomedical | biomedical@hospital.com | biomedical123 | Responsable Biomédical |

## ⚠️ Important

### Authentification Supabase

Les utilisateurs créés dans la table `profiles` ont des mots de passe hashés, mais **Supabase utilise son propre système d'authentification**. 

Pour que ces utilisateurs puissent se connecter via Supabase Auth :

1. **Option 1 : Créer les utilisateurs via Supabase Auth**
   - Allez dans **Authentication** > **Users** dans Supabase
   - Créez chaque utilisateur manuellement avec le même email
   - Les mots de passe doivent être les mêmes que ceux listés ci-dessus

2. **Option 2 : Utiliser l'API Supabase Admin**
   - Utilisez l'API Admin pour créer les utilisateurs
   - Le script crée les profils dans la table `profiles`, mais vous devez aussi créer les comptes Auth

### Row Level Security (RLS)

Après avoir créé les tables, vous devez configurer les politiques RLS (Row Level Security) pour la sécurité :

1. Allez dans **Authentication** > **Policies** dans Supabase
2. Activez RLS sur chaque table
3. Créez les politiques nécessaires selon vos besoins de sécurité

## 🔍 Vérification

Après l'exécution du script, vérifiez :

1. **Tables créées** : Allez dans **Table Editor** et vérifiez que toutes les tables sont présentes
2. **Utilisateurs créés** : Vérifiez la table `profiles` pour voir les utilisateurs
3. **Salles créées** : Vérifiez la table `rooms` pour voir les salles initiales

## 📝 Notes

- Le script utilise `ON CONFLICT DO NOTHING` pour éviter les erreurs si les données existent déjà
- Tous les IDs sont générés automatiquement avec `uuid_generate_v4()`
- Les timestamps utilisent `TIMESTAMP WITH TIME ZONE` pour la compatibilité Supabase
- Les types JSON utilisent `JSONB` (format binaire optimisé de PostgreSQL)

## 🆘 En cas de problème

Si vous rencontrez des erreurs :

1. Vérifiez que vous êtes connecté au bon projet Supabase
2. Vérifiez que vous avez les permissions nécessaires
3. Exécutez le script section par section si nécessaire
4. Consultez les logs d'erreur dans Supabase

