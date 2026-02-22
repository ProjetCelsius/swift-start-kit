-- ============================================
-- BOUSSOLE CLIMAT — Migration 001: Tables principales
-- Basé sur le CDC v1.2, Partie E
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Organizations ─────────────────────────────
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sector_naf text,
  headcount_range text check (headcount_range in ('1-10','11-50','51-250','251-500','501-1000','1001-5000','5000+')),
  revenue_range text check (revenue_range in ('<1M','1-10M','10-50M','50-200M','200M-1Md','>1Md')),
  number_of_sites integer,
  rse_start_year integer,
  created_at timestamptz not null default now()
);

-- ─── User profiles (extends auth.users) ────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('client','reader','analyst','admin')),
  organization_id uuid references public.organizations(id),
  first_name text not null,
  last_name text not null,
  title text,
  photo_url text,
  created_at timestamptz not null default now()
);

-- ─── Diagnostics ───────────────────────────────
create table public.diagnostics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id),
  analyst_id uuid not null references public.profiles(id),
  client_user_id uuid not null references public.profiles(id),
  status text not null default 'onboarding' check (status in (
    'onboarding','questionnaire','survey_pending','analysis','review','ready_for_restitution','delivered','archived'
  )),
  analysis_step text check (analysis_step in ('collecting','analyzing','writing','reviewing','ready')),
  survey_token text unique default uuid_generate_v4()::text,
  dg_token text unique default uuid_generate_v4()::text,
  survey_message text,
  survey_target_count integer,
  survey_distinguish_populations boolean not null default false,
  restitution_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unlocked_at timestamptz
);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger diagnostics_updated_at
  before update on public.diagnostics
  for each row execute function public.update_updated_at();

-- ─── Questionnaire responses ───────────────────
create table public.questionnaire_responses (
  id uuid primary key default uuid_generate_v4(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  block integer not null check (block in (1,2,3,4)),
  question_key text not null,
  response_value integer,
  response_text text,
  response_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(diagnostic_id, question_key)
);

create trigger questionnaire_responses_updated_at
  before update on public.questionnaire_responses
  for each row execute function public.update_updated_at();

-- ─── Advancement tiles (Bloc 1) ────────────────
create table public.advancement_tiles (
  id uuid primary key default uuid_generate_v4(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  tile_key text not null,
  status text not null default 'not_done' check (status in ('done','in_progress','not_done')),
  comment text,
  relevance text check (relevance in ('essential','recommended','optional')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(diagnostic_id, tile_key)
);

create trigger advancement_tiles_updated_at
  before update on public.advancement_tiles
  for each row execute function public.update_updated_at();

-- ─── Survey responses (anonymous) ──────────────
create table public.survey_responses (
  id uuid primary key default uuid_generate_v4(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  population text check (population in ('direction','manager','collaborateur')),
  s1 integer not null check (s1 between 1 and 10),
  s2 integer not null check (s2 between 1 and 10),
  s3 integer not null check (s3 between 1 and 10),
  s4 integer not null check (s4 between 1 and 10),
  s5 integer not null check (s5 between 1 and 10),
  s6 integer not null check (s6 between 1 and 10),
  s7 integer not null check (s7 between 1 and 10),
  s8 integer not null check (s8 between 1 and 10),
  s9_profile text not null check (s9_profile in ('moteur','engage','indifferent','sceptique','refractaire')),
  s10_verbatim text,
  fingerprint text,
  created_at timestamptz not null default now()
);

-- ─── DG responses ──────────────────────────────
create table public.dg_responses (
  id uuid primary key default uuid_generate_v4(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade unique,
  dg1_governance text not null,
  dg2_budget text not null,
  dg3_roi_horizon text not null,
  dg4_main_benefit text not null,
  dg5_means_score integer not null check (dg5_means_score between 1 and 10),
  created_at timestamptz not null default now()
);

-- ─── Diagnostic sections (AI-generated + edited) ─
create table public.diagnostic_sections (
  id uuid primary key default uuid_generate_v4(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  section_number integer not null check (section_number between 1 and 9),
  section_key text not null,
  content_json jsonb not null default '{}'::jsonb,
  status text not null default 'empty' check (status in ('empty','draft','validated')),
  generated_by_ai boolean not null default false,
  last_edited_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(diagnostic_id, section_number)
);

create trigger diagnostic_sections_updated_at
  before update on public.diagnostic_sections
  for each row execute function public.update_updated_at();

-- ─── Journal entries ───────────────────────────
create table public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  content text not null,
  step_change text,
  created_at timestamptz not null default now()
);

-- ─── Journal replies ───────────────────────────
create table public.journal_replies (
  id uuid primary key default uuid_generate_v4(),
  journal_entry_id uuid not null references public.journal_entries(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  content text not null,
  created_at timestamptz not null default now()
);

-- ─── Messages ──────────────────────────────────
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  content text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─── Shared access (invited readers) ───────────
create table public.shared_access (
  id uuid primary key default uuid_generate_v4(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  invited_by uuid not null references public.profiles(id),
  invited_email text not null,
  user_id uuid references public.profiles(id),
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── Analytics events ──────────────────────────
create table public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  diagnostic_id uuid references public.diagnostics(id),
  user_id uuid references public.profiles(id),
  session_id text,
  event_type text not null check (event_type in (
    'page_view','section_view','questionnaire_start','questionnaire_complete',
    'block_start','block_complete','survey_link_generated','survey_link_copied',
    'pdf_exported','diagnostic_shared','cta_clicked','calendly_opened'
  )),
  event_data jsonb,
  page_path text,
  duration_ms integer,
  device_type text check (device_type in ('desktop','mobile','tablet')),
  created_at timestamptz not null default now()
);

-- ─── Indexes for performance ───────────────────
create index idx_diagnostics_org on public.diagnostics(organization_id);
create index idx_diagnostics_analyst on public.diagnostics(analyst_id);
create index idx_diagnostics_client on public.diagnostics(client_user_id);
create index idx_diagnostics_status on public.diagnostics(status);
create index idx_diagnostics_survey_token on public.diagnostics(survey_token);
create index idx_diagnostics_dg_token on public.diagnostics(dg_token);
create index idx_questionnaire_diagnostic on public.questionnaire_responses(diagnostic_id);
create index idx_survey_diagnostic on public.survey_responses(diagnostic_id);
create index idx_sections_diagnostic on public.diagnostic_sections(diagnostic_id);
create index idx_journal_diagnostic on public.journal_entries(diagnostic_id);
create index idx_messages_diagnostic on public.messages(diagnostic_id);
create index idx_analytics_diagnostic on public.analytics_events(diagnostic_id);
create index idx_analytics_type on public.analytics_events(event_type);
create index idx_analytics_created on public.analytics_events(created_at);

-- ─── Realtime subscriptions ────────────────────
-- Enable realtime for tables that need live updates
alter publication supabase_realtime add table public.survey_responses;
alter publication supabase_realtime add table public.journal_entries;
alter publication supabase_realtime add table public.journal_replies;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.diagnostics;
