-- =====================================================
-- MODULES QHSE COMPLETS - SCHÉMA SQL
-- Centre Diagnostic Libreville
-- =====================================================
-- Ce script ajoute tous les modules QHSE du cahier des charges
-- Exécutez ce script APRÈS avoir créé la base avec schema.sql
-- =====================================================

USE hospital_management;

-- =====================================================
-- 1. GESTION DOCUMENTAIRE (GED QHSE)
-- =====================================================
CREATE TABLE IF NOT EXISTS qhse_documents (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    document_type ENUM('procedure', 'instruction', 'registre', 'rapport', 'audit', 'formation', 'autre') NOT NULL,
    category VARCHAR(255),
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size INT,
    mime_type VARCHAR(100),
    description TEXT,
    status ENUM('brouillon', 'en_validation', 'validé', 'obsolète', 'archivé') DEFAULT 'brouillon',
    created_by VARCHAR(36) NOT NULL,
    validated_by VARCHAR(36) NULL,
    validation_date TIMESTAMP NULL,
    effective_date DATE NULL,
    review_date DATE NULL,
    access_level ENUM('public', 'interne', 'confidentiel') DEFAULT 'interne',
    tags JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    FOREIGN KEY (validated_by) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_document_type (document_type),
    INDEX idx_status (status),
    INDEX idx_category (category)
);

