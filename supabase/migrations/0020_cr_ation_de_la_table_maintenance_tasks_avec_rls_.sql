-- Create maintenance_tasks table
CREATE TABLE public.maintenance_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID REFERENCES public.biomedical_equipment(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  technician_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planifiée',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.maintenance_tasks ENABLE ROW LEVEL SECURITY;

-- Policies for maintenance_tasks
CREATE POLICY "Authenticated users can view maintenance tasks" ON public.maintenance_tasks
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Technicians and supervisors can manage their assigned tasks" ON public.maintenance_tasks
FOR ALL TO authenticated USING (
  (auth.uid() = technician_id) OR
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin', 'superviseur_technicien')))
) WITH CHECK (
  (auth.uid() = technician_id) OR
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin', 'superviseur_technicien')))
);