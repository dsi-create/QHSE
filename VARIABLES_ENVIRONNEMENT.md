# Variables d'Environnement

## Variables requises pour l'application

### Pour le développement local

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://lpaakleuwselpyqjbwao.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYWFrbGV1d3NlbHB5cWpid2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTg0NTQsImV4cCI6MjA4MTY5NDQ1NH0.wviBwe6GqtIihY7k5RQLhot3vjnFoncldMSz-Dxz5a4

# API Backend (optionnel - seulement si vous utilisez le backend Express)
VITE_API_URL=http://localhost:3001/api
```

### Pour le déploiement Netlify

Dans l'interface Netlify, allez dans :
**Site settings** → **Environment variables** → **Add a variable**

Ajoutez les variables suivantes :

| Variable | Valeur |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://lpaakleuwselpyqjbwao.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYWFrbGV1d3NlbHB5cWpid2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTg0NTQsImV4cCI6MjA4MTY5NDQ1NH0.wviBwe6GqtIihY7k5RQLhot3vjnFoncldMSz-Dxz5a4` |

## Description des variables

### `VITE_SUPABASE_URL`
- **Type** : String
- **Description** : URL de votre projet Supabase
- **Valeur** : `https://lpaakleuwselpyqjbwao.supabase.co`
- **Utilisé dans** : `src/integrations/supabase/client.ts`

### `VITE_SUPABASE_ANON_KEY`
- **Type** : String
- **Description** : Clé API anonyme (publique) de Supabase pour l'authentification et les requêtes
- **Valeur** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYWFrbGV1d3NlbHB5cWpid2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTg0NTQsImV4cCI6MjA4MTY5NDQ1NH0.wviBwe6GqtIihY7k5RQLhot3vjnFoncldMSz-Dxz5a4`
- **Utilisé dans** : `src/integrations/supabase/client.ts`
- **Note** : Cette clé est publique et peut être exposée côté client. La sécurité est gérée par les RLS (Row Level Security) dans Supabase.

### `VITE_API_URL` (Optionnel)
- **Type** : String
- **Description** : URL du backend Express (si vous l'utilisez encore)
- **Valeur par défaut** : `http://localhost:3001/api`
- **Utilisé dans** : `src/integrations/api/client.ts`
- **Note** : Non nécessaire si vous utilisez uniquement Supabase

## Comment ajouter les variables dans Netlify

### Méthode 1 : Via l'interface web

1. Connectez-vous à [Netlify](https://app.netlify.com)
2. Sélectionnez votre site
3. Allez dans **Site settings**
4. Cliquez sur **Environment variables** dans le menu de gauche
5. Cliquez sur **Add a variable**
6. Ajoutez chaque variable :
   - **Key** : `VITE_SUPABASE_URL`
   - **Value** : `https://lpaakleuwselpyqjbwao.supabase.co`
   - **Scopes** : Sélectionnez les environnements (Production, Deploy previews, Branch deploys)
7. Répétez pour `VITE_SUPABASE_ANON_KEY`

### Méthode 2 : Via Netlify CLI

```bash
# Ajouter une variable pour tous les environnements
netlify env:set VITE_SUPABASE_URL "https://lpaakleuwselpyqjbwao.supabase.co"

# Ajouter une variable pour un environnement spécifique
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." --context production
```

## Vérification

Pour vérifier que les variables sont bien chargées :

1. **En développement local** :
   - Vérifiez que le fichier `.env` existe à la racine
   - Redémarrez le serveur de développement (`npm run dev`)
   - Les variables sont accessibles via `import.meta.env.VITE_SUPABASE_URL`

2. **Sur Netlify** :
   - Vérifiez dans **Site settings** → **Environment variables**
   - Les variables doivent apparaître dans la liste
   - Après un nouveau déploiement, elles seront disponibles dans le build

## Sécurité

⚠️ **Important** :
- Les variables `VITE_*` sont exposées côté client (dans le bundle JavaScript)
- Ne mettez JAMAIS de clés secrètes (service_role key) dans les variables `VITE_*`
- La clé `anon` est publique par design - la sécurité est gérée par RLS dans Supabase
- Ne commitez JAMAIS le fichier `.env` (il est dans `.gitignore`)

## Valeurs par défaut

Si les variables d'environnement ne sont pas définies, le code utilise des valeurs par défaut :
- `VITE_SUPABASE_URL` : `https://lpaakleuwselpyqjbwao.supabase.co`
- `VITE_SUPABASE_ANON_KEY` : La clé fournie dans le code
- `VITE_API_URL` : `http://localhost:3001/api`

Cependant, il est **recommandé** de toujours définir ces variables explicitement.

