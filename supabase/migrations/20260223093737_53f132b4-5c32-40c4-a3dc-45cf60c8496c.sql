
-- ============ TABLES FIRST ============

-- 1. organizations
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sector_naf text,
  headcount_range text,
  revenue_range text,
  number_of_sites integer DEFAULT 1,
  rse_start_year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- 2. profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'client',
  organization_id uuid REFERENCES public.organizations,
  first_name text,
  last_name text,
  title text,
  photo_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. diagnostics
CREATE TABLE public.diagnostics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations,
  analyst_id uuid REFERENCES public.profiles,
  client_user_id uuid REFERENCES public.profiles,
  status text DEFAULT 'draft',
  analysis_step text,
  survey_token text UNIQUE DEFAULT gen_random_uuid()::text,
  dg_token text UNIQUE DEFAULT gen_random_uuid()::text,
  survey_message text,
  survey_target_count integer DEFAULT 20,
  survey_distinguish_populations boolean DEFAULT false,
  restitution_date timestamptz,
  unlocked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

-- 4. questionnaire_responses
CREATE TABLE public.questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id uuid NOT NULL REFERENCES public.diagnostics ON DELETE CASCADE,
  block integer NOT NULL,
  question_key text NOT NULL,
  response_value numeric,
  response_text text,
  response_json jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(diagnostic_id, question_key)
);
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- 5. advancement_tiles
CREATE TABLE public.advancement_tiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id uuid NOT NULL REFERENCES public.diagnostics ON DELETE CASCADE,
  tile_key text NOT NULL,
  status text DEFAULT 'not_done',
  relevance text,
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(diagnostic_id, tile_key)
);
ALTER TABLE public.advancement_tiles ENABLE ROW LEVEL SECURITY;

-- 6. survey_responses
CREATE TABLE public.survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id uuid NOT NULL REFERENCES public.diagnostics ON DELETE CASCADE,
  population text,
  s1 integer NOT NULL, s2 integer NOT NULL, s3 integer NOT NULL, s4 integer NOT NULL,
  s5 integer NOT NULL, s6 integer NOT NULL, s7 integer NOT NULL, s8 integer NOT NULL,
  s9_profile text NOT NULL,
  s10_verbatim text,
  fingerprint text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- 7. dg_responses
CREATE TABLE public.dg_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id uuid NOT NULL REFERENCES public.diagnostics ON DELETE CASCADE UNIQUE,
  dg1_governance text NOT NULL,
  dg2_budget text NOT NULL,
  dg3_roi_horizon text NOT NULL,
  dg4_main_benefit text NOT NULL,
  dg5_means_score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.dg_responses ENABLE ROW LEVEL SECURITY;

-- 8. diagnostic_sections
CREATE TABLE public.diagnostic_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id uuid NOT NULL REFERENCES public.diagnostics ON DELETE CASCADE,
  section_number integer NOT NULL,
  section_key text NOT NULL,
  content_json jsonb,
  status text DEFAULT 'empty',
  generated_by_ai boolean DEFAULT false,
  last_edited_by uuid REFERENCES public.profiles,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(diagnostic_id, section_number)
);
ALTER TABLE public.diagnostic_sections ENABLE ROW LEVEL SECURITY;

-- 9. journal_entries
CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id uuid NOT NULL REFERENCES public.diagnostics ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles,
  content text NOT NULL,
  step_change text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- 10. journal_replies
CREATE TABLE public.journal_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id uuid NOT NULL REFERENCES public.journal_entries ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.journal_replies ENABLE ROW LEVEL SECURITY;

-- 11. messages
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id uuid NOT NULL REFERENCES public.diagnostics ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 12. shared_access
CREATE TABLE public.shared_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id uuid NOT NULL REFERENCES public.diagnostics ON DELETE CASCADE,
  invited_by uuid NOT NULL REFERENCES public.profiles,
  invited_email text NOT NULL,
  user_id uuid REFERENCES public.profiles,
  revoked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.shared_access ENABLE ROW LEVEL SECURITY;

