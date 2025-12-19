-- =====================================================
-- CORRECTION DES INDEX POUR MYSQL
-- =====================================================
-- Script de correction pour créer les index si nécessaire
-- Utilisez ce script si vous avez une erreur avec CREATE INDEX IF NOT EXISTS
-- =====================================================

USE hospital_management;

-- Créer les index seulement s'ils n'existent pas
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

-- Message de confirmation
SELECT 'Index créés avec succès!' AS message;



