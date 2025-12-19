# 📋 DÉTAIL COMPLET DES MODULES QHSE

Ce document détaille chaque module QHSE intégré dans l'application avec leurs fonctionnalités, champs, workflows et utilisation.

---

## 📄 MODULE 1 : GESTION DOCUMENTAIRE (GED QHSE)

### 🎯 Objectif
Centraliser, gérer et suivre tous les documents QHSE (procédures, instructions, registres, rapports) avec gestion des versions et contrôle d'accès.

### 📊 Champs de données

#### Table `qhse_documents`
| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| `id` | VARCHAR(36) | Identifiant unique | ✅ |
| `title` | VARCHAR(255) | Titre du document | ✅ |
| `document_type` | ENUM | Type : procedure, instruction, registre, rapport, audit, formation, autre | ✅ |
| `category` | VARCHAR(255) | Catégorie du document | ❌ |
| `version` | VARCHAR(50) | Version (ex: 1.0, 2.1) | ✅ |
| `description` | TEXT | Description détaillée | ❌ |
| `status` | ENUM | Statut : brouillon, en_validation, validé, obsolète, archivé | ✅ |
| `access_level` | ENUM | Niveau : public, interne, confidentiel | ✅ |
| `file_path` | VARCHAR(500) | Chemin du fichier uploadé | ❌ |
| `effective_date` | DATE | Date d'entrée en vigueur | ❌ |
| `review_date` | DATE | Date de révision prévue | ❌ |
| `validation_date` | DATE | Date de validation | ❌ |
| `validated_by` | VARCHAR(36) | ID du validateur | ❌ |
| `created_by` | VARCHAR(36) | ID du créateur | ✅ |
| `created_at` | TIMESTAMP | Date de création | ✅ |
| `updated_at` | TIMESTAMP | Date de mise à jour | ✅ |

#### Table `document_revisions`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique |
| `document_id` | VARCHAR(36) | Référence au document |
| `version` | VARCHAR(50) | Numéro de version |
| `change_description` | TEXT | Description des changements |
| `file_path` | VARCHAR(500) | Chemin du fichier révisé |
| `revised_by` | VARCHAR(36) | ID du réviseur |
| `revision_date` | DATE | Date de révision |

### 🔄 Workflow de gestion documentaire

1. **Création** : Création d'un document en statut "Brouillon"
2. **Validation** : Envoi en validation (statut "En validation")
3. **Approbation** : Validation par un responsable (statut "Validé")
4. **Révision** : Mise à jour et création d'une nouvelle version
5. **Archivage** : Marquage comme obsolète ou archivé

### ✨ Fonctionnalités

- ✅ **Upload de fichiers** : PDF, Word, Excel, PowerPoint, images
- ✅ **Gestion des versions** : Historique complet des révisions
- ✅ **Contrôle d'accès** : Niveaux public, interne, confidentiel
- ✅ **Statuts** : Brouillon → En validation → Validé → Obsolète/Archivé
- ✅ **Recherche avancée** : Par titre, catégorie, type, description
- ✅ **Téléchargement** : Accès direct aux fichiers depuis l'interface

### 🎨 Interface utilisateur

- **Tableau de liste** : Titre, Type, Catégorie, Version, Statut, Date création
- **Formulaire de création** : Tous les champs avec validation
- **Actions** : Envoyer en validation, Télécharger, Voir détails

### 📡 Routes API

- `GET /api/qhse/documents` - Liste tous les documents
- `POST /api/qhse/documents` - Créer un document (avec upload)
- `PUT /api/qhse/documents/:id` - Mettre à jour un document

---

## ✅ MODULE 2 : AUDITS & INSPECTIONS

### 🎯 Objectif
Programmer, réaliser et suivre les audits internes/externes et inspections avec gestion des non-conformités et plans d'action.

### 📊 Champs de données