-- Table des révisions de documents
CREATE TABLE IF NOT EXISTS document_revisions (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL,
    version VARCHAR(50) NOT NULL,
    change_description TEXT,
    file_path VARCHAR(500),
    revised_by VARCHAR(36) NOT NULL,
    revision_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES qhse_documents(id) ON DELETE CASCADE,
    FOREIGN KEY (revised_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    INDEX idx_document_id (document_id)
);

-- =====================================================
-- 2. AUDITS & INSPECTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS audits (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    audit_type ENUM('interne', 'externe', 'certification', 'inspection') NOT NULL,
    scope TEXT NOT NULL,
    planned_date DATE NOT NULL,
    actual_date DATE NULL,
    auditor_id VARCHAR(36),
    audited_department VARCHAR(255),
    status ENUM('planifié', 'en_cours', 'terminé', 'annulé') DEFAULT 'planifié',
    findings JSON DEFAULT NULL,
    non_conformities_count INT DEFAULT 0,
    conformities_count INT DEFAULT 0,
    opportunities_count INT DEFAULT 0,
    report_path VARCHAR(500),
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (auditor_id) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    INDEX idx_audit_type (audit_type),
    INDEX idx_status (status),
    INDEX idx_planned_date (planned_date)
);

-- Table des non-conformités issues des audits
CREATE TABLE IF NOT EXISTS non_conformities (
    id VARCHAR(36) PRIMARY KEY,
    audit_id VARCHAR(36),
    incident_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('mineure', 'majeure', 'critique') DEFAULT 'mineure',
    root_cause TEXT,
    corrective_action TEXT,
    preventive_action TEXT,
    assigned_to VARCHAR(36),
    due_date DATE,
    status ENUM('ouvert', 'en_cours', 'fermé', 'verifié') DEFAULT 'ouvert',
    verification_date DATE NULL,
    verified_by VARCHAR(36),
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE SET NULL,
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    INDEX idx_status (status),
    INDEX idx_severity (severity)
);

-- Table des checklists d'audit
CREATE TABLE IF NOT EXISTS audit_checklists (
    id VARCHAR(36) PRIMARY KEY,
    audit_id VARCHAR(36) NOT NULL,
    question TEXT NOT NULL,
    requirement TEXT,
    compliance_status ENUM('conforme', 'non_conforme', 'non_applicable', 'non_évalué') DEFAULT 'non_évalué',
    observation TEXT,
    photo_urls JSON DEFAULT NULL,
    checked_by VARCHAR(36),
    checked_at TIMESTAMP NULL,
    FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE,
    FOREIGN KEY (checked_by) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_audit_id (audit_id)
);

-- =====================================================
-- 3. FORMATIONS & COMPÉTENCES
-- =====================================================
CREATE TABLE IF NOT EXISTS trainings (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    trainer VARCHAR(255),
    training_type ENUM('interne', 'externe', 'en_ligne', 'présentiel') DEFAULT 'interne',
    duration_hours DECIMAL(5,2),
    location VARCHAR(255),
    planned_date DATE,
    actual_date DATE NULL,
    status ENUM('planifiée', 'en_cours', 'terminée', 'annulée') DEFAULT 'planifiée',
    max_participants INT,
    certificate_required BOOLEAN DEFAULT FALSE,
    validity_months INT NULL,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_planned_date (planned_date)
);

-- Table des participations aux formations
CREATE TABLE IF NOT EXISTS training_participations (
    id VARCHAR(36) PRIMARY KEY,
    training_id VARCHAR(36) NOT NULL,
    participant_id VARCHAR(36) NOT NULL,
    registration_status ENUM('inscrit', 'présent', 'absent', 'excused') DEFAULT 'inscrit',
    attendance_date DATE NULL,
    score DECIMAL(5,2) NULL,
    passed BOOLEAN DEFAULT FALSE,
    certificate_number VARCHAR(255) NULL,
    certificate_issued_date DATE NULL,
    certificate_expiry_date DATE NULL,
    comments TEXT,
    registered_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (registered_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_training_participant (training_id, participant_id),
    INDEX idx_participant_id (participant_id),
    INDEX idx_certificate_expiry (certificate_expiry_date)
);

-- Table des compétences et habilitations
CREATE TABLE IF NOT EXISTS competencies (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    skill_category VARCHAR(255),
    level ENUM('débutant', 'intermédiaire', 'avancé', 'expert') DEFAULT 'débutant',
    certification_number VARCHAR(255),
    issued_date DATE,
    expiry_date DATE NULL,
    issuing_authority VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(36),
    verification_date DATE NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_employee_id (employee_id),
    INDEX idx_expiry_date (expiry_date)
);

-- =====================================================
-- 4. SUIVI DES DÉCHETS MÉDICAUX
-- =====================================================
CREATE TABLE IF NOT EXISTS medical_waste (
    id VARCHAR(36) PRIMARY KEY,
    waste_type ENUM('DASRI', 'médicamenteux', 'chimique', 'radioactif', 'autre') NOT NULL,
    category VARCHAR(255),
    quantity DECIMAL(10,2) NOT NULL,
    unit ENUM('kg', 'litre', 'unité') DEFAULT 'kg',
    collection_date DATE NOT NULL,
    collection_location VARCHAR(255) NOT NULL,
    producer_service VARCHAR(255),
    waste_code VARCHAR(100),
    treatment_method VARCHAR(255),
    treatment_company VARCHAR(255),
    treatment_date DATE NULL,
    tracking_number VARCHAR(255),
    certificate_number VARCHAR(255),
    status ENUM('collecté', 'stocké', 'traité', 'éliminé') DEFAULT 'collecté',
    handled_by VARCHAR(36),
    registered_by VARCHAR(36) NOT NULL,
    notes TEXT,
    photo_urls JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (handled_by) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (registered_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    INDEX idx_waste_type (waste_type),
    INDEX idx_status (status),
    INDEX idx_collection_date (collection_date)
);

-- Table des fiches de traçabilité des déchets
CREATE TABLE IF NOT EXISTS waste_tracking (
    id VARCHAR(36) PRIMARY KEY,
    waste_id VARCHAR(36) NOT NULL,
    step ENUM('collecte', 'transport', 'traitement', 'élimination') NOT NULL,
    location VARCHAR(255),
    handler_name VARCHAR(255),
    handler_signature VARCHAR(500),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (waste_id) REFERENCES medical_waste(id) ON DELETE CASCADE,
    INDEX idx_waste_id (waste_id),
    INDEX idx_timestamp (timestamp)
);

-- =====================================================
-- 5. SUIVI STÉRILISATION & LINGE
-- =====================================================
CREATE TABLE IF NOT EXISTS sterilization_cycles (
    id VARCHAR(36) PRIMARY KEY,
    cycle_number VARCHAR(100) NOT NULL UNIQUE,
    sterilizer_id VARCHAR(255) NOT NULL,
    sterilizer_type ENUM('autoclave', 'ETO', 'plasma', 'peroxyde') NOT NULL,
    cycle_type ENUM('stérilisation', 'désinfection', 'préventif') DEFAULT 'stérilisation',
    program_name VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NULL,
    duration_minutes INT,
    temperature DECIMAL(5,2),
    pressure DECIMAL(5,2),
    operator_id VARCHAR(36) NOT NULL,
    status ENUM('en_cours', 'terminé', 'échoué', 'annulé') DEFAULT 'en_cours',
    result ENUM('conforme', 'non_conforme', 'en_attente') DEFAULT 'en_attente',
    biological_indicator_result ENUM('conforme', 'non_conforme', 'non_testé') DEFAULT 'non_testé',
    chemical_indicator_result ENUM('conforme', 'non_conforme', 'non_testé') DEFAULT 'non_testé',
    non_conformity_reason TEXT,
    batch_number VARCHAR(100),
    items_count INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (operator_id) REFERENCES profiles(id) ON DELETE RESTRICT,
    INDEX idx_cycle_number (cycle_number),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time)
);

-- Table des équipements stérilisés
CREATE TABLE IF NOT EXISTS sterilized_items (
    id VARCHAR(36) PRIMARY KEY,
    cycle_id VARCHAR(36) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(255),
    lot_number VARCHAR(100),
    quantity INT DEFAULT 1,
    location VARCHAR(255),
    expiry_date DATE NULL,
    used_date DATE NULL,
    used_by VARCHAR(36),
    status ENUM('stérilisé', 'utilisé', 'expiré', 'rejeté') DEFAULT 'stérilisé',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cycle_id) REFERENCES sterilization_cycles(id) ON DELETE CASCADE,
    FOREIGN KEY (used_by) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_cycle_id (cycle_id),
    INDEX idx_status (status),
    INDEX idx_expiry_date (expiry_date)
);

-- Table de suivi du linge
CREATE TABLE IF NOT EXISTS laundry_tracking (
    id VARCHAR(36) PRIMARY KEY,
    batch_number VARCHAR(100) NOT NULL,
    laundry_type ENUM('blouse', 'drap', 'champ_operatoire', 'autre') NOT NULL,
    quantity INT NOT NULL,
    collection_date DATE NOT NULL,
    collection_location VARCHAR(255),
    washing_date DATE NULL,
    washing_method VARCHAR(255),
    sterilization_date DATE NULL,
    sterilization_cycle_id VARCHAR(36),
    distribution_date DATE NULL,
    distribution_location VARCHAR(255),
    status ENUM('collecté', 'en_lavage', 'stérilisé', 'distribué', 'rejeté') DEFAULT 'collecté',
    handler_id VARCHAR(36),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sterilization_cycle_id) REFERENCES sterilization_cycles(id) ON DELETE SET NULL,
    FOREIGN KEY (handler_id) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_batch_number (batch_number),
    INDEX idx_status (status),
    INDEX idx_collection_date (collection_date)
);

