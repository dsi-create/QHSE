-- =====================================================
-- SCRIPT DE CORRECTION DU SCHÉMA DE BASE DE DONNÉES
-- Pour corriger les ENUMs qui ne correspondent pas aux types TypeScript
-- =====================================================
-- Exécutez ce script si vous avez déjà créé les tables
-- =====================================================

USE hospital_management;

-- Corriger l'ENUM statut dans la table incidents
ALTER TABLE incidents 
MODIFY COLUMN statut ENUM('nouveau', 'attente', 'cours', 'traite', 'resolu') DEFAULT 'nouveau';

-- Corriger l'ENUM priorite dans la table incidents
ALTER TABLE incidents 
MODIFY COLUMN priorite ENUM('faible', 'moyenne', 'haute', 'critique') DEFAULT 'moyenne';

-- Corriger l'ENUM status dans la table bookings si nécessaire
-- (Vérifiez d'abord si vos valeurs actuelles correspondent)
-- ALTER TABLE bookings 
-- MODIFY COLUMN status ENUM('réservé', 'en_cours', 'terminé', 'annulé') DEFAULT 'réservé';

-- Ajouter le rôle biomedical si nécessaire
ALTER TABLE profiles
MODIFY COLUMN role ENUM(
    'agent_securite', 
    'agent_entretien', 
    'technicien', 
    'superviseur_qhse', 
    'superadmin',
    'secretaire', 
    'superviseur_agent_securite', 
    'superviseur_agent_entretien',
    'superviseur_technicien', 
    'medecin',
    'biomedical',
    'Infirmier'
) NOT NULL;

-- Afficher les structures corrigées
DESCRIBE incidents;
DESCRIBE profiles;
DESCRIBE bookings;

