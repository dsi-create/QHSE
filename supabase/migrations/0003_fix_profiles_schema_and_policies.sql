-- Drop policies dependent on the 'role' column to allow type alteration
-- NOTE: You might need to identify and drop ALL policies that depend on 'profiles.role'
-- The previous error mentioned 'Les cuisiniers et admins peuvent gérer les menus' on 'weekly_menu_items'
-- This implies a policy on 'weekly_menu_items' that references 'profiles.role'.
-- We need to find all such policies and drop them.

-- Based on the schema provided, here are the policies that reference profiles.role:
-- "Cooks and Admins can view all employee orders" on "employee_orders"
-- "Les administrateurs peuvent gérer les QCM." on "qcms"
-- "Les administrateurs peuvent gérer toutes les réponses" on "user_qcm_answers"
-- "Les administrateurs peuvent gérer tous les rapports" on "reports"
-- "Les administrateurs peuvent gérer les questions." on "questions"
-- "Les administrateurs peuvent gérer les options." on "options"
-- "Les utilisateurs peuvent voir les tickets" on "tickets"
-- "Les utilisateurs privilégiés peuvent mettre à jour les ticke" on "tickets"
-- "Les administrateurs et managers peuvent supprimer des tickets" on "tickets"
-- "Les administrateurs peuvent mettre à jour tous les profils" on "profiles"
-- "Allow privileged users to manage reports" on "generated_reports"
-- "Cooks and Admins can manage employee menus" on "employee_menus"
-- "Les cuisiniers et admins peuvent gérer les menus" on "weekly_menu_items"

DROP POLICY IF EXISTS "Cooks and Admins can view all employee orders" ON public.employee_orders;
DROP POLICY IF EXISTS "Les administrateurs peuvent gérer les QCM." ON public.qcms;
DROP POLICY IF EXISTS "Les administrateurs peuvent gérer toutes les réponses" ON public.user_qcm_answers;
DROP POLICY IF EXISTS "Les administrateurs peuvent gérer tous les rapports" ON public.reports;
DROP POLICY IF EXISTS "Les administrateurs peuvent gérer les questions." ON public.questions;
DROP POLICY IF EXISTS "Les administrateurs peuvent gérer les options." ON public.options;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir les tickets" ON public.tickets;
DROP POLICY IF EXISTS "Les utilisateurs privilégiés peuvent mettre à jour les ticke" ON public.tickets;
DROP POLICY IF EXISTS "Les administrateurs et managers peuvent supprimer des tickets" ON public.tickets;
DROP POLICY IF EXISTS "Les administrateurs peuvent mettre à jour tous les profils" ON public.profiles;
DROP POLICY IF EXISTS "Allow privileged users to manage reports" ON public.generated_reports;
DROP POLICY IF EXISTS "Cooks and Admins can manage employee menus" ON public.employee_menus;
DROP POLICY IF EXISTS "Les cuisiniers et admins peuvent gérer les menus" ON public.weekly_menu_items;


-- Ensure civility ENUM type exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'civility') THEN
        CREATE TYPE public.civility AS ENUM ('M.', 'Mme', 'Mlle');
    END IF;
END $$;

-- Add civility column to public.profiles if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS civility public.civility;

-- Ensure user_role ENUM type exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM (
            'agent_securite', 'agent_entretien', 'technicien', 'superviseur_qhse', 'superadmin', 
            'secretaire', 'superviseur_agent_securite', 'superviseur_agent_entretien', 
            'superviseur_technicien', 'medecin', 'Infirmier'
        );
    END IF;
END $$;

-- Alter role column to use user_role type
-- This will fail if there's existing data that cannot be cast.
-- If you have existing data in 'role' that is not in the ENUM, you'll need to update it first.
ALTER TABLE public.profiles
ALTER COLUMN role TYPE public.user_role USING role::public.user_role;


-- Recreate the dropped policies
-- Policy for employee_orders
CREATE POLICY "Cooks and Admins can view all employee orders" ON public.employee_orders FOR SELECT USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = ANY (ARRAY['Chef Cuisinier'::user_role, 'Aide Cuisinier'::user_role, 'Super Admin'::user_role])));

-- Policies for qcms
CREATE POLICY "Les administrateurs peuvent gérer les QCM." ON public.qcms FOR ALL USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'Super Admin'::user_role));

-- Policies for user_qcm_answers
CREATE POLICY "Les administrateurs peuvent gérer toutes les réponses" ON public.user_qcm_answers FOR ALL USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'Super Admin'::user_role));

-- Policies for reports
CREATE POLICY "Les administrateurs peuvent gérer tous les rapports" ON public.reports FOR ALL USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'Super Admin'::user_role));

-- Policies for questions
CREATE POLICY "Les administrateurs peuvent gérer les questions." ON public.questions FOR ALL USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'Super Admin'::user_role));

-- Policies for options
CREATE POLICY "Les administrateurs peuvent gérer les options." ON public.options FOR ALL USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = 'Super Admin'::user_role));

-- Policies for tickets
CREATE POLICY "Les utilisateurs peuvent voir les tickets" ON public.tickets FOR SELECT USING (((requester_id = auth.uid()) OR (( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = ANY (ARRAY['Super Admin'::user_role, 'Manager'::user_role, 'DSI'::user_role, 'Technicien'::user_role]))));
CREATE POLICY "Les utilisateurs privilégiés peuvent mettre à jour les ticke" ON public.tickets FOR UPDATE USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = ANY (ARRAY['Super Admin'::user_role, 'Manager'::user_role, 'DSI'::user_role, 'Technicien'::user_role]))));
CREATE POLICY "Les administrateurs et managers peuvent supprimer des tickets" ON public.tickets FOR DELETE USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = ANY (ARRAY['Super Admin'::user_role, 'Manager'::user_role, 'DSI'::user_role]))));

-- Policies for profiles
CREATE POLICY "Les administrateurs peuvent mettre à jour tous les profils" ON public.profiles FOR UPDATE USING ((( SELECT profiles_1.role FROM profiles profiles_1 WHERE (profiles_1.id = auth.uid())) = 'Super Admin'::user_role));

-- Policies for generated_reports
CREATE POLICY "Allow privileged users to manage reports" ON public.generated_reports FOR ALL USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = ANY (ARRAY['Manager'::user_role, 'DSI'::user_role, 'Super Admin'::user_role]))));

-- Policies for employee_menus
CREATE POLICY "Cooks and Admins can manage employee menus" ON public.employee_menus FOR ALL USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = ANY (ARRAY['Chef Cuisinier'::user_role, 'Aide Cuisinier'::user_role, 'Super Admin'::user_role]))));

-- Policies for weekly_menu_items
CREATE POLICY "Les cuisiniers et admins peuvent gérer les menus" ON public.weekly_menu_items FOR ALL USING ((( SELECT profiles.role FROM profiles WHERE (profiles.id = auth.uid())) = ANY (ARRAY['Chef Cuisinier'::user_role, 'Super Admin'::user_role]))));