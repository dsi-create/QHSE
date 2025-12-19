-- Create biomedical_equipment table
CREATE TABLE public.biomedical_equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT,
  serial_number TEXT NOT NULL,
  department TEXT,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'opérationnel',
  last_maintenance TIMESTAMP WITH TIME ZONE,
  next_maintenance TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.biomedical_equipment ENABLE ROW LEVEL SECURITY;

-- Policies for biomedical_equipment
CREATE POLICY "Authenticated users can view biomedical equipment" ON public.biomedical_equipment
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Biomedical supervisors and admins can manage equipment" ON public.biomedical_equipment
FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);