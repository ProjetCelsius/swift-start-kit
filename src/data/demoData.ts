// ============================================
// BOUSSOLE CLIMAT — Complete Demo Data
// Single diagnostic: Maison Duval, 6-step progression
// ============================================

export type DemoStep = 1 | 2 | 3 | 4 | 5 | 6
export type DemoStatus = 'onboarding' | 'questionnaire' | 'survey_pending' | 'analysis' | 'ready_for_restitution' | 'delivered'
export type DemoRole = 'client' | 'admin' | 'guest'

export const STEP_LABELS: Record<DemoStep, string> = {
  1: 'Questionnaire en cours',
  2: 'Questionnaire terminé',
  3: 'Sondage en cours',
  4: 'Données complètes',
  5: 'Analyse en cours',
  6: 'Diagnostic livré',
}

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

export interface DemoDocuments {
  files: { name: string; size: string; date: string; type: 'pdf' | 'excel' | 'image' | 'other' }[]
  notes: string
  corpus_validated?: boolean
  validation_date?: string
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
  documents: DemoDocuments
  bloc1Completed: boolean
  bloc2Completed: boolean
  bloc3Completed: boolean
  bloc4Completed: boolean
  profilClimat?: {
    code: string
    name: string
    phrase: string
    family: string
  }
}

// ────────────────────────────────────────────────
// MAISON DUVAL — Full diagnostic data (step 6 = delivered)
// ────────────────────────────────────────────────

