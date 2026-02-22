-- ============================================
-- BOUSSOLE CLIMAT — Migration 002: Row Level Security
-- ============================================

-- Enable RLS on all tables
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.diagnostics enable row level security;
alter table public.questionnaire_responses enable row level security;
alter table public.advancement_tiles enable row level security;
alter table public.survey_responses enable row level security;
alter table public.dg_responses enable row level security;
alter table public.diagnostic_sections enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_replies enable row level security;
alter table public.messages enable row level security;
alter table public.shared_access enable row level security;
alter table public.analytics_events enable row level security;

-- ─── Helper function: get user role ────────────
create or replace function public.get_user_role()
returns text as $$
  select role from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- ─── Helper function: is admin ─────────────────
create or replace function public.is_admin()
returns boolean as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$ language sql security definer stable;

-- ─── Helper function: is analyst for diagnostic ─
create or replace function public.is_analyst_for(diag_id uuid)
returns boolean as $$
  select exists(
    select 1 from public.diagnostics 
    where id = diag_id and analyst_id = auth.uid()
  )
$$ language sql security definer stable;

-- ─── Helper function: is client for diagnostic ──
create or replace function public.is_client_for(diag_id uuid)
returns boolean as $$
  select exists(
    select 1 from public.diagnostics 
    where id = diag_id and client_user_id = auth.uid()
  )
$$ language sql security definer stable;

-- ─── Helper function: is reader for diagnostic ──
create or replace function public.is_reader_for(diag_id uuid)
returns boolean as $$
  select exists(
    select 1 from public.shared_access 
    where diagnostic_id = diag_id 
      and user_id = auth.uid() 
      and revoked = false
  )
$$ language sql security definer stable;

-- ═══════════════════════════════════════════════
-- PROFILES
-- ═══════════════════════════════════════════════
create policy "Users can view own profile"
  on public.profiles for select using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update using (id = auth.uid());

create policy "Admins can view all profiles"
  on public.profiles for select using (public.is_admin());

create policy "Analysts can view profiles of their clients"
  on public.profiles for select using (
    exists(
      select 1 from public.diagnostics d
      where d.analyst_id = auth.uid()
        and (d.client_user_id = profiles.id or d.analyst_id = profiles.id)
    )
  );

-- ═══════════════════════════════════════════════
-- ORGANIZATIONS
-- ═══════════════════════════════════════════════
create policy "Clients can view own org"
  on public.organizations for select using (
    exists(select 1 from public.profiles where id = auth.uid() and organization_id = organizations.id)
  );

create policy "Analysts can view orgs of their diagnostics"
  on public.organizations for select using (
    exists(
      select 1 from public.diagnostics d
      where d.analyst_id = auth.uid() and d.organization_id = organizations.id
    )
  );

create policy "Admins can do everything on orgs"
  on public.organizations for all using (public.is_admin());

-- ═══════════════════════════════════════════════
-- DIAGNOSTICS
-- ═══════════════════════════════════════════════
create policy "Clients can view own diagnostic"
  on public.diagnostics for select using (client_user_id = auth.uid());

create policy "Analysts can view assigned diagnostics"
  on public.diagnostics for select using (analyst_id = auth.uid());

create policy "Analysts can update assigned diagnostics"
  on public.diagnostics for update using (analyst_id = auth.uid());

create policy "Admins can do everything on diagnostics"
  on public.diagnostics for all using (public.is_admin());

create policy "Readers can view shared diagnostics"
  on public.diagnostics for select using (public.is_reader_for(id));

-- ═══════════════════════════════════════════════
-- QUESTIONNAIRE RESPONSES
-- ═══════════════════════════════════════════════
create policy "Clients can manage own questionnaire responses"
  on public.questionnaire_responses for all using (public.is_client_for(diagnostic_id));

create policy "Analysts can view questionnaire responses"
  on public.questionnaire_responses for select using (public.is_analyst_for(diagnostic_id));

create policy "Admins can view all questionnaire responses"
  on public.questionnaire_responses for select using (public.is_admin());

-- ═══════════════════════════════════════════════
-- ADVANCEMENT TILES
-- ═══════════════════════════════════════════════
create policy "Clients can manage own tiles"
  on public.advancement_tiles for all using (public.is_client_for(diagnostic_id));

create policy "Analysts can manage tiles (relevance tags)"
  on public.advancement_tiles for all using (public.is_analyst_for(diagnostic_id));

create policy "Admins can manage all tiles"
  on public.advancement_tiles for all using (public.is_admin());

