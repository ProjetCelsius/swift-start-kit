// ============================================
// BOUSSOLE CLIMAT — Complete Demo Data
// ============================================

export type DemoStatus = 'onboarding' | 'questionnaire' | 'survey_pending' | 'analysis' | 'ready_for_restitution' | 'delivered'
export type DemoRole = 'client' | 'admin' | 'guest'

export interface DemoOrganization {
  name: string
  sector: string
  naf: string
  headcount: string
  revenue: string
  sites: string
  rseStartYear: number
  contact: { name: string; title: string; email: string }
  analyst: { name: string; title: string; initials: string }
}

export interface DemoBloc1 {
  tiles: Record<string, { status: 'done' | 'in_progress' | 'not_started'; comment?: string }>
  headcount: string
  revenue: string
  naf: string
}

export interface DemoBloc2 {
  responses: number[] // 20 values, 1-4
  scores: { gouvernance: number; mesure: number; strategie: number; culture: number; global: number }
  letters: { gouvernance: string; mesure: string; strategie: string; culture: string; global: string }
}

export interface DemoBloc3 {
  q21_drivers: string[]
  q22_barrier: string
  q23_regulatory: Record<string, string>
  q24_lost_tender: boolean
  q24_tender_detail?: string
  q25_carte_blanche?: string
  q26_ambition?: string
  q27_confidential?: string
  completed: boolean
}

export interface DemoBloc4 {
  partA: number[] // P1-P8
  partB: number[] // predictions
  partC: number[] // 5 population %
  completed: boolean
}

export interface DemoSurvey {
  respondents: number
  target: number
  averages: number[] // S1-S8
  profiles: number[] // 5 population %
  verbatims: string[]
  dailyResponses: { day: string; count: number }[]
}

export interface DemoDG {
  received: boolean
  dg1?: string
  dg2?: string
  dg3?: string
  dg4?: string
  dg5?: number
}

export interface DemoJournalEntry {
  id: string
  author: 'analyst' | 'client'
  authorName: string
  date: Date
  text: string
  badge?: string
  badgeColor?: string
}

export interface DemoMessage {
  id: string
  author: 'analyst' | 'client'
  authorName: string
  date: Date
  text: string
}

export interface DemoDiagnosticSection {
  status: 'empty' | 'draft' | 'validated'
  content?: any
}

export interface DemoDiagnostic {
  id: string
  status: DemoStatus
  organization: DemoOrganization
  bloc1: DemoBloc1
  bloc2: DemoBloc2
  bloc3: DemoBloc3
  bloc4: DemoBloc4
  survey: DemoSurvey
  dg: DemoDG
  journal: DemoJournalEntry[]
  messages: DemoMessage[]
  diagnosticUnlocked: boolean
  diagnosticSections: DemoDiagnosticSection[]
  checklist: Record<string, boolean>
  // Section-specific data for delivered diagnostics
  synthesis?: string[]
  priorities?: any[]
  antiRecommendation?: { title: string; text: string }
  maturity?: any
  perceptionGaps?: any
  humanCapital?: any
  footprint?: any
  deadlines?: any[]
  tileEnrichments?: Record<string, { status: string; relevance: string }>
  quarterlyPlan?: any[]
}

// ────────────────────────────────────────────────
// DIAGNOSTIC A — NovaTech Solutions (questionnaire)
// ────────────────────────────────────────────────