#### Table `audits`
| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| `id` | VARCHAR(36) | Identifiant unique | ✅ |
| `title` | VARCHAR(255) | Titre de l'audit | ✅ |
| `audit_type` | ENUM | Type : interne, externe, certification, inspection | ✅ |
| `scope` | TEXT | Périmètre de l'audit | ✅ |
| `planned_date` | DATE | Date planifiée | ✅ |
| `actual_date` | DATE | Date réelle de réalisation | ❌ |
| `auditor_id` | VARCHAR(36) | ID de l'auditeur | ❌ |
| `audited_department` | VARCHAR(255) | Département audité | ❌ |
| `status` | ENUM | Statut : planifié, en_cours, terminé, annulé | ✅ |
| `findings` | JSON | Constats de l'audit | ❌ |
| `non_conformities_count` | INT | Nombre de non-conformités | ✅ |
| `conformities_count` | INT | Nombre de conformités | ✅ |
| `opportunities_count` | INT | Nombre d'opportunités d'amélioration | ✅ |
| `report_path` | VARCHAR(500) | Chemin du rapport | ❌ |
| `created_by` | VARCHAR(36) | ID du créateur | ✅ |
| `created_at` | TIMESTAMP | Date de création | ✅ |
| `updated_at` | TIMESTAMP | Date de mise à jour | ✅ |

#### Table `non_conformities`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique |
| `audit_id` | VARCHAR(36) | Référence à l'audit |
| `incident_id` | VARCHAR(36) | Référence à un incident |
| `title` | VARCHAR(255) | Titre de la non-conformité |
| `description` | TEXT | Description détaillée |
| `severity` | ENUM | Gravité : mineure, majeure, critique |
| `root_cause` | TEXT | Cause racine |
| `corrective_action` | TEXT | Action corrective |
| `preventive_action` | TEXT | Action préventive |
| `assigned_to` | VARCHAR(36) | ID de la personne assignée |
| `due_date` | DATE | Date d'échéance |
| `status` | ENUM | Statut : ouvert, en_cours, fermé, vérifié |
| `verification_date` | DATE | Date de vérification |
| `verified_by` | VARCHAR(36) | ID du vérificateur |

#### Table `audit_checklists`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique |
| `audit_id` | VARCHAR(36) | Référence à l'audit |
| `question` | TEXT | Question de la checklist |
| `requirement` | TEXT | Exigence de référence |
| `compliance_status` | ENUM | Statut : conforme, non_conforme, non_applicable, non_évalué |
| `observation` | TEXT | Observation |
| `photo_urls` | JSON | Photos associées |
| `checked_by` | VARCHAR(36) | ID de la personne ayant vérifié |
| `checked_at` | TIMESTAMP | Date de vérification |

### 🔄 Workflow des audits

1. **Planification** : Création de l'audit avec date planifiée
2. **Réalisation** : Exécution de l'audit (statut "En cours")
3. **Rapport** : Rédaction du rapport avec constats
4. **Non-conformités** : Identification et enregistrement des NC
5. **Plan d'action** : Définition des actions correctives/préventives
6. **Clôture** : Vérification et fermeture de l'audit

### ✨ Fonctionnalités

- ✅ **Types d'audits** : Interne, Externe, Certification, Inspection
- ✅ **Checklists digitales** : Questions et vérifications structurées
- ✅ **Gestion des non-conformités** : Avec gravité et suivi
- ✅ **Plans d'action** : Actions correctives et préventives
- ✅ **Rapports** : Génération et stockage des rapports
- ✅ **Indicateurs** : Compteurs de conformités, NC, opportunités

### 🎨 Interface utilisateur

- **Tableau de liste** : Titre, Type, Date planifiée, Département, Non-conformités, Statut
- **Formulaire de création** : Titre, Type, Périmètre, Date planifiée, Département
- **Actions** : Voir détails, Générer rapport

### 📡 Routes API

