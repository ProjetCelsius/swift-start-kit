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

// ────────────────────────────────────────────────
// DIAGNOSTIC B — Groupe Méridien (analysis)
// ────────────────────────────────────────────────

const DIAG_B: DemoDiagnostic = {
  id: 'demo-meridien',
  status: 'analysis',
  organization: {
    name: 'Groupe Méridien',
    sector: 'Commerce de gros alimentaire',
    naf: '4639B',
    headcount: '501-1000',
    revenue: '50-200M',
    sites: '8 (siège Marseille + 7 entrepôts régionaux)',
    rseStartYear: 2019,
    contact: { name: 'Julien Marchand', title: 'Responsable Développement Durable', email: 'j.marchand@meridien.fr' },
    analyst: { name: 'Sophie Lefèvre', title: 'Analyste climat', initials: 'SL' },
  },
  bloc1: {
    tiles: {
      bilan_carbone: { status: 'done', comment: 'BC complet scopes 1-2-3, mis à jour annuellement depuis 2020' },
      strategie_climat: { status: 'done', comment: 'Stratégie existante mais pas alignée SBTi' },
      objectifs_reduction: { status: 'done', comment: 'Objectif -30% sur scope 1+2 d\'ici 2030' },
      rapport_rse: { status: 'done', comment: 'DPEF publiée depuis 2020, transition CSRD en cours' },
      certification: { status: 'not_started' },
      formation: { status: 'done', comment: 'Programme complet : Fresque, ateliers métiers, e-learning' },
      eco_conception: { status: 'in_progress', comment: 'Démarche sur les emballages logistiques' },
      achats_responsables: { status: 'done', comment: 'Critères carbone intégrés pour top 50 fournisseurs' },
      mobilite: { status: 'done', comment: 'Flotte hybride/électrique à 40%, plan de mobilité' },
      acv: { status: 'not_started' },
      compensation: { status: 'done', comment: 'Contribution carbone via reforestation locale' },
      initiatives_collectives: { status: 'in_progress', comment: 'Membre du Club Climat territorial' },
    },
    headcount: '501-1000',
    revenue: '50-200M',
    naf: '4639B',
  },
  bloc2: {
    responses: [4, 3, 3, 3, 4, 3, 3, 4, 3, 3, 3, 2, 2, 2, 1, 2, 3, 3, 3, 3],
    scores: { gouvernance: 73, mesure: 80, strategie: 47, culture: 67, global: 67 },
    letters: { gouvernance: 'B', mesure: 'A', strategie: 'C', culture: 'B', global: 'B' },
  },
  bloc3: {
    q21_drivers: ['Réduction des coûts', 'Conformité réglementaire', 'Pression donneurs d\'ordre'],
    q22_barrier: 'Difficulté à mesurer le ROI',
    q23_regulatory: {
      csrd: 'Déjà concerné', beges: 'Déjà concerné', taxonomie: 'Sous 12 mois',
      vigilance: 'Sous 2-3 ans', donneurs_ordre: 'Déjà concerné', affichage: 'Sous 12 mois',
    },
    q24_lost_tender: true,
    q24_tender_detail: 'Appel d\'offres Carrefour 2024, critères carbone non satisfaits sur le scope 3 transport.',
    q25_carte_blanche: 'Notre principal défi est de convaincre les équipes opérationnelles que le climat n\'est pas un frein au business mais un levier de compétitivité.',
    q26_ambition: 'Devenir la référence RSE du secteur grossiste alimentaire d\'ici 2028.',
    q27_confidential: "Le DG parle beaucoup de climat en public mais en interne les arbitrages budgétaires ne suivent pas. Le dernier budget a été coupé de 30% sans discussion.",
    completed: true,
  },
  bloc4: {
    partA: [8, 6, 5, 7, 6, 5, 4, 7],
    partB: [6, 4, 3, 5, 5, 4, 3, 5],
    partC: [10, 25, 40, 20, 5],
    completed: true,
  },
  survey: {
    respondents: 34,
    target: 40,
    averages: [5.2, 3.8, 3.1, 4.6, 4.2, 4.8, 3.4, 4.1],
    profiles: [8, 32, 38, 18, 4],
    verbatims: [
      "On nous demande de trier nos déchets mais les camions prennent tout ensemble, c'est décourageant",
      "J'aimerais comprendre ce que l'entreprise fait concrètement, pas juste des slogans",
      "Le sujet est important mais on n'a pas le temps avec la charge de travail actuelle",
      "La direction devrait montrer l'exemple sur les déplacements",
      "Très content que l'entreprise prenne ça au sérieux, continuez",
    ],
    dailyResponses: [
      { day: '03/02', count: 0 }, { day: '04/02', count: 5 }, { day: '05/02', count: 11 },
      { day: '06/02', count: 18 }, { day: '07/02', count: 22 }, { day: '08/02', count: 26 },
      { day: '09/02', count: 30 }, { day: '10/02', count: 34 },
    ],
  },
  dg: {
    received: true,
    dg1: 'Sujet délégué avec reporting',
    dg2: '50-100k€',
    dg3: '1-3 ans',
    dg4: 'Réduction des coûts',
    dg5: 6,
  },
  journal: [
    { id: 'jb1', author: 'analyst', authorName: 'Sophie', date: new Date(Date.now() - 14 * 86400_000), text: "Bienvenue Julien ! Votre espace est prêt.", badge: 'Étape : Démarrage', badgeColor: '#2D7A50' },
    { id: 'jb2', author: 'analyst', authorName: 'Sophie', date: new Date(Date.now() - 12 * 86400_000), text: "Appel de lancement très riche. Je note l'historique solide de votre démarche depuis 2019.", badge: 'Étape : Questionnaire en cours', badgeColor: '#E8734A' },
    { id: 'jb3', author: 'analyst', authorName: 'Sophie', date: new Date(Date.now() - 5 * 86400_000), text: "Questionnaire complété, merci ! 34 répondants au sondage, c'est un excellent taux. Je lance l'analyse." },
    { id: 'jb4', author: 'analyst', authorName: 'Sophie', date: new Date(Date.now() - 2 * 86400_000), text: "J'ai commencé par croiser vos réponses avec le sondage. Les écarts de perception sont particulièrement intéressants sur la question des moyens (P2 vs S2 : écart de 2.2 points).", badge: 'Étape : Analyse en cours', badgeColor: '#E8734A' },
    { id: 'jb5', author: 'analyst', authorName: 'Sophie', date: new Date(Date.now() - 6 * 3600_000), text: "Le questionnaire DG est arrivé. Je l'intègre à l'analyse. Vous pouvez vous attendre à la restitution d'ici la semaine prochaine." },
  ],
  messages: [
    { id: 'mb1', author: 'analyst', authorName: 'Sophie Lefèvre', date: new Date(Date.now() - 10 * 86400_000), text: "Bonjour Julien, j'ai une question sur votre réponse au Bloc 3 : vous mentionnez avoir perdu un appel d'offres Carrefour. Pourriez-vous préciser les critères carbone qui n'étaient pas satisfaits ?" },
    { id: 'mb2', author: 'client', authorName: 'Julien Marchand', date: new Date(Date.now() - 9 * 86400_000), text: "C'était principalement le scope 3 transport. Ils demandaient une mesure précise des émissions par tonne.km livrée, et nous n'avions pas cette granularité." },
    { id: 'mb3', author: 'analyst', authorName: 'Sophie Lefèvre', date: new Date(Date.now() - 9 * 86400_000 + 7200_000), text: "Merci pour la précision, c'est très utile pour l'analyse. C'est exactement le type de signal marché qui renforce l'urgence d'agir sur le scope 3." },
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
}

// ────────────────────────────────────────────────
// DIAGNOSTIC C — Maison Duval (delivered)
// ────────────────────────────────────────────────

const DIAG_C: DemoDiagnostic = {
  id: 'demo-duval',
  status: 'delivered',
  organization: {
    name: 'Maison Duval',
    sector: 'Production de boissons alcooliques',
    naf: '1102B',
    headcount: '51-250',
    revenue: '10-50M',
    sites: '2 (Épernay + bureau commercial Paris)',
    rseStartYear: 2021,
    contact: { name: 'Camille Duval', title: 'DG & fondatrice', email: 'camille@maison-duval.fr' },
    analyst: { name: 'Guillaume Pakula', title: 'Analyste climat senior', initials: 'GP' },
  },
  bloc1: {
    tiles: {
      bilan_carbone: { status: 'done', comment: 'Premier BC réalisé en 2022, scope 1-2-3' },
      strategie_climat: { status: 'in_progress', comment: 'Existe informellement, pas encore formalisée' },
      objectifs_reduction: { status: 'not_started' },
      rapport_rse: { status: 'done', comment: 'Reporting volontaire depuis 2022' },
      certification: { status: 'not_started' },
      formation: { status: 'done', comment: 'Sensibilisation 100% des collaborateurs' },
      eco_conception: { status: 'not_started' },
      achats_responsables: { status: 'in_progress', comment: 'Réflexion en cours avec les vignerons partenaires' },
      mobilite: { status: 'done', comment: 'Véhicules hybrides pour les commerciaux' },
      acv: { status: 'not_started' },
      compensation: { status: 'done', comment: 'Contribution via reforestation Champagne' },
      initiatives_collectives: { status: 'done', comment: 'Membre actif du Comité Interprofessionnel' },
    },
    headcount: '51-250',
    revenue: '10-50M',
    naf: '1102B',
  },
  bloc2: {
    responses: [4, 3, 3, 3, 3, 2, 3, 3, 2, 2, 2, 2, 1, 2, 1, 2, 4, 3, 3, 3],
    scores: { gouvernance: 73, mesure: 60, strategie: 40, culture: 73, global: 62 },
    letters: { gouvernance: 'B', mesure: 'B', strategie: 'C', culture: 'B', global: 'B' },
  },
  bloc3: {
    q21_drivers: ['Conviction direction', 'Pression filière', 'Image de marque'],
    q22_barrier: 'Manque de temps / priorités concurrentes',
    q23_regulatory: {
      csrd: 'Sous 12 mois', beges: 'Déjà concerné', taxonomie: 'Sous 12 mois',
      vigilance: 'Pas concerné', donneurs_ordre: 'Sous 12 mois', affichage: 'Sous 2-3 ans',
    },
    q24_lost_tender: false,
    q25_carte_blanche: 'Le climat, c\'est l\'avenir de notre terroir. Si on ne protège pas nos vignes, on n\'aura plus de champagne dans 50 ans.',
    q26_ambition: 'Être la première maison de champagne carbone-neutre.',
    q27_confidential: 'RAS — Camille est à la fois DG et moteur de la démarche, pas de tension interne.',
    completed: true,
  },
  bloc4: {
    partA: [9, 5, 7, 8, 6, 8, 7, 8],
    partB: [7, 4, 5, 6, 5, 6, 5, 6],
    partC: [20, 35, 30, 10, 5],
    completed: true,
  },
  survey: {
    respondents: 28,
    target: 20,
    averages: [8.4, 4.2, 6.1, 7.8, 5.6, 7.2, 6.8, 7.1],
    profiles: [25, 39, 29, 7, 0],
    verbatims: [
      "Camille nous inspire sur le sujet, ça fait plaisir de voir une direction qui y croit vraiment",
      "On aimerait avoir plus de moyens concrets pour agir au quotidien dans les vignes",
      "Le tri et les écogestes c'est bien, mais le vrai sujet c'est le transport et les bouteilles",
      "Fiers de travailler dans une maison qui prend ça au sérieux",
    ],
    dailyResponses: [
      { day: '15/12', count: 0 }, { day: '16/12', count: 4 }, { day: '17/12', count: 10 },
      { day: '18/12', count: 16 }, { day: '19/12', count: 22 }, { day: '20/12', count: 26 }, { day: '21/12', count: 28 },
    ],
  },
  dg: {
    received: true,
    dg1: 'Sujet porté personnellement par la DG',
    dg2: '20-50k€',
    dg3: '3-5 ans',
    dg4: 'Image et réputation',
    dg5: 7,
  },
  journal: [
    { id: 'jc1', author: 'analyst', authorName: 'Thomas', date: new Date(Date.now() - 45 * 86400_000), text: "Bienvenue Camille ! Ravi de vous accompagner dans cette démarche.", badge: 'Étape : Démarrage', badgeColor: '#2D7A50' },
    { id: 'jc2', author: 'analyst', authorName: 'Thomas', date: new Date(Date.now() - 40 * 86400_000), text: "Appel de lancement excellent. Votre conviction est communicative. Le questionnaire ne devrait pas poser de difficulté.", badge: 'Étape : Questionnaire en cours', badgeColor: '#E8734A' },
    { id: 'jc3', author: 'analyst', authorName: 'Thomas', date: new Date(Date.now() - 30 * 86400_000), text: "28 répondants au sondage sur 20 visés — bravo ! Les équipes vignoble ont particulièrement bien joué le jeu.", badge: 'Étape : Analyse en cours', badgeColor: '#E8734A' },
    { id: 'jc4', author: 'analyst', authorName: 'Thomas', date: new Date(Date.now() - 15 * 86400_000), text: "L'analyse est terminée. Bonne nouvelle : vos équipes sont remarquablement alignées avec votre vision. Le principal chantier sera le scope 3 transport et fournisseurs.", badge: 'Étape : Restitution', badgeColor: '#F5A623' },
    { id: 'jc5', author: 'analyst', authorName: 'Thomas', date: new Date(Date.now() - 7 * 86400_000), text: "Restitution réalisée. Votre diagnostic est maintenant déverrouillé. N'hésitez pas à parcourir chaque section et à me poser vos questions.", badge: 'Étape : Livré', badgeColor: '#1B5E3B' },
  ],
  messages: [
    { id: 'mc1', author: 'client', authorName: 'Camille Duval', date: new Date(Date.now() - 20 * 86400_000), text: "Thomas, je voulais vous remercier pour la qualité de l'échange à l'appel de lancement. J'ai hâte de voir les résultats." },
    { id: 'mc2', author: 'analyst', authorName: 'Thomas Renaud', date: new Date(Date.now() - 20 * 86400_000 + 7200_000), text: "Merci Camille ! Votre engagement rend l'analyse d'autant plus riche. Je reviens vers vous très vite." },
    { id: 'mc3', author: 'client', authorName: 'Camille Duval', date: new Date(Date.now() - 5 * 86400_000), text: "J'ai parcouru le diagnostic, c'est remarquable. La section sur les écarts de perception m'a ouvert les yeux sur le besoin de mieux communiquer en interne." },
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
  synthesis: [
    "Maison Duval se trouve à un tournant de sa démarche climat. En trois ans, vous avez posé des bases solides : un premier Bilan Carbone réalisé, une sensibilisation de l'ensemble des collaborateurs, et surtout une direction qui porte le sujet avec conviction. C'est un atout rare dans votre secteur, où beaucoup d'acteurs en sont encore au stade de la conformité subie.",
    "Le point d'alerte principal concerne votre scope 3, et plus spécifiquement le poste viticole et le transport aval. Ces deux postes représentent 72% de votre empreinte totale et sont les plus difficiles à réduire. Vous le savez — mais vous n'avez pas encore de plan d'action structuré pour les adresser. Les engagements pris auprès du Comité Interprofessionnel pourraient devenir contraignants d'ici 18 mois, et vous n'êtes pas prête.",
    "La bonne nouvelle : vos équipes sont remarquablement alignées avec la direction sur l'importance du sujet. L'écart de perception le plus faible que nous ayons jamais mesuré. Ce capital humain est votre meilleur levier pour passer à l'action — à condition de le structurer et de lui donner des objectifs concrets.",
  ],
  priorities: [
    { number: 1, title: 'Structurer un plan de réduction scope 3 transport', why: "Les engagements interprofessionnels deviennent contraignants en 2027. 18 mois pour se préparer, c'est court.", effort: 'Projet' as const, budget: '10-50k€' as const },
    { number: 2, title: 'Engager 5 fournisseurs viticoles clés dans une démarche carbone partagée', why: "72% de votre empreinte dépend de votre amont. Sans eux, votre trajectoire est impossible.", effort: 'Transformation' as const, budget: '<10k€' as const },
    { number: 3, title: 'Formaliser la stratégie climat et la faire valider en COMEX', why: "Vous agissez déjà, mais sans feuille de route écrite. Ça fragilise la pérennité si Camille est moins disponible.", effort: 'Rapide' as const, budget: '<10k€' as const },
  ],
  antiRecommendation: {
    title: 'Ne lancez pas de certification B Corp maintenant',
    text: "Le coût (40-80k€) et l'effort ne sont pas justifiés à votre stade. Votre priorité est la réduction réelle des émissions, pas le label. Revenez-y dans 2 ans quand votre trajectoire sera en place.",
  },
  maturity: {
    globalScore: 62, globalLetter: 'B', globalLabel: 'Structuré', globalColor: '#2D7A50',
    dimensions: [
      { id: 'gouvernance', label: 'Gouvernance climat', score: 73, letter: 'B', color: '#2D7A50', analysis: "Portage exemplaire par la direction. Le sujet est présent en COMEX. Point de fragilité : la dépendance à une seule personne (Camille) pour l'impulsion stratégique.", sectorPosition: 'Top 20% du secteur agroalimentaire', sectorPositive: true },
      { id: 'mesure', label: 'Mesure et données', score: 60, letter: 'B', color: '#2D7A50', analysis: "Bon premier bilan, mais la couverture scope 3 reste partielle. Les données fournisseurs sont estimées, pas collectées.", sectorPosition: 'Médiane du secteur', sectorPositive: false },
      { id: 'action', label: 'Stratégie et objectifs', score: 40, letter: 'C', color: '#E8734A', analysis: "C'est le point faible. Des actions existent mais sans trajectoire formalisée ni jalons. L'absence d'objectif SBTi est un risque face aux exigences clients.", sectorPosition: 'En dessous de la médiane', sectorPositive: false },
      { id: 'culture', label: 'Culture et engagement', score: 73, letter: 'B', color: '#2D7A50', analysis: "Point fort remarquable. La culture familiale de la Maison crée un alignement naturel. Les équipes vignoble sont particulièrement engagées.", sectorPosition: 'Top 15%', sectorPositive: true },
    ],
  },
  perceptionGaps: {
    rseScores: [9, 5, 7, 8, 6, 8, 7, 8],
    rsePredictions: [7, 4, 5, 6, 5, 6, 5, 6],
    employeeScores: [8.4, 4.2, 6.1, 7.8, 5.6, 7.2, 6.8, 7.1],
    populationEstimate: [20, 35, 30, 10, 5],
    populationReal: [25, 39, 29, 7, 0],
    dgAnalysis: "Budget déclaré cohérent (20-50k€), horizon ROI long (3-5 ans) — signe de conviction. Écart notable sur les moyens : DG5 = 7/10 vs P2 = 5/10.",
  },
  humanCapital: {
    currentFTE: 0.3,
    recommendedFTE: 1.5,
    analysis: "Pour une entreprise de votre taille et de votre ambition, 0.3 ETP dédié au climat est insuffisant. Le portage par la DG est un atout mais ne remplace pas un(e) chargé(e) de mission à temps plein.",
  },
  footprint: {
    hasFootprint: true,
    total: 4200, scope1: 380, scope2: 120, scope3: 3700,
    employees: 150, revenue: 35000,
    intensityPerEmployee: 28, intensityPerRevenue: 0.12,
    sectorAvgIntensity: 35,
  },
  deadlines: [
    { date: 'Janvier 2026', title: 'CSRD — Première année de reporting', description: "Publication obligatoire du rapport de durabilité.", status: 'En cours', urgent: true },
    { date: 'Déjà réalisé', title: 'BEGES-r', description: "Bilan réglementaire déjà réalisé.", status: 'Prêt', urgent: false },
    { date: 'Juin 2026', title: 'Mise à jour Bilan Carbone', description: "Mise à jour recommandée (>2 ans depuis le dernier).", status: 'Pas commencé', urgent: true },
    { date: 'Janvier 2027', title: 'Engagements interprofessionnels Champagne', description: "Réduction -25% scope 1+2 par rapport à 2019.", status: 'En cours', urgent: false },
    { date: 'Juin 2027', title: 'Taxonomie européenne', description: "Éligibilité à vérifier.", status: 'Pas commencé', urgent: false },
  ],
  tileEnrichments: {
    bilan_carbone: { status: 'done', relevance: 'essential' },
    strategie_climat: { status: 'in_progress', relevance: 'essential' },
    objectifs_reduction: { status: 'not_started', relevance: 'essential' },
    rapport_rse: { status: 'done', relevance: 'essential' },
    certification: { status: 'not_started', relevance: 'optional' },
    formation: { status: 'done', relevance: 'recommended' },
    eco_conception: { status: 'not_started', relevance: 'recommended' },
    achats_responsables: { status: 'in_progress', relevance: 'essential' },
    mobilite: { status: 'done', relevance: 'recommended' },
    acv: { status: 'not_started', relevance: 'optional' },
    compensation: { status: 'done', relevance: 'optional' },
    initiatives_collectives: { status: 'done', relevance: 'recommended' },
  },
  quarterlyPlan: [
    { quarter: 'T1 2026', actions: [{ label: 'Formaliser stratégie climat', priority: 3 }, { label: 'Recruter/dédier 1 ETP climat', priority: 3 }] },
    { quarter: 'T2 2026', actions: [{ label: 'Lancer plan scope 3 transport', priority: 1 }, { label: 'Engager 5 fournisseurs viticoles', priority: 2 }] },
    { quarter: 'T3 2026', actions: [{ label: 'Mise à jour Bilan Carbone', priority: 1 }, { label: 'Reporting CSRD', priority: 3 }] },
    { quarter: 'T4 2026', actions: [{ label: 'Bilan annuel climat', priority: 3 }, { label: 'Ajuster trajectoire', priority: 1 }] },
  ],
}

// ────────────────────────────────────────────────
// DIAGNOSTIC D — Maison Duval VIERGE (onboarding)
// ────────────────────────────────────────────────
const DUVAL_BASE_ORG: DemoOrganization = {
  name: 'Maison Duval',
  sector: 'Production de boissons alcooliques',
  naf: '1102B',
  headcount: '51-250',
  revenue: '10-50M',
  sites: '2 (Épernay + bureau commercial Paris)',
  rseStartYear: 2021,
  contact: { name: 'Camille Duval', title: 'DG & fondatrice', email: 'camille@maison-duval.fr' },
  analyst: { name: 'Guillaume Pakula', title: 'Analyste climat senior', initials: 'GP' },
}

const mkDuvalOrg = (suffix: string): DemoOrganization => ({ ...DUVAL_BASE_ORG, name: `Maison Duval — ${suffix}` })

const DIAG_D: DemoDiagnostic = {
  id: 'demo-duval-vierge',
  status: 'onboarding',
  organization: mkDuvalOrg('Vierge'),
  bloc1: { tiles: {}, headcount: '', revenue: '', naf: '' },
  bloc2: { responses: [], scores: { gouvernance: 0, mesure: 0, strategie: 0, culture: 0, global: 0 }, letters: { gouvernance: 'D', mesure: 'D', strategie: 'D', culture: 'D', global: 'D' } },
  bloc3: { q21_drivers: [], q22_barrier: '', q23_regulatory: {}, q24_lost_tender: false, completed: false },
  bloc4: { partA: [], partB: [], partC: [], completed: false },
  survey: { respondents: 0, target: 20, averages: [], profiles: [], verbatims: [], dailyResponses: [] },
  dg: { received: false },
  journal: [{ id: 'jd1', author: 'analyst', authorName: 'Guillaume', date: new Date(Date.now() - 1 * 86400_000), text: "Bienvenue Camille ! Votre espace est prêt. On se retrouve jeudi pour l'appel de lancement.", badge: 'Étape : Démarrage', badgeColor: '#2D7A50' }],
  messages: [],
  diagnosticUnlocked: false,
  diagnosticSections: Array(9).fill({ status: 'empty' as const }),
  checklist: { appel_lancement: false, bloc1: false, bloc2: false, bloc3: false, bloc4: false, sondage: false, dg: false, ia_generated: false, validated: false, restitution_planned: false, unlocked: false },
}

// ────────────────────────────────────────────────
// DIAGNOSTIC E — Maison Duval APPEL FAIT
// ────────────────────────────────────────────────
const DIAG_E: DemoDiagnostic = {
  ...DIAG_D,
  organization: mkDuvalOrg('Appel fait'),
  id: 'demo-duval-appel',
  status: 'questionnaire',
  bloc1: { ...DIAG_C.bloc1 },
  journal: [
    { id: 'je1', author: 'analyst', authorName: 'Guillaume', date: new Date(Date.now() - 5 * 86400_000), text: "Bienvenue Camille ! Votre espace est prêt.", badge: 'Étape : Démarrage', badgeColor: '#2D7A50' },
    { id: 'je2', author: 'analyst', authorName: 'Guillaume', date: new Date(Date.now() - 2 * 86400_000), text: "Appel de lancement réalisé. Bloc 1 rempli ensemble. Bonne base de départ !", badge: 'Étape : Questionnaire', badgeColor: '#E8734A' },
  ],
  checklist: { appel_lancement: true, bloc1: true, bloc2: false, bloc3: false, bloc4: false, sondage: false, dg: false, ia_generated: false, validated: false, restitution_planned: false, unlocked: false },
}

// ────────────────────────────────────────────────
// DIAGNOSTIC F — Maison Duval APPEL + SONDAGE (pas questionnaire)
// ────────────────────────────────────────────────
const DIAG_F: DemoDiagnostic = {
  ...DIAG_E,
  organization: mkDuvalOrg('Sondage fait'),
  id: 'demo-duval-sondage',
  status: 'survey_pending',
  survey: { ...DIAG_C.survey },
  dg: { ...DIAG_C.dg },
  journal: [
    ...DIAG_E.journal,
    { id: 'jf3', author: 'analyst', authorName: 'Guillaume', date: new Date(Date.now() - 1 * 86400_000), text: "Le sondage a été lancé en parallèle du questionnaire. 28 réponses déjà ! Pensez à finaliser les blocs 2, 3 et 4.", badge: 'Sondage en cours', badgeColor: '#E8734A' },
  ],
  checklist: { appel_lancement: true, bloc1: true, bloc2: false, bloc3: false, bloc4: false, sondage: true, dg: true, ia_generated: false, validated: false, restitution_planned: false, unlocked: false },
}

// ────────────────────────────────────────────────
// DIAGNOSTIC G — Maison Duval TOUT REMPLI → prêt pour analyse
// ────────────────────────────────────────────────
const DIAG_G: DemoDiagnostic = {
  ...DIAG_C,
  id: 'demo-duval-complet',
  status: 'ready_for_restitution',
  organization: mkDuvalOrg('Complet'),
  diagnosticUnlocked: false,
  diagnosticSections: Array(9).fill({ status: 'draft' as const }),
  journal: [
    ...DIAG_C.journal.slice(0, -1),
    { id: 'jg5', author: 'analyst', authorName: 'Guillaume', date: new Date(Date.now() - 2 * 86400_000), text: "L'analyse est terminée. Votre restitution est planifiée pour la semaine prochaine !", badge: 'Étape : Prêt pour restitution', badgeColor: '#F5A623' },
  ],
  checklist: { appel_lancement: true, bloc1: true, bloc2: true, bloc3: true, bloc4: true, sondage: true, dg: true, ia_generated: true, validated: true, restitution_planned: true, unlocked: false },
}

// ── Exports ──────────────────────────────────────

export const DEMO_DIAGNOSTICS: DemoDiagnostic[] = [DIAG_A, DIAG_B, DIAG_C, DIAG_D, DIAG_E, DIAG_F, DIAG_G]

export function getDemoDiagnostic(id: string): DemoDiagnostic | undefined {
  return DEMO_DIAGNOSTICS.find(d => d.id === id)
}

export const DEMO_ADMIN_KPIS = {
  activeDiagnostics: 7,
  awaitingRestitution: 2,
  avgSurveyRate: 76,
  avgDaysPerDiagnostic: 12,
}
