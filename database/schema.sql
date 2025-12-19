-- Base de données MySQL pour remplacer Supabase
-- Exécutez ce script dans votre base de données WAMP

CREATE DATABASE IF NOT EXISTS hospital_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_management;

-- Table des utilisateurs/profils
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(191) UNIQUE NOT NULL,
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    civility ENUM('M.', 'Mme', 'Mlle'),
    service VARCHAR(255),
    role ENUM(
        'agent_securite', 
        'agent_entretien', 
        'technicien', 
        'superviseur_qhse', 
        'superadmin',
        'secretaire', 
        'superviseur_agent_securite', 
        'superviseur_agent_entretien',
        'superviseur_technicien', 
        'medecin', 
        'biomedical',
        'Infirmier'
    ) NOT NULL,
    pin VARCHAR(255) NULL,
    added_permissions JSON DEFAULT NULL,
    removed_permissions JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des incidents
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    description TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reported_by VARCHAR(36),
    statut ENUM('nouveau', 'attente', 'cours', 'traite', 'resolu') DEFAULT 'nouveau',
    priorite ENUM('faible', 'moyenne', 'haute', 'critique') DEFAULT 'moyenne',
    service VARCHAR(255),
    lieu VARCHAR(255),
    photo_urls JSON DEFAULT NULL,
    assigned_to VARCHAR(36),
    deadline TIMESTAMP NULL,
    report JSON DEFAULT NULL,
    FOREIGN KEY (reported_by) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Table des visiteurs
CREATE TABLE IF NOT EXISTS visitors (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    id_document VARCHAR(255) NOT NULL,
    reason TEXT,
    destination VARCHAR(255),
    person_to_see VARCHAR(255),
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP NULL,
    registered_by VARCHAR(36),
    FOREIGN KEY (registered_by) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Table des équipements biomédicaux
CREATE TABLE IF NOT EXISTS biomedical_equipment (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255),
    serial_number VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    status ENUM('opérationnel', 'en_maintenance', 'hors_service') DEFAULT 'opérationnel',
    last_maintenance TIMESTAMP NULL,
    next_maintenance TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des tâches de maintenance
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) NOT NULL,
    type VARCHAR(255) NOT NULL,
    description TEXT,
    technician_id VARCHAR(36),
    scheduled_date TIMESTAMP NOT NULL,
    status ENUM('planifiée', 'en_cours', 'terminée') DEFAULT 'planifiée',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES biomedical_equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Table des salles
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INT,
    location VARCHAR(255) NOT NULL,
    doctor_in_charge VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des médecins
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    status ENUM('disponible', 'occupé', 'absent') DEFAULT 'disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(36) PRIMARY KEY,
    room_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    booked_by VARCHAR(36),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    doctor_id VARCHAR(36),
    status ENUM('réservé', 'en_cours', 'terminé', 'annulé') DEFAULT 'réservé',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (booked_by) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

-- Table des tâches planifiées
CREATE TABLE IF NOT EXISTS planned_tasks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    assigned_to VARCHAR(36),
    created_by VARCHAR(36),
    due_date DATE NOT NULL,
    status ENUM('à faire', 'en_cours', 'terminée', 'annulée') DEFAULT 'à faire',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    recipient_id VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    `read` BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES profiles(id) ON DELETE CASCADE,
    INDEX idx_recipient_read (recipient_id, `read`),
    INDEX idx_created_at (created_at)
);

-- Créer un utilisateur superadmin par défaut (password: admin123)
-- L'ID sera généré avec UUID() lors de l'insertion
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
    'superadmin',
    'admin@hospital.com',
    '$2a$10$1o50rXzUgFgMwHEpx1FUUOX9jfyEvgzR7rhtyVFbcicvvPYqmfBUC', -- bcrypt hash de 'admin123'
    'Super',
    'Admin',
    'M.',
    'superadmin',
    'Administration'
) ON DUPLICATE KEY UPDATE username=username;