- `GET /api/qhse/audits` - Liste tous les audits
- `POST /api/qhse/audits` - Créer un audit
- `GET /api/qhse/non-conformities` - Liste des non-conformités
- `POST /api/qhse/non-conformities` - Créer une non-conformité

---

## 🎓 MODULE 3 : FORMATIONS & COMPÉTENCES

### 🎯 Objectif
Gérer les formations QHSE, suivre les participations, et maintenir un registre des compétences et habilitations des employés.

### 📊 Champs de données

#### Table `trainings`
| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| `id` | VARCHAR(36) | Identifiant unique | ✅ |
| `title` | VARCHAR(255) | Titre de la formation | ✅ |
| `category` | VARCHAR(255) | Catégorie (ex: Sécurité, Hygiène) | ✅ |
| `description` | TEXT | Description détaillée | ❌ |
| `trainer` | VARCHAR(255) | Nom du formateur | ❌ |
| `training_type` | ENUM | Type : interne, externe, en_ligne, présentiel | ✅ |
| `duration_hours` | DECIMAL(5,2) | Durée en heures | ❌ |
| `location` | VARCHAR(255) | Lieu de la formation | ❌ |
| `planned_date` | DATE | Date planifiée | ❌ |
| `actual_date` | DATE | Date réelle | ❌ |
| `status` | ENUM | Statut : planifiée, en_cours, terminée, annulée | ✅ |
| `max_participants` | INT | Nombre maximum de participants | ❌ |
| `certificate_required` | BOOLEAN | Certificat requis | ✅ |
| `validity_months` | INT | Validité du certificat en mois | ❌ |
| `created_by` | VARCHAR(36) | ID du créateur | ✅ |
| `created_at` | TIMESTAMP | Date de création | ✅ |
| `updated_at` | TIMESTAMP | Date de mise à jour | ✅ |

#### Table `training_participations`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique |
| `training_id` | VARCHAR(36) | Référence à la formation |
| `participant_id` | VARCHAR(36) | ID du participant |
| `registration_status` | ENUM | Statut : inscrit, présent, absent, excused |
| `attendance_date` | DATE | Date de présence |
| `score` | DECIMAL(5,2) | Score obtenu |
| `passed` | BOOLEAN | Réussi ou non |
| `certificate_number` | VARCHAR(255) | Numéro de certificat |
| `certificate_issued_date` | DATE | Date d'émission |
| `certificate_expiry_date` | DATE | Date d'expiration |
| `comments` | TEXT | Commentaires |
| `registered_by` | VARCHAR(36) | ID de la personne ayant inscrit |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

#### Table `competencies`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique |
| `employee_id` | VARCHAR(36) | ID de l'employé |
| `skill_name` | VARCHAR(255) | Nom de la compétence |
| `skill_category` | VARCHAR(255) | Catégorie |
| `level` | ENUM | Niveau : débutant, intermédiaire, avancé, expert |
| `certification_number` | VARCHAR(255) | Numéro de certification |
| `issued_date` | DATE | Date d'émission |
| `expiry_date` | DATE | Date d'expiration |
| `issuing_authority` | VARCHAR(255) | Autorité émettrice |
| `verified` | BOOLEAN | Vérifié ou non |
| `verified_by` | VARCHAR(36) | ID du vérificateur |
| `verification_date` | DATE | Date de vérification |
| `notes` | TEXT | Notes |

### 🔄 Workflow des formations

1. **Planification** : Création de la formation avec dates et lieu
2. **Inscription** : Inscription des participants
3. **Réalisation** : Tenue de la formation (statut "En cours")
4. **Évaluation** : Enregistrement des scores et résultats
5. **Certification** : Émission des certificats si requis
6. **Suivi** : Alertes sur échéances des certificats

### ✨ Fonctionnalités

- ✅ **Types de formations** : Interne, Externe, En ligne, Présentiel
- ✅ **Gestion des participants** : Inscription, présence, résultats
- ✅ **Certificats** : Génération et suivi des certificats
- ✅ **Alertes échéances** : Notifications sur expiration des certificats
- ✅ **Registre des compétences** : Par employé avec niveaux
- ✅ **Validité** : Période de validité des compétences