const MAISON_DUVAL: DemoDiagnostic = {
  id: 'demo-duval',
  status: 'delivered',
  organization: {
    name: 'Maison Duval',
    sector: 'Hébergement et restauration',
    naf: 'I — Hébergement et restauration',
    headcount: '251–500',
    revenue: '50–200 M€',
    sites: '12 (Paris, Lyon, Bordeaux, Nice, Strasbourg, + 7 régions)',
    rseStartYear: 2020,
    contact: { name: 'Sophie Duval-Martin', title: 'Directrice Générale', email: 'sophie@maison-duval.fr' },
    analyst: { name: 'Guillaume Pakula', title: 'Analyste climat senior', initials: 'GP' },
  },
  bloc1: {
    tiles: {
      bilan_carbone: { status: 'done', comment: 'BC complet scopes 1-2-3 réalisé en 2024 par Carbone 4' },
      strategie_climat: { status: 'done', comment: 'Stratégie « Duval 2030 » intégrée au plan stratégique' },
      objectifs_reduction: { status: 'done', comment: '-35% sur scopes 1-2 d\'ici 2030, -20% scope 3 achats alimentaires' },
      rapport_rse: { status: 'done', comment: 'Premier rapport RSE publié en 2021, annuel depuis' },
      certification: { status: 'done', comment: 'Clef Verte sur 8/12 établissements' },
      formation: { status: 'done', comment: '100% des managers formés, programme « Cuisine Responsable » pour les chefs' },
      eco_conception: { status: 'done', comment: 'Menus éco-conçus, score carbone affiché depuis 2023' },
      achats_responsables: { status: 'done', comment: '85% approvisionnement local, charte fournisseurs signée' },
      mobilite: { status: 'done', comment: 'Flotte 100% hybride/électrique, forfait mobilité pour tous' },
      acv: { status: 'in_progress', comment: 'ACV en cours sur les menus signatures' },
      compensation: { status: 'in_progress', comment: 'Partenariat reforestation en discussion' },
      initiatives_collectives: { status: 'not_started' },
    },
    headcount: '251–500',
    revenue: '50–200 M€',
    naf: 'I — Hébergement et restauration',
  },
  bloc1Completed: true,
  bloc2: {
    responses: [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 4, 3, 3, 3],
    scores: { gouvernance: 78, mesure: 65, strategie: 72, culture: 69, global: 71 },
    letters: { gouvernance: 'A', mesure: 'B', strategie: 'A', culture: 'B', global: 'A' },
  },
  bloc2Completed: true,
  bloc3: {
    q21_drivers: ['Conviction direction', 'Attentes clients', 'Attractivité employeur', 'Anticipation réglementaire'],
    q22_barrier: 'Coût de la transition sur les achats alimentaires (local + bio = +25% sur les matières premières)',
    q23_regulatory: {
      csrd: 'Sous 12 mois',
      beges: 'Déjà concerné',
      taxonomie: 'Sous 2-3 ans',
      vigilance: 'Pas concerné',
      donneurs_ordre: 'Sous 12 mois',
      affichage: 'Déjà concerné',
    },
    q24_lost_tender: false,
    q25_carte_blanche: 'Transformer chaque établissement en ambassadeur de la cuisine responsable',
    q26_ambition: 'Que « Maison Duval » soit synonyme de gastronomie durable en France',
    q27_confidential: 'Le surcoût de l\'approvisionnement local met la marge sous pression. On tient par conviction mais ce n\'est pas tenable indéfiniment sans revalorisation.',
    completed: true,
  },
  bloc3Completed: true,
  bloc4: {
    partA: [8, 7, 6, 8, 9, 7, 6, 8],
    partB: [6, 5, 5, 7, 7, 5, 4, 6],
    partC: [15, 30, 30, 18, 7],
    completed: true,
  },
  bloc4Completed: true,
  survey: {
    respondents: 45,
    target: 40,
    averages: [7.1, 6.5, 5.8, 7.3, 8.0, 6.2, 5.1, 6.8],
    profiles: [12, 28, 32, 20, 8],
    verbatims: [
      'Sophie porte le sujet avec une vraie sincérité. Ça se voit dans les choix quotidiens.',
      'Le score carbone sur les menus, c\'est concret. On voit l\'impact de nos choix.',
      'Il faudrait étendre la démarche aux prestataires de nettoyage aussi.',
      'Les clients demandent de plus en plus d\'infos sur la provenance. On est bien armés.',
      'Le tri et le compostage fonctionnent bien. Mais le gaspillage alimentaire reste un sujet.',
      'Fiers de travailler dans une maison qui prend ça au sérieux.',
    ],
    dailyResponses: [
      { day: 'Lun', count: 8 }, { day: 'Mar', count: 12 }, { day: 'Mer', count: 9 },
      { day: 'Jeu', count: 7 }, { day: 'Ven', count: 5 }, { day: 'Lun', count: 3 }, { day: 'Mar', count: 1 },
    ],
  },
  dg: {
    received: true,
    dg1: 'Le climat est au cœur de notre identité de marque. Nos clients viennent chez nous aussi pour nos valeurs. C\'est un avantage concurrentiel réel.',
    dg2: 'Le scope 3 alimentaire est notre défi principal. Chaque produit local coûte plus cher, mais nos clients comprennent et acceptent le premium.',
    dg3: 'Budget RSE de 350k€/an. L\'objectif est de l\'intégrer complètement au P&L plutôt que de le traiter comme un coût séparé.',
    dg4: 'On est parmi les meilleurs de l\'hôtellerie-restauration en France. Mais la barre monte vite et il faut garder l\'avance.',
    dg5: 8,
  },
  documents: {
    files: [
      { name: 'Bilan Carbone 2024 - Maison Duval.pdf', size: '3.8 Mo', date: '20/01/2025', type: 'pdf' },
      { name: 'Rapport RSE 2023.pdf', size: '12.4 Mo', date: '20/01/2025', type: 'pdf' },
      { name: 'Stratégie Duval 2030.pdf', size: '2.1 Mo', date: '22/01/2025', type: 'pdf' },
      { name: 'Organigramme équipe RSE.xlsx', size: '0.4 Mo', date: '22/01/2025', type: 'excel' },
      { name: 'Budget RSE 2024-2025.xlsx', size: '0.6 Mo', date: '25/01/2025', type: 'excel' },
    ],
    notes: 'La certification Clef Verte est en cours de renouvellement pour les 4 derniers établissements. Dossiers complets attendus pour avril 2025.',
    corpus_validated: true,
    validation_date: '2026-01-20',
  },
  journal: [
    {
      id: 'jc1', author: 'analyst', authorName: 'Guillaume',
      date: new Date(Date.now() - 25 * 86400_000),
      text: "Bienvenue Sophie ! Votre engagement est déjà très visible. Hâte de structurer tout ça.",
      badge: 'Étape : Démarrage', badgeColor: '#2D7A50',
    },
    {
      id: 'jc2', author: 'analyst', authorName: 'Guillaume',
      date: new Date(Date.now() - 18 * 86400_000),
      text: "Tous les questionnaires sont remplis. Profil A/B — excellent. Le sondage dépasse l'objectif avec 45 réponses !",
      badge: 'Étape : Analyse', badgeColor: '#1B4332',
    },
    {
      id: 'jc3', author: 'analyst', authorName: 'Guillaume',
      date: new Date(Date.now() - 7 * 86400_000),
      text: "Votre diagnostic est prêt. 9 sections d'analyse personnalisées vous attendent. Prenons RDV pour la restitution.",
      badge: 'Étape : Diagnostic prêt', badgeColor: '#1B4332',
    },
    {
      id: 'jc4', author: 'analyst', authorName: 'Guillaume',
      date: new Date(Date.now() - 3 * 86400_000),
      text: "Restitution réalisée. Merci pour cet échange riche. N'hésitez pas si vous avez des questions sur les recommandations.",
      badge: 'Étape : Terminé', badgeColor: '#1B4332',
    },
  ],
  messages: [
    {
      id: 'mc1', author: 'client', authorName: 'Sophie Duval-Martin',
      date: new Date(Date.now() - 10 * 86400_000),
      text: "Guillaume, le taux de réponse au sondage est impressionnant. L'équipe est vraiment mobilisée !",
    },
    {
      id: 'mc2', author: 'analyst', authorName: 'Guillaume Pakula',
      date: new Date(Date.now() - 10 * 86400_000 + 3600_000),
      text: "Oui, 45 réponses pour un objectif de 40, c'est excellent ! Les verbatims sont très riches aussi. Ça va nourrir le diagnostic.",
    },
  ],
  diagnosticUnlocked: true,
  diagnosticSections: Array(9).fill({ status: 'validated' as const }),
  checklist: {
    appel_lancement: true,
    bloc1: true, bloc2: true, bloc3: true, bloc4: true,
    sondage: true, dg: true,
    ia_generated: true, validated: true,
    restitution_planned: true, unlocked: true,
  },
  profilClimat: {
    code: 'S · M · F · D',
    name: 'Les fondations sont là',
    phrase: '« On fait les choses dans les règles, et on les fait bien. »',
    family: 'Famille des Méthodiques',
  },
}

