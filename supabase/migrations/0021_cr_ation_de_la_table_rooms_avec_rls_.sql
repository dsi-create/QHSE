-- Create rooms table
CREATE TABLE public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  capacity INTEGER,
  location TEXT NOT NULL,
  doctor_in_charge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Policies for rooms
CREATE POLICY "Public read access to rooms" ON public.rooms
FOR SELECT USING (true);

CREATE POLICY "Supervisors and secretaries can manage rooms" ON public.rooms
FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin', 'secretaire'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('superviseur_qhse', 'superadmin', 'secretaire'))
);