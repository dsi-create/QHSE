# 🔐 Guide : Créer les Utilisateurs dans Supabase Auth

## ⚠️ Problème

L'erreur "Email ou mot de passe incorrect" apparaît car les utilisateurs ont été créés dans la table `profiles` mais **pas dans Supabase Auth**.

Supabase utilise deux systèmes :
1. **Supabase Auth** (`auth.users`) - Pour l'authentification
2. **Table profiles** - Pour les données utilisateur

Les deux doivent être synchronisés !

## ✅ Solution : Créer les utilisateurs dans Supabase Auth

### Méthode 1 : Via l'interface Supabase (Recommandé)

1. **Accéder à Supabase**
   - URL : https://lpaakleuwselpyqjbwao.supabase.co
   - Menu : **Authentication** > **Users**

2. **Créer chaque utilisateur**
   - Cliquer sur **Add user** > **Create new user**
   - Remplir les champs :
     - **Email** : `admin@hospital.com`
     - **Password** : `admin123`
     - **Auto Confirm User** : ✅ (cocher)
     - **User Metadata** (optionnel mais recommandé) :
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
   - Cliquer sur **Create user**

3. **Répéter pour tous les utilisateurs**

### Méthode 2 : Via SQL (Avancé)

Si vous avez accès à l'API Admin de Supabase, vous pouvez utiliser ce script SQL dans le SQL Editor :

```sql
-- ATTENTION : Ce script nécessite des permissions admin
-- Il utilise l'extension auth pour créer les utilisateurs

-- Créer le superadmin
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    (SELECT id FROM profiles WHERE email = 'admin@hospital.com' LIMIT 1),
    'authenticated',
    'authenticated',
    'admin@hospital.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"first_name": "Super", "last_name": "Admin", "username": "superadmin", "role": "superadmin", "service": "Administration", "civility": "M."}'::jsonb
) ON CONFLICT (id) DO NOTHING;
```

**⚠️ Note** : Cette méthode nécessite des permissions spéciales et peut ne pas fonctionner selon votre configuration Supabase.

## 📋 Liste complète des utilisateurs à créer

| Email | Mot de passe | Metadata JSON |
|-------|--------------|---------------|
| `admin@hospital.com` | `admin123` | `{"first_name": "Super", "last_name": "Admin", "username": "superadmin", "role": "superadmin", "service": "Administration", "civility": "M."}` |
| `qhse@hospital.com` | `qhse123` | `{"first_name": "Superviseur", "last_name": "QHSE", "username": "superviseur_qhse", "role": "superviseur_qhse", "service": "Qualité, Hygiène, Sécurité et Environnement", "civility": "M."}` |
| `secretaire@hospital.com` | `secretaire123` | `{"first_name": "Secrétaire", "last_name": "Administrative", "username": "secretaire", "role": "secretaire", "service": "Secrétariat", "civility": "Mme"}` |
| `agent.securite@hospital.com` | `agent_securite123` | `{"first_name": "Agent", "last_name": "Sécurité", "username": "agent_securite", "role": "agent_securite", "service": "Sécurité & Accueil", "civility": "M."}` |
| `superviseur.securite@hospital.com` | `superviseur_securite123` | `{"first_name": "Superviseur", "last_name": "Sécurité", "username": "superviseur_securite", "role": "superviseur_agent_securite", "service": "Sécurité & Accueil", "civility": "M."}` |
| `agent.entretien@hospital.com` | `agent_entretien123` | `{"first_name": "Agent", "last_name": "Entretien", "username": "agent_entretien", "role": "agent_entretien", "service": "Entretien & Maintenance", "civility": "M."}` |
| `superviseur.entretien@hospital.com` | `superviseur_entretien123` | `{"first_name": "Superviseur", "last_name": "Entretien", "username": "superviseur_entretien", "role": "superviseur_agent_entretien", "service": "Entretien & Maintenance", "civility": "M."}` |
| `technicien@hospital.com` | `technicien123` | `{"first_name": "Technicien", "last_name": "Biomédical", "username": "technicien", "role": "technicien", "service": "Maintenance Technique", "civility": "M."}` |
| `superviseur.technicien@hospital.com` | `superviseur_technicien123` | `{"first_name": "Superviseur", "last_name": "Technicien", "username": "superviseur_technicien", "role": "superviseur_technicien", "service": "Maintenance Technique", "civility": "M."}` |
| `medecin@hospital.com` | `medecin123` | `{"first_name": "Dr.", "last_name": "Médecin", "username": "medecin", "role": "medecin", "service": "Médecine Générale", "civility": "M."}` |
| `biomedical@hospital.com` | `biomedical123` | `{"first_name": "Responsable", "last_name": "Biomédical", "username": "biomedical", "role": "biomedical", "service": "Service Biomédical", "civility": "M."}` |

## 🔄 Synchronisation automatique

Si vous créez les utilisateurs avec les **User Metadata** corrects, le trigger `handle_new_user` devrait automatiquement créer ou mettre à jour l'entrée dans la table `profiles`.

Cependant, comme les utilisateurs existent déjà dans `profiles`, vous pouvez :

1. **Option A** : Supprimer les entrées existantes dans `profiles` et laisser le trigger les recréer
2. **Option B** : Créer les utilisateurs Auth avec les mêmes IDs que ceux dans `profiles`

## ✅ Vérification

Après avoir créé un utilisateur dans Supabase Auth :

1. Vérifiez dans **Authentication** > **Users** que l'utilisateur apparaît
2. Vérifiez dans **Table Editor** > **profiles** que l'entrée existe (ou a été créée par le trigger)
3. Essayez de vous connecter avec l'email et le mot de passe

## 🆘 Si ça ne fonctionne toujours pas

1. Vérifiez que l'email dans Auth correspond exactement à celui dans `profiles`
2. Vérifiez que le mot de passe est correct
3. Vérifiez que "Auto Confirm User" est coché lors de la création
4. Vérifiez les logs dans Supabase pour voir les erreurs

