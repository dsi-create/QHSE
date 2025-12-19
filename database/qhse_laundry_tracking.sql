-- =====================================================
-- MODULE DE SUIVI ET TRAÇABILITÉ DU LINGE À LA BUANDERIE
-- Centre Diagnostic Libreville
-- =====================================================
-- Ce script ajoute le module de suivi du linge à la buanderie
-- Exécutez ce script APRÈS avoir créé la base avec schema.sql et qhse_modules_schema.sql
-- =====================================================

USE hospital_management;

-- =====================================================
-- IMPORTANT : Ce script remplace l'ancienne table laundry_tracking
-- Si vous avez déjà des données dans l'ancienne table, sauvegardez-les d'abord
-- =====================================================
-- Supprimer l'ancienne table laundry_tracking si elle existe (structure simplifiée)
-- Cette instruction est sûre et ne causera pas d'erreur si la table n'existe pas
DROP TABLE IF EXISTS laundry_tracking;

-- =====================================================
-- TABLE PRINCIPALE : SUIVI DU LINGE
-- =====================================================
CREATE TABLE IF NOT EXISTS laundry_tracking (
    id VARCHAR(36) PRIMARY KEY,
    
    -- En-tête du formulaire
    service_emetteur VARCHAR(255) NOT NULL,
    periode_concernee VARCHAR(255),
    etabli_par VARCHAR(36) NOT NULL,
    date_etablissement DATE NOT NULL,
    
    -- 1. Données de réception du linge sale
    date_reception DATE NOT NULL,
    service_origine VARCHAR(255) NOT NULL,
    type_linge ENUM('draps', 'coussins', 'blouses', 'gants', 'masques', 'autoclave', 'autre') NOT NULL,
    poids_kg DECIMAL(10,2),
    quantite INT,
    etat_linge VARCHAR(255),
    agent_reception VARCHAR(36),
    signature_reception VARCHAR(500), -- Pour stocker une signature électronique ou le nom
    
    -- 2. Lavage / Désinfection
    date_lavage DATE,
    machine_utilisee VARCHAR(255),
    cycle_temperature VARCHAR(100),
    produit_lessiviel VARCHAR(255),
    duree_cycle INT, -- en minutes
    agent_lavage VARCHAR(36),
    controle_visuel BOOLEAN,
    observations_lavage TEXT,
    
    -- 3. Séchage et Repassage
    date_sechage DATE,
    type_sechage ENUM('seche_linge', 'naturel', 'autre') NULL,
    temperature_sechage DECIMAL(5,2), -- en °C
    duree_sechage INT, -- en minutes
    repassage_effectue_par VARCHAR(36),
    controle_qualite_sechage BOOLEAN,
    signature_sechage VARCHAR(500),
    
    -- 4. Pliage, Conditionnement et Stockage
    date_pliage DATE,
    type_linge_plie VARCHAR(255),
    quantite_pliee INT,
    mode_conditionnement VARCHAR(255),
    zone_stockage VARCHAR(255),
    controle_conformite_pliage BOOLEAN,
    signature_agent_pliage VARCHAR(500),
    observations_pliage TEXT,
    
    -- 5. Distribution du linge propre
    date_livraison DATE,
    service_destinataire VARCHAR(255),
    type_linge_livre VARCHAR(255),
    quantite_livree INT,
    etat_linge_livre VARCHAR(255),
    agent_livreur VARCHAR(36),
    receptonnaire_nom VARCHAR(255),
    signature_receptonnaire VARCHAR(500),
    heure_livraison TIME,
    
    -- 6. Non-conformités et Actions Correctives
    date_non_conformite DATE NULL,
    type_non_conformite VARCHAR(255),
    service_concerne_non_conformite VARCHAR(255),
    mesure_corrective TEXT,
    responsable_corrective VARCHAR(36),
    date_cloture_non_conformite DATE NULL,
    signature_non_conformite VARCHAR(500),
    
    -- 7. Traçabilité / Archivage
    responsable_traçabilite VARCHAR(36),
    date_validation_traçabilite DATE,
    signature_traçabilite VARCHAR(500),
    observations_traçabilite TEXT,
    
    -- 8. Synthèse hebdomadaire / mensuelle (sera calculée via une vue ou requête séparée)
    -- Ces données seront calculées dynamiquement
    
    -- Statut global
    status ENUM('en_reception', 'en_lavage', 'en_sechage', 'en_pliage', 'en_stockage', 'en_distribution', 'termine', 'non_conforme') DEFAULT 'en_reception',
    
    -- Métadonnées
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (etabli_par) REFERENCES profiles(id) ON DELETE RESTRICT,
    FOREIGN KEY (agent_reception) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (agent_lavage) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (repassage_effectue_par) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (agent_livreur) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (responsable_corrective) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (responsable_traçabilite) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    
    INDEX idx_date_reception (date_reception),
    INDEX idx_service_origine (service_origine),
    INDEX idx_status (status),
    INDEX idx_date_etablissement (date_etablissement),
    INDEX idx_type_linge (type_linge)
);

-- =====================================================
-- TABLE : SYNTHÈSE HEBDOMADAIRE / MENSUELLE
-- =====================================================
CREATE TABLE IF NOT EXISTS laundry_summary (
    id VARCHAR(36) PRIMARY KEY,
    periode_type ENUM('hebdomadaire', 'mensuelle') NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    total_linge_traite_kg DECIMAL(10,2) DEFAULT 0,
    taux_non_conformite DECIMAL(5,2) DEFAULT 0, -- en pourcentage
    nombre_services_desservis INT DEFAULT 0,
    observations TEXT,
    responsable_buanderie VARCHAR(36),
    signature_responsable VARCHAR(500),
    date_visa DATE,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (responsable_buanderie) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE RESTRICT,
    
    INDEX idx_periode (date_debut, date_fin),
    INDEX idx_periode_type (periode_type)
);

-- =====================================================
-- VUE : STATISTIQUES DU LINGE PAR PÉRIODE
-- =====================================================
-- Supprimer la vue si elle existe déjà
DROP VIEW IF EXISTS v_laundry_statistics;

-- Créer la vue avec gestion des erreurs
-- Note: La vue sera créée seulement si la table laundry_tracking existe avec la bonne structure
CREATE VIEW v_laundry_statistics AS
SELECT 
    DATE_FORMAT(date_reception, '%Y-%m') as mois,
    DATE_FORMAT(date_reception, '%Y-%u') as semaine,
    COUNT(*) as nombre_lots,
    SUM(COALESCE(poids_kg, 0)) as total_poids_kg,
    SUM(COALESCE(quantite, 0)) as total_quantite,
    COUNT(CASE WHEN date_non_conformite IS NOT NULL THEN 1 END) as nombre_non_conformites,
    CASE 
        WHEN COUNT(*) > 0 THEN
            ROUND(
                COUNT(CASE WHEN date_non_conformite IS NOT NULL THEN 1 END) * 100.0 / COUNT(*),
                2
            )
        ELSE 0
    END as taux_non_conformite_pourcent,
    COUNT(DISTINCT service_origine) as nombre_services_desservis
FROM laundry_tracking
WHERE date_reception IS NOT NULL
GROUP BY DATE_FORMAT(date_reception, '%Y-%m'), DATE_FORMAT(date_reception, '%Y-%u');