-- =====================================================
-- 6. GESTION DES RISQUES
-- =====================================================
CREATE TABLE IF NOT EXISTS risks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    risk_category ENUM('biologique', 'chimique', 'physique', 'ergonomique', 'psychosocial', 'sécurité', 'environnemental', 'autre') NOT NULL,
    risk_source VARCHAR(255),
    probability ENUM('très_faible', 'faible', 'moyenne', 'élevée', 'très_élevée') NOT NULL,
    severity ENUM('négligeable', 'faible', 'modérée', 'importante', 'critique') NOT NULL,
    risk_level ENUM('très_faible', 'faible', 'moyen', 'élevé', 'très_élevé') NOT NULL,
    current_controls TEXT,
    residual_probability ENUM('très_faible', 'faible', 'moyenne', 'élevée', 'très_élevée') NULL,
    residual_severity ENUM('négligeable', 'faible', 'modérée', 'importante', 'critique') NULL,
    residual_risk_level ENUM('très_faible', 'faible', 'moyen', 'élevé', 'très_élevé') NULL,
    treatment_plan TEXT,
    action_plan TEXT,
    responsible_person VARCHAR(36),
    due_date DATE,
    status ENUM('identifié', 'évalué', 'en_traitement', 'traité', 'surveillé') DEFAULT 'identifié',
    review_date DATE,
    last_review_date DATE NULL,
    reviewed_by VARCHAR(36),
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (responsible_person) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    INDEX idx_risk_category (risk_category),
    INDEX idx_risk_level (risk_level),
    INDEX idx_status (status)
);