-- 13. analytics_events
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_id uuid REFERENCES public.diagnostics,
  user_id uuid REFERENCES public.profiles,
  session_id text,
  event_type text NOT NULL,
  event_data jsonb,
  page_path text,
  duration_ms integer,
  device_type text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- ============ TRIGGERS ============

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_diagnostics_updated_at BEFORE UPDATE ON public.diagnostics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_questionnaire_responses_updated_at BEFORE UPDATE ON public.questionnaire_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_advancement_tiles_updated_at BEFORE UPDATE ON public.advancement_tiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_diagnostic_sections_updated_at BEFORE UPDATE ON public.diagnostic_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'first_name', ''), COALESCE(NEW.raw_user_meta_data->>'last_name', ''));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ HELPER FUNCTIONS ============

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()), false);
$$;

CREATE OR REPLACE FUNCTION public.is_diagnostic_participant(d_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.diagnostics WHERE id = d_id AND (client_user_id = auth.uid() OR analyst_id = auth.uid())
  ) OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.shared_access WHERE diagnostic_id = d_id AND user_id = auth.uid() AND revoked = false
  );
$$;

-- ============ RLS POLICIES ============

-- PROFILES
CREATE POLICY "Users see own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Analysts see client profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'analyst')
  AND EXISTS (SELECT 1 FROM public.diagnostics d WHERE d.analyst_id = auth.uid() AND d.client_user_id = profiles.id)
);
CREATE POLICY "Admins see all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE USING (public.is_admin());

-- ORGANIZATIONS
CREATE POLICY "Clients see own org" ON public.organizations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND organization_id = organizations.id)
);
CREATE POLICY "Analysts see orgs via diagnostics" ON public.organizations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.diagnostics d WHERE d.analyst_id = auth.uid() AND d.organization_id = organizations.id)
);
CREATE POLICY "Admins full access orgs" ON public.organizations FOR ALL USING (public.is_admin());

-- DIAGNOSTICS
CREATE POLICY "Clients see own diagnostic" ON public.diagnostics FOR SELECT USING (client_user_id = auth.uid());
CREATE POLICY "Analysts see assigned diagnostics" ON public.diagnostics FOR SELECT USING (analyst_id = auth.uid());
CREATE POLICY "Shared access see diagnostics" ON public.diagnostics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.shared_access WHERE diagnostic_id = diagnostics.id AND user_id = auth.uid() AND revoked = false)
);
CREATE POLICY "Admins full access diagnostics" ON public.diagnostics FOR ALL USING (public.is_admin());
CREATE POLICY "Analysts manage assigned diagnostics" ON public.diagnostics FOR UPDATE USING (analyst_id = auth.uid());
CREATE POLICY "Analysts insert diagnostics" ON public.diagnostics FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('analyst', 'admin'))
);

-- QUESTIONNAIRE_RESPONSES
CREATE POLICY "Participants see responses" ON public.questionnaire_responses FOR SELECT USING (public.is_diagnostic_participant(diagnostic_id));
CREATE POLICY "Participants insert responses" ON public.questionnaire_responses FOR INSERT WITH CHECK (public.is_diagnostic_participant(diagnostic_id));
CREATE POLICY "Participants update responses" ON public.questionnaire_responses FOR UPDATE USING (public.is_diagnostic_participant(diagnostic_id));
CREATE POLICY "Participants delete responses" ON public.questionnaire_responses FOR DELETE USING (public.is_diagnostic_participant(diagnostic_id));

-- ADVANCEMENT_TILES
CREATE POLICY "Participants see tiles" ON public.advancement_tiles FOR SELECT USING (public.is_diagnostic_participant(diagnostic_id));
CREATE POLICY "Participants insert tiles" ON public.advancement_tiles FOR INSERT WITH CHECK (public.is_diagnostic_participant(diagnostic_id));
CREATE POLICY "Participants update tiles" ON public.advancement_tiles FOR UPDATE USING (public.is_diagnostic_participant(diagnostic_id));
CREATE POLICY "Participants delete tiles" ON public.advancement_tiles FOR DELETE USING (public.is_diagnostic_participant(diagnostic_id));

-- SURVEY_RESPONSES
CREATE POLICY "Anyone can submit survey" ON public.survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Analysts read surveys" ON public.survey_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.diagnostics d WHERE d.id = survey_responses.diagnostic_id AND d.analyst_id = auth.uid())
);
CREATE POLICY "Admins read surveys" ON public.survey_responses FOR SELECT USING (public.is_admin());

