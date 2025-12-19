# 📋 GUIDE D'EXÉCUTION DES SCRIPTS SQL

## 🎯 ORDRE D'EXÉCUTION

Pour que tout fonctionne correctement, vous devez exécuter les scripts SQL dans cet ordre :

---

## ÉTAPE 1 : Script Principal (OBLIGATOIRE)

### ✅ `database/schema.sql`

**Ce script crée :**
- La base de données `hospital_management`
- Toutes les tables principales (10 tables)
- L'utilisateur Super Admin

**À exécuter EN PREMIER !**

```sql
-- Copiez-collez le contenu de database/schema.sql dans PhpMyAdmin
```

---

## ÉTAPE 2 : Script Modules QHSE (OBLIGATOIRE)

### ✅ `database/qhse_modules_schema.sql`

**Ce script ajoute :**
- 16 nouvelles tables pour les modules QHSE
- Colonnes CAPA dans la table `incidents`
- Index optimisés

**À exécuter EN SECOND (après schema.sql) !**

```sql
-- Copiez-collez le contenu de database/qhse_modules_schema.sql dans PhpMyAdmin
```

---

## ÉTAPE 3 : Script Utilisateurs (RECOMMANDÉ)

### ✅ `database/init_all_users.sql`

**Ce script crée :**
- Tous les 10 utilisateurs par défaut

**À exécuter EN TROISIÈME !**

```sql
-- Copiez-collez le contenu de database/init_all_users.sql dans PhpMyAdmin
```

---

## 📊 RÉSUMÉ

| Ordre | Script | Contenu | Obligatoire |
|-------|--------|---------|-------------|
| **1** | `schema.sql` | Base + Tables principales | ✅ OUI |
| **2** | `qhse_modules_schema.sql` | Tables modules QHSE | ✅ OUI |
| **3** | `init_all_users.sql` | Utilisateurs par défaut | ⚠️ Recommandé |

---

## 🚀 PROCÉDURE COMPLÈTE

### Dans PhpMyAdmin :

1. **Ouvrez PhpMyAdmin** : http://localhost/phpmyadmin

2. **Exécutez `schema.sql`** :
   - Onglet SQL
   - Copiez-collez le contenu de `database/schema.sql`
   - Cliquez sur "Exécuter"
   - ✅ Vérifiez : 10 tables créées

3. **Exécutez `qhse_modules_schema.sql`** :
   - Onglet SQL
   - Copiez-collez le contenu de `database/qhse_modules_schema.sql`
   - Cliquez sur "Exécuter"
   - ✅ Vérifiez : 16 nouvelles tables créées

4. **Exécutez `init_all_users.sql`** :
   - Onglet SQL
   - Copiez-collez le contenu de `database/init_all_users.sql`
   - Cliquez sur "Exécuter"
   - ✅ Vérifiez : 10 utilisateurs créés

---

## ✅ VÉRIFICATION

### Vérifier les tables :

```sql
SHOW TABLES;
```

Vous devriez voir **26 tables** au total :
- 10 tables principales (de schema.sql)
- 16 tables QHSE (de qhse_modules_schema.sql)

### Vérifier les utilisateurs :

```sql
SELECT username, email, role FROM profiles ORDER BY role;
```

Vous devriez voir **10 utilisateurs**.

### Vérifier les colonnes CAPA dans incidents :

```sql
DESCRIBE incidents;
```

Vous devriez voir :
- `corrective_action`
- `preventive_action`
- `root_cause`
- `capa_status`
- `capa_due_date`
- `capa_completed_date`
- `recurrence_count`

---

## ⚠️ IMPORTANT

**L'ordre est crucial !**

- ❌ Ne pas exécuter `qhse_modules_schema.sql` avant `schema.sql`
- ❌ Ne pas exécuter `init_all_users.sql` avant `schema.sql`
- ✅ Toujours commencer par `schema.sql`
- ✅ Puis `qhse_modules_schema.sql`
- ✅ Enfin `init_all_users.sql`

---

## 🆘 SI VOUS AVEZ DÉJÀ EXÉCUTÉ `schema.sql`

Si vous avez déjà créé la base de données avec `schema.sql`, vous pouvez :

1. **Exécuter directement `qhse_modules_schema.sql`** (pour ajouter les modules QHSE)
2. **Puis `init_all_users.sql`** (pour créer les utilisateurs)

**Pas besoin de réexécuter `schema.sql` !**

---

## 📝 FICHIERS SQL DISPONIBLES

### Scripts principaux :
- ✅ `schema.sql` - Base de données principale
- ✅ `qhse_modules_schema.sql` - Modules QHSE
- ✅ `init_all_users.sql` - Tous les utilisateurs

### Scripts de correction :
- `fix_schema_enums.sql` - Correction des ENUMs (si nécessaire)

### Scripts individuels :
- `create_qhse_user.sql`
- `create_secretaire_user.sql`
- `create_agent_securite_user.sql`
- `create_superviseur_securite_user.sql`

---

**En résumé : Exécutez d'abord `schema.sql`, puis `qhse_modules_schema.sql`, puis `init_all_users.sql` ! 🚀**