### 🎨 Interface utilisateur

- **Tableau de liste** : Titre, Catégorie, Type, Date planifiée, Durée, Statut
- **Formulaire de création** : Tous les champs avec validation
- **Actions** : Voir détails, Inscrire participants, Générer certificats

### 📡 Routes API

- `GET /api/qhse/trainings` - Liste toutes les formations
- `POST /api/qhse/trainings` - Créer une formation
- `POST /api/qhse/trainings/:id/participants` - Inscrire un participant
- `GET /api/qhse/competencies/:employeeId` - Compétences d'un employé

---

## 🗑️ MODULE 4 : SUIVI DES DÉCHETS MÉDICAUX

### 🎯 Objectif
Enregistrer, suivre et tracer tous les déchets médicaux depuis leur collecte jusqu'à leur élimination finale selon la réglementation.

### 📊 Champs de données

#### Table `medical_waste`
| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| `id` | VARCHAR(36) | Identifiant unique | ✅ |
| `waste_type` | ENUM | Type : DASRI, médicamenteux, chimique, radioactif, autre | ✅ |
| `category` | VARCHAR(255) | Catégorie spécifique | ❌ |
| `quantity` | DECIMAL(10,2) | Quantité | ✅ |
| `unit` | ENUM | Unité : kg, litre, unité | ✅ |
| `collection_date` | DATE | Date de collecte | ✅ |
| `collection_location` | VARCHAR(255) | Lieu de collecte | ✅ |
| `producer_service` | VARCHAR(255) | Service producteur | ❌ |
| `waste_code` | VARCHAR(100) | Code déchet réglementaire | ❌ |
| `treatment_method` | VARCHAR(255) | Méthode de traitement | ❌ |
| `treatment_company` | VARCHAR(255) | Entreprise de traitement | ❌ |
| `treatment_date` | DATE | Date de traitement | ❌ |
| `tracking_number` | VARCHAR(255) | Numéro de traçabilité | ❌ |
| `certificate_number` | VARCHAR(255) | Numéro de certificat d'élimination | ❌ |
| `status` | ENUM | Statut : collecté, stocké, traité, éliminé | ✅ |
| `handled_by` | VARCHAR(36) | ID de la personne ayant manipulé | ❌ |
| `registered_by` | VARCHAR(36) | ID de la personne ayant enregistré | ✅ |
| `notes` | TEXT | Notes | ❌ |
| `photo_urls` | JSON | Photos associées | ❌ |
| `created_at` | TIMESTAMP | Date de création | ✅ |
| `updated_at` | TIMESTAMP | Date de mise à jour | ✅ |

#### Table `waste_tracking`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique |
| `waste_id` | VARCHAR(36) | Référence au déchet |
| `step` | ENUM | Étape : collecte, transport, traitement, élimination |
| `location` | VARCHAR(255) | Localisation |
| `handler_name` | VARCHAR(255) | Nom du responsable |
| `handler_signature` | TEXT | Signature (base64) |
| `timestamp` | TIMESTAMP | Horodatage |
| `notes` | TEXT | Notes |

### 🔄 Workflow des déchets

1. **Collecte** : Enregistrement à la collecte (statut "Collecté")
2. **Stockage** : Mise en stockage temporaire (statut "Stocké")
3. **Transport** : Enlèvement par transporteur agréé
4. **Traitement** : Traitement par entreprise agréée (statut "Traité")
5. **Élimination** : Élimination finale avec certificat (statut "Éliminé")

### ✨ Fonctionnalités

- ✅ **Types de déchets** : DASRI, Médicamenteux, Chimique, Radioactif, Autre
- ✅ **Traçabilité complète** : Suivi de chaque étape du circuit
- ✅ **Codes réglementaires** : Codes déchets selon la réglementation
- ✅ **Photos** : Prise de photos pour preuve
- ✅ **Certificats** : Numéros de certificats d'élimination
- ✅ **Statistiques** : Quantités par type et période

