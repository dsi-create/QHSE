# 🚀 Guide Rapide : Créer l'utilisateur Admin dans Supabase

## ⚠️ Problème

L'erreur 500 `/auth/v1/token?grant_type=password` signifie que l'utilisateur `admin@hospital.com` n'existe pas dans **Supabase Auth**.

## ✅ Solution : Créer l'utilisateur via l'interface Supabase

### Étapes détaillées :

1. **Accéder à Supabase Dashboard**
   - URL : https://lpaakleuwselpyqjbwao.supabase.co
   - Connectez-vous à votre compte Supabase

2. **Aller dans Authentication**
   - Menu de gauche : **Authentication**
   - Sous-menu : **Users**

3. **Créer un nouvel utilisateur**
   - Cliquez sur le bouton **"Add user"** (en haut à droite)
   - Sélectionnez **"Create new user"**

4. **Remplir le formulaire**
   - **Email** : `admin@hospital.com`
   - **Password** : `admin123`
   - **Auto Confirm User** : ✅ **COCHEZ CETTE CASE** (très important !)
   - **Send magic link** : ❌ Décochez (pas nécessaire)

5. **Ajouter les métadonnées (optionnel mais recommandé)**
   - Cliquez sur **"Advanced"** ou **"User Metadata"**
   - Ajoutez ce JSON dans le champ **User Metadata** :
   ```json
   {
     "first_name": "Super",
     "last_name": "Admin",
     "username": "superadmin",
     "role": "superadmin",
     "service": "Administration",
     "civility": "M."
   }
   ```

6. **Créer l'utilisateur**
   - Cliquez sur **"Create user"**

7. **Vérifier la création**
   - L'utilisateur devrait apparaître dans la liste des utilisateurs
   - Vérifiez que l'email est `admin@hospital.com`
   - Vérifiez que "Confirmed" est à ✅

## 🔄 Synchronisation avec la table profiles

Si vous avez ajouté les métadonnées, le trigger `handle_new_user` devrait automatiquement :
- Créer ou mettre à jour l'entrée dans la table `profiles`
- Utiliser les mêmes données que celles dans `profiles`

Si l'entrée existe déjà dans `profiles` avec le même email, elle sera mise à jour.

## ✅ Tester la connexion

1. **Rechargez la page de connexion** de votre application
2. **Connectez-vous** avec :
   - Email : `admin@hospital.com`
   - Mot de passe : `admin123`
3. **La connexion devrait maintenant fonctionner !**

## 🆘 Si ça ne fonctionne toujours pas

1. **Vérifiez les logs Supabase**
   - Menu : **Logs** > **Postgres Logs**
   - Cherchez les erreurs liées à l'authentification

2. **Vérifiez que l'utilisateur est confirmé**
   - Dans **Authentication** > **Users**
   - La colonne "Confirmed" doit être ✅

3. **Vérifiez la table profiles**
   - Menu : **Table Editor** > **profiles**
   - Vérifiez qu'il y a une entrée avec `email = 'admin@hospital.com'`
   - Vérifiez que l'`id` correspond à celui dans `auth.users`

4. **Vérifiez les politiques RLS**
   - Menu : **Authentication** > **Policies**
   - Assurez-vous que les politiques permettent la lecture de la table `profiles`

## 📝 Note importante

- L'utilisateur doit exister dans **DEUX endroits** :
  1. `auth.users` (pour l'authentification) ✅ Créé via l'interface
  2. `profiles` (pour les données utilisateur) ✅ Créé par le script SQL ou le trigger

- Si vous créez l'utilisateur avec les métadonnées, le trigger créera automatiquement l'entrée dans `profiles`
- Si l'entrée existe déjà dans `profiles`, elle sera mise à jour avec les données de `auth.users`

