# Guide de déploiement sur Netlify

## Configuration requise

### 1. Variables d'environnement

Dans l'interface Netlify, ajoutez les variables d'environnement suivantes :

- `VITE_SUPABASE_URL` = `https://lpaakleuwselpyqjbwao.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYWFrbGV1d3NlbHB5cWpid2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTg0NTQsImV4cCI6MjA4MTY5NDQ1NH0.wviBwe6GqtIihY7k5RQLhot3vjnFoncldMSz-Dxz5a4`

### 2. Configuration du projet

Le fichier `netlify.toml` est déjà configuré avec :
- **Build command** : `npm run build`
- **Publish directory** : `dist`
- **Redirects** : Configuration pour le routing SPA (Single Page Application)

## Étapes de déploiement

### Option 1 : Déploiement via GitHub (Recommandé)

1. **Connecter le dépôt GitHub**
   - Allez sur [Netlify](https://app.netlify.com)
   - Cliquez sur "Add new site" > "Import an existing project"
   - Connectez votre compte GitHub
   - Sélectionnez le dépôt `dsi-create/QHSE`

2. **Configurer les paramètres de build**
   - Netlify détectera automatiquement la configuration depuis `netlify.toml`
   - Vérifiez que :
     - Build command : `npm run build`
     - Publish directory : `dist`

3. **Ajouter les variables d'environnement**
   - Dans "Site settings" > "Environment variables"
   - Ajoutez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

4. **Déployer**
   - Cliquez sur "Deploy site"
   - Netlify construira et déploiera automatiquement votre site

### Option 2 : Déploiement manuel (Netlify CLI)

1. **Installer Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Se connecter à Netlify**
   ```bash
   netlify login
   ```

3. **Initialiser le site**
   ```bash
   netlify init
   ```

4. **Déployer**
   ```bash
   netlify deploy --prod
   ```

## Configuration des redirects

Le fichier `netlify.toml` inclut une règle de redirection pour le routing SPA :
- Toutes les routes (`/*`) redirigent vers `/index.html` avec un status 200
- Cela permet à React Router de gérer le routing côté client

## Vérification post-déploiement

Après le déploiement, vérifiez :
1. ✅ L'application se charge correctement
2. ✅ L'authentification Supabase fonctionne
3. ✅ Le routing fonctionne (essayez de naviguer vers différentes pages)
4. ✅ Les variables d'environnement sont bien chargées

## Notes importantes

- **Backend** : Le backend Express n'est pas nécessaire car nous utilisons Supabase
- **CORS** : Assurez-vous que Supabase autorise votre domaine Netlify dans les paramètres CORS
- **Build** : Le build peut prendre quelques minutes la première fois
- **Déploiements automatiques** : Chaque push sur la branche `main` déclenchera un nouveau déploiement

## Support

En cas de problème :
1. Vérifiez les logs de build dans Netlify
2. Vérifiez que les variables d'environnement sont bien définies
3. Vérifiez la configuration Supabase (RLS, CORS, etc.)

