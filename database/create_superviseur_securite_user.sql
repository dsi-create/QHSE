-- Script pour créer un utilisateur Superviseur Agent de Sécurité par défaut
-- Mot de passe par défaut : superviseur_securite123

USE hospital_management;

-- Créer un utilisateur Superviseur Agent de Sécurité par défaut
INSERT INTO profiles (
    id, 
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name, 
    civility, 
    role,
    service
) VALUES (
    UUID(),
    'superviseur_securite',
    'superviseur.securite@hospital.com',
    '$2a$10$ceA7HbrXM711/UOs0nrK/uE/kEKmfvOfhybyQ9nlmdHITGyEZVbBG', -- bcrypt hash de 'superviseur_securite123'
    'Superviseur',
    'Sécurité',
    'M.',
    'superviseur_agent_securite',
    'Sécurité & Accueil'
) ON DUPLICATE KEY UPDATE username=username;

-- Afficher les informations de connexion
SELECT 
    username,
    email,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    role,
    service
FROM profiles 
WHERE role = 'superviseur_agent_securite';



