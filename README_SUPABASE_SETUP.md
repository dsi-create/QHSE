# 🚀 Guide Complet de Configuration Supabase

## ✅ Ce qui a été fait

### 1. Migration vers Supabase
- ✅ Client Supabase configuré avec les nouvelles credentials
- ✅ Hook d'authentification (`use-auth.ts`) migré vers Supabase
- ✅ Variables d'environnement configurées
- ✅ Script SQL complet créé pour initialiser toute la base de données

### 2. Configuration Netlify
- ✅ Fichier `netlify.toml` créé
- ✅ Configuration de build et redirects
- ✅ Fichier `.npmrc` pour forcer npm
- ✅ Suppression de `pnpm-lock.yaml`

### 3. Documentation
- ✅ `INIT_SUPABASE.md` - Guide d'initialisation
- ✅ `MIGRATION_SUPABASE.md` - Guide de migration
- ✅ `NETLIFY_DEPLOY.md` - Guide de déploiement
- ✅ `VARIABLES_ENVIRONNEMENT.md` - Documentation des variables

## 📋 Prochaines étapes

### Étape 1 : Initialiser Supabase

1. **Accéder à Supabase SQL Editor**
   - URL : https://lpaakleuwselpyqjbwao.supabase.co
   - Menu : **SQL Editor** > **New query**

2. **Exécuter le script d'initialisation**
   - Ouvrir : `supabase/init_complete_database.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL
   - Cliquer sur **Run**

3. **Vérifier les tables créées**
   - Menu : **Table Editor**
   - Vérifier que toutes les tables sont présentes

### Étape 2 : Créer les utilisateurs Auth

Les utilisateurs dans la table `profiles` ont été créés, mais vous devez aussi les créer dans Supabase Auth :

1. **Via l'interface Supabase**
   - Menu : **Authentication** > **Users** > **Add user**
   - Créer chaque utilisateur avec :
     - Email (ex: `admin@hospital.com`)
     - Mot de passe (ex: `admin123`)
     - Email confirmé : ✅

2. **Utilisateurs à créer** :
   - `admin@hospital.com` / `admin123` (superadmin)
   - `qhse@hospital.com` / `qhse123` (superviseur_qhse)
   - `secretaire@hospital.com` / `secretaire123`
   - Et tous les autres utilisateurs (voir `INIT_SUPABASE.md`)

### Étape 3 : Configurer Row Level Security (RLS)

1. **Activer RLS sur les tables**
   - Menu : **Authentication** > **Policies**
   - Pour chaque table, créer des politiques selon vos besoins

2. **Politiques recommandées** :
   - Les utilisateurs peuvent lire leurs propres données
   - Les superviseurs peuvent lire toutes les données
   - Les utilisateurs peuvent créer leurs propres enregistrements

### Étape 4 : Configurer Netlify

1. **Ajouter les variables d'environnement**
   - Menu : **Site settings** > **Environment variables**
   - Ajouter :
     - `VITE_SUPABASE_URL` = `https://lpaakleuwselpyqjbwao.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

2. **Déclencher un nouveau déploiement**
   - Les changements sont déjà sur GitHub
   - Netlify devrait détecter automatiquement et redéployer

### Étape 5 : Tester l'application

1. **Tester la connexion**
   - Se connecter avec `admin@hospital.com` / `admin123`
   - Vérifier que l'authentification fonctionne

2. **Tester les fonctionnalités**
   - Créer un incident
   - Vérifier les notifications
   - Tester les modules QHSE

## 📁 Fichiers importants

### Scripts SQL
- `supabase/init_complete_database.sql` - Script complet d'initialisation

### Configuration
- `netlify.toml` - Configuration Netlify
- `.npmrc` - Configuration npm
- `.env.example` - Template des variables d'environnement

### Documentation
- `INIT_SUPABASE.md` - Guide d'initialisation détaillé
- `MIGRATION_SUPABASE.md` - Guide de migration
- `NETLIFY_DEPLOY.md` - Guide de déploiement Netlify
- `VARIABLES_ENVIRONNEMENT.md` - Documentation des variables

## 🔐 Identifiants par défaut

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
| Biomédical | biomedical@hospital.com | biomedical123 |

## ⚠️ Notes importantes

1. **Authentification Supabase** : Les utilisateurs doivent être créés à la fois dans la table `profiles` ET dans Supabase Auth
2. **RLS** : Configurez les politiques de sécurité après la création des tables
3. **Variables d'environnement** : N'oubliez pas de les ajouter dans Netlify
4. **Backend Express** : N'est plus nécessaire, tout passe par Supabase maintenant

## 🆘 En cas de problème

1. Vérifiez les logs dans Supabase SQL Editor
2. Vérifiez les variables d'environnement dans Netlify
3. Vérifiez que les utilisateurs sont créés dans Supabase Auth
4. Consultez la documentation dans les fichiers `.md`

## ✨ Résumé

Votre application est maintenant :
- ✅ Configurée pour Supabase
- ✅ Prête pour le déploiement Netlify
- ✅ Avec toutes les tables et données initiales
- ✅ Documentée complètement

Il ne reste plus qu'à :
1. Exécuter le script SQL dans Supabase
2. Créer les utilisateurs dans Supabase Auth
3. Configurer les variables d'environnement dans Netlify
4. Tester l'application !

