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

export const MOCK_ANALYSTS = ['Claire Lefèvre', 'Thomas Moreau', 'Julie Dupont']

export const MOCK_DIAGNOSTICS: AdminDiagnostic[] = [
  {
    id: 'diag-001',
    company: 'TechVert Solutions',
    contactEmail: 'rse@techvert.fr',
    analyst: 'Claire Lefèvre',
    status: 'analysis',
    sector: 'Numérique',
    headcount: '251-500',
    revenue: '50-200M',
    createdAt: '2025-12-15',
    lastActivity: '2026-02-20',
    surveyRespondents: 23,
    surveyTarget: 30,
    dgReceived: true,
    checklist: {
      appel_lancement: true,
      bloc1: true,
      bloc2: true,
      bloc3: true,
      bloc4: true,
      sondage: true,
      dg: true,
      ia_generated: false,
      validated: false,
      restitution_planned: false,
      unlocked: false,
    },
  },
  {
    id: 'diag-002',
    company: 'Maison Durable SAS',
    contactEmail: 'direction@maisondurable.fr',
    analyst: 'Claire Lefèvre',
    status: 'delivered',
    sector: 'Construction',
    headcount: '51-250',
    revenue: '10-50M',
    createdAt: '2025-09-01',
    lastActivity: '2026-01-10',
    surveyRespondents: 45,
    surveyTarget: 30,
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
    id: 'diag-003',
    company: 'LogiVert Transport',
    contactEmail: 'qse@logivert.com',
    analyst: 'Thomas Moreau',
    status: 'questionnaire',
    sector: 'Transport & Logistique',
    headcount: '501-1000',
    revenue: '200M-1Md',
    createdAt: '2026-01-20',
    lastActivity: '2026-02-18',
    surveyRespondents: 8,
    surveyTarget: 50,
    dgReceived: false,
    checklist: {
      appel_lancement: true,
      bloc1: true, bloc2: true, bloc3: false, bloc4: false,
      sondage: false, dg: false,
      ia_generated: false, validated: false,
      restitution_planned: false, unlocked: false,
    },
  },
  {
    id: 'diag-004',
    company: 'Alimentaire Bio Co.',
    contactEmail: 'rse@bioco.fr',
    analyst: 'Julie Dupont',
    status: 'restitution',
    sector: 'Agroalimentaire',
    headcount: '251-500',
    revenue: '50-200M',
    createdAt: '2025-11-05',
    lastActivity: '2026-02-19',
    surveyRespondents: 38,
    surveyTarget: 30,
    dgReceived: true,
    checklist: {
      appel_lancement: true,
      bloc1: true, bloc2: true, bloc3: true, bloc4: true,
      sondage: true, dg: true,
      ia_generated: true, validated: true,
      restitution_planned: true, unlocked: false,
    },
  },
  {
    id: 'diag-005',
    company: 'Néo-Énergie',
    contactEmail: 'contact@neoenergie.fr',
    analyst: 'Thomas Moreau',
    status: 'onboarding',
    sector: 'Énergie',
    headcount: '11-50',
    revenue: '1-10M',
    createdAt: '2026-02-10',
    lastActivity: '2026-02-10',
    surveyRespondents: 0,
    surveyTarget: 10,
    dgReceived: false,
    checklist: {
      appel_lancement: false,
      bloc1: false, bloc2: false, bloc3: false, bloc4: false,
      sondage: false, dg: false,
      ia_generated: false, validated: false,
      restitution_planned: false, unlocked: false,
    },
  },
]

// Admin KPIs
export const MOCK_ADMIN_KPIS = {
  activeDiagnostics: MOCK_DIAGNOSTICS.filter(d => d.status !== 'delivered').length,
  awaitingRestitution: MOCK_DIAGNOSTICS.filter(d => d.status === 'restitution').length,
  avgSurveyRate: 76,
  avgDaysPerDiagnostic: 42,
}

// Stats
export const MOCK_STATS = {
  statusDistribution: [
    { status: 'Onboarding', count: 1 },
    { status: 'Questionnaire', count: 1 },
    { status: 'Analyse', count: 1 },
    { status: 'Restitution', count: 1 },
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
