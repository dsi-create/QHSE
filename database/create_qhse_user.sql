-- Script pour créer un utilisateur Superviseur QHSE par défaut
-- Mot de passe par défaut : qhse123

USE hospital_management;

-- Créer un utilisateur Superviseur QHSE par défaut
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
    'superviseur_qhse',
    'qhse@hospital.com',
    '$2a$10$QAKZ5a/n7raPrBo6RJh3euS6u3yRRNXP/xNIhXrC2k4vN877UkQRq', -- bcrypt hash de 'qhse123'
    'Superviseur',
    'QHSE',
    'M.',
    'superviseur_qhse',
    'Qualité, Hygiène, Sécurité et Environnement'
) ON DUPLICATE KEY UPDATE username=username;

-- Afficher les informations de connexion
SELECT 
    username,
    email,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    role,
    service
FROM profiles 
WHERE role = 'superviseur_qhse';


