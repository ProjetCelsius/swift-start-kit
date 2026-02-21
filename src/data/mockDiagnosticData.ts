// ============================================
// BOUSSOLE CLIMAT — Mock diagnostic data
// ============================================

export const MOCK_SYNTHESIS = {
  paragraphs: [
    "Votre organisation a amorcé une démarche climat avec une réelle volonté de structuration. Le bilan carbone réalisé en 2023 constitue une première étape solide, et la nomination d'un référent RSE témoigne d'un engagement naissant. Cependant, la démarche reste encore largement portée par quelques personnes convaincues, sans ancrage systématique dans les processus de décision. Le sujet climat n'est pas encore perçu comme un levier stratégique par l'ensemble du comité de direction.",
    "L'analyse croisée de vos réponses et de celles de vos collaborateurs révèle un écart de perception significatif : là où vous estimez la démarche « bien engagée », vos équipes la perçoivent comme « en construction ». Ce décalage, fréquent dans les organisations de votre taille, n'est pas un problème en soi — c'est un signal. Il indique que la communication interne sur les actions menées et les ambitions climatiques doit être renforcée pour créer une dynamique collective.",
    "Votre secteur connaît une accélération réglementaire majeure avec la CSRD qui vous concernera dès 2026. Les entreprises de votre secteur les plus avancées ont déjà intégré le climat dans leur stratégie d'investissement et leur politique achats. Vous avez une fenêtre d'opportunité de 12 à 18 mois pour transformer votre démarche actuelle en avantage concurrentiel, avant que la conformité réglementaire ne devienne une simple obligation subie.",
  ],
  analyst: {
    name: 'Claire Lefèvre',
    title: 'Analyste climat senior — Celsius',
    date: '15 janvier 2026',
    photoUrl: '',
  },
}

export interface Priority {
  number: number
  title: string
  why: string
  effort: 'Rapide' | 'Projet' | 'Transformation'
  budget: '<10k€' | '10-50k€' | '>50k€'
}

export const MOCK_PRIORITIES: Priority[] = [
  {
    number: 1,
    title: 'Structurer la gouvernance climat avec un comité dédié',
    why: "Votre démarche manque d'un ancrage décisionnel clair. Un comité climat trimestriel avec la DG, la DAF et les opérations permettrait de transformer les intentions en décisions budgétaires concrètes. C'est le prérequis à toute accélération.",
    effort: 'Rapide',
    budget: '<10k€',
  },
  {
    number: 2,
    title: 'Lancer un programme de sensibilisation interne structuré',
    why: "L'écart de perception entre direction et terrain est votre principal frein. Une Fresque du Climat pour 100% des managers, suivie d'ateliers métiers, réduirait ce fossé en 6 mois et créerait les relais internes indispensables.",
    effort: 'Projet',
    budget: '10-50k€',
  },
  {
    number: 3,
    title: 'Intégrer un critère carbone dans la politique achats',
    why: "Votre scope 3 représente 78% de vos émissions. Sans levier sur vos fournisseurs, vos objectifs de réduction resteront théoriques. Commencez par les 20 fournisseurs qui représentent 80% de vos achats.",
    effort: 'Transformation',
    budget: '>50k€',
  },
]

export const MOCK_ANTI_RECOMMENDATION = {
  title: 'Ce que nous ne ferions PAS',
  text: "Nous ne recommandons pas de vous engager dans une certification ISO 14001 à ce stade. Votre maturité organisationnelle ne permettrait pas d'en tirer pleinement parti, et le coût (40-80k€) serait disproportionné par rapport aux bénéfices. Concentrez-vous d'abord sur les fondamentaux : gouvernance, données et culture. La certification viendra naturellement dans 18 à 24 mois.",
}

export interface DimensionScore {
  id: string
  label: string
  score: number
  letter: string
  color: string
  analysis: string
  sectorPosition: string
  sectorPositive: boolean
}

