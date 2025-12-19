-- Create planned_tasks table
CREATE TABLE public.planned_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'à faire',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.planned_tasks ENABLE ROW LEVEL SECURITY;

-- Policies for planned_tasks
CREATE POLICY "Authenticated users can view planned tasks" ON public.planned_tasks
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Assigned users and supervisors can update their planned tasks" ON public.planned_tasks
FOR UPDATE TO authenticated USING (
  (auth.uid() = assigned_to) OR
  (auth.uid() = created_by) OR
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin', 'superviseur_agent_securite', 'superviseur_agent_entretien', 'superviseur_technicien')))
) WITH CHECK (
  (auth.uid() = assigned_to) OR
  (auth.uid() = created_by) OR
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin', 'superviseur_agent_securite', 'superviseur_agent_entretien', 'superviseur_technicien')))
);

CREATE POLICY "Supervisors can manage all planned tasks" ON public.planned_tasks
FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin', 'superviseur_agent_securite', 'superviseur_agent_entretien', 'superviseur_technicien'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin', 'superviseur_agent_securite', 'superviseur_agent_entretien', 'superviseur_technicien'))
);