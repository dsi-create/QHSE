-- Script pour créer un utilisateur Agent d'Entretien par défaut
-- Mot de passe par défaut : agent_entretien123

USE hospital_management;

-- Créer un utilisateur Agent d'Entretien par défaut dans la table profiles
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
    'agent_entretien',
    'agent.entretien@hospital.com',
    '$2a$10$/VQSbyde252YK1DHQbm91eANGu//A4.3BpAxGjtYu1mzQgajY/CLm', -- bcrypt hash de 'agent_entretien123'
    'Agent',
    'Entretien',
    'M.',
    'agent_entretien',
    'Entretien & Maintenance'
) ON DUPLICATE KEY UPDATE username=username;

-- Afficher les informations de connexion
SELECT 
    username,
    email,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    role,
    service
FROM profiles 
WHERE role = 'agent_entretien';



