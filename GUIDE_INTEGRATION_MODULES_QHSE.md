# 📋 GUIDE D'INTÉGRATION DES MODULES QHSE COMPLETS

## 🎯 Vue d'ensemble

Ce guide explique comment intégrer tous les modules QHSE du cahier des charges dans l'application existante.

---

## ✅ CE QUI A ÉTÉ CRÉÉ

### 1. Schéma de base de données
- ✅ **Fichier** : `database/qhse_modules_schema.sql`
- ✅ **Contenu** : Toutes les tables pour les 7 nouveaux modules QHSE

### 2. Types TypeScript
- ✅ **Fichier** : `src/types.ts` (mis à jour)
- ✅ **Contenu** : Tous les types et interfaces pour les modules QHSE

### 3. Routes API Backend
- ✅ **Fichier** : `backend/routes/qhse.js`
- ✅ **Contenu** : Routes CRUD pour tous les modules QHSE
- ✅ **Intégration** : Intégré dans `backend/server.js`

---

## 📦 MODULES CRÉÉS

### 1. ✅ Gestion Documentaire (GED QHSE)
- Création, validation, diffusion et archivage des documents
- Gestion des versions
- Contrôle d'accès par profil

### 2. ✅ Audits & Inspections
- Programmation d'audits
- Checklists digitales
- Suivi des non-conformités
- Plan d'action automatique

### 3. ✅ Formations & Compétences
- Suivi des formations QHSE
- Habilitations et certificats
- Alertes sur échéances
- Vision des compétences par employé

### 4. ✅ Suivi des Déchets Médicaux
- Enregistrement et pesée
- Filière d'élimination
- Traçabilité complète
- Registres numériques

### 5. ✅ Suivi Stérilisation & Linge
- Registres numériques des cycles
- Traçabilité complète
- Alertes anomalies
- Suivi du linge

### 6. ✅ Gestion des Risques
- Identification des risques
- Évaluation (probabilité, sévérité)
- Plan d'action
- Suivi des actions

### 7. ✅ Reporting & Exportation
- Génération automatique de rapports
- Formats PDF, Excel, Word
- Rapports périodiques

### 8. ✅ Amélioration Incidents (CAPA)
- Actions correctives et préventives
- Analyse de cause racine
- Suivi de récurrence

---

## 🗄️ INSTALLATION DE LA BASE DE DONNÉES

### Étape 1 : Exécuter le schéma SQL

1. **Ouvrez PhpMyAdmin** : http://localhost/phpmyadmin

2. **Sélectionnez** la base `hospital_management`

3. **Onglet SQL**

4. **Exécutez** le script :
   ```sql
   -- Copiez-collez le contenu de database/qhse_modules_schema.sql
   ```

5. **Vérifiez** que les nouvelles tables sont créées :
   ```sql
   SHOW TABLES LIKE 'qhse%' OR LIKE 'audits%' OR LIKE 'trainings%' OR LIKE 'medical_waste%' OR LIKE 'sterilization%' OR LIKE 'risks%' OR LIKE 'reports%';
   ```

### Étape 2 : Vérifier les colonnes ajoutées aux incidents

