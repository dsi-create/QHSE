-- Script pour créer un utilisateur Biomédical par défaut
-- Mot de passe par défaut : biomedical123

USE hospital_management;

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
    'biomedical',
    'biomedical@hospital.com',
    '$2a$10$uzobdsc.sq9bQDV.0FeBZ.n/DhGxpLBsr2lryay8WmJE7PvkoYK8i',
    'Responsable',
    'Biomédical',
    'M.',
    'biomedical',
    'Service Biomédical'
) ON DUPLICATE KEY UPDATE username = username;

SELECT 
    username,
    email,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    role,
    service
FROM profiles
WHERE username = 'biomedical';




