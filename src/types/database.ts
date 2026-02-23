// ============================================
// BOUSSOLE CLIMAT — Database Types
// Auto-generated from SQL schema (001_create_tables.sql)
// Use with supabase.from('table').select() etc.
// ============================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// ─── Enums ─────────────────────────────────────
export type UserRole = 'client' | 'reader' | 'analyst' | 'admin'
export type DiagnosticStatus = 'onboarding' | 'questionnaire' | 'survey_pending' | 'analysis' | 'review' | 'ready_for_restitution' | 'delivered' | 'archived'
export type AnalysisStep = 'collecting' | 'analyzing' | 'writing' | 'reviewing' | 'ready'
export type TileStatus = 'done' | 'in_progress' | 'not_done'
export type TileRelevance = 'essential' | 'recommended' | 'optional'
export type SectionStatus = 'empty' | 'draft' | 'validated'
export type PopulationCategory = 'direction' | 'manager' | 'collaborateur'
export type PopulationProfile = 'moteur' | 'engage' | 'indifferent' | 'sceptique' | 'refractaire'
export type HeadcountRange = '1-10' | '11-50' | '51-250' | '251-500' | '501-1000' | '1001-5000' | '5000+'
export type RevenueRange = '<1M' | '1-10M' | '10-50M' | '50-200M' | '200M-1Md' | '>1Md'
export type EventType = 'page_view' | 'section_view' | 'questionnaire_start' | 'questionnaire_complete' | 'block_start' | 'block_complete' | 'survey_link_generated' | 'survey_link_copied' | 'pdf_exported' | 'diagnostic_shared' | 'cta_clicked' | 'calendly_opened'
export type DeviceType = 'desktop' | 'mobile' | 'tablet'

// ─── Row types ─────────────────────────────────

export interface Organization {
  id: string
  name: string
  sector_naf: string | null
  headcount_range: HeadcountRange | null
  revenue_range: RevenueRange | null
  number_of_sites: number | null
  rse_start_year: number | null
  created_at: string
}

export interface Profile {
  id: string
  role: UserRole
  organization_id: string | null
  first_name: string
  last_name: string
  title: string | null
  photo_url: string | null
  created_at: string
}

export interface Diagnostic {
  id: string
  organization_id: string
  analyst_id: string
  client_user_id: string
  status: DiagnosticStatus
  analysis_step: AnalysisStep | null
  survey_token: string
  dg_token: string
  survey_message: string | null
  survey_target_count: number | null
  survey_distinguish_populations: boolean
  restitution_date: string | null
  created_at: string
  updated_at: string
  unlocked_at: string | null
}

export interface QuestionnaireResponse {
  id: string
  diagnostic_id: string
  block: 1 | 2 | 3 | 4
  question_key: string
  response_value: number | null
  response_text: string | null
  response_json: Json | null
  created_at: string
  updated_at: string
}

export interface AdvancementTile {
  id: string
  diagnostic_id: string
  tile_key: string
  status: TileStatus
  comment: string | null
  relevance: TileRelevance | null
  created_at: string
  updated_at: string
}

export interface SurveyResponse {
  id: string
  diagnostic_id: string
  population: PopulationCategory | null
  s1: number
  s2: number
  s3: number
  s4: number
  s5: number
  s6: number
  s7: number
  s8: number
  s9_profile: PopulationProfile
  s10_verbatim: string | null
  fingerprint: string | null
  created_at: string
}

export interface DgResponse {
  id: string
  diagnostic_id: string
  dg1_governance: string
  dg2_budget: string
  dg3_roi_horizon: string
  dg4_main_benefit: string
  dg5_means_score: number
  created_at: string
}

// Section content JSON types (per CDC)
export interface SectionContent1 {
  paragraph_1: string
  paragraph_2: string
  paragraph_3: string
}

export interface SectionContent2 {
  priorities: Array<{
    title: string
    why_now: string
    effort_tag: 'quick' | 'project' | 'transformation'
    budget_tag: '<10k' | '10-50k' | '>50k'
  }>
  anti_recommendation: {
    title: string
    explanation: string
  }
}

export interface SectionContent3 {
  global_score: number
  global_grade: string
  dimensions: Array<{
    name: string
    score: number
    grade: string
    analysis: string
    sector_position: string
  }>
}

export interface SectionContent4 {
  gaps_analysis: Array<{
    question_key: string
    rse_score: number
    prediction_score: number
    survey_score: number
    interpretation: string
  }>
  population_analysis: string
  dg_analysis: string | null
}

export interface SectionContent5 {
  current_fte: number
  recommended_fte: number
  analysis: string
}

