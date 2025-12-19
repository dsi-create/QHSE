-- Script pour mettre à jour le mot de passe de l'administrateur
-- Ce script met à jour le hash du mot de passe pour l'utilisateur admin@hospital.com
-- avec le nouveau hash bcrypt valide pour le mot de passe 'admin123'

USE hospital_management;

-- Mettre à jour le hash du mot de passe pour l'utilisateur admin
UPDATE profiles 
SET password_hash = '$2a$10$1o50rXzUgFgMwHEpx1FUUOX9jfyEvgzR7rhtyVFbcicvvPYqmfBUC' 
WHERE email = 'admin@hospital.com';

-- Afficher le résultat pour vérification
SELECT id, username, email, first_name, last_name, role 
FROM profiles 
WHERE email = 'admin@hospital.com';


