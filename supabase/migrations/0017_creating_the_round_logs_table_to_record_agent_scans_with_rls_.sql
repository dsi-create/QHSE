-- Create round_logs table
CREATE TABLE public.round_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checkpoint_id UUID REFERENCES public.checkpoints(id) ON DELETE CASCADE NOT NULL,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.round_logs ENABLE ROW LEVEL SECURITY;

-- Policies for round_logs table
-- Agents can view their own round logs
CREATE POLICY "Agents can view their own round logs" ON public.round_logs
FOR SELECT TO authenticated USING (auth.uid() = agent_id);

-- Supervisors and Admins can view all round logs
CREATE POLICY "Supervisors and Admins can view all round logs" ON public.round_logs
FOR SELECT TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('superadmin', 'superviseur_qhse', 'superviseur_agent_securite', 'superviseur_agent_entretien'));

-- Agents can insert their own round logs
CREATE POLICY "Agents can insert their own round logs" ON public.round_logs
FOR INSERT TO authenticated WITH CHECK (auth.uid() = agent_id);

-- No update or delete policies for round logs (logs should be immutable)