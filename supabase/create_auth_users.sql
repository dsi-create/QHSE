-- =====================================================
-- SCRIPT POUR CRÉER LES UTILISATEURS DANS SUPABASE AUTH
-- =====================================================
-- ATTENTION : Ce script nécessite des permissions admin
-- Il est préférable de créer les utilisateurs via l'interface Supabase
-- =====================================================

-- Cette fonction nécessite l'extension pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fonction helper pour créer un utilisateur Auth
CREATE OR REPLACE FUNCTION create_auth_user(
    p_email TEXT,
    p_password TEXT,
    p_user_id UUID,
    p_metadata JSONB
) RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Vérifier si l'utilisateur existe déjà
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = p_email;
    
    IF v_user_id IS NOT NULL THEN
        RAISE NOTICE 'User % already exists', p_email;
        RETURN v_user_id;
    END IF;
    
    -- Créer l'utilisateur dans auth.users
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        confirmation_token,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        p_user_id,
        'authenticated',
        'authenticated',
        p_email,
        crypt(p_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        p_metadata,
        '',
        ''
    ) RETURNING id INTO v_user_id;
    
    RAISE NOTICE 'User % created with ID %', p_email, v_user_id;
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le superadmin
SELECT create_auth_user(
    'admin@hospital.com',
    'admin123',
    (SELECT id FROM profiles WHERE email = 'admin@hospital.com' LIMIT 1),
    '{"first_name": "Super", "last_name": "Admin", "username": "superadmin", "role": "superadmin", "service": "Administration", "civility": "M."}'::jsonb
);

-- Créer le superviseur QHSE
SELECT create_auth_user(
    'qhse@hospital.com',
    'qhse123',
    (SELECT id FROM profiles WHERE email = 'qhse@hospital.com' LIMIT 1),
    '{"first_name": "Superviseur", "last_name": "QHSE", "username": "superviseur_qhse", "role": "superviseur_qhse", "service": "Qualité, Hygiène, Sécurité et Environnement", "civility": "M."}'::jsonb
);

-- Créer la secrétaire
SELECT create_auth_user(
    'secretaire@hospital.com',
    'secretaire123',
    (SELECT id FROM profiles WHERE email = 'secretaire@hospital.com' LIMIT 1),
    '{"first_name": "Secrétaire", "last_name": "Administrative", "username": "secretaire", "role": "secretaire", "service": "Secrétariat", "civility": "Mme"}'::jsonb
);

-- Créer l'agent sécurité
SELECT create_auth_user(
    'agent.securite@hospital.com',
    'agent_securite123',
    (SELECT id FROM profiles WHERE email = 'agent.securite@hospital.com' LIMIT 1),
    '{"first_name": "Agent", "last_name": "Sécurité", "username": "agent_securite", "role": "agent_securite", "service": "Sécurité & Accueil", "civility": "M."}'::jsonb
);

-- Créer le superviseur sécurité
SELECT create_auth_user(
    'superviseur.securite@hospital.com',
    'superviseur_securite123',
    (SELECT id FROM profiles WHERE email = 'superviseur.securite@hospital.com' LIMIT 1),
    '{"first_name": "Superviseur", "last_name": "Sécurité", "username": "superviseur_securite", "role": "superviseur_agent_securite", "service": "Sécurité & Accueil", "civility": "M."}'::jsonb
);

-- Créer l'agent entretien
SELECT create_auth_user(
    'agent.entretien@hospital.com',
    'agent_entretien123',
    (SELECT id FROM profiles WHERE email = 'agent.entretien@hospital.com' LIMIT 1),
    '{"first_name": "Agent", "last_name": "Entretien", "username": "agent_entretien", "role": "agent_entretien", "service": "Entretien & Maintenance", "civility": "M."}'::jsonb
);

-- Créer le superviseur entretien
SELECT create_auth_user(
    'superviseur.entretien@hospital.com',
    'superviseur_entretien123',
    (SELECT id FROM profiles WHERE email = 'superviseur.entretien@hospital.com' LIMIT 1),
    '{"first_name": "Superviseur", "last_name": "Entretien", "username": "superviseur_entretien", "role": "superviseur_agent_entretien", "service": "Entretien & Maintenance", "civility": "M."}'::jsonb
);

-- Créer le technicien
SELECT create_auth_user(
    'technicien@hospital.com',
    'technicien123',
    (SELECT id FROM profiles WHERE email = 'technicien@hospital.com' LIMIT 1),
    '{"first_name": "Technicien", "last_name": "Biomédical", "username": "technicien", "role": "technicien", "service": "Maintenance Technique", "civility": "M."}'::jsonb
);

-- Créer le superviseur technicien
SELECT create_auth_user(
    'superviseur.technicien@hospital.com',
    'superviseur_technicien123',
    (SELECT id FROM profiles WHERE email = 'superviseur.technicien@hospital.com' LIMIT 1),
    '{"first_name": "Superviseur", "last_name": "Technicien", "username": "superviseur_technicien", "role": "superviseur_technicien", "service": "Maintenance Technique", "civility": "M."}'::jsonb
);

-- Créer le médecin
SELECT create_auth_user(
    'medecin@hospital.com',
    'medecin123',
    (SELECT id FROM profiles WHERE email = 'medecin@hospital.com' LIMIT 1),
    '{"first_name": "Dr.", "last_name": "Médecin", "username": "medecin", "role": "medecin", "service": "Médecine Générale", "civility": "M."}'::jsonb
);

-- Créer le responsable biomédical
SELECT create_auth_user(
    'biomedical@hospital.com',
    'biomedical123',
    (SELECT id FROM profiles WHERE email = 'biomedical@hospital.com' LIMIT 1),
    '{"first_name": "Responsable", "last_name": "Biomédical", "username": "biomedical", "role": "biomedical", "service": "Service Biomédical", "civility": "M."}'::jsonb
);

-- Nettoyer la fonction helper (optionnel)
-- DROP FUNCTION IF EXISTS create_auth_user(TEXT, TEXT, UUID, JSONB);

