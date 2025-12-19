# Migration vers Supabase

## Configuration

1. Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://lpaakleuwselpyqjbwao.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwYWFrbGV1d3NlbHB5cWpid2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTg0NTQsImV4cCI6MjA4MTY5NDQ1NH0.wviBwe6GqtIihY7k5RQLhot3vjnFoncldMSz-Dxz5a4
```

2. Redémarrez le serveur de développement pour que les variables d'environnement soient prises en compte.

## Changements effectués

### ✅ Authentification migrée
- Le hook `use-auth.ts` utilise maintenant Supabase directement
- L'authentification se fait via `supabase.auth.signInWithPassword()`
- Les sessions sont gérées automatiquement par Supabase
- Plus besoin de gérer les tokens JWT manuellement

### ✅ Client Supabase mis à jour
- Le fichier `src/integrations/supabase/client.ts` utilise les nouvelles credentials
- Les variables d'environnement sont chargées depuis `.env`

### ⚠️ À migrer encore
Les hooks suivants utilisent encore le client API (backend Express) :
- `use-incidents.ts`
- `use-bookings.ts`
- `use-visitors.ts`
- `use-notifications.ts`
- `use-biomedical-equipment.ts`
- `use-planned-tasks.ts`
- `use-user-management.ts`

Et les composants QHSE :
- `QHSEDocumentsList.tsx`
- `LaundryTrackingList.tsx`
- `SterilizationRegisterList.tsx`
- `RisksList.tsx`
- `AuditsList.tsx`
- `TrainingsList.tsx`
- `MedicalWasteList.tsx`

## Prochaines étapes

1. Migrer les hooks restants pour utiliser Supabase directement
2. Migrer les composants QHSE
3. Supprimer ou désactiver le backend Express (optionnel)
4. Tester toutes les fonctionnalités avec Supabase

## Notes importantes

- Supabase gère automatiquement les sessions et les tokens
- Les RLS (Row Level Security) doivent être configurées dans Supabase pour la sécurité
- Les migrations SQL existantes dans `supabase/migrations/` peuvent être appliquées dans Supabase
- Le backend Express peut être conservé pour certaines fonctionnalités spécifiques si nécessaire