export const MOCK_MATURITY = {
  globalScore: 52,
  globalLetter: 'B',
  globalLabel: 'Structuré',
  globalColor: '#2D7A50',
  dimensions: [
    {
      id: 'gouvernance',
      label: 'Gouvernance climat',
      score: 62,
      letter: 'B',
      color: '#2D7A50',
      analysis: "Votre gouvernance climat est en cours de structuration. Le portage par la direction existe mais reste informel. L'intégration du climat dans les décisions d'investissement est le prochain palier à franchir.",
      sectorPosition: 'Top 30% de votre secteur',
      sectorPositive: true,
    },
    {
      id: 'mesure',
      label: 'Mesure et données',
      score: 45,
      letter: 'C',
      color: '#E8734A',
      analysis: "Le bilan carbone initial est une bonne base, mais la couverture du scope 3 reste partielle. La qualité des données et la fréquence de mise à jour sont vos principaux axes d'amélioration.",
      sectorPosition: 'Dans la moyenne sectorielle',
      sectorPositive: false,
    },
    {
      id: 'action',
      label: 'Stratégie et objectifs',
      score: 38,
      letter: 'C',
      color: '#E8734A',
      analysis: "Des actions existent mais sans feuille de route structurée. Les objectifs de réduction ne sont pas encore alignés sur une trajectoire scientifique. L'absence de jalons intermédiaires rend le suivi difficile.",
      sectorPosition: 'En dessous de la moyenne sectorielle',
      sectorPositive: false,
    },
    {
      id: 'culture',
      label: 'Culture et engagement',
      score: 65,
      letter: 'B',
      color: '#2D7A50',
      analysis: "Point fort de votre organisation. La sensibilité des équipes est réelle et constitue un levier puissant. Le défi est de transformer cette sensibilité en compétences opérationnelles et en actions mesurables.",
      sectorPosition: 'Top 20% de votre secteur',
      sectorPositive: true,
    },
  ] as DimensionScore[],
}

// ── Section 4: Perception Gaps ───────────────────────────

export const PERCEPTION_LABELS = [
  'Sujet stratégique',
  'Moyens suffisants',
  'Objectifs clairs',
  'Équipes impliquées',
  'Mesure des progrès',
  'Intégration business',
  'Reconnaissance externe',
  'Confiance objectifs',
]

export const MOCK_PERCEPTION_GAPS = {
  rseScores:       [8.2, 7.5, 6.8, 7.8, 6.0, 5.5, 7.0, 7.2],
  rsePredictions:  [6.5, 5.8, 5.2, 5.0, 4.5, 4.8, 5.5, 5.0],
  employeeScores:  [5.8, 4.3, 4.0, 4.6, 3.8, 3.5, 5.2, 4.1],
}

export const MOCK_POPULATION_COMPARISON = {
  rseEstimate:  [15, 30, 30, 20, 5],
  employeeReal: [8, 22, 35, 25, 10],
}

export const MOCK_DG_COMPARISON = {
  hasResponded: true,
  budgetDeclared: '200 000 € à 500 000 €',
  budgetPerceived: '50 000 € à 200 000 €',
  dgMeansScore: 7.5,
  rseMeansScore: 5.8,
}

// ── Section 5: Human Capital ─────────────────────────────

export const MOCK_HUMAN_CAPITAL = {
  currentFTE: 0.5,
  recommendedFTE: 2.0,
  population: [8, 22, 35, 25, 10],
  analysis: [
    "Avec 0,5 ETP dédié à la démarche climat, votre organisation est en dessous du seuil critique pour une entreprise de votre taille et de votre secteur. Les benchmarks sectoriels montrent qu'une entreprise de 250 à 500 salariés engagée dans une démarche structurée mobilise en moyenne 1,5 à 2,5 ETP dédiés.",
    "Le sous-dimensionnement de l'équipe climat explique en partie l'écart de perception observé entre la direction et les collaborateurs. Sans relais opérationnels formés et mandatés, la stratégie peine à se traduire en actions concrètes au quotidien.",
    "Nous recommandons un renforcement progressif : un premier recrutement d'un chargé de mission climat à plein temps dans les 6 prochains mois, complété par la formation de 5 à 8 ambassadeurs climat dans les fonctions clés (achats, RH, production, communication).",
  ],
}

// ── Section 6: Carbon Footprint ──────────────────────────