### 🎨 Interface utilisateur

- **Tableau de liste** : Type, Quantité, Lieu de collecte, Date, Numéro de suivi, Statut
- **Formulaire de création** : Type, Catégorie, Quantité, Unité, Lieu, Date, Code déchet
- **Actions** : Voir détails, Mettre à jour le statut, Voir la traçabilité

### 📡 Routes API

- `GET /api/qhse/waste` - Liste tous les déchets
- `POST /api/qhse/waste` - Enregistrer un déchet

---

## 🧪 MODULE 5 : SUIVI STÉRILISATION & LINGE

### 🎯 Objectif
Enregistrer et tracer tous les cycles de stérilisation ainsi que le suivi du linge hospitalier pour garantir la traçabilité complète.

### 📊 Champs de données

#### Table `sterilization_cycles`
| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| `id` | VARCHAR(36) | Identifiant unique | ✅ |
| `cycle_number` | VARCHAR(100) | Numéro de cycle | ✅ |
| `sterilizer_id` | VARCHAR(100) | ID du stérilisateur | ✅ |
| `sterilizer_type` | ENUM | Type : autoclave, ETO, plasma, peroxyde | ✅ |
| `cycle_type` | ENUM | Type : stérilisation, désinfection, préventif | ✅ |
| `program_name` | VARCHAR(255) | Nom du programme | ❌ |
| `start_time` | TIMESTAMP | Heure de début | ✅ |
| `end_time` | TIMESTAMP | Heure de fin | ❌ |
| `duration_minutes` | INT | Durée en minutes | ❌ |
| `temperature` | DECIMAL(5,2) | Température (°C) | ❌ |
| `pressure` | DECIMAL(5,2) | Pression (bar) | ❌ |
| `operator_id` | VARCHAR(36) | ID de l'opérateur | ✅ |
| `status` | ENUM | Statut : en_cours, terminé, échoué, annulé | ✅ |
| `result` | ENUM | Résultat : conforme, non_conforme, en_attente | ✅ |
| `biological_indicator_result` | ENUM | Indicateur biologique : conforme, non_conforme, non_testé | ❌ |
| `chemical_indicator_result` | ENUM | Indicateur chimique : conforme, non_conforme, non_testé | ❌ |
| `non_conformity_reason` | TEXT | Raison de non-conformité | ❌ |
| `batch_number` | VARCHAR(100) | Numéro de lot | ❌ |
| `items_count` | INT | Nombre d'items | ✅ |
| `notes` | TEXT | Notes | ❌ |
| `created_at` | TIMESTAMP | Date de création | ✅ |
| `updated_at` | TIMESTAMP | Date de mise à jour | ✅ |

#### Table `sterilized_items`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique |
| `cycle_id` | VARCHAR(36) | Référence au cycle |
| `item_name` | VARCHAR(255) | Nom de l'équipement |
| `item_code` | VARCHAR(100) | Code de l'équipement |
| `lot_number` | VARCHAR(100) | Numéro de lot |
| `quantity` | INT | Quantité |
| `location` | VARCHAR(255) | Localisation |
| `expiry_date` | DATE | Date d'expiration |
| `used_date` | DATE | Date d'utilisation |
| `used_by` | VARCHAR(36) | ID de l'utilisateur |
| `status` | ENUM | Statut : stérilisé, utilisé, expiré, rejeté |
| `created_at` | TIMESTAMP | Date de création |

