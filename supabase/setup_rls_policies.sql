-- =====================================================
-- CONFIGURATION DES POLITIQUES RLS (Row Level Security)
-- =====================================================
-- Ce script configure les politiques de sécurité pour toutes les tables
-- Exécutez ce script APRÈS avoir créé les tables avec init_complete_database.sql
-- =====================================================

-- =====================================================
-- 1. TABLE PROFILES
-- =====================================================

-- Activer RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Superadmins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Politique : Tous les utilisateurs authentifiés peuvent voir tous les profils
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT TO authenticated USING (true);

-- Politique : Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

-- Politique : Les superadmins peuvent gérer tous les profils
CREATE POLICY "Superadmins can manage all profiles" ON public.profiles
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'superadmin')
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'superadmin')
);

-- Politique : Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. TABLE INCIDENTS
-- =====================================================

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view incidents" ON public.incidents;
DROP POLICY IF EXISTS "Users can create incidents" ON public.incidents;
DROP POLICY IF EXISTS "Users can update their own incidents" ON public.incidents;
DROP POLICY IF EXISTS "Supervisors can manage all incidents" ON public.incidents;

CREATE POLICY "Authenticated users can view incidents" ON public.incidents
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create incidents" ON public.incidents
FOR INSERT TO authenticated WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can update their own incidents" ON public.incidents
FOR UPDATE TO authenticated USING (
    auth.uid() = reported_by OR auth.uid() = assigned_to
) WITH CHECK (
    auth.uid() = reported_by OR auth.uid() = assigned_to
);

CREATE POLICY "Supervisors can manage all incidents" ON public.incidents
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);

-- =====================================================
-- 3. TABLE VISITORS
-- =====================================================

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view visitors" ON public.visitors;
DROP POLICY IF EXISTS "Users can create visitors" ON public.visitors;
DROP POLICY IF EXISTS "Users can update visitors" ON public.visitors;

CREATE POLICY "Authenticated users can view visitors" ON public.visitors
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create visitors" ON public.visitors
FOR INSERT TO authenticated WITH CHECK (auth.uid() = registered_by);

CREATE POLICY "Users can update visitors" ON public.visitors
FOR UPDATE TO authenticated USING (
    auth.uid() = registered_by OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('agent_securite', 'superviseur_agent_securite', 'superadmin'))
);

-- =====================================================
-- 4. TABLE BIOMEDICAL_EQUIPMENT
-- =====================================================

ALTER TABLE public.biomedical_equipment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view equipment" ON public.biomedical_equipment;
DROP POLICY IF EXISTS "Biomedical can manage equipment" ON public.biomedical_equipment;

CREATE POLICY "Authenticated users can view equipment" ON public.biomedical_equipment
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Biomedical can manage equipment" ON public.biomedical_equipment
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('biomedical', 'superadmin'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('biomedical', 'superadmin'))
);

-- =====================================================
-- 5. TABLE MAINTENANCE_TASKS
-- =====================================================

ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view maintenance tasks" ON public.maintenance_tasks;
DROP POLICY IF EXISTS "Technicians can manage their tasks" ON public.maintenance_tasks;

CREATE POLICY "Authenticated users can view maintenance tasks" ON public.maintenance_tasks
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Technicians can manage their tasks" ON public.maintenance_tasks
FOR ALL TO authenticated USING (
    auth.uid() = technician_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('biomedical', 'superviseur_technicien', 'superadmin'))
) WITH CHECK (
    auth.uid() = technician_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('biomedical', 'superviseur_technicien', 'superadmin'))
);

-- =====================================================
-- 6. TABLE ROOMS
-- =====================================================

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to rooms" ON public.rooms;
DROP POLICY IF EXISTS "Supervisors can manage rooms" ON public.rooms;

CREATE POLICY "Public read access to rooms" ON public.rooms
FOR SELECT USING (true);

CREATE POLICY "Supervisors can manage rooms" ON public.rooms
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin', 'secretaire'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin', 'secretaire'))
);

-- =====================================================
-- 7. TABLE DOCTORS
-- =====================================================

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to doctors" ON public.doctors;
DROP POLICY IF EXISTS "Supervisors can manage doctors" ON public.doctors;

CREATE POLICY "Public read access to doctors" ON public.doctors
FOR SELECT USING (true);

