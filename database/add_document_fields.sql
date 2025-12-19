-- =====================================================
-- AJOUT DES CHAMPS SUPPLÉMENTAIRES POUR LA GESTION DOCUMENTAIRE QHSE
-- Centre Diagnostic Libreville
-- =====================================================
-- Ce script ajoute les champs manquants pour la gestion documentaire complète
-- Exécutez ce script APRÈS avoir créé la table qhse_documents
-- =====================================================

USE hospital_management;

-- Vérifier si la table existe avant d'ajouter les colonnes
SET @table_exists = (
  SELECT COUNT(*) 
  FROM information_schema.tables 
  WHERE table_schema = 'hospital_management' 
  AND table_name = 'qhse_documents'
);

SET @sql = IF(@table_exists > 0,
  CONCAT(
    'ALTER TABLE qhse_documents ',
    'ADD COLUMN IF NOT EXISTS code VARCHAR(100) NULL COMMENT "Code unique du document" AFTER title, ',
    'ADD COLUMN IF NOT EXISTS processus VARCHAR(255) NULL COMMENT "Processus concerné" AFTER code, ',
    'ADD COLUMN IF NOT EXISTS sous_processus VARCHAR(255) NULL COMMENT "Sous-processus concerné" AFTER processus, ',
    'ADD COLUMN IF NOT EXISTS validity_date DATE NULL COMMENT "Date de validité du document" AFTER review_date, ',
    'ADD COLUMN IF NOT EXISTS revision_responsible VARCHAR(36) NULL COMMENT "Responsable de la révision" AFTER validated_by, ',
    'ADD COLUMN IF NOT EXISTS is_displayed BOOLEAN DEFAULT FALSE COMMENT "Document affiché ou non" AFTER access_level, ',
    'ADD COLUMN IF NOT EXISTS display_location VARCHAR(500) NULL COMMENT "Lieu d\'affichage du document" AFTER is_displayed, ',
    'ADD INDEX IF NOT EXISTS idx_code (code), ',
    'ADD INDEX IF NOT EXISTS idx_processus (processus), ',
    'ADD INDEX IF NOT EXISTS idx_is_displayed (is_displayed), ',
    'ADD FOREIGN KEY IF NOT EXISTS fk_revision_responsible (revision_responsible) REFERENCES profiles(id) ON DELETE SET NULL;'
  ),
  'SELECT "Table qhse_documents n\'existe pas. Veuillez d\'abord exécuter qhse_modules_schema.sql";'
);

-- MySQL ne supporte pas ADD COLUMN IF NOT EXISTS directement
-- Utilisons une procédure stockée temporaire avec gestion d'erreur
DELIMITER $$

DROP PROCEDURE IF EXISTS add_column_if_not_exists$$
CREATE PROCEDURE add_column_if_not_exists(
    IN p_table_name VARCHAR(255),
    IN p_column_name VARCHAR(255),
    IN p_column_definition TEXT,
    IN p_after_column VARCHAR(255)
)
BEGIN
    DECLARE column_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO column_exists
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
    AND table_name = p_table_name
    AND column_name = p_column_name;
    
    IF column_exists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE ', p_table_name, ' ADD COLUMN ', p_column_name, ' ', p_column_definition);
        IF p_after_column IS NOT NULL AND p_after_column != '' THEN
            SET @sql = CONCAT(@sql, ' AFTER ', p_after_column);
        END IF;
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DELIMITER ;

-- Ajouter les colonnes manquantes
CALL add_column_if_not_exists('qhse_documents', 'code', 'VARCHAR(100) NULL COMMENT "Code unique du document"', 'title');
CALL add_column_if_not_exists('qhse_documents', 'processus', 'VARCHAR(255) NULL COMMENT "Processus concerné"', 'code');
CALL add_column_if_not_exists('qhse_documents', 'sous_processus', 'VARCHAR(255) NULL COMMENT "Sous-processus concerné"', 'processus');
CALL add_column_if_not_exists('qhse_documents', 'validity_date', 'DATE NULL COMMENT "Date de validité du document"', 'review_date');
CALL add_column_if_not_exists('qhse_documents', 'revision_responsible', 'VARCHAR(36) NULL COMMENT "Responsable de la révision"', 'validated_by');
CALL add_column_if_not_exists('qhse_documents', 'is_displayed', 'BOOLEAN DEFAULT FALSE COMMENT "Document affiché ou non"', 'access_level');
CALL add_column_if_not_exists('qhse_documents', 'display_location', 'VARCHAR(500) NULL COMMENT "Lieu d\'affichage du document"', 'is_displayed');

-- Ajouter les index si nécessaire
SET @index_exists = (
  SELECT COUNT(*) 
  FROM information_schema.statistics 
  WHERE table_schema = 'hospital_management' 
  AND table_name = 'qhse_documents' 
  AND index_name = 'idx_code'
);

SET @sql = IF(@index_exists = 0,
  'CREATE INDEX idx_code ON qhse_documents(code)',
  'SELECT "Index idx_code existe déjà";'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index pour processus
SET @index_exists = (
  SELECT COUNT(*) 
  FROM information_schema.statistics 
  WHERE table_schema = 'hospital_management' 
  AND table_name = 'qhse_documents' 
  AND index_name = 'idx_processus'
);

SET @sql = IF(@index_exists = 0,
  'CREATE INDEX idx_processus ON qhse_documents(processus)',
  'SELECT "Index idx_processus existe déjà";'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index pour is_displayed
SET @index_exists = (
  SELECT COUNT(*) 
  FROM information_schema.statistics 
  WHERE table_schema = 'hospital_management' 
  AND table_name = 'qhse_documents' 
  AND index_name = 'idx_is_displayed'
);

SET @sql = IF(@index_exists = 0,
  'CREATE INDEX idx_is_displayed ON qhse_documents(is_displayed)',
  'SELECT "Index idx_is_displayed existe déjà";'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajouter la clé étrangère pour revision_responsible si elle n'existe pas
SET @fk_exists = (
  SELECT COUNT(*) 
  FROM information_schema.table_constraints 
  WHERE table_schema = 'hospital_management' 
  AND table_name = 'qhse_documents' 
  AND constraint_name = 'fk_revision_responsible'
);

SET @sql = IF(@fk_exists = 0,
  'ALTER TABLE qhse_documents ADD CONSTRAINT fk_revision_responsible FOREIGN KEY (revision_responsible) REFERENCES profiles(id) ON DELETE SET NULL',
  'SELECT "Contrainte fk_revision_responsible existe déjà";'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Nettoyer la procédure temporaire
DROP PROCEDURE IF EXISTS add_column_if_not_exists;

SELECT 'Champs supplémentaires ajoutés avec succès à la table qhse_documents' AS message;

