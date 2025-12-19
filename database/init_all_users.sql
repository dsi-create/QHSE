-- =====================================================
-- SCRIPT COMPLET D'INITIALISATION DE LA BASE DE DONNÉES
-- Centre Diagnostic Libreville
-- =====================================================
-- Ce script crée tous les utilisateurs par défaut nécessaires
-- Exécutez ce script dans PhpMyAdmin ou MySQL après avoir créé la base de données
-- =====================================================

USE hospital_management;

-- =====================================================
-- 1. SUPER ADMIN (déjà créé dans schema.sql)
-- =====================================================
-- Email: admin@hospital.com
-- Mot de passe: admin123
-- (Déjà inclus dans schema.sql)

-- =====================================================
-- 2. SUPERVISEUR QHSE
-- =====================================================
INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'superviseur_qhse',
    'qhse@hospital.com',
    '$2a$10$QAKZ5a/n7raPrBo6RJh3euS6u3yRRNXP/xNIhXrC2k4vN877UkQRq', -- Mot de passe: qhse123
    'Superviseur',
    'QHSE',
    'M.',
    'superviseur_qhse',
    'Qualité, Hygiène, Sécurité et Environnement'
) ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- 3. SECRÉTAIRE
-- =====================================================
INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'secretaire',
    'secretaire@hospital.com',
    '$2a$10$Lk99gn0FmP0MyEoCma3Kz.GpSbEuxwdKsV8JhpGreVC1A19cwfC/O', -- Mot de passe: secretaire123
    'Secrétaire',
    'Administrative',
    'Mme',
    'secretaire',
    'Secrétariat'
) ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- 4. AGENT DE SÉCURITÉ
-- =====================================================
INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'agent_securite',
    'agent.securite@hospital.com',
    '$2a$10$DoPIFbDXZKSls29fEXLpJ.HIlqgpHKqPAQkDaNkqRQfLfVKjGNbaa', -- Mot de passe: agent_securite123
    'Agent',
    'Sécurité',
    'M.',
    'agent_securite',
    'Sécurité & Accueil'
) ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- 5. SUPERVISEUR AGENT DE SÉCURITÉ
-- =====================================================
INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'superviseur_securite',
    'superviseur.securite@hospital.com',
    '$2a$10$ceA7HbrXM711/UOs0nrK/uE/kEKmfvOfhybyQ9nlmdHITGyEZVbBG', -- Mot de passe: superviseur_securite123
    'Superviseur',
    'Sécurité',
    'M.',
    'superviseur_agent_securite',
    'Sécurité & Accueil'
) ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- 6. AGENT D'ENTRETIEN
-- =====================================================
INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'agent_entretien',
    'agent.entretien@hospital.com',
    '$2a$10$/VQSbyde252YK1DHQbm91eANGu//A4.3BpAxGjtYu1mzQgajY/CLm', -- Mot de passe: agent_entretien123
    'Agent',
    'Entretien',
    'M.',
    'agent_entretien',
    'Entretien & Maintenance'
) ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- 7. SUPERVISEUR AGENT D'ENTRETIEN
-- =====================================================
INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'superviseur_entretien',
    'superviseur.entretien@hospital.com',
    '$2a$10$qU1noQU0TqVUFXN4MX.OOeJuV.7uUv.nUsC45nApNzzk1JRXpvRKS', -- Mot de passe: superviseur_entretien123
    'Superviseur',
    'Entretien',
    'M.',
    'superviseur_agent_entretien',
    'Entretien & Maintenance'
) ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- 8. TECHNICIEN
-- =====================================================
INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'technicien',
    'technicien@hospital.com',
    '$2a$10$pLh9MrMj1Qc1p/gKOCC3CuxXThkqG.xLKVl8z3M5rBIq/KVsEoXcu', -- Mot de passe: technicien123
    'Technicien',
    'Biomédical',
    'M.',
    'technicien',
    'Maintenance Technique'
) ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- 9. SUPERVISEUR TECHNICIEN
-- =====================================================
INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'superviseur_technicien',
    'superviseur.technicien@hospital.com',
    '$2a$10$HCMirNtM63xKaE88I4A.5.XSQ/2pyjCjwAn4RYH/r2btqlEKr9zuS', -- Mot de passe: superviseur_technicien123
    'Superviseur',
    'Technicien',
    'M.',
    'superviseur_technicien',
    'Maintenance Technique'
) ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- 10. MÉDECIN
-- =====================================================
INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'medecin',
    'medecin@hospital.com',
    '$2a$10$RHjdi.Yl3kmsR/Yepo9UZ.O/fFYC3vASkQ7Jyg8o8VeyC.wAZrBAu', -- Mot de passe: medecin123
    'Dr.',
    'Médecin',
    'M.',
    'medecin',
    'Médecine Générale'
) ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- 11. RESPONSABLE BIOMÉDICAL
-- =====================================================
INSERT INTO profiles (
    id, username, email, password_hash, first_name, last_name, civility, role, service
) VALUES (
    UUID(),
    'biomedical',
    'biomedical@hospital.com',
    '$2a$10$uzobdsc.sq9bQDV.0FeBZ.n/DhGxpLBsr2lryay8WmJE7PvkoYK8i', -- Mot de passe: biomedical123
    'Responsable',
    'Biomédical',
    'M.',
    'biomedical',
    'Service Biomédical'
) ON DUPLICATE KEY UPDATE username=username;

-- =====================================================
-- AFFICHAGE DES INFORMATIONS DE CONNEXION
-- =====================================================
SELECT 
    username,
    email,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    role,
    service,
    CASE 
        WHEN username = 'superadmin' THEN 'admin123'
        WHEN username = 'superviseur_qhse' THEN 'qhse123'
        WHEN username = 'secretaire' THEN 'secretaire123'
        WHEN username = 'agent_securite' THEN 'agent_securite123'
        WHEN username = 'superviseur_securite' THEN 'superviseur_securite123'
        WHEN username = 'agent_entretien' THEN 'agent_entretien123'
        WHEN username = 'superviseur_entretien' THEN 'superviseur_entretien123'
        WHEN username = 'technicien' THEN 'technicien123'
        WHEN username = 'superviseur_technicien' THEN 'superviseur_technicien123'
        WHEN username = 'medecin' THEN 'medecin123'
        WHEN username = 'biomedical' THEN 'biomedical123'
        ELSE 'N/A'
    END AS mot_de_passe
FROM profiles 
ORDER BY 
    CASE role
        WHEN 'superadmin' THEN 1
        WHEN 'superviseur_qhse' THEN 2
        WHEN 'superviseur_agent_securite' THEN 3
        WHEN 'superviseur_agent_entretien' THEN 4
        WHEN 'superviseur_technicien' THEN 5
        WHEN 'agent_securite' THEN 6
        WHEN 'agent_entretien' THEN 7
        WHEN 'technicien' THEN 8
        WHEN 'secretaire' THEN 9
        WHEN 'medecin' THEN 10
        WHEN 'biomedical' THEN 11
        ELSE 12
    END;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