-- DG_RESPONSES
CREATE POLICY "Anyone can submit dg" ON public.dg_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Analysts read dg" ON public.dg_responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.diagnostics d WHERE d.id = dg_responses.diagnostic_id AND d.analyst_id = auth.uid())
);
CREATE POLICY "Admins read dg" ON public.dg_responses FOR SELECT USING (public.is_admin());

-- DIAGNOSTIC_SECTIONS
CREATE POLICY "Clients see validated unlocked sections" ON public.diagnostic_sections FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.diagnostics d WHERE d.id = diagnostic_sections.diagnostic_id AND d.client_user_id = auth.uid() AND d.unlocked_at IS NOT NULL)
  AND status = 'validated'
);
CREATE POLICY "Analysts see sections" ON public.diagnostic_sections FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.diagnostics d WHERE d.id = diagnostic_sections.diagnostic_id AND d.analyst_id = auth.uid())
);
CREATE POLICY "Admins full access sections" ON public.diagnostic_sections FOR ALL USING (public.is_admin());
CREATE POLICY "Analysts insert sections" ON public.diagnostic_sections FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.diagnostics d WHERE d.id = diagnostic_sections.diagnostic_id AND d.analyst_id = auth.uid())
);
CREATE POLICY "Analysts update sections" ON public.diagnostic_sections FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.diagnostics d WHERE d.id = diagnostic_sections.diagnostic_id AND d.analyst_id = auth.uid())
);

-- JOURNAL_ENTRIES
CREATE POLICY "Participants see journal" ON public.journal_entries FOR SELECT USING (public.is_diagnostic_participant(diagnostic_id));
CREATE POLICY "Participants write journal" ON public.journal_entries FOR INSERT WITH CHECK (public.is_diagnostic_participant(diagnostic_id) AND author_id = auth.uid());
CREATE POLICY "Authors update journal" ON public.journal_entries FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Authors delete journal" ON public.journal_entries FOR DELETE USING (author_id = auth.uid());

-- JOURNAL_REPLIES
CREATE POLICY "Participants see replies" ON public.journal_replies FOR SELECT USING (
  public.is_diagnostic_participant((SELECT diagnostic_id FROM public.journal_entries WHERE id = journal_replies.journal_entry_id))
);
CREATE POLICY "Participants write replies" ON public.journal_replies FOR INSERT WITH CHECK (
  public.is_diagnostic_participant((SELECT diagnostic_id FROM public.journal_entries WHERE id = journal_replies.journal_entry_id))
  AND author_id = auth.uid()
);
CREATE POLICY "Authors update replies" ON public.journal_replies FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Authors delete replies" ON public.journal_replies FOR DELETE USING (author_id = auth.uid());

-- MESSAGES
CREATE POLICY "Participants see messages" ON public.messages FOR SELECT USING (public.is_diagnostic_participant(diagnostic_id));
CREATE POLICY "Participants send messages" ON public.messages FOR INSERT WITH CHECK (public.is_diagnostic_participant(diagnostic_id) AND sender_id = auth.uid());
CREATE POLICY "Sender update message" ON public.messages FOR UPDATE USING (sender_id = auth.uid());

-- SHARED_ACCESS
CREATE POLICY "Participants see shared access" ON public.shared_access FOR SELECT USING (public.is_diagnostic_participant(diagnostic_id));
CREATE POLICY "Clients invite" ON public.shared_access FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.diagnostics d WHERE d.id = shared_access.diagnostic_id AND d.client_user_id = auth.uid())
  AND invited_by = auth.uid()
);
CREATE POLICY "Inviters manage access" ON public.shared_access FOR UPDATE USING (invited_by = auth.uid());
CREATE POLICY "Admins manage shared access" ON public.shared_access FOR ALL USING (public.is_admin());

-- ANALYTICS_EVENTS
CREATE POLICY "Authenticated insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins read analytics" ON public.analytics_events FOR SELECT USING (public.is_admin());

-- ============ REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.survey_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.journal_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.journal_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diagnostics;
