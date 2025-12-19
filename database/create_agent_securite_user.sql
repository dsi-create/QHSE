-- Script pour créer un utilisateur Agent de Sécurité par défaut
-- Mot de passe par défaut : agent_securite123

USE hospital_management;

-- Créer un utilisateur Agent de Sécurité par défaut
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
    'agent_securite',
    'agent.securite@hospital.com',
    '$2a$10$DoPIFbDXZKSls29fEXLpJ.HIlqgpHKqPAQkDaNkqRQfLfVKjGNbaa', -- bcrypt hash de 'agent_securite123'
    'Agent',
    'Sécurité',
    'M.',
    'agent_securite',
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
WHERE role = 'agent_securite';