#### Table `laundry_tracking`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique |
| `batch_number` | VARCHAR(100) | Numéro de lot |
| `laundry_type` | ENUM | Type : blouse, drap, champ_operatoire, autre |
| `quantity` | INT | Quantité |
| `collection_date` | DATE | Date de collecte |
| `collection_location` | VARCHAR(255) | Lieu de collecte |
| `washing_date` | DATE | Date de lavage |
| `washing_method` | VARCHAR(255) | Méthode de lavage |
| `sterilization_date` | DATE | Date de stérilisation |
| `sterilization_cycle_id` | VARCHAR(36) | Référence au cycle |
| `distribution_date` | DATE | Date de distribution |
| `distribution_location` | VARCHAR(255) | Lieu de distribution |
| `status` | ENUM | Statut : collecté, en_lavage, stérilisé, distribué, rejeté |
| `handler_id` | VARCHAR(36) | ID du responsable |
| `notes` | TEXT | Notes |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

### 🔄 Workflow de stérilisation

1. **Démarrage** : Création du cycle avec paramètres (statut "En cours")
2. **Exécution** : Enregistrement des paramètres (température, pression)
3. **Contrôles** : Indicateurs biologiques et chimiques
4. **Clôture** : Fin du cycle avec résultat (statut "Terminé")
5. **Traçabilité** : Suivi des équipements stérilisés jusqu'à utilisation

### ✨ Fonctionnalités

- ✅ **Types de stérilisateurs** : Autoclave, ETO, Plasma, Peroxyde
- ✅ **Contrôles qualité** : Indicateurs biologiques et chimiques
- ✅ **Traçabilité complète** : Suivi des équipements depuis stérilisation jusqu'à utilisation
- ✅ **Suivi du linge** : Collecte → Lavage → Stérilisation → Distribution
- ✅ **Alertes** : Expiration des équipements stérilisés
- ✅ **Rapports** : Historique des cycles et conformité

### 🎨 Interface utilisateur

- **Tableau de liste** : Numéro, Stérilisateur, Type, Début, Durée, Statut, Résultat
- **Formulaire de création** : Numéro, ID stérilisateur, Type, Programme, Température, Pression, Lot
- **Actions** : Voir détails, Terminer le cycle, Voir les items

### 📡 Routes API

- `GET /api/qhse/sterilization-cycles` - Liste tous les cycles
- `POST /api/qhse/sterilization-cycles` - Créer un cycle

---

## ⚠️ MODULE 6 : GESTION DES RISQUES

### 🎯 Objectif
Identifier, évaluer, traiter et suivre tous les risques QHSE avec calcul automatique du niveau de risque et plans d'action.

### 📊 Champs de données

#### Table `risks`
| Champ | Type | Description | Obligatoire |
|-------|------|-------------|-------------|
| `id` | VARCHAR(36) | Identifiant unique | ✅ |
| `title` | VARCHAR(255) | Titre du risque | ✅ |
| `description` | TEXT | Description détaillée | ✅ |
| `risk_category` | ENUM | Catégorie : biologique, chimique, physique, ergonomique, psychosocial, sécurité, environnemental, autre | ✅ |
| `risk_source` | VARCHAR(255) | Source du risque | ❌ |
| `probability` | ENUM | Probabilité : très_faible, faible, moyenne, élevée, très_élevée | ✅ |
| `severity` | ENUM | Sévérité : négligeable, faible, modérée, importante, critique | ✅ |
| `risk_level` | ENUM | Niveau calculé : très_faible, faible, moyen, élevé, très_élevé | ✅ |
| `current_controls` | TEXT | Contrôles actuels | ❌ |
| `residual_probability` | ENUM | Probabilité résiduelle | ❌ |
| `residual_severity` | ENUM | Sévérité résiduelle | ❌ |
| `residual_risk_level` | ENUM | Niveau de risque résiduel | ❌ |
| `treatment_plan` | TEXT | Plan de traitement | ❌ |
| `action_plan` | TEXT | Plan d'action | ❌ |
| `responsible_person` | VARCHAR(36) | ID du responsable | ❌ |
| `due_date` | DATE | Date d'échéance | ❌ |
| `status` | ENUM | Statut : identifié, évalué, en_traitement, traité, surveillé | ✅ |
| `review_date` | DATE | Date de révision prévue | ❌ |
| `last_review_date` | DATE | Date de dernière révision | ❌ |
| `reviewed_by` | VARCHAR(36) | ID du réviseur | ❌ |
| `created_by` | VARCHAR(36) | ID du créateur | ✅ |
| `created_at` | TIMESTAMP | Date de création | ✅ |
| `updated_at` | TIMESTAMP | Date de mise à jour | ✅ |