const DIAG_A: DemoDiagnostic = {
  id: 'demo-novatech',
  status: 'questionnaire',
  organization: {
    name: 'NovaTech Solutions',
    sector: 'Édition de logiciels',
    naf: '5829C',
    headcount: '251-500',
    revenue: '10-50M',
    sites: '3 (Paris, Lyon, Nantes)',
    rseStartYear: 2022,
    contact: { name: 'Marie Delcourt', title: 'Directrice RSE', email: 'marie.delcourt@novatech.fr' },
    analyst: { name: 'Thomas Renaud', title: 'Analyste climat senior', initials: 'TR' },
  },
  bloc1: {
    tiles: {
      bilan_carbone: { status: 'done', comment: 'Réalisé en 2023 par Celsius, scopes 1-2-3' },
      strategie_climat: { status: 'in_progress', comment: 'En cours de formalisation avec le COMEX' },
      objectifs_reduction: { status: 'not_started' },
      rapport_rse: { status: 'done', comment: 'Première année de reporting CSRD' },
      certification: { status: 'not_started' },
      formation: { status: 'done', comment: 'Fresque du Climat pour 200 collaborateurs en 2023' },
      eco_conception: { status: 'in_progress', comment: 'Démarche initiée sur 2 produits phares' },
      achats_responsables: { status: 'done', comment: 'En cours d\'intégration dans les processus achats' },
      mobilite: { status: 'in_progress', comment: 'Forfait mobilité durable en place, plan vélo à l\'étude' },
      acv: { status: 'not_started' },
      compensation: { status: 'done', comment: 'Budget RSE dédié de 80k€/an' },
      initiatives_collectives: { status: 'done', comment: '1 ETP dédié RSE depuis 2022' },
    },
    headcount: '251-500',
    revenue: '10-50M',
    naf: '5829C',
  },
  bloc2: {
    responses: [3, 2, 3, 2, 3, 2, 2, 3, 2, 1, 2, 1, 2, 1, 1, 2, 3, 2, 2, 3],
    scores: { gouvernance: 60, mesure: 47, strategie: 33, culture: 53, global: 48 },
    letters: { gouvernance: 'B', mesure: 'C', strategie: 'C', culture: 'B', global: 'C' },
  },
  bloc3: {
    q21_drivers: ['Conformité réglementaire', 'Attractivité employeur', 'Conviction direction'],
    q22_barrier: 'Manque de temps / priorités concurrentes',
    q23_regulatory: {
      csrd: 'Sous 12 mois',
      beges: 'Déjà concerné',
      taxonomie: 'Sous 2-3 ans',
      vigilance: 'Pas concerné',
      donneurs_ordre: 'Sous 12 mois',
      affichage: 'Je ne sais pas',
    },
    q24_lost_tender: false,
    completed: false,
  },
  bloc4: {
    partA: [],
    partB: [],
    partC: [],
    completed: false,
  },
  survey: {
    respondents: 0,
    target: 30,
    averages: [],
    profiles: [],
    verbatims: [],
    dailyResponses: [],
  },
  dg: { received: false },
  journal: [
    {
      id: 'ja1',
      author: 'analyst',
      authorName: 'Thomas',
      date: new Date(Date.now() - 3 * 86400_000),
      text: "Bienvenue Marie ! J'ai bien reçu vos accès. On se retrouve jeudi pour l'appel de lancement. N'hésitez pas si vous avez des questions d'ici là.",
      badge: 'Étape : Démarrage',
      badgeColor: '#2D7A50',
    },
    {
      id: 'ja2',
      author: 'analyst',
      authorName: 'Thomas',
      date: new Date(Date.now() - 1 * 86400_000),
      text: "Appel de lancement réalisé. Bloc 1 rempli ensemble. Bonne base de départ — votre BC 2023 est de bonne qualité. Je note que la stratégie climat est en cours de formalisation, on en reparlera dans l'analyse.",
      badge: 'Étape : Questionnaire en cours',
      badgeColor: '#E8734A',
    },
  ],
  messages: [
    {
      id: 'ma1',
      author: 'client',
      authorName: 'Marie Delcourt',
      date: new Date(Date.now() - 2 * 86400_000),
      text: "Bonjour Thomas, est-ce que je peux remplir les blocs dans le désordre ou il faut suivre l'ordre ?",
    },
    {
      id: 'ma2',
      author: 'analyst',
      authorName: 'Thomas Renaud',
      date: new Date(Date.now() - 2 * 86400_000 + 3600_000),
      text: "Vous pouvez tout à fait commencer par le bloc qui vous inspire le plus ! Seul le Bloc 1 devait être fait en premier (c'est chose faite). Bonne continuation.",
    },
  ],
  diagnosticUnlocked: false,
  diagnosticSections: Array(9).fill({ status: 'empty' as const }),
  checklist: {
    appel_lancement: true,
    bloc1: true, bloc2: true, bloc3: false, bloc4: false,
    sondage: false, dg: false,
    ia_generated: false, validated: false,
    restitution_planned: false, unlocked: false,
  },
}



// ── Exports ──────────────────────────────────────

export const DEMO_DIAGNOSTICS: DemoDiagnostic[] = [DIAG_A]

export function getDemoDiagnostic(id: string): DemoDiagnostic | undefined {
  return DEMO_DIAGNOSTICS.find(d => d.id === id)
}

export const DEMO_ADMIN_KPIS = {
  activeDiagnostics: 7,
  awaitingRestitution: 2,
  avgSurveyRate: 76,
  avgDaysPerDiagnostic: 12,
}
