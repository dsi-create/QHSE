# 🔍 Debug : Erreur 500 lors de la connexion

## ⚠️ Problème actuel

L'erreur **500** sur `/auth/v1/token?grant_type=password` signifie que Supabase Auth rejette la requête d'authentification.

## ✅ Solutions à vérifier

### 1. Vérifier que l'utilisateur existe dans Supabase Auth

1. Allez sur https://lpaakleuwselpyqjbwao.supabase.co
2. Menu : **Authentication** > **Users**
3. Vérifiez que `admin@hospital.com` existe
4. Vérifiez que la colonne **"Confirmed"** est ✅ (très important !)

### 2. Si l'utilisateur n'est pas confirmé

1. Cliquez sur l'utilisateur `admin@hospital.com`
2. Dans les détails, vérifiez que **"Email Confirmed"** est ✅
3. Si ce n'est pas le cas, cliquez sur **"Confirm email"** ou recréez l'utilisateur avec **"Auto Confirm User"** coché

### 3. Vérifier le mot de passe

Si l'utilisateur existe mais que la connexion échoue :
1. Dans Supabase, cliquez sur l'utilisateur
2. Cliquez sur **"Reset password"** ou **"Send password reset email"**
3. Ou supprimez et recréez l'utilisateur avec le bon mot de passe

### 4. Vérifier les logs Supabase

1. Menu : **Logs** > **Postgres Logs**
2. Cherchez les erreurs au moment de la tentative de connexion
3. Les erreurs peuvent indiquer :
   - Problème de hash de mot de passe
   - Problème de configuration Auth
   - Problème de permissions

### 5. Recréer l'utilisateur (Solution rapide)

Si rien ne fonctionne, recréez l'utilisateur :

1. **Supprimer l'ancien utilisateur** (si nécessaire)
   - Authentication > Users > Cliquez sur l'utilisateur > Delete

2. **Créer un nouvel utilisateur**
   - Authentication > Users > Add user > Create new user
   - Email : `admin@hospital.com`
   - Password : `admin123`
   - **Auto Confirm User** : ✅ **COCHEZ OBLIGATOIREMENT**
   - User Metadata :
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

3. **Vérifier la création**
   - L'utilisateur doit apparaître avec "Confirmed" ✅
   - Vérifiez que l'email est exactement `admin@hospital.com`

### 6. Vérifier la synchronisation avec profiles

Après avoir créé l'utilisateur dans Auth :

1. Menu : **Table Editor** > **profiles**
2. Vérifiez qu'il y a une entrée avec `email = 'admin@hospital.com'`
3. Si l'entrée n'existe pas, le trigger `handle_new_user` devrait la créer automatiquement
4. Si le trigger ne fonctionne pas, vérifiez qu'il existe :
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

### 7. Tester avec une requête SQL directe

Dans SQL Editor, testez :

```sql
-- Vérifier que l'utilisateur existe dans auth.users
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'admin@hospital.com';

-- Vérifier que le profil existe
SELECT id, email, username, role 
FROM profiles 
WHERE email = 'admin@hospital.com';
```

## 🔧 Script de vérification rapide

Exécutez ce script dans SQL Editor pour vérifier tout :

```sql
-- Vérifier les utilisateurs Auth
SELECT 
    'Auth Users' as source,
    COUNT(*) as count
FROM auth.users
WHERE email = 'admin@hospital.com'

UNION ALL

-- Vérifier les profils
SELECT 
    'Profiles' as source,
    COUNT(*) as count
FROM profiles
WHERE email = 'admin@hospital.com';

-- Vérifier le trigger
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgenabled as enabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

## 🎯 Checklist de résolution

- [ ] L'utilisateur existe dans `auth.users`
- [ ] L'email est exactement `admin@hospital.com` (sans espaces)
- [ ] L'utilisateur est confirmé (Email Confirmed = ✅)
- [ ] Le mot de passe est `admin123`
- [ ] L'entrée existe dans `profiles` (ou sera créée par le trigger)
- [ ] Les politiques RLS sont configurées (script `setup_rls_policies.sql` exécuté)
- [ ] Le trigger `handle_new_user` existe et est actif

## 🆘 Si rien ne fonctionne

1. **Vérifiez les variables d'environnement**
   - `VITE_SUPABASE_URL` doit être `https://lpaakleuwselpyqjbwao.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` doit être la bonne clé

2. **Testez avec un autre utilisateur**
   - Créez un utilisateur de test avec un email différent
   - Essayez de vous connecter avec cet utilisateur

3. **Vérifiez la console du navigateur**
   - Ouvrez F12 > Console
   - Regardez les erreurs détaillées
   - Les erreurs peuvent donner plus d'informations

4. **Contactez le support Supabase**
   - Si le problème persiste, il peut y avoir un problème avec votre projet Supabase

