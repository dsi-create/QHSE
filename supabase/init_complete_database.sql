-- =====================================================
-- SCRIPT COMPLET D'INITIALISATION SUPABASE
-- Centre Diagnostic Libreville - Application QHSE
-- =====================================================
-- Ce script crée toutes les tables et données nécessaires
-- Exécutez ce script dans Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. ENUMS (Types personnalisés)
-- =====================================================

-- Civilité
DO $$ BEGIN
    CREATE TYPE civility_type AS ENUM ('M.', 'Mme', 'Mlle');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Rôles utilisateurs
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM (
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
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Statut incidents
DO $$ BEGIN
    CREATE TYPE incident_status_type AS ENUM ('nouveau', 'attente', 'cours', 'traite', 'resolu');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Priorité incidents
DO $$ BEGIN
    CREATE TYPE priority_type AS ENUM ('faible', 'moyenne', 'haute', 'critique');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Statut équipements
DO $$ BEGIN
    CREATE TYPE equipment_status_type AS ENUM ('opérationnel', 'en_maintenance', 'hors_service');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Statut maintenance
DO $$ BEGIN
    CREATE TYPE maintenance_status_type AS ENUM ('planifiée', 'en_cours', 'terminée');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Statut réservations
DO $$ BEGIN
    CREATE TYPE booking_status_type AS ENUM ('réservé', 'en_cours', 'terminé', 'annulé');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Statut tâches planifiées
DO $$ BEGIN
    CREATE TYPE planned_task_status_type AS ENUM ('à faire', 'en_cours', 'terminée', 'annulée');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 3. TABLE PROFILES (utilisateurs)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(191) UNIQUE NOT NULL,
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    civility civility_type,
    service VARCHAR(255),
    role user_role_type NOT NULL,
    pin VARCHAR(255) NULL,
    added_permissions JSONB DEFAULT NULL,
    removed_permissions JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. TABLE INCIDENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(255) NOT NULL,
    description TEXT,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    statut incident_status_type DEFAULT 'nouveau',
    priorite priority_type DEFAULT 'moyenne',
    service VARCHAR(255),
    lieu VARCHAR(255),
    photo_urls JSONB DEFAULT NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    deadline TIMESTAMP WITH TIME ZONE NULL,
    report JSONB DEFAULT NULL,
    corrective_action TEXT NULL,
    preventive_action TEXT NULL,
    root_cause TEXT NULL,
    capa_status VARCHAR(50) DEFAULT 'non_défini',
    capa_due_date DATE NULL,
    capa_completed_date DATE NULL,
    recurrence_count INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_incidents_statut ON incidents(statut);
CREATE INDEX IF NOT EXISTS idx_incidents_priorite ON incidents(priorite);
CREATE INDEX IF NOT EXISTS idx_incidents_service ON incidents(service);
CREATE INDEX IF NOT EXISTS idx_incidents_date_creation ON incidents(date_creation);

-- =====================================================
-- 5. TABLE VISITEURS
-- =====================================================
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    id_document VARCHAR(255) NOT NULL,
    reason TEXT,
    destination VARCHAR(255),
    person_to_see VARCHAR(255),
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP WITH TIME ZONE NULL,
    registered_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- =====================================================
-- 6. TABLE ÉQUIPEMENTS BIOMÉDICAUX
-- =====================================================
CREATE TABLE IF NOT EXISTS biomedical_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255),
    serial_number VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    status equipment_status_type DEFAULT 'opérationnel',
    last_maintenance TIMESTAMP WITH TIME ZONE NULL,
    next_maintenance TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. TABLE TÂCHES DE MAINTENANCE