```sql
-- Vérifier que les colonnes CAPA sont ajoutées
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

## 🔧 CONFIGURATION DU BACKEND

### Les routes QHSE sont déjà intégrées dans `server.js`

Les routes sont disponibles sous `/api/qhse/*` :

- `/api/qhse/documents` - Gestion documentaire
- `/api/qhse/audits` - Audits & inspections
- `/api/qhse/non-conformities` - Non-conformités
- `/api/qhse/trainings` - Formations
- `/api/qhse/competencies/:employeeId` - Compétences
- `/api/qhse/waste` - Déchets médicaux
- `/api/qhse/sterilization-cycles` - Cycles de stérilisation
- `/api/qhse/risks` - Gestion des risques
- `/api/qhse/reports/generate` - Génération de rapports

---

## 📱 PROCHAINES ÉTAPES (FRONTEND)

### À créer dans le frontend :

1. **Composants pour chaque module** :
   - `src/components/qhse/documents/` - Gestion documentaire
   - `src/components/qhse/audits/` - Audits & inspections
   - `src/components/qhse/trainings/` - Formations
   - `src/components/qhse/waste/` - Déchets médicaux
   - `src/components/qhse/sterilization/` - Stérilisation
   - `src/components/qhse/risks/` - Gestion des risques
   - `src/components/qhse/reports/` - Reporting

2. **Intégration dans le portail QHSE** :
   - Ajouter les liens dans `SuperviseurQHSEPortal`
   - Ajouter les permissions dans `src/lib/data.ts`

3. **API Client** :
   - Ajouter les fonctions dans `src/integrations/api/client.ts`

---

## 📊 STRUCTURE DES TABLES CRÉÉES

### Tables principales :

1. **qhse_documents** - Documents QHSE
2. **document_revisions** - Révisions de documents
3. **audits** - Audits programmés
4. **non_conformities** - Non-conformités
5. **audit_checklists** - Checklists d'audit
6. **trainings** - Formations
7. **training_participations** - Participations aux formations
8. **competencies** - Compétences et habilitations
9. **medical_waste** - Déchets médicaux
10. **waste_tracking** - Traçabilité des déchets
11. **sterilization_cycles** - Cycles de stérilisation
12. **sterilized_items** - Équipements stérilisés
13. **laundry_tracking** - Suivi du linge
14. **risks** - Risques identifiés
15. **risk_actions** - Actions de traitement des risques
16. **reports** - Rapports générés

### Colonnes ajoutées à `incidents` :

- `corrective_action` - Action corrective
- `preventive_action` - Action préventive
- `root_cause` - Cause racine
- `capa_status` - Statut CAPA
- `capa_due_date` - Date d'échéance CAPA
- `capa_completed_date` - Date de complétion CAPA
- `recurrence_count` - Nombre de récurrences

---

## ✅ CHECKLIST D'INTÉGRATION

### Backend :
- [x] Schéma SQL créé
- [x] Routes API créées
- [x] Routes intégrées dans server.js
- [x] Types TypeScript créés
- [ ] Tests unitaires (à faire)

### Base de données :
- [ ] Exécuter `qhse_modules_schema.sql`
- [ ] Vérifier les tables créées
- [ ] Vérifier les colonnes CAPA dans incidents

### Frontend :
- [ ] Créer les composants pour chaque module
- [ ] Intégrer dans le portail QHSE
- [ ] Ajouter les permissions
- [ ] Créer les formulaires
- [ ] Créer les tableaux de données
- [ ] Créer les tableaux de bord

### Reporting :
- [ ] Implémenter la génération PDF
- [ ] Implémenter la génération Excel
- [ ] Implémenter la génération Word
- [ ] Créer les templates de rapports

---

## 🚀 DÉMARRAGE

### 1. Installer les dépendances (si nécessaire)

```bash
npm install
cd backend
npm install
```

### 2. Exécuter le schéma SQL

Voir section "Installation de la base de données" ci-dessus.

### 3. Démarrer le backend

```bash
cd backend
npm start
```

Vous devriez voir :
```
✅ Serveur API démarré sur le port 3001
📦 Modules QHSE chargés: GED, Audits, Formations, Déchets, Stérilisation, Risques
```

### 4. Tester les routes API

Utilisez Postman ou curl pour tester :

```bash
# Tester la récupération des documents (après authentification)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/qhse/documents
```

---

## 📝 NOTES IMPORTANTES

1. **Upload de fichiers** :
   - Les documents sont stockés dans `backend/uploads/documents/`
   - Taille max : 50MB
   - Types autorisés : PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, JPEG, PNG

2. **Authentification** :
   - Toutes les routes nécessitent un token JWT valide
   - Utilisez `authenticateToken` middleware

3. **Permissions** :
   - À définir selon les rôles utilisateurs
   - Super Admin et Superviseur QHSE ont accès complet

4. **Reporting** :
   - La génération de rapports est un placeholder
   - À implémenter avec des bibliothèques comme :
     - PDF : `pdfkit` ou `puppeteer`
     - Excel : `exceljs` ou `xlsx`
     - Word : `docx`

---

## 🆘 DÉPANNAGE

### Erreur : "Table doesn't exist"
- Vérifiez que vous avez exécuté `qhse_modules_schema.sql`
- Vérifiez que vous êtes dans la bonne base de données

### Erreur : "Cannot find module './routes/qhse'"
- Vérifiez que le fichier `backend/routes/qhse.js` existe
- Vérifiez que l'import est correct dans `server.js`

### Erreur : "authenticateToken is not a function"
- Vérifiez que `authenticateToken` est bien défini dans `server.js`
- Vérifiez que le middleware est passé correctement aux routes QHSE

---

## 📚 DOCUMENTATION API

### Format des réponses

Toutes les routes retournent du JSON :

```json
{
  "id": "uuid",
  "message": "Message de succès"
}
```

### Format des erreurs

```json
{
  "error": "Message d'erreur"
}
```

---

**Une fois ces étapes terminées, tous les modules QHSE sont prêts à être utilisés ! 🎉**



