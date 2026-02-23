// ============================================
// BOUSSOLE CLIMAT — Mock admin data
// ============================================

export type DiagnosticStatus = 'onboarding' | 'questionnaire' | 'analysis' | 'restitution' | 'delivered'

export interface AdminDiagnostic {
  id: string
  company: string
  contactEmail: string
  analyst: string
  status: DiagnosticStatus
  sector: string
  headcount: string
  revenue: string
  createdAt: string
  lastActivity: string
  surveyRespondents: number
  surveyTarget: number
  dgReceived: boolean
  checklist: Record<string, boolean>
}

export const STATUS_CONFIG: Record<DiagnosticStatus, { label: string; color: string; bg: string }> = {
  onboarding: { label: 'Onboarding', color: '#7A766D', bg: '#F0EDE6' },
  questionnaire: { label: 'Questionnaire', color: '#B87333', bg: '#F5EDE4' },
  analysis: { label: 'Analyse', color: '#1B4332', bg: '#E8F0EB' },
  restitution: { label: 'Prêt', color: '#fff', bg: '#1B4332' },
  delivered: { label: 'Terminé', color: '#7A766D', bg: '#F0EDE6' },
}

export const MOCK_ANALYSTS = ['Guillaume Pakula']

export const MOCK_DIAGNOSTICS: AdminDiagnostic[] = [
  {
    id: 'demo-duval',
    company: 'Maison Duval',
    contactEmail: 'sophie@maison-duval.fr',
    analyst: 'Guillaume Pakula',
    status: 'delivered',
    sector: 'Hébergement et restauration',
    headcount: '251–500',
    revenue: '50–200 M€',
    createdAt: '2025-12-15',
    lastActivity: new Date(Date.now() - 3 * 86400_000).toISOString(),
    surveyRespondents: 45,
    surveyTarget: 40,
    dgReceived: true,
    checklist: {
      appel_lancement: true,
      bloc1: true, bloc2: true, bloc3: true, bloc4: true,
      sondage: true, dg: true,
      ia_generated: true, validated: true,
      restitution_planned: true, unlocked: true,
    },
  },
  {
    id: 'demo-meridien',
    company: 'Groupe Méridien',
    contactEmail: 'rse@meridien.fr',
    analyst: 'Guillaume Pakula',
    status: 'analysis',
    sector: 'Industrie manufacturière',
    headcount: '501–1 000',
    revenue: '50–200 M€',
    createdAt: '2026-01-10',
    lastActivity: new Date(Date.now() - 2 * 86400_000).toISOString(),
    surveyRespondents: 23,
    surveyTarget: 30,
    dgReceived: true,
    checklist: {
      appel_lancement: true,
      bloc1: true, bloc2: true, bloc3: true, bloc4: true,
      sondage: true, dg: true,
      ia_generated: false, validated: false,
      restitution_planned: false, unlocked: false,
    },
  },
  {
    id: 'demo-novatech',
    company: 'NovaTech Solutions',
    contactEmail: 'contact@novatech.fr',
    analyst: 'Guillaume Pakula',
    status: 'questionnaire',
    sector: 'Information et communication',
    headcount: '51–250',
    revenue: '10–50 M€',
    createdAt: '2026-02-01',
    lastActivity: new Date(Date.now() - 1 * 86400_000).toISOString(),
    surveyRespondents: 0,
    surveyTarget: 30,
    dgReceived: false,
    checklist: {
      appel_lancement: true,
      bloc1: true, bloc2: false, bloc3: false, bloc4: false,
      sondage: false, dg: false,
      ia_generated: false, validated: false,
      restitution_planned: false, unlocked: false,
    },
  },
]

// Admin KPIs
export const MOCK_ADMIN_KPIS = {
  activeDiagnostics: 3,
  awaitingRestitution: 1,
  avgSurveyRate: 76,
  avgDaysPerDiagnostic: 12,
}

// Stats
export const MOCK_STATS = {
  statusDistribution: [
    { status: 'Questionnaire', count: 1 },
    { status: 'Analyse', count: 1 },
    { status: 'Livré', count: 1 },
  ],
  maturityDistribution: [
    { letter: 'A', count: 2 },
    { letter: 'B', count: 5 },
    { letter: 'C', count: 8 },
    { letter: 'D', count: 3 },
  ],
  monthlyDiagnostics: [
    { month: 'Sep', count: 1 },
    { month: 'Oct', count: 2 },
    { month: 'Nov', count: 1 },
    { month: 'Déc', count: 1 },
    { month: 'Jan', count: 2 },
    { month: 'Fév', count: 1 },
  ],
}
