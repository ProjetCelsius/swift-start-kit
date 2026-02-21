// ============================================
// BOUSSOLE CLIMAT — Types
// ============================================

// --- Enums ---

export type UserRole = 'client' | 'reader' | 'analyst' | 'admin'

export type DiagnosticStatus =
  | 'onboarding'
  | 'questionnaire'
  | 'survey_pending'
  | 'analysis'
  | 'review'
  | 'ready_for_restitution'
  | 'delivered'
  | 'archived'

export type AnalysisStep =
  | 'collecting'
  | 'analyzing'
  | 'writing'
  | 'reviewing'
  | 'ready'

export type TileStatus = 'done' | 'in_progress' | 'not_done'
export type TileRelevance = 'essential' | 'recommended' | 'optional'

export type SectionStatus = 'empty' | 'draft' | 'validated'

export type MaturityGrade = 'A' | 'B' | 'C' | 'D'

export type PopulationProfile =
  | 'moteur'
  | 'engage'
  | 'indifferent'
  | 'sceptique'
  | 'refractaire'

export type HeadcountRange =
  | '1-10' | '11-50' | '51-250' | '251-500'
  | '501-1000' | '1001-5000' | '5000+'

export type RevenueRange =
  | '<1M' | '1-10M' | '10-50M' | '50-200M'
  | '200M-1Md' | '>1Md'

// --- Core models ---

export interface Organization {
  id: string
  name: string
  sector_naf?: string
  headcount_range?: HeadcountRange
  revenue_range?: RevenueRange
  number_of_sites?: number
  rse_start_year?: number
  created_at: string
}

export interface User {
  id: string
  role: UserRole
  organization_id?: string
  first_name: string
  last_name: string
  title?: string
  photo_url?: string
  created_at: string
}

export interface Diagnostic {
  id: string
  organization_id: string
  analyst_id: string
  client_user_id: string
  status: DiagnosticStatus
  analysis_step?: AnalysisStep
  created_at: string
  updated_at: string
  unlocked_at?: string
  survey_token: string
  dg_token: string
  survey_message?: string
  survey_target_count?: number
  survey_distinguish_populations: boolean
  // Relations
  organization?: Organization
  analyst?: User
  client?: User
}

export interface QuestionnaireResponse {
  id: string
  diagnostic_id: string
  block: 1 | 2 | 3 | 4
  question_key: string
  response_value?: number
  response_text?: string
  response_json?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AdvancementTile {
  id: string
  diagnostic_id: string
  tile_key: string
  status: TileStatus
  comment?: string
  relevance?: TileRelevance
  created_at: string
  updated_at: string
}

export interface SurveyResponse {
  id: string
  diagnostic_id: string
  population?: string
  s1: number; s2: number; s3: number; s4: number
  s5: number; s6: number; s7: number; s8: number
  s9_profile: PopulationProfile
  s10_verbatim?: string
  fingerprint?: string
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

export interface DiagnosticSection {
  id: string
  diagnostic_id: string
  section_number: number
  section_key: string
  content_json: Record<string, unknown>
  status: SectionStatus
  generated_by_ai: boolean
  last_edited_by: string
  created_at: string
  updated_at: string
}

export interface JournalEntry {
  id: string
  diagnostic_id: string
  author_id: string
  content: string
  step_change?: string
  created_at: string
  author?: User
  replies?: JournalReply[]
}

export interface JournalReply {
  id: string
  journal_entry_id: string
  author_id: string
  content: string
  created_at: string
  author?: User
}

export interface Message {
  id: string
  diagnostic_id: string
  sender_id: string
  content: string
  read_at?: string
  created_at: string
  sender?: User
}

export interface AnalyticsEvent {
  id: string
  diagnostic_id?: string
  user_id?: string
  session_id: string
  event_type: string
  event_data?: Record<string, unknown>
  page_path: string
  duration_ms?: number
  device_type: 'desktop' | 'mobile' | 'tablet'
  created_at: string
}

// --- UI types ---

export interface SidebarSection {
  key: string
  label: string
  icon: string
  locked: boolean
  status?: 'completed' | 'in_progress' | 'active'
  children?: SidebarSection[]
  badge?: string | number
}

export interface BlockStatus {
  block: number
  label: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number // 0-100
  estimatedMinutes: number
}

// --- Scoring ---

export interface DimensionScore {
  dimension: string
  score: number // 0-100
  grade: MaturityGrade
  analysis?: string
  sector_position?: string
}

export interface MaturityProfile {
  global_score: number
  global_grade: MaturityGrade
  dimensions: DimensionScore[]
}

export function calculateDimensionScore(answers: number[]): number {
  if (answers.length !== 5) return 0
  const sum = answers.reduce((a, b) => a + b, 0)
  return Math.round(((sum - 5) / 15) * 100)
}

export function scoreToGrade(score: number): MaturityGrade {
  if (score >= 75) return 'A'
  if (score >= 50) return 'B'
  if (score >= 25) return 'C'
  return 'D'
}

export function gradeLabel(grade: MaturityGrade): string {
  const labels: Record<MaturityGrade, string> = {
    A: 'Avancé',
    B: 'Structuré',
    C: 'En construction',
    D: 'Émergent',
  }
  return labels[grade]
}

export function gradeColor(grade: MaturityGrade): string {
  const colors: Record<MaturityGrade, string> = {
    A: 'var(--color-celsius-900)',
    B: 'var(--color-celsius-800)',
    C: 'var(--color-corail-500)',
    D: 'var(--color-rouge-500)',
  }
  return colors[grade]
}

export function gradeInfo(score: number): { letter: MaturityGrade; label: string; color: string } {
  const grade = scoreToGrade(score)
  return {
    letter: grade,
    label: gradeLabel(grade),
    color: { A: '#1B5E3B', B: '#2D7A50', C: '#E8734A', D: '#DC4A4A' }[grade],
  }
}
