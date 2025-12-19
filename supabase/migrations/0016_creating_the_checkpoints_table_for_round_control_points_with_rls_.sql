-- Create checkpoints table
CREATE TABLE public.checkpoints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  barcode_data TEXT UNIQUE NOT NULL, -- Unique identifier for the barcode
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;

-- Policies for checkpoints table
-- Admins and supervisors can view all checkpoints
CREATE POLICY "Allow all authenticated users to view checkpoints" ON public.checkpoints
FOR SELECT TO authenticated USING (true);

-- Admins and supervisors can insert checkpoints
CREATE POLICY "Admins and supervisors can insert checkpoints" ON public.checkpoints
FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('superadmin', 'superviseur_qhse', 'superviseur_agent_securite', 'superviseur_agent_entretien'));

-- Admins and supervisors can update checkpoints
CREATE POLICY "Admins and supervisors can update checkpoints" ON public.checkpoints
FOR UPDATE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('superadmin', 'superviseur_qhse', 'superviseur_agent_securite', 'superviseur_agent_entretien'));

-- Admins and supervisors can delete checkpoints
CREATE POLICY "Admins and supervisors can delete checkpoints" ON public.checkpoints
FOR DELETE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('superadmin', 'superviseur_qhse', 'superviseur_agent_securite', 'superviseur_agent_entretien'));