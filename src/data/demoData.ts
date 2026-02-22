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
  // Bloc completion flags
  bloc1Completed: boolean
  bloc2Completed: boolean
  bloc3Completed: boolean
  bloc4Completed: boolean // Perception RSE
  // Profil Climat
  profilClimat?: {
    code: string // e.g. "S·M·F·D"
    name: string
    phrase: string
    family: string
  }
}

// ────────────────────────────────────────────────
// DIAGNOSTIC A — NovaTech Solutions (questionnaire en cours)
// ────────────────────────────────────────────────

const DIAG_A: DemoDiagnostic = {
  id: 'demo-novatech',
  status: 'questionnaire',
  organization: {
    name: 'NovaTech Solutions',
    sector: 'Information et communication',
    naf: 'J — Information et communication',
    headcount: '51–250',
    revenue: '10–50 M€',
    sites: '2 (Paris, Lyon)',
    rseStartYear: 2022,
    contact: { name: 'Marie Delcourt', title: 'Directrice RSE', email: 'marie.delcourt@novatech.fr' },
    analyst: { name: 'Guillaume Pakula', title: 'Analyste climat senior', initials: 'GP' },
  },
  bloc1: {
    tiles: {
      bilan_carbone: { status: 'done', comment: 'Réalisé en 2023 par Celsius, scopes 1-2-3' },
      strategie_climat: { status: 'not_started' },
      objectifs_reduction: { status: 'not_started' },
      rapport_rse: { status: 'not_started' },
      certification: { status: 'not_started' },
      formation: { status: 'in_progress', comment: 'Fresque du Climat prévue Q2 2025' },
      eco_conception: { status: 'not_started' },
      achats_responsables: { status: 'not_started' },
      mobilite: { status: 'not_started' },
      acv: { status: 'not_started' },
      compensation: { status: 'not_started' },
      initiatives_collectives: { status: 'not_started' },
    },
    headcount: '51–250',
    revenue: '10–50 M€',
    naf: 'J — Information et communication',
  },
  bloc1Completed: true,
  bloc2: {
    responses: [2, 3, 2, 2, 3, 2, 3, 2, 2, 3, 2, 2, 3, 2, 1, 2, 3, 2, 3, 2],
    scores: { gouvernance: 45, mesure: 52, strategie: 38, culture: 55, global: 48 },
    letters: { gouvernance: 'C', mesure: 'C', strategie: 'D', culture: 'B', global: 'C' },
  },
  bloc2Completed: true,
  bloc3: {
    q21_drivers: ['Conformité réglementaire', 'Attractivité employeur'],
    q22_barrier: 'Manque de temps / priorités concurrentes',
    q23_regulatory: {
      csrd: 'Sous 12 mois',
      beges: 'Pas concerné',
      taxonomie: 'Je ne sais pas',
    },
    q24_lost_tender: false,
    completed: false, // 3/7 questions answered
  },
  bloc3Completed: false,
  bloc4: {
    partA: [],
    partB: [],
    partC: [],
    completed: false,
  },
  bloc4Completed: false,
  survey: {
    respondents: 0,
    target: 30,
    averages: [],
    profiles: [],
    verbatims: [],
    dailyResponses: [],
  },
  dg: { received: false },
  documents: { files: [], notes: '', corpus_validated: false },
  journal: [
    {
      id: 'ja1', author: 'analyst', authorName: 'Guillaume',
      date: new Date(Date.now() - 3 * 86400_000),
      text: "Bienvenue Marie ! J'ai bien reçu vos accès. On se retrouve jeudi pour l'appel de lancement.",
      badge: 'Étape : Démarrage', badgeColor: '#2D7A50',
    },
    {
      id: 'ja2', author: 'analyst', authorName: 'Guillaume',
      date: new Date(Date.now() - 1 * 86400_000),
      text: "Appel de lancement réalisé. Bloc 1 rempli ensemble. Bonne base — votre BC 2023 est solide.",
      badge: 'Étape : Questionnaire en cours', badgeColor: '#E8734A',
    },
  ],
  messages: [
    {
      id: 'ma1', author: 'client', authorName: 'Marie Delcourt',
      date: new Date(Date.now() - 2 * 86400_000),
      text: "Bonjour Guillaume, est-ce que je peux remplir les blocs dans le désordre ?",
    },
    {
      id: 'ma2', author: 'analyst', authorName: 'Guillaume Pakula',
      date: new Date(Date.now() - 2 * 86400_000 + 3600_000),
      text: "Vous pouvez tout à fait ! Seul le Bloc 1 devait être fait en premier (c'est chose faite).",
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
  profilClimat: undefined, // Not yet revealed (bloc3 not done)
}

// ────────────────────────────────────────────────
// DIAGNOSTIC B — Groupe Méridien (analysis)
// ────────────────────────────────────────────────

const DIAG_B: DemoDiagnostic = {
  id: 'demo-meridien',
  status: 'analysis',
  organization: {
    name: 'Groupe Méridien',
    sector: 'Industrie manufacturière',
    naf: 'C — Industrie manufacturière',
    headcount: '501–1 000',
    revenue: '50–200 M€',
    sites: '4 (Toulouse, Bordeaux, Marseille, Lille)',
    rseStartYear: 2019,
    contact: { name: 'Jean-Marc Fournier', title: 'Directeur Développement Durable', email: 'jm.fournier@meridien-group.com' },
    analyst: { name: 'Guillaume Pakula', title: 'Analyste climat senior', initials: 'GP' },
  },
  bloc1: {
    tiles: {
      bilan_carbone: { status: 'done', comment: 'BEGES réglementaire + BC volontaire scopes 1-2-3, réalisé en 2024 par Bureau Veritas' },
      strategie_climat: { status: 'done', comment: 'Stratégie climat 2030 validée par le CA en 2023' },
      objectifs_reduction: { status: 'done', comment: 'SBTi near-term validé, -42% scopes 1-2 d\'ici 2030' },
      rapport_rse: { status: 'done', comment: 'DPEF publiée depuis 2020, transition CSRD en cours' },
      certification: { status: 'done', comment: 'ISO 14001 sur 3 sites, en cours sur le 4ème' },
      formation: { status: 'done', comment: 'Programme annuel : Fresque + ateliers métiers, 450 formés' },
      eco_conception: { status: 'in_progress', comment: 'Pilote ACV sur 2 gammes de produits' },
      achats_responsables: { status: 'done', comment: 'Charte achats responsables depuis 2021, 78% fournisseurs évalués' },
      mobilite: { status: 'in_progress', comment: 'Plan de mobilité en déploiement, bornes de recharge installées' },
      acv: { status: 'in_progress', comment: 'ACV en cours sur produits phares' },
      compensation: { status: 'not_started' },
      initiatives_collectives: { status: 'not_started' },
    },
    headcount: '501–1 000',
    revenue: '50–200 M€',
    naf: 'C — Industrie manufacturière',
  },
  bloc1Completed: true,
  bloc2: {
    responses: [3, 3, 3, 2, 3, 2, 2, 3, 3, 2, 2, 3, 3, 2, 2, 3, 4, 3, 3, 3],
    scores: { gouvernance: 62, mesure: 48, strategie: 55, culture: 71, global: 62 },
    letters: { gouvernance: 'B', mesure: 'C', strategie: 'B', culture: 'A', global: 'B' },
  },
  bloc2Completed: true,
  bloc3: {
    q21_drivers: ['Conformité réglementaire', 'Pression des donneurs d\'ordre', 'Conviction direction', 'Attractivité employeur'],
    q22_barrier: 'Complexité de la supply chain / scope 3',
    q23_regulatory: {
      csrd: 'Déjà concerné',
      beges: 'Déjà concerné',
      taxonomie: 'Sous 12 mois',
      vigilance: 'Sous 2-3 ans',
      donneurs_ordre: 'Déjà concerné',
      affichage: 'Sous 2-3 ans',
    },
    q24_lost_tender: true,
    q24_tender_detail: 'Appel d\'offres automobile perdu en 2024 faute de trajectoire scope 3 formalisée',
    q25_carte_blanche: 'Embarquer les fournisseurs de rang 1 dans une trajectoire commune',
    q26_ambition: 'Devenir la référence industrielle bas-carbone du secteur d\'ici 2030',
    q27_confidential: 'Le CA hésite à investir dans la capture carbone — sujet sensible en interne',
    completed: true,
  },
  bloc3Completed: true,
  bloc4: {
    partA: [7, 6, 5, 7, 8, 6, 5, 7],
    partB: [5, 4, 4, 5, 6, 4, 3, 5],
    partC: [10, 25, 35, 20, 10],
    completed: true,
  },
  bloc4Completed: true,
  survey: {
    respondents: 23,
    target: 30,
    averages: [6.2, 5.8, 4.9, 6.5, 7.1, 5.3, 4.2, 6.0],
    profiles: [8, 22, 38, 24, 8],
    verbatims: [
      'On fait beaucoup de choses mais on ne sait pas mesurer l\'impact.',
      'La direction est sincèrement engagée, ça se sent.',
      'Il faudrait plus de formation concrète sur nos métiers.',
      'Le tri des déchets c\'est bien, mais les vrais enjeux sont sur la supply chain.',
      'On a l\'impression que c\'est surtout du reporting obligatoire.',
    ],
    dailyResponses: [
      { day: 'Lun', count: 5 }, { day: 'Mar', count: 8 }, { day: 'Mer', count: 4 },
      { day: 'Jeu', count: 3 }, { day: 'Ven', count: 2 }, { day: 'Lun', count: 1 },
    ],
  },
  dg: {
    received: true,
    dg1: 'Le climat est un risque stratégique majeur pour notre secteur. Nos clients automobiles exigent des trajectoires chiffrées, c\'est une condition de survie commerciale.',
    dg2: 'La supply chain scope 3 est notre point faible. 73% de nos émissions y sont concentrées et nous n\'avons pas encore les outils pour piloter ça efficacement.',
    dg3: 'On a investi 2,3M€ dans l\'efficacité énergétique en 2024. L\'objectif est de doubler pour la capture carbone en 2026, mais le CA est partagé.',
    dg4: 'Honnêtement, je pense qu\'on est en avance sur la plupart de nos concurrents directs. Mais par rapport aux attentes sociétales, on est en retard.',
    dg5: 7,
  },
  documents: {
    files: [
      { name: 'Bilan GES 2024 - Groupe Méridien.pdf', size: '4.2 Mo', date: '03/02/2025', type: 'pdf' },
      { name: 'Rapport DPEF 2023.pdf', size: '8.7 Mo', date: '03/02/2025', type: 'pdf' },
      { name: 'Organigramme RSE.xlsx', size: '0.3 Mo', date: '05/02/2025', type: 'excel' },
    ],
    notes: 'La stratégie climat 2030 est en cours de révision suite aux nouvelles exigences CSRD. Document à jour prévu pour mars 2025.',
    corpus_validated: true,
    validation_date: '2026-02-08',
  },
  journal: [
    {
      id: 'jb1', author: 'analyst', authorName: 'Guillaume',
      date: new Date(Date.now() - 12 * 86400_000),
      text: "Bienvenue Jean-Marc ! Votre profil est intéressant — un groupe industriel avec des bases solides. Hâte de creuser.",
      badge: 'Étape : Démarrage', badgeColor: '#2D7A50',
    },
    {
      id: 'jb2', author: 'analyst', authorName: 'Guillaume',
      date: new Date(Date.now() - 8 * 86400_000),
      text: "Questionnaire terminé — profil B avec un beau score culture. Le sondage est lancé, 23 réponses déjà. Excellente mobilisation !",
      badge: 'Étape : Analyse en cours', badgeColor: '#B87333',
    },
    {
      id: 'jb3', author: 'analyst', authorName: 'Guillaume',
      date: new Date(Date.now() - 2 * 86400_000),
      text: "J'ai bien reçu toutes vos données et la réponse DG. Je m'y plonge — comptez 48h pour votre diagnostic.",
      badge: 'Étape : Analyse', badgeColor: '#1B4332',
    },
  ],
  messages: [
    {
      id: 'mb1', author: 'client', authorName: 'Jean-Marc Fournier',
      date: new Date(Date.now() - 5 * 86400_000),
      text: "Guillaume, le DG a bien répondu au questionnaire. Par contre il a demandé que la partie scope 3 reste confidentielle.",
    },
    {
      id: 'mb2', author: 'analyst', authorName: 'Guillaume Pakula',
      date: new Date(Date.now() - 5 * 86400_000 + 7200_000),
      text: "Bien noté Jean-Marc. La confidentialité sera respectée dans le diagnostic. Ces éléments n'apparaîtront que dans la section DG confidentielle.",
    },
  ],
  diagnosticUnlocked: false,
  diagnosticSections: Array(9).fill({ status: 'empty' as const }),
  checklist: {
    appel_lancement: true,
    bloc1: true, bloc2: true, bloc3: true, bloc4: true,
    sondage: true, dg: true,
    ia_generated: false, validated: false,
    restitution_planned: false, unlocked: false,
  },
  profilClimat: {
    code: 'C · A · V · O',
    name: 'Le premier de cordée',
    phrase: '« On ouvre la voie, même quand le sentier n\'est pas balisé. »',
    family: 'Famille des Pionniers',
  },
}

// ────────────────────────────────────────────────
// DIAGNOSTIC C — Maison Duval (delivered)
// ────────────────────────────────────────────────

const DIAG_C: DemoDiagnostic = {
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

// ── Exports ──────────────────────────────────────

export const DEMO_DIAGNOSTICS: DemoDiagnostic[] = [DIAG_A, DIAG_B, DIAG_C]

export function getDemoDiagnostic(id: string): DemoDiagnostic | undefined {
  return DEMO_DIAGNOSTICS.find(d => d.id === id)
}

export const DEMO_ADMIN_KPIS = {
  activeDiagnostics: 7,
  awaitingRestitution: 2,
  avgSurveyRate: 76,
  avgDaysPerDiagnostic: 12,
}
