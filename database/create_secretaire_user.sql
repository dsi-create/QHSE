-- Script pour créer un utilisateur Secrétaire par défaut
-- Mot de passe par défaut : secretaire123

USE hospital_management;

-- Créer un utilisateur Secrétaire par défaut
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
    'secretaire',
    'secretaire@hospital.com',
    '$2a$10$Lk99gn0FmP0MyEoCma3Kz.GpSbEuxwdKsV8JhpGreVC1A19cwfC/O', -- bcrypt hash de 'secretaire123'
    'Secrétaire',
    'Administrative',
    'Mme',
    'secretaire',
    'Secrétariat'
) ON DUPLICATE KEY UPDATE username=username;

-- Afficher les informations de connexion
SELECT 
    username,
    email,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    role,
    service
FROM profiles 
WHERE role = 'secretaire';

