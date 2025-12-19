-- =====================================================
-- MISE À JOUR DES TYPES DE DOCUMENTS SELON LA PROCÉDURE QGR-PROC-001
-- Centre Diagnostic Libreville
-- =====================================================
-- Ce script met à jour l'ENUM document_type pour inclure tous les types
-- selon la procédure de gestion documentaire
-- =====================================================

USE hospital_management;

-- Vérifier si la table existe
SET @table_exists = (
  SELECT COUNT(*) 
  FROM information_schema.tables 
  WHERE table_schema = 'hospital_management' 
  AND table_name = 'qhse_documents'
);

-- Si la table existe, modifier l'ENUM
SET @sql = IF(@table_exists > 0,
  'ALTER TABLE qhse_documents MODIFY COLUMN document_type ENUM(
    \'procedure\', \'instruction\', \'registre\', \'rapport\', \'audit\', \'formation\', \'autre\',
    \'POL\', \'PROC\', \'PROT\', \'FP\', \'FT\', \'FORM\', \'ANN\'
  ) NOT NULL;',
  'SELECT "Table qhse_documents n\'existe pas. Veuillez d\'abord exécuter qhse_modules_schema.sql";'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Types de documents mis à jour avec succès' AS message;