export interface SectionContent6 {
  has_carbon_footprint: boolean
  total_emissions: number | null
  scope_1: number | null
  scope_2: number | null
  scope_3: number | null
  intensity_per_employee: number | null
  intensity_per_revenue: number | null
  sector_average: number | null
  analysis: string
}

export interface SectionContent7 {
  deadlines: Array<{
    name: string
    date: string
    description: string
    readiness: 'ready' | 'in_progress' | 'not_started'
  }>
}

export interface SectionContent9 {
  twelve_month_plan: Array<{
    quarter: string
    actions: string[]
  }>
  summary: string
}

export type SectionContentMap = {
  1: SectionContent1
  2: SectionContent2
  3: SectionContent3
  4: SectionContent4
  5: SectionContent5
  6: SectionContent6
  7: SectionContent7
  8: Json // Section 8 is auto-fed from tiles, not AI-generated
  9: SectionContent9
}

export interface DiagnosticSection {
  id: string
  diagnostic_id: string
  section_number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  section_key: string
  content_json: Json
  status: SectionStatus
  generated_by_ai: boolean
  last_edited_by: string | null
  created_at: string
  updated_at: string
}

export interface JournalEntry {
  id: string
  diagnostic_id: string
  author_id: string
  content: string
  step_change: string | null
  created_at: string
}

export interface JournalReply {
  id: string
  journal_entry_id: string
  author_id: string
  content: string
  created_at: string
}

export interface Message {
  id: string
  diagnostic_id: string
  sender_id: string
  content: string
  read_at: string | null
  created_at: string
}

export interface SharedAccess {
  id: string
  diagnostic_id: string
  invited_by: string
  invited_email: string
  user_id: string | null
  revoked: boolean
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  diagnostic_id: string | null
  user_id: string | null
  session_id: string | null
  event_type: EventType
  event_data: Json | null
  page_path: string | null
  duration_ms: number | null
  device_type: DeviceType | null
  created_at: string
}

// ─── Supabase Database type (for createClient<Database>) ──
export interface Database {
  public: {
    Tables: {
      organizations: { Row: Organization; Insert: Partial<Organization> & Pick<Organization, 'name'>; Update: Partial<Organization> }
      profiles: { Row: Profile; Insert: Partial<Profile> & Pick<Profile, 'id' | 'first_name' | 'last_name'>; Update: Partial<Profile> }
      diagnostics: { Row: Diagnostic; Insert: Partial<Diagnostic> & Pick<Diagnostic, 'organization_id' | 'analyst_id' | 'client_user_id'>; Update: Partial<Diagnostic> }
      questionnaire_responses: { Row: QuestionnaireResponse; Insert: Partial<QuestionnaireResponse> & Pick<QuestionnaireResponse, 'diagnostic_id' | 'block' | 'question_key'>; Update: Partial<QuestionnaireResponse> }
      advancement_tiles: { Row: AdvancementTile; Insert: Partial<AdvancementTile> & Pick<AdvancementTile, 'diagnostic_id' | 'tile_key'>; Update: Partial<AdvancementTile> }
      survey_responses: { Row: SurveyResponse; Insert: Partial<SurveyResponse> & Pick<SurveyResponse, 'diagnostic_id' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9_profile'>; Update: Partial<SurveyResponse> }
      dg_responses: { Row: DgResponse; Insert: Partial<DgResponse> & Pick<DgResponse, 'diagnostic_id' | 'dg1_governance' | 'dg2_budget' | 'dg3_roi_horizon' | 'dg4_main_benefit' | 'dg5_means_score'>; Update: Partial<DgResponse> }
      diagnostic_sections: { Row: DiagnosticSection; Insert: Partial<DiagnosticSection> & Pick<DiagnosticSection, 'diagnostic_id' | 'section_number' | 'section_key'>; Update: Partial<DiagnosticSection> }
      journal_entries: { Row: JournalEntry; Insert: Partial<JournalEntry> & Pick<JournalEntry, 'diagnostic_id' | 'author_id' | 'content'>; Update: Partial<JournalEntry> }
      journal_replies: { Row: JournalReply; Insert: Partial<JournalReply> & Pick<JournalReply, 'journal_entry_id' | 'author_id' | 'content'>; Update: Partial<JournalReply> }
      messages: { Row: Message; Insert: Partial<Message> & Pick<Message, 'diagnostic_id' | 'sender_id' | 'content'>; Update: Partial<Message> }
      shared_access: { Row: SharedAccess; Insert: Partial<SharedAccess> & Pick<SharedAccess, 'diagnostic_id' | 'invited_by' | 'invited_email'>; Update: Partial<SharedAccess> }
      analytics_events: { Row: AnalyticsEvent; Insert: Partial<AnalyticsEvent> & Pick<AnalyticsEvent, 'event_type'>; Update: Partial<AnalyticsEvent> }
    }
  }
}