// ────────────────────────────────────────────────
// Step-based diagnostic builder
// Returns a view of MAISON_DUVAL with visibility based on step
// ────────────────────────────────────────────────

export function buildDiagnosticAtStep(base: DemoDiagnostic, step: DemoStep): DemoDiagnostic {
  switch (step) {
    case 1: // Questionnaire en cours — blocs 1-2 done, bloc3 partial
      return {
        ...base,
        status: 'questionnaire',
        bloc3Completed: false,
        bloc3: { ...base.bloc3, completed: false, q25_carte_blanche: undefined, q26_ambition: undefined, q27_confidential: undefined },
        bloc4Completed: false,
        bloc4: { ...base.bloc4, partA: [], partB: [], partC: [], completed: false },
        survey: { ...base.survey, respondents: 0, averages: [], profiles: [], verbatims: [], dailyResponses: [] },
        dg: { received: false },
        documents: { ...base.documents, corpus_validated: false, validation_date: undefined },
        diagnosticUnlocked: false,
        diagnosticSections: Array(9).fill({ status: 'empty' as const }),
        checklist: { ...base.checklist, bloc3: false, bloc4: false, sondage: false, dg: false, ia_generated: false, validated: false, restitution_planned: false, unlocked: false },
        profilClimat: undefined,
        journal: base.journal.slice(0, 1),
      }

    case 2: // Questionnaire terminé — all blocs done, profil climat visible
      return {
        ...base,
        status: 'questionnaire',
        survey: { ...base.survey, respondents: 0, averages: [], profiles: [], verbatims: [], dailyResponses: [] },
        dg: { received: false },
        documents: { ...base.documents, corpus_validated: false, validation_date: undefined },
        diagnosticUnlocked: false,
        diagnosticSections: Array(9).fill({ status: 'empty' as const }),
        checklist: { ...base.checklist, sondage: false, dg: false, ia_generated: false, validated: false, restitution_planned: false, unlocked: false },
        journal: base.journal.slice(0, 2),
      }

    case 3: // Sondage en cours — 23/40 responses
      return {
        ...base,
        status: 'survey_pending',
        survey: {
          ...base.survey,
          respondents: 23,
          dailyResponses: base.survey.dailyResponses.slice(0, 4),
        },
        dg: { received: false },
        documents: { ...base.documents, corpus_validated: false, validation_date: undefined },
        diagnosticUnlocked: false,
        diagnosticSections: Array(9).fill({ status: 'empty' as const }),
        checklist: { ...base.checklist, sondage: false, dg: false, ia_generated: false, validated: false, restitution_planned: false, unlocked: false },
        journal: [
          ...base.journal.slice(0, 2),
          {
            id: 'jc-step3', author: 'analyst' as const, authorName: 'Guillaume',
            date: new Date(Date.now() - 12 * 86400_000),
            text: "Sondage lancé ! 23 réponses déjà reçues, bonne mobilisation. On attend encore quelques jours.",
            badge: 'Étape : Sondage', badgeColor: '#B87333',
          },
        ],
      }

    case 4: // Données complètes — 45/40, DG reçu, documents validés
      return {
        ...base,
        status: 'survey_pending',
        diagnosticUnlocked: false,
        diagnosticSections: Array(9).fill({ status: 'empty' as const }),
        checklist: { ...base.checklist, ia_generated: false, validated: false, restitution_planned: false, unlocked: false },
        journal: [
          ...base.journal.slice(0, 2),
          {
            id: 'jc-step4', author: 'analyst' as const, authorName: 'Guillaume',
            date: new Date(Date.now() - 8 * 86400_000),
            text: "Toutes les données sont reçues : 45 réponses au sondage, réponse DG, documents validés. Je passe en phase d'analyse.",
            badge: 'Données complètes', badgeColor: '#2D7A50',
          },
        ],
      }

    case 5: // Analyse en cours
      return {
        ...base,
        status: 'analysis',
        diagnosticUnlocked: false,
        diagnosticSections: Array(9).fill({ status: 'empty' as const }),
        checklist: { ...base.checklist, ia_generated: false, validated: false, restitution_planned: false, unlocked: false },
        journal: [
          ...base.journal.slice(0, 2),
          {
            id: 'jc-step5a', author: 'analyst' as const, authorName: 'Guillaume',
            date: new Date(Date.now() - 5 * 86400_000),
            text: "Toutes les données sont reçues. Je m'y plonge — comptez 48h pour votre diagnostic.",
            badge: 'Données complètes', badgeColor: '#2D7A50',
          },
          {
            id: 'jc-step5b', author: 'analyst' as const, authorName: 'Guillaume',
            date: new Date(Date.now() - 2 * 86400_000),
            text: "L'analyse est en cours. Je croise vos réponses avec les benchmarks sectoriels. Résultats très bientôt.",
            badge: 'Analyse en cours', badgeColor: '#B87333',
          },
        ],
      }

    case 6: // Diagnostic livré — état complet
    default:
      return base
  }
}

// ── Exports ──────────────────────────────────────

export const MAISON_DUVAL_FULL = MAISON_DUVAL

/** @deprecated Use MAISON_DUVAL_FULL + buildDiagnosticAtStep instead */
export const DEMO_DIAGNOSTICS: DemoDiagnostic[] = [MAISON_DUVAL]

export function getDemoDiagnostic(_id: string): DemoDiagnostic | undefined {
  return MAISON_DUVAL
}

export const DEMO_ADMIN_KPIS = {
  activeDiagnostics: 7,
  awaitingRestitution: 2,
  avgSurveyRate: 76,
  avgDaysPerDiagnostic: 12,
}