export const MOCK_FOOTPRINT = {
  hasFootprint: true,
  total: 12500,
  scope1: 1800,
  scope2: 950,
  scope3: 9750,
  employees: 320,
  revenue: 45000, // k€
  intensityPerEmployee: 39.1,
  intensityPerRevenue: 0.278,
  sectorAvgIntensity: 32.5,
  trajectoryYears: [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
  trajectoryBau: [12500, 12800, 13100, 13500, 13900, 14300, 14800, 15200],
  trajectoryParis: [12500, 11250, 10000, 8750, 7500, 6250, 5000, 3750],
  estimatedCategories: [
    { label: 'Achats de biens et services', value: 4200 },
    { label: 'Transport de marchandises', value: 2100 },
    { label: 'Déplacements professionnels', value: 1500 },
    { label: 'Énergie (bâtiments)', value: 1800 },
    { label: 'Immobilisations', value: 950 },
    { label: 'Déplacements domicile-travail', value: 850 },
    { label: 'Autres', value: 1100 },
  ],
}

// ── Section 7: Key Deadlines ─────────────────────────────

export interface Deadline {
  date: string
  title: string
  description: string
  status: 'Prêt' | 'En cours' | 'Pas commencé'
  urgent: boolean
}

export const MOCK_DEADLINES: Deadline[] = [
  {
    date: 'Janvier 2026',
    title: 'CSRD — Premier rapport de durabilité',
    description: "Publication obligatoire pour les entreprises de plus de 250 salariés. Inclut les normes ESRS climat (E1).",
    status: 'En cours',
    urgent: true,
  },
  {
    date: 'Mars 2026',
    title: 'Taxonomie européenne — Reporting d\'éligibilité',
    description: "Analyse d'éligibilité et d'alignement de vos activités avec la taxonomie verte européenne.",
    status: 'Pas commencé',
    urgent: true,
  },
  {
    date: 'Juin 2026',
    title: 'Bilan GES réglementaire — Mise à jour',
    description: "Mise à jour obligatoire du bilan de gaz à effet de serre (scopes 1, 2 et 3 significatif).",
    status: 'En cours',
    urgent: false,
  },
  {
    date: 'Janvier 2027',
    title: 'Devoir de vigilance — Plan de vigilance climat',
    description: "Intégration des risques climatiques dans le plan de vigilance si applicable.",
    status: 'Pas commencé',
    urgent: false,
  },
  {
    date: 'Juin 2027',
    title: 'RE2020 — Conformité bâtiments tertiaires',
    description: "Échéance de conformité pour les bâtiments tertiaires de plus de 1 000 m².",
    status: 'Prêt',
    urgent: false,
  },
  {
    date: 'Janvier 2028',
    title: 'CSRD — Deuxième cycle de reporting',
    description: "Deuxième publication avec indicateurs de progression et analyse de double matérialité mise à jour.",
    status: 'Pas commencé',
    urgent: false,
  },
]

// ── Section 8: Advancement Profile ───────────────────────

export interface TileEnrichment {
  status: 'done' | 'in_progress' | 'not_started'
  relevance: 'essential' | 'recommended' | 'optional'
}

export const MOCK_TILE_ENRICHMENTS: Record<string, TileEnrichment> = {
  bilan_carbone: { status: 'done', relevance: 'essential' },
  strategie_climat: { status: 'in_progress', relevance: 'essential' },
  objectifs_reduction: { status: 'not_started', relevance: 'essential' },
  rapport_rse: { status: 'not_started', relevance: 'essential' },
  certification: { status: 'not_started', relevance: 'optional' },
  formation: { status: 'in_progress', relevance: 'recommended' },
  eco_conception: { status: 'not_started', relevance: 'recommended' },
  achats_responsables: { status: 'not_started', relevance: 'essential' },
  mobilite: { status: 'done', relevance: 'recommended' },
  acv: { status: 'not_started', relevance: 'optional' },
  compensation: { status: 'not_started', relevance: 'optional' },
  initiatives_collectives: { status: 'in_progress', relevance: 'recommended' },
}

// ── Section 9: Next Steps / Quarterly Plan ───────────────

export interface QuarterlyAction {
  label: string
  priority: number // 1-3 matches priority cards
}

export interface Quarter {
  quarter: string
  actions: QuarterlyAction[]
}

export const MOCK_QUARTERLY_PLAN: Quarter[] = [
  {
    quarter: 'T1 2026',
    actions: [
      { label: 'Constituer le comité climat', priority: 1 },
      { label: 'Nommer les ambassadeurs internes', priority: 2 },
    ],
  },
  {
    quarter: 'T2 2026',
    actions: [
      { label: 'Premier comité climat', priority: 1 },
      { label: 'Fresque du Climat managers', priority: 2 },
      { label: 'Audit fournisseurs top 20', priority: 3 },
    ],
  },
  {
    quarter: 'T3 2026',
    actions: [
      { label: 'Intégrer le climat dans le budget 2027', priority: 1 },
      { label: 'Ateliers métiers climat', priority: 2 },
    ],
  },
  {
    quarter: 'T4 2026',
    actions: [
      { label: 'Bilan du comité climat', priority: 1 },
      { label: 'Critères carbone dans les appels d\'offres', priority: 3 },
      { label: 'Mesure d\'impact sensibilisation', priority: 2 },
    ],
  },
]
