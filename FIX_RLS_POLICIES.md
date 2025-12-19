# 🔒 Fix : Configuration des Politiques RLS

## ⚠️ Problème

L'erreur **"Database error querying schema"** est causée par l'absence de politiques RLS (Row Level Security) sur les tables Supabase.

Quand RLS est activé sur une table sans politiques, **aucun accès n'est autorisé**, même pour les utilisateurs authentifiés.

## ✅ Solution

Exécutez le script `supabase/setup_rls_policies.sql` dans Supabase SQL Editor.

### Étapes :

1. **Accéder à Supabase SQL Editor**
   - URL : https://lpaakleuwselpyqjbwao.supabase.co
   - Menu : **SQL Editor** > **New query**

2. **Exécuter le script**
   - Ouvrez le fichier `supabase/setup_rls_policies.sql`
   - Copiez tout le contenu
   - Collez dans l'éditeur SQL
   - Cliquez sur **Run**

3. **Vérifier l'exécution**
   - Le script devrait s'exécuter sans erreur
   - Vous devriez voir des messages de confirmation

## 📋 Ce que fait le script

Le script configure les politiques RLS pour toutes les tables :

### Tables principales
- ✅ `profiles` - Lecture pour tous, gestion pour superadmins
- ✅ `incidents` - Lecture pour tous, création/gestion selon rôles
- ✅ `visitors` - Lecture pour tous, création/gestion selon rôles
- ✅ `biomedical_equipment` - Lecture pour tous, gestion pour biomédical
- ✅ `maintenance_tasks` - Lecture pour tous, gestion pour techniciens
- ✅ `rooms` - Lecture pour tous, gestion pour secrétaires/superviseurs
- ✅ `doctors` - Lecture pour tous, gestion pour superviseurs
- ✅ `bookings` - Lecture pour tous, gestion pour secrétaires
- ✅ `planned_tasks` - Lecture pour tous, gestion pour superviseurs
- ✅ `notifications` - Lecture de ses propres notifications

### Modules QHSE
- ✅ `qhse_documents` - Gestion documentaire
- ✅ `audits` - Audits et inspections
- ✅ `trainings` - Formations
- ✅ `medical_waste` - Déchets médicaux
- ✅ `sterilization_cycles` - Cycles de stérilisation
- ✅ `risks` - Gestion des risques

## 🔍 Vérification

Après l'exécution du script :

1. **Rechargez votre application**
2. **Essayez de vous connecter** avec `admin@hospital.com` / `admin123`
3. **Vérifiez que les données se chargent** correctement

## 🆘 Si ça ne fonctionne toujours pas

1. **Vérifiez les logs Supabase**
   - Menu : **Logs** > **Postgres Logs**
   - Cherchez les erreurs liées aux politiques

2. **Vérifiez que RLS est activé**
   - Menu : **Table Editor** > Sélectionnez une table
   - Vérifiez que "RLS Enabled" est ✅

3. **Vérifiez les politiques créées**
   - Menu : **Authentication** > **Policies**
   - Vous devriez voir toutes les politiques listées

4. **Testez une requête simple**
   - Dans SQL Editor, exécutez :
   ```sql
   SELECT * FROM profiles LIMIT 1;
   ```
   - Si ça fonctionne, les politiques sont correctes

## 📝 Notes importantes

- Les politiques permettent :
  - **Lecture** : Tous les utilisateurs authentifiés peuvent lire la plupart des tables
  - **Écriture** : Selon les rôles et permissions
  - **Gestion** : Seuls les superadmins et superviseurs peuvent gérer certaines tables

- Les politiques sont **additives** : si plusieurs politiques s'appliquent, l'utilisateur a accès si **au moins une** politique l'autorise.

- Pour désactiver RLS temporairement (déconseillé en production) :
  ```sql
  ALTER TABLE nom_table DISABLE ROW LEVEL SECURITY;
  ```