CREATE POLICY "Supervisors can manage doctors" ON public.doctors
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);

-- =====================================================
-- 8. TABLE BOOKINGS
-- =====================================================

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Secretaries can manage bookings" ON public.bookings;
DROP POLICY IF EXISTS "Doctors can update their bookings" ON public.bookings;

CREATE POLICY "Authenticated users can view bookings" ON public.bookings
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Secretaries can manage bookings" ON public.bookings
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('secretaire', 'superadmin'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('secretaire', 'superadmin'))
);

CREATE POLICY "Doctors can update their bookings" ON public.bookings
FOR UPDATE TO authenticated USING (
    auth.uid() = doctor_id OR auth.uid() = booked_by
) WITH CHECK (
    auth.uid() = doctor_id OR auth.uid() = booked_by
);

-- =====================================================
-- 9. TABLE PLANNED_TASKS
-- =====================================================

ALTER TABLE public.planned_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view planned tasks" ON public.planned_tasks;
DROP POLICY IF EXISTS "Assigned users can update tasks" ON public.planned_tasks;
DROP POLICY IF EXISTS "Supervisors can manage tasks" ON public.planned_tasks;

CREATE POLICY "Authenticated users can view planned tasks" ON public.planned_tasks
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Assigned users can update tasks" ON public.planned_tasks
FOR UPDATE TO authenticated USING (
    auth.uid() = assigned_to OR auth.uid() = created_by
) WITH CHECK (
    auth.uid() = assigned_to OR auth.uid() = created_by
);

CREATE POLICY "Supervisors can manage tasks" ON public.planned_tasks
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);

-- =====================================================
-- 10. TABLE NOTIFICATIONS
-- =====================================================

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT TO authenticated USING (auth.uid() = recipient_id);

CREATE POLICY "Users can create notifications" ON public.notifications
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE TO authenticated USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);

-- =====================================================
-- 11. MODULES QHSE - TABLES
-- =====================================================

-- QHSE Documents
ALTER TABLE public.qhse_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view documents" ON public.qhse_documents;
DROP POLICY IF EXISTS "Users can create documents" ON public.qhse_documents;
DROP POLICY IF EXISTS "Users can update their documents" ON public.qhse_documents;

CREATE POLICY "Authenticated users can view documents" ON public.qhse_documents
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create documents" ON public.qhse_documents
FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their documents" ON public.qhse_documents
FOR UPDATE TO authenticated USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);

-- Audits
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view audits" ON public.audits;
DROP POLICY IF EXISTS "QHSE supervisors can manage audits" ON public.audits;

CREATE POLICY "Authenticated users can view audits" ON public.audits
FOR SELECT TO authenticated USING (true);

CREATE POLICY "QHSE supervisors can manage audits" ON public.audits
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);

-- Trainings
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view trainings" ON public.trainings;
DROP POLICY IF EXISTS "QHSE supervisors can manage trainings" ON public.trainings;

CREATE POLICY "Authenticated users can view trainings" ON public.trainings
FOR SELECT TO authenticated USING (true);

CREATE POLICY "QHSE supervisors can manage trainings" ON public.trainings
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);

-- Medical Waste
ALTER TABLE public.medical_waste ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view waste" ON public.medical_waste;
DROP POLICY IF EXISTS "QHSE supervisors can manage waste" ON public.medical_waste;

CREATE POLICY "Authenticated users can view waste" ON public.medical_waste
FOR SELECT TO authenticated USING (true);

CREATE POLICY "QHSE supervisors can manage waste" ON public.medical_waste
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);

-- Sterilization Cycles
ALTER TABLE public.sterilization_cycles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view cycles" ON public.sterilization_cycles;
DROP POLICY IF EXISTS "Users can manage cycles" ON public.sterilization_cycles;

CREATE POLICY "Authenticated users can view cycles" ON public.sterilization_cycles
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage cycles" ON public.sterilization_cycles
FOR ALL TO authenticated USING (
    auth.uid() = operator_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);

-- Risks
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view risks" ON public.risks;
DROP POLICY IF EXISTS "QHSE supervisors can manage risks" ON public.risks;

CREATE POLICY "Authenticated users can view risks" ON public.risks
FOR SELECT TO authenticated USING (true);

CREATE POLICY "QHSE supervisors can manage risks" ON public.risks
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