#### Table `risk_actions`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique |
| `risk_id` | VARCHAR(36) | Référence au risque |
| `action_type` | ENUM | Type : prévention, mitigation, transfert, acceptation |
| `description` | TEXT | Description de l'action |
| `assigned_to` | VARCHAR(36) | ID de la personne assignée |
| `due_date` | DATE | Date d'échéance |
| `status` | ENUM | Statut : planifiée, en_cours, terminée, annulée |
| `completion_date` | DATE | Date de complétion |
| `effectiveness` | ENUM | Efficacité : très_élevée, élevée, moyenne, faible |
| `notes` | TEXT | Notes |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

### 🔄 Workflow de gestion des risques

1. **Identification** : Enregistrement du risque (statut "Identifié")
2. **Évaluation** : Calcul automatique du niveau de risque (statut "Évalué")
3. **Traitement** : Définition du plan d'action (statut "En traitement")
4. **Mise en œuvre** : Réalisation des actions
5. **Suivi** : Vérification de l'efficacité (statut "Traité")
6. **Surveillance** : Surveillance continue (statut "Surveillé")

### ✨ Fonctionnalités

- ✅ **Calcul automatique** : Niveau de risque = Probabilité × Sévérité
- ✅ **Matrice de risque** : 5×5 (Très faible à Très élevé)
- ✅ **Catégories** : 8 catégories de risques
- ✅ **Plans d'action** : Actions de prévention, mitigation, transfert, acceptation
- ✅ **Risque résiduel** : Évaluation après traitement
- ✅ **Révisions périodiques** : Dates de révision prévues

### 🎨 Interface utilisateur

- **Tableau de liste** : Titre, Catégorie, Niveau, Probabilité, Sévérité, Statut
- **Formulaire de création** : Titre, Description, Catégorie, Probabilité, Sévérité, Contrôles
- **Calcul automatique** : Affichage du niveau de risque calculé
- **Actions** : Voir détails, Ajouter action, Mettre à jour le statut

### 📡 Routes API

- `GET /api/qhse/risks` - Liste tous les risques
- `POST /api/qhse/risks` - Créer un risque

---

## 📊 MODULE 7 : REPORTING & EXPORTATION

### 🎯 Objectif
Générer automatiquement des rapports périodiques QHSE en différents formats (PDF, Excel, Word).

### 📊 Champs de données

#### Table `reports`
| Champ | Type | Description |
|-------|------|-------------|
| `id` | VARCHAR(36) | Identifiant unique |
| `report_type` | VARCHAR(255) | Type de rapport |
| `title` | VARCHAR(255) | Titre du rapport |
| `period_start` | DATE | Début de la période |
| `period_end` | DATE | Fin de la période |
| `data` | JSON | Données du rapport |
| `format` | ENUM | Format : pdf, excel, word |
| `file_path` | VARCHAR(500) | Chemin du fichier généré |
| `generated_by` | VARCHAR(36) | ID du générateur |
| `generated_at` | TIMESTAMP | Date de génération |

### 🔄 Types de rapports disponibles

1. **Rapport mensuel QHSE** : Synthèse des activités du mois
2. **Rapport d'audits** : Résultats des audits réalisés
3. **Rapport de formations** : Formations réalisées et compétences
4. **Rapport de déchets** : Quantités et traçabilité
5. **Rapport de stérilisation** : Cycles et conformité
6. **Rapport de risques** : Risques identifiés et traités

