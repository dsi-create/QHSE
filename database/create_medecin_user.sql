-- Script pour créer un utilisateur Médecin par défaut
-- Mot de passe par défaut : medecin123

USE hospital_management;

-- Créer un utilisateur Médecin par défaut dans la table profiles
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
    'medecin',
    'medecin@hospital.com',
    '$2a$10$RHjdi.Yl3kmsR/Yepo9UZ.O/fFYC3vASkQ7Jyg8o8VeyC.wAZrBAu', -- bcrypt hash de 'medecin123'
    'Dr.',
    'Médecin',
    'M.',
    'medecin',
    'Médecine Générale'
) ON DUPLICATE KEY UPDATE username=username;

-- Optionnel : Créer aussi dans la table doctors pour l'annuaire
-- Décommentez les lignes suivantes si vous voulez aussi ajouter le médecin dans l'annuaire
/*
INSERT INTO doctors (
    id,
    name,
    specialty,
    status
) VALUES (
    (SELECT id FROM profiles WHERE username = 'medecin'),
    'Dr. Médecin',
    'Médecine Générale',
    'disponible'
) ON DUPLICATE KEY UPDATE name=name;
*/

-- Afficher les informations de connexion
SELECT 
    username,
    email,
    CONCAT(first_name, ' ', last_name) AS nom_complet,
    role,
    service
FROM profiles 
WHERE role = 'medecin';


