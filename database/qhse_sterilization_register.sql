-- =====================================================
-- REGISTRE DE TRAÇABILITÉ DE LA STÉRILISATION DES ÉQUIPEMENTS MÉDICAUX
-- Centre Diagnostic Libreville
-- Code: EN-STE-001-CDL
-- =====================================================
-- Ce script ajoute le registre complet de traçabilité de la stérilisation
-- Exécutez ce script APRÈS avoir créé la base avec schema.sql et qhse_modules_schema.sql
-- =====================================================

USE hospital_management;

-- =====================================================
-- TABLE PRINCIPALE : REGISTRE DE STÉRILISATION
-- =====================================================
CREATE TABLE IF NOT EXISTS sterilization_register (
    id VARCHAR(36) PRIMARY KEY,
    
    -- En-tête du registre
    code_document VARCHAR(50) DEFAULT 'EN-STE-001-CDL',
    version VARCHAR(10) DEFAULT 'AA',
    date_application DATE,
    date_limite_validite DATE,
    redacteur VARCHAR(255),
    verificateur VARCHAR(255),
    approbateur VARCHAR(255),
    periode_debut DATE,
    periode_fin DATE,
    
    -- 1. Informations générales du cycle
    date_cycle DATE NOT NULL,
    service_concerne VARCHAR(255) NOT NULL,
    operateur_nom VARCHAR(255) NOT NULL,
    operateur_id VARCHAR(36),
    type_materiel VARCHAR(255) NOT NULL,
    numero_lot VARCHAR(100),
    code_traçabilite VARCHAR(100),
    methode_sterilisation ENUM('vapeur', 'chaleur_seche', 'ethylene_oxyde', 'plasma_hydrogene', 'autre') NOT NULL,
    numero_cycle VARCHAR(100),
    programme VARCHAR(100),
    temperature DECIMAL(5,2), -- en °C
    duree_cycle INT, -- en minutes
    resultat_test_controle ENUM('conforme', 'non_conforme', 'en_attente') DEFAULT 'en_attente',
    status_cycle ENUM('en_cours', 'terminé', 'échoué', 'interrompu') DEFAULT 'en_cours',
    observation_action_corrective TEXT,
    signature_operateur VARCHAR(500),
    signature_superviseur VARCHAR(500),
    
    -- 2. Contrôle des charges stérilisées
    date_controle DATE,
    type_charge VARCHAR(255),
    nombre_unites INT,
    numero_cycle_controle VARCHAR(100),
    resultat_controle ENUM('acceptee', 'rejetee', 'en_attente') DEFAULT 'en_attente',
    statut_charge ENUM('acceptee', 'rejetee', 'en_attente') DEFAULT 'en_attente',
    signature_controle VARCHAR(500),
    
    -- 3. Libération des charges stériles
    date_liberation DATE,
    numero_lot_charge VARCHAR(100),
    service_destinataire VARCHAR(255),
    delai_validite DATE,
    signature_receptionnaire VARCHAR(500),
    observations_liberation TEXT,
    
    -- 4. Suivi des indicateurs et maintenance
    date_maintenance DATE,
    type_operation_maintenance VARCHAR(255),
    nom_technicien VARCHAR(255),
    technicien_id VARCHAR(36),
    resultat_controle_maintenance ENUM('conforme', 'non_conforme', 'en_attente') DEFAULT 'en_attente',
    signature_maintenance VARCHAR(500),
    observations_maintenance TEXT,
    
    -- 5. Observations générales / Non-conformités
    observations_generales TEXT,
    non_conformites TEXT,
    
    -- 6. Validation
    responsable_sterilisation VARCHAR(255),
    responsable_sterilisation_id VARCHAR(36),
    date_validation DATE,
    signature_validation VARCHAR(500),
    
    -- Métadonnées
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (operateur_id) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (technicien_id) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (responsable_sterilisation_id) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    
    INDEX idx_date_cycle (date_cycle),
    INDEX idx_service_concerne (service_concerne),
    INDEX idx_status_cycle (status_cycle),
    INDEX idx_numero_cycle (numero_cycle),
    INDEX idx_periode (periode_debut, periode_fin)
);

-- =====================================================
-- TABLE : CHARGES STÉRILISÉES (pour le contrôle détaillé)
-- =====================================================
CREATE TABLE IF NOT EXISTS sterilization_charges (
    id VARCHAR(36) PRIMARY KEY,
    register_id VARCHAR(36) NOT NULL,
    date_controle DATE NOT NULL,
    type_charge VARCHAR(255) NOT NULL,
    nombre_unites INT NOT NULL,
    numero_cycle VARCHAR(100),
    resultat_controle ENUM('acceptee', 'rejetee', 'en_attente') DEFAULT 'en_attente',
    statut ENUM('acceptee', 'rejetee', 'en_attente') DEFAULT 'en_attente',
    signature VARCHAR(500),
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (register_id) REFERENCES sterilization_register(id) ON DELETE CASCADE,
    INDEX idx_register_id (register_id),
    INDEX idx_date_controle (date_controle)
);

-- =====================================================
-- TABLE : LIBÉRATIONS DE CHARGES
-- =====================================================
CREATE TABLE IF NOT EXISTS sterilization_liberations (
    id VARCHAR(36) PRIMARY KEY,
    register_id VARCHAR(36) NOT NULL,
    date_liberation DATE NOT NULL,
    numero_lot_charge VARCHAR(100) NOT NULL,
    service_destinataire VARCHAR(255) NOT NULL,
    delai_validite DATE,
    signature_receptionnaire VARCHAR(500),
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (register_id) REFERENCES sterilization_register(id) ON DELETE CASCADE,
    INDEX idx_register_id (register_id),
    INDEX idx_date_liberation (date_liberation)
);

-- =====================================================
-- TABLE : MAINTENANCE ET INDICATEURS
-- =====================================================
CREATE TABLE IF NOT EXISTS sterilization_maintenance (
    id VARCHAR(36) PRIMARY KEY,
    register_id VARCHAR(36) NOT NULL,
    date_maintenance DATE NOT NULL,
    type_operation VARCHAR(255) NOT NULL,
    nom_technicien VARCHAR(255),
    technicien_id VARCHAR(36),
    resultat_controle ENUM('conforme', 'non_conforme', 'en_attente') DEFAULT 'en_attente',
    signature VARCHAR(500),
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (register_id) REFERENCES sterilization_register(id) ON DELETE CASCADE,
    FOREIGN KEY (technicien_id) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_register_id (register_id),
    INDEX idx_date_maintenance (date_maintenance)
);

-- =====================================================
-- TABLE : NON-CONFORMITÉS
-- =====================================================
CREATE TABLE IF NOT EXISTS sterilization_non_conformites (
    id VARCHAR(36) PRIMARY KEY,
    register_id VARCHAR(36) NOT NULL,
    date_observation DATE NOT NULL,
    description TEXT NOT NULL,
    type_non_conformite VARCHAR(255),
    action_corrective TEXT,
    responsable_action VARCHAR(36),
    date_cloture DATE,
    status ENUM('ouverte', 'en_cours', 'cloturee') DEFAULT 'ouverte',
    signature VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (register_id) REFERENCES sterilization_register(id) ON DELETE CASCADE,
    FOREIGN KEY (responsable_action) REFERENCES profiles(id) ON DELETE SET NULL,
    INDEX idx_register_id (register_id),
    INDEX idx_status (status)
);



