-- Create doctors table
CREATE TABLE public.doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Policies for doctors
CREATE POLICY "Public read access to doctors" ON public.doctors
FOR SELECT USING (true);

CREATE POLICY "Supervisors and admins can manage doctors" ON public.doctors
FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin'))
);