-- ═══════════════════════════════════════════════
-- SURVEY RESPONSES (anonymous — via Edge Function only)
-- No direct RLS for insertion (handled by Edge Function)
-- ═══════════════════════════════════════════════
create policy "Analysts can view survey responses"
  on public.survey_responses for select using (public.is_analyst_for(diagnostic_id));

create policy "Admins can view all survey responses"
  on public.survey_responses for select using (public.is_admin());

-- Clients can view AGGREGATED survey data (count only, not individual responses)
-- Actual aggregation is done in the app layer; we allow select for count queries
create policy "Clients can count survey responses"
  on public.survey_responses for select using (public.is_client_for(diagnostic_id));

-- ═══════════════════════════════════════════════
-- DG RESPONSES (via Edge Function only)
-- ═══════════════════════════════════════════════
create policy "Analysts can view DG responses"
  on public.dg_responses for select using (public.is_analyst_for(diagnostic_id));

create policy "Admins can view all DG responses"
  on public.dg_responses for select using (public.is_admin());

-- ═══════════════════════════════════════════════
-- DIAGNOSTIC SECTIONS
-- ═══════════════════════════════════════════════
-- Clients can only see validated sections of unlocked diagnostics
create policy "Clients can view unlocked validated sections"
  on public.diagnostic_sections for select using (
    public.is_client_for(diagnostic_id) 
    and status = 'validated'
    and exists(
      select 1 from public.diagnostics 
      where id = diagnostic_id and unlocked_at is not null
    )
  );

-- Readers same as clients
create policy "Readers can view unlocked validated sections"
  on public.diagnostic_sections for select using (
    public.is_reader_for(diagnostic_id)
    and status = 'validated'
    and exists(
      select 1 from public.diagnostics 
      where id = diagnostic_id and unlocked_at is not null
    )
  );

create policy "Analysts can manage sections of their diagnostics"
  on public.diagnostic_sections for all using (public.is_analyst_for(diagnostic_id));

create policy "Admins can manage all sections"
  on public.diagnostic_sections for all using (public.is_admin());

-- ═══════════════════════════════════════════════
-- JOURNAL ENTRIES
-- ═══════════════════════════════════════════════
create policy "Clients can view journal of their diagnostic"
  on public.journal_entries for select using (public.is_client_for(diagnostic_id));

create policy "Analysts can manage journal of their diagnostics"
  on public.journal_entries for all using (public.is_analyst_for(diagnostic_id));

create policy "Admins can manage all journal entries"
  on public.journal_entries for all using (public.is_admin());

-- ═══════════════════════════════════════════════
-- JOURNAL REPLIES
-- ═══════════════════════════════════════════════
create policy "Users can view replies on accessible journals"
  on public.journal_replies for select using (
    exists(
      select 1 from public.journal_entries je
      where je.id = journal_entry_id
        and (public.is_client_for(je.diagnostic_id) or public.is_analyst_for(je.diagnostic_id))
    )
  );

create policy "Users can insert replies on accessible journals"
  on public.journal_replies for insert with check (
    author_id = auth.uid() and
    exists(
      select 1 from public.journal_entries je
      where je.id = journal_entry_id
        and (public.is_client_for(je.diagnostic_id) or public.is_analyst_for(je.diagnostic_id))
    )
  );

create policy "Admins can manage all replies"
  on public.journal_replies for all using (public.is_admin());

-- ═══════════════════════════════════════════════
-- MESSAGES
-- ═══════════════════════════════════════════════
create policy "Clients can manage messages of their diagnostic"
  on public.messages for all using (public.is_client_for(diagnostic_id));

create policy "Analysts can manage messages of their diagnostics"
  on public.messages for all using (public.is_analyst_for(diagnostic_id));

create policy "Admins can manage all messages"
  on public.messages for all using (public.is_admin());

-- ═══════════════════════════════════════════════
-- SHARED ACCESS
-- ═══════════════════════════════════════════════
create policy "Clients can manage sharing of their diagnostic"
  on public.shared_access for all using (public.is_client_for(diagnostic_id));

create policy "Admins can manage all sharing"
  on public.shared_access for all using (public.is_admin());

-- ═══════════════════════════════════════════════
-- ANALYTICS (insert-only for clients, full for admins)
-- ═══════════════════════════════════════════════
create policy "Authenticated users can insert analytics"
  on public.analytics_events for insert with check (auth.uid() is not null);

create policy "Admins can view all analytics"
  on public.analytics_events for select using (public.is_admin());

create policy "Analysts can view analytics of their diagnostics"
  on public.analytics_events for select using (public.is_analyst_for(diagnostic_id));