### ✨ Fonctionnalités

- ✅ **Génération automatique** : Rapports périodiques programmés
- ✅ **Formats multiples** : PDF, Excel, Word
- ✅ **Personnalisation** : Période et critères personnalisables
- ✅ **Historique** : Archivage des rapports générés

### 📡 Routes API

- `POST /api/qhse/reports/generate` - Générer un rapport

**Note** : La génération effective nécessite l'installation de bibliothèques :
- `pdfkit` ou `puppeteer` pour PDF
- `exceljs` ou `xlsx` pour Excel
- `docx` pour Word

---

## 🔧 MODULE 8 : AMÉLIORATION DES INCIDENTS (CAPA)

### 🎯 Objectif
Gérer les actions correctives et préventives (CAPA) liées aux incidents avec analyse de cause racine et suivi de récurrence.

### 📊 Colonnes ajoutées à la table `incidents`

| Champ | Type | Description |
|-------|------|-------------|
| `corrective_action` | TEXT | Action corrective |
| `preventive_action` | TEXT | Action préventive |
| `root_cause` | TEXT | Cause racine |
| `capa_status` | ENUM | Statut CAPA : non_défini, en_cours, terminé, vérifié |
| `capa_due_date` | DATE | Date d'échéance CAPA |
| `capa_completed_date` | DATE | Date de complétion CAPA |
| `recurrence_count` | INT | Nombre de récurrences |

### 🔄 Workflow CAPA

1. **Analyse** : Identification de la cause racine
2. **Planification** : Définition des actions correctives/préventives
3. **Mise en œuvre** : Réalisation des actions (statut "En cours")
4. **Vérification** : Vérification de l'efficacité (statut "Terminé")
5. **Validation** : Validation finale (statut "Vérifié")
6. **Suivi** : Surveillance pour éviter la récurrence

### ✨ Fonctionnalités

- ✅ **Cause racine** : Analyse approfondie
- ✅ **Actions CAPA** : Correctives et préventives
- ✅ **Suivi des échéances** : Dates d'échéance et complétion
- ✅ **Récurrence** : Compteur de récurrences
- ✅ **Statuts** : Non défini → En cours → Terminé → Vérifié

---

## 🎯 RÉSUMÉ DES FONCTIONNALITÉS COMMUNES

Tous les modules partagent :

- ✅ **Recherche et filtres** : Recherche textuelle et filtres par statut/type
- ✅ **Interface moderne** : Design aligné avec le logo (cyan/blue/teal)
- ✅ **Responsive** : Compatible mobile, tablette, desktop
- ✅ **Notifications** : Alertes sur échéances et actions requises
- ✅ **Traçabilité** : Historique complet des modifications
- ✅ **Permissions** : Contrôle d'accès par rôle utilisateur
- ✅ **Export** : Possibilité d'exporter les données

---

## 📱 INTÉGRATION DANS LE PORTAIL QHSE

Tous les modules sont accessibles depuis le **Portail Superviseur QHSE** via des cartes d'accès rapide :

- 📄 Gestion Documentaire
- ✅ Audits & Inspections
- 🎓 Formations & Compétences
- 🗑️ Déchets Médicaux
- 🧪 Stérilisation & Linge
- ⚠️ Gestion des Risques
- 📊 Reporting

---

## 🔐 PERMISSIONS

### Superviseur QHSE
✅ Accès complet à tous les modules avec droits de création, modification, suppression

### Agents d'entretien, Techniciens, Agents sécurité
✅ Accès en lecture aux modules pour consultation
❌ Pas de droits de création/modification

---

## 📚 DOCUMENTATION TECHNIQUE

- **Schéma SQL** : `database/qhse_modules_schema.sql`
- **Routes API** : `backend/routes/qhse.js`
- **Types TypeScript** : `src/types.ts`
- **Composants React** : `src/components/qhse/`

---

*Document généré le : $(date)*