-- Table des actions de traitement des risques
CREATE TABLE IF NOT EXISTS risk_actions (
    id VARCHAR(36) PRIMARY KEY,
    risk_id VARCHAR(36) NOT NULL,
    action_type ENUM('prévention', 'mitigation', 'transfert', 'acceptation') NOT NULL,
    description TEXT NOT NULL,
    assigned_to VARCHAR(36),
    due_date DATE,
    status ENUM('planifiée', 'en_cours', 'terminée', 'annulée') DEFAULT 'planifiée',
    completion_date DATE NULL,
    effectiveness ENUM('très_élevée', 'élevée', 'moyenne', 'faible') NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_risk_id (risk_id),
    INDEX idx_status (status)
);

-- =====================================================
-- 7. AMÉLIORATION DES INCIDENTS (CAPA)
-- =====================================================
-- Ajout de colonnes pour les actions correctives et préventives
-- Note: Si les colonnes existent déjà, ces commandes échoueront silencieusement
-- Utilisez ALTER TABLE ... ADD COLUMN seulement si les colonnes n'existent pas

-- Vérifier et ajouter les colonnes CAPA si elles n'existent pas
SET @dbname = DATABASE();
SET @tablename = 'incidents';
SET @columnname = 'corrective_action';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TEXT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = 'preventive_action';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TEXT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = 'root_cause';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TEXT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = 'capa_status';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ENUM(\'non_défini\', \'en_cours\', \'terminé\', \'vérifié\') DEFAULT \'non_défini\'')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = 'capa_due_date';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATE NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = 'capa_completed_date';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATE NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = 'recurrence_count';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 0')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- =====================================================
-- 8. REPORTING & EXPORTATION
-- =====================================================
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    report_type ENUM('incidents', 'audits', 'formations', 'déchets', 'stérilisation', 'risques', 'conformité', 'personnalisé') NOT NULL,
    period_type ENUM('quotidien', 'hebdomadaire', 'mensuel', 'trimestriel', 'annuel', 'personnalisé') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    filters JSON DEFAULT NULL,
    generated_by VARCHAR(36) NOT NULL,
    file_path VARCHAR(500),
    file_format ENUM('pdf', 'excel', 'word') DEFAULT 'pdf',
    status ENUM('en_cours', 'terminé', 'échoué') DEFAULT 'en_cours',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    INDEX idx_report_type (report_type),
    INDEX idx_generated_at (generated_at)
);

-- Index supplémentaires pour améliorer les performances
-- Note: MySQL ne supporte pas CREATE INDEX IF NOT EXISTS
-- Ces index sont créés seulement s'ils n'existent pas déjà (via les conditions)
SET @index_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_schema = DATABASE() 
    AND table_name = 'incidents' 
    AND index_name = 'idx_incidents_statut'
);
SET @sql = IF(@index_exists = 0, 
    'CREATE INDEX idx_incidents_statut ON incidents(statut)', 
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_schema = DATABASE() 
    AND table_name = 'incidents' 
    AND index_name = 'idx_incidents_priorite'
);
SET @sql = IF(@index_exists = 0, 
    'CREATE INDEX idx_incidents_priorite ON incidents(priorite)', 
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_schema = DATABASE() 
    AND table_name = 'incidents' 
    AND index_name = 'idx_incidents_service'
);
SET @sql = IF(@index_exists = 0, 
    'CREATE INDEX idx_incidents_service ON incidents(service)', 
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE table_schema = DATABASE() 
    AND table_name = 'incidents' 
    AND index_name = 'idx_incidents_date_creation'
);
SET @sql = IF(@index_exists = 0, 
    'CREATE INDEX idx_incidents_date_creation ON incidents(date_creation)', 
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