-- =====================================================
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES biomedical_equipment(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    description TEXT,
    technician_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status maintenance_status_type DEFAULT 'planifiée',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. TABLE SALLES
-- =====================================================
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    capacity INT,
    location VARCHAR(255) NOT NULL,
    doctor_in_charge VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 9. TABLE MÉDECINS
-- =====================================================
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'disponible',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 10. TABLE RÉSERVATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    booked_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    status booking_status_type DEFAULT 'réservé',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 11. TABLE TÂCHES PLANIFIÉES
-- =====================================================
CREATE TABLE IF NOT EXISTS planned_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date DATE NOT NULL,
    status planned_task_status_type DEFAULT 'à faire',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 12. TABLE NOTIFICATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    link VARCHAR(255),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read ON notifications(recipient_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- =====================================================
-- 13. MODULES QHSE - GESTION DOCUMENTAIRE
-- =====================================================

-- Types pour documents
DO $$ BEGIN
    CREATE TYPE document_type_enum AS ENUM ('procedure', 'instruction', 'registre', 'rapport', 'audit', 'formation', 'autre');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_status_enum AS ENUM ('brouillon', 'en_validation', 'validé', 'obsolète', 'archivé');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE access_level_enum AS ENUM ('public', 'interne', 'confidentiel');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS qhse_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    document_type document_type_enum NOT NULL,
    category VARCHAR(255),
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size INT,
    mime_type VARCHAR(100),
    description TEXT,
    status document_status_enum DEFAULT 'brouillon',
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    validated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    validation_date TIMESTAMP WITH TIME ZONE NULL,
    effective_date DATE NULL,
    review_date DATE NULL,
    access_level access_level_enum DEFAULT 'interne',
    tags JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_qhse_documents_updated_at BEFORE UPDATE ON qhse_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_document_type ON qhse_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_document_status ON qhse_documents(status);
CREATE INDEX IF NOT EXISTS idx_document_category ON qhse_documents(category);

-- Table des révisions de documents
CREATE TABLE IF NOT EXISTS document_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES qhse_documents(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    change_description TEXT,
    file_path VARCHAR(500),
    revised_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    revision_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_document_revisions_document_id ON document_revisions(document_id);

-- =====================================================
-- 14. MODULES QHSE - AUDITS
-- =====================================================

DO $$ BEGIN
    CREATE TYPE audit_type_enum AS ENUM ('interne', 'externe', 'certification', 'inspection');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_status_enum AS ENUM ('planifié', 'en_cours', 'terminé', 'annulé');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE compliance_status_enum AS ENUM ('conforme', 'non_conforme', 'non_applicable', 'non_évalué');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_enum AS ENUM ('mineure', 'majeure', 'critique');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE nc_status_enum AS ENUM ('ouvert', 'en_cours', 'fermé', 'verifié');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    audit_type audit_type_enum NOT NULL,
    scope TEXT NOT NULL,
    planned_date DATE NOT NULL,
    actual_date DATE NULL,
    auditor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    audited_department VARCHAR(255),
    status audit_status_enum DEFAULT 'planifié',
    findings JSONB DEFAULT NULL,
    non_conformities_count INT DEFAULT 0,
    conformities_count INT DEFAULT 0,
    opportunities_count INT DEFAULT 0,
    report_path VARCHAR(500),
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON audits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_audit_type ON audits(audit_type);
CREATE INDEX IF NOT EXISTS idx_audit_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_audit_planned_date ON audits(planned_date);

-- Table des non-conformités
CREATE TABLE IF NOT EXISTS non_conformities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,
    incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity severity_enum DEFAULT 'mineure',
    root_cause TEXT,
    corrective_action TEXT,
    preventive_action TEXT,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date DATE,
    status nc_status_enum DEFAULT 'ouvert',
    verification_date DATE NULL,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_non_conformities_updated_at BEFORE UPDATE ON non_conformities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_nc_status ON non_conformities(status);
CREATE INDEX IF NOT EXISTS idx_nc_severity ON non_conformities(severity);

-- Table des checklists d'audit
CREATE TABLE IF NOT EXISTS audit_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    requirement TEXT,
    compliance_status compliance_status_enum DEFAULT 'non_évalué',
    observation TEXT,
    photo_urls JSONB DEFAULT NULL,
    checked_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    checked_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_checklists_audit_id ON audit_checklists(audit_id);

-- =====================================================
-- 15. MODULES QHSE - FORMATIONS
-- =====================================================

DO $$ BEGIN
    CREATE TYPE training_type_enum AS ENUM ('interne', 'externe', 'en_ligne', 'présentiel');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE training_status_enum AS ENUM ('planifiée', 'en_cours', 'terminée', 'annulée');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE registration_status_enum AS ENUM ('inscrit', 'présent', 'absent', 'excused');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE skill_level_enum AS ENUM ('débutant', 'intermédiaire', 'avancé', 'expert');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS trainings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    trainer VARCHAR(255),
    training_type training_type_enum DEFAULT 'interne',
    duration_hours DECIMAL(5,2),
    location VARCHAR(255),
    planned_date DATE,
    actual_date DATE NULL,
    status training_status_enum DEFAULT 'planifiée',
    max_participants INT,
    certificate_required BOOLEAN DEFAULT FALSE,
    validity_months INT NULL,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_trainings_updated_at BEFORE UPDATE ON trainings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_training_status ON trainings(status);
CREATE INDEX IF NOT EXISTS idx_training_category ON trainings(category);
CREATE INDEX IF NOT EXISTS idx_training_planned_date ON trainings(planned_date);

-- Table des participations aux formations
CREATE TABLE IF NOT EXISTS training_participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    registration_status registration_status_enum DEFAULT 'inscrit',
    attendance_date DATE NULL,
    score DECIMAL(5,2) NULL,
    passed BOOLEAN DEFAULT FALSE,
    certificate_number VARCHAR(255) NULL,
    certificate_issued_date DATE NULL,
    certificate_expiry_date DATE NULL,
    comments TEXT,
    registered_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(training_id, participant_id)
);

CREATE TRIGGER update_training_participations_updated_at BEFORE UPDATE ON training_participations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_training_participations_participant_id ON training_participations(participant_id);
CREATE INDEX IF NOT EXISTS idx_training_participations_certificate_expiry ON training_participations(certificate_expiry_date);

-- Table des compétences
CREATE TABLE IF NOT EXISTS competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    skill_category VARCHAR(255),
    level skill_level_enum DEFAULT 'débutant',
    certification_number VARCHAR(255),
    issued_date DATE,
    expiry_date DATE NULL,
    issuing_authority VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verification_date DATE NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_competencies_updated_at BEFORE UPDATE ON competencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_competencies_employee_id ON competencies(employee_id);
CREATE INDEX IF NOT EXISTS idx_competencies_expiry_date ON competencies(expiry_date);

-- =====================================================
-- 16. MODULES QHSE - DÉCHETS MÉDICAUX
-- =====================================================

DO $$ BEGIN
    CREATE TYPE waste_type_enum AS ENUM ('DASRI', 'médicamenteux', 'chimique', 'radioactif', 'autre');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE waste_unit_enum AS ENUM ('kg', 'litre', 'unité');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE waste_status_enum AS ENUM ('collecté', 'stocké', 'traité', 'éliminé');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE waste_step_enum AS ENUM ('collecte', 'transport', 'traitement', 'élimination');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS medical_waste (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    waste_type waste_type_enum NOT NULL,
    category VARCHAR(255),
    quantity DECIMAL(10,2) NOT NULL,
    unit waste_unit_enum DEFAULT 'kg',
    collection_date DATE NOT NULL,
    collection_location VARCHAR(255) NOT NULL,
    producer_service VARCHAR(255),
    waste_code VARCHAR(100),
    treatment_method VARCHAR(255),
    treatment_company VARCHAR(255),
    treatment_date DATE NULL,
    tracking_number VARCHAR(255),
    certificate_number VARCHAR(255),
    status waste_status_enum DEFAULT 'collecté',
    handled_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    registered_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    notes TEXT,
    photo_urls JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_medical_waste_updated_at BEFORE UPDATE ON medical_waste
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_waste_type ON medical_waste(waste_type);
CREATE INDEX IF NOT EXISTS idx_waste_status ON medical_waste(status);
CREATE INDEX IF NOT EXISTS idx_waste_collection_date ON medical_waste(collection_date);

-- Table de traçabilité des déchets
CREATE TABLE IF NOT EXISTS waste_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    waste_id UUID NOT NULL REFERENCES medical_waste(id) ON DELETE CASCADE,
    step waste_step_enum NOT NULL,
    location VARCHAR(255),
    handler_name VARCHAR(255),
    handler_signature VARCHAR(500),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_waste_tracking_waste_id ON waste_tracking(waste_id);
CREATE INDEX IF NOT EXISTS idx_waste_tracking_timestamp ON waste_tracking(timestamp);

-- =====================================================
-- 17. MODULES QHSE - STÉRILISATION
-- =====================================================

DO $$ BEGIN
    CREATE TYPE sterilizer_type_enum AS ENUM ('autoclave', 'ETO', 'plasma', 'peroxyde');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cycle_type_enum AS ENUM ('stérilisation', 'désinfection', 'préventif');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cycle_status_enum AS ENUM ('en_cours', 'terminé', 'échoué', 'annulé');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cycle_result_enum AS ENUM ('conforme', 'non_conforme', 'en_attente');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE indicator_result_enum AS ENUM ('conforme', 'non_conforme', 'non_testé');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_status_enum AS ENUM ('stérilisé', 'utilisé', 'expiré', 'rejeté');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE laundry_type_enum AS ENUM ('blouse', 'drap', 'champ_operatoire', 'autre');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE laundry_status_enum AS ENUM ('collecté', 'en_lavage', 'stérilisé', 'distribué', 'rejeté');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS sterilization_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_number VARCHAR(100) NOT NULL UNIQUE,
    sterilizer_id VARCHAR(255) NOT NULL,
    sterilizer_type sterilizer_type_enum NOT NULL,
    cycle_type cycle_type_enum DEFAULT 'stérilisation',
    program_name VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NULL,
    duration_minutes INT,
    temperature DECIMAL(5,2),
    pressure DECIMAL(5,2),
    operator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    status cycle_status_enum DEFAULT 'en_cours',
    result cycle_result_enum DEFAULT 'en_attente',
    biological_indicator_result indicator_result_enum DEFAULT 'non_testé',
    chemical_indicator_result indicator_result_enum DEFAULT 'non_testé',
    non_conformity_reason TEXT,
    batch_number VARCHAR(100),
    items_count INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_sterilization_cycles_updated_at BEFORE UPDATE ON sterilization_cycles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_cycle_number ON sterilization_cycles(cycle_number);
CREATE INDEX IF NOT EXISTS idx_cycle_status ON sterilization_cycles(status);
CREATE INDEX IF NOT EXISTS idx_cycle_start_time ON sterilization_cycles(start_time);

-- Table des équipements stérilisés
CREATE TABLE IF NOT EXISTS sterilized_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES sterilization_cycles(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(255),
    lot_number VARCHAR(100),
    quantity INT DEFAULT 1,
    location VARCHAR(255),
    expiry_date DATE NULL,
    used_date DATE NULL,
    used_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status item_status_enum DEFAULT 'stérilisé',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sterilized_items_cycle_id ON sterilized_items(cycle_id);
CREATE INDEX IF NOT EXISTS idx_sterilized_items_status ON sterilized_items(status);
CREATE INDEX IF NOT EXISTS idx_sterilized_items_expiry_date ON sterilized_items(expiry_date);

-- Table de suivi du linge
CREATE TABLE IF NOT EXISTS laundry_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number VARCHAR(100) NOT NULL,
    laundry_type laundry_type_enum NOT NULL,
    quantity INT NOT NULL,
    collection_date DATE NOT NULL,
    collection_location VARCHAR(255),
    washing_date DATE NULL,
    washing_method VARCHAR(255),
    sterilization_date DATE NULL,
    sterilization_cycle_id UUID REFERENCES sterilization_cycles(id) ON DELETE SET NULL,
    distribution_date DATE NULL,
    distribution_location VARCHAR(255),
    status laundry_status_enum DEFAULT 'collecté',
    handler_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_laundry_tracking_updated_at BEFORE UPDATE ON laundry_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_laundry_batch_number ON laundry_tracking(batch_number);
CREATE INDEX IF NOT EXISTS idx_laundry_status ON laundry_tracking(status);
CREATE INDEX IF NOT EXISTS idx_laundry_collection_date ON laundry_tracking(collection_date);

-- =====================================================
-- 18. MODULES QHSE - GESTION DES RISQUES
-- =====================================================

DO $$ BEGIN
    CREATE TYPE risk_category_enum AS ENUM ('biologique', 'chimique', 'physique', 'ergonomique', 'psychosocial', 'sécurité', 'environnemental', 'autre');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE probability_enum AS ENUM ('très_faible', 'faible', 'moyenne', 'élevée', 'très_élevée');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_risk_enum AS ENUM ('négligeable', 'faible', 'modérée', 'importante', 'critique');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_enum AS ENUM ('très_faible', 'faible', 'moyen', 'élevé', 'très_élevé');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_status_enum AS ENUM ('identifié', 'évalué', 'en_traitement', 'traité', 'surveillé');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE action_type_enum AS ENUM ('prévention', 'mitigation', 'transfert', 'acceptation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE action_status_enum AS ENUM ('planifiée', 'en_cours', 'terminée', 'annulée');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE effectiveness_enum AS ENUM ('très_élevée', 'élevée', 'moyenne', 'faible');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    risk_category risk_category_enum NOT NULL,
    risk_source VARCHAR(255),
    probability probability_enum NOT NULL,
    severity severity_risk_enum NOT NULL,
    risk_level risk_level_enum NOT NULL,
    current_controls TEXT,
    residual_probability probability_enum NULL,
    residual_severity severity_risk_enum NULL,
    residual_risk_level risk_level_enum NULL,
    treatment_plan TEXT,
    action_plan TEXT,
    responsible_person UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date DATE,
    status risk_status_enum DEFAULT 'identifié',
    review_date DATE,
    last_review_date DATE NULL,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON risks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_risk_category ON risks(risk_category);
CREATE INDEX IF NOT EXISTS idx_risk_level ON risks(risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_status ON risks(status);

-- Table des actions de traitement des risques
CREATE TABLE IF NOT EXISTS risk_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_id UUID NOT NULL REFERENCES risks(id) ON DELETE CASCADE,
    action_type action_type_enum NOT NULL,
    description TEXT NOT NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date DATE,
    status action_status_enum DEFAULT 'planifiée',
    completion_date DATE NULL,
    effectiveness effectiveness_enum NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_risk_actions_updated_at BEFORE UPDATE ON risk_actions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_risk_actions_risk_id ON risk_actions(risk_id);
CREATE INDEX IF NOT EXISTS idx_risk_actions_status ON risk_actions(status);

-- =====================================================
-- 19. DONNÉES INITIALES - UTILISATEURS
-- =====================================================

-- Super Admin (password: admin123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'superadmin',
    'admin@hospital.com',
    '$2a$10$1o50rXzUgFgMwHEpx1FUUOX9jfyEvgzR7rhtyVFbcicvvPYqmfBUC',
    'Super',
    'Admin',
    'M.',
    'superadmin',
    'Administration'
) ON CONFLICT (username) DO NOTHING;

-- Superviseur QHSE (password: qhse123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'superviseur_qhse',
    'qhse@hospital.com',
    '$2a$10$QAKZ5a/n7raPrBo6RJh3euS6u3yRRNXP/xNIhXrC2k4vN877UkQRq',
    'Superviseur',
    'QHSE',
    'M.',
    'superviseur_qhse',
    'Qualité, Hygiène, Sécurité et Environnement'
) ON CONFLICT (username) DO NOTHING;

-- Secrétaire (password: secretaire123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'secretaire',
    'secretaire@hospital.com',
    '$2a$10$Lk99gn0FmP0MyEoCma3Kz.GpSbEuxwdKsV8JhpGreVC1A19cwfC/O',
    'Secrétaire',
    'Administrative',
    'Mme',
    'secretaire',
    'Secrétariat'
) ON CONFLICT (username) DO NOTHING;

-- Agent Sécurité (password: agent_securite123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'agent_securite',
    'agent.securite@hospital.com',
    '$2a$10$DoPIFbDXZKSls29fEXLpJ.HIlqgpHKqPAQkDaNkqRQfLfVKjGNbaa',
    'Agent',
    'Sécurité',
    'M.',
    'agent_securite',
    'Sécurité & Accueil'
) ON CONFLICT (username) DO NOTHING;

-- Superviseur Sécurité (password: superviseur_securite123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'superviseur_securite',
    'superviseur.securite@hospital.com',
    '$2a$10$ceA7HbrXM711/UOs0nrK/uE/kEKmfvOfhybyQ9nlmdHITGyEZVbBG',
    'Superviseur',
    'Sécurité',
    'M.',
    'superviseur_agent_securite',
    'Sécurité & Accueil'
) ON CONFLICT (username) DO NOTHING;

-- Agent Entretien (password: agent_entretien123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'agent_entretien',
    'agent.entretien@hospital.com',
    '$2a$10$/VQSbyde252YK1DHQbm91eANGu//A4.3BpAxGjtYu1mzQgajY/CLm',
    'Agent',
    'Entretien',
    'M.',
    'agent_entretien',
    'Entretien & Maintenance'
) ON CONFLICT (username) DO NOTHING;

-- Superviseur Entretien (password: superviseur_entretien123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'superviseur_entretien',
    'superviseur.entretien@hospital.com',
    '$2a$10$qU1noQU0TqVUFXN4MX.OOeJuV.7uUv.nUsC45nApNzzk1JRXpvRKS',
    'Superviseur',
    'Entretien',
    'M.',
    'superviseur_agent_entretien',
    'Entretien & Maintenance'
) ON CONFLICT (username) DO NOTHING;

-- Technicien (password: technicien123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'technicien',
    'technicien@hospital.com',
    '$2a$10$pLh9MrMj1Qc1p/gKOCC3CuxXThkqG.xLKVl8z3M5rBIq/KVsEoXcu',
    'Technicien',
    'Biomédical',
    'M.',
    'technicien',
    'Maintenance Technique'
) ON CONFLICT (username) DO NOTHING;

-- Superviseur Technicien (password: superviseur_technicien123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'superviseur_technicien',
    'superviseur.technicien@hospital.com',
    '$2a$10$HCMirNtM63xKaE88I4A.5.XSQ/2pyjCjwAn4RYH/r2btqlEKr9zuS',
    'Superviseur',
    'Technicien',
    'M.',
    'superviseur_technicien',
    'Maintenance Technique'
) ON CONFLICT (username) DO NOTHING;

-- Médecin (password: medecin123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'medecin',
    'medecin@hospital.com',
    '$2a$10$RHjdi.Yl3kmsR/Yepo9UZ.O/fFYC3vASkQ7Jyg8o8VeyC.wAZrBAu',
    'Dr.',
    'Médecin',
    'M.',
    'medecin',
    'Médecine Générale'
) ON CONFLICT (username) DO NOTHING;

-- Responsable Biomédical (password: biomedical123)
INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
VALUES (
    uuid_generate_v4(),
    'biomedical',
    'biomedical@hospital.com',
    '$2a$10$uzobdsc.sq9bQDV.0FeBZ.n/DhGxpLBsr2lryay8WmJE7PvkoYK8i',
    'Responsable',
    'Biomédical',
    'M.',
    'biomedical',
    'Service Biomédical'
) ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- 20. DONNÉES INITIALES - SALLES
-- =====================================================

INSERT INTO rooms (id, name, capacity, location, doctor_in_charge)
VALUES 
    (uuid_generate_v4(), 'Salle de Consultation 1', 1, 'Rez-de-chaussée', 'Dr. Médecin'),
    (uuid_generate_v4(), 'Salle de Consultation 2', 1, 'Rez-de-chaussée', 'Dr. Médecin'),
    (uuid_generate_v4(), 'Salle d\'Examen', 1, 'Premier étage', NULL),
    (uuid_generate_v4(), 'Salle de Réunion', 10, 'Premier étage', NULL),
    (uuid_generate_v4(), 'Amphithéâtre', 50, 'Rez-de-chaussée', NULL)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

