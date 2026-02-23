// ============================================
// BOUSSOLE CLIMAT — Mock diagnostic data
// ============================================

// Mock client: ETI industrielle, 800 salaries, ~50M€ CA, profil SMFD, score B (62/100)

export const mockDiagnostic = {
  client: {
    name: "Groupe Méridien",
    sector: "Industrie manufacturière",
    employees: 800,
    revenue: "50-200M",
    analyst: { name: "Guillaume Pakula", initials: "GP", title: "Analyste Climat Senior" },
    profilClimat: { code: "SMFD", name: "Les fondations sont là", phrase: "On fait les choses dans les règles, et on les fait bien.", family: "Les Méthodiques", entrepriseType: "Saint-Gobain" }
  },

  section1: {
    paragraphs: [
      "Groupe Méridien a posé des bases solides : un Bilan Carbone récent, un référent climat identifié, une direction qui reconnaît le sujet. Mais ces fondations restent fragiles. La démarche repose largement sur une personne — votre responsable RSE — qui cumule ce rôle avec d'autres missions. C'est à la fois votre force (son engagement est réel) et votre vulnérabilité : si elle part, tout s'arrête.",
      "Le point d'alerte principal concerne l'écart entre votre perception et celle de vos équipes. Vous estimiez que 60% de vos collaborateurs étaient engagés ou moteurs. La réalité mesurée est de 38%. Ce n'est pas un problème d'adhésion — la plupart ne sont pas opposés. C'est un problème de communication et de traduction concrète : vos équipes ne savent pas quoi faire de leur bonne volonté.",
      "La bonne nouvelle : votre scope 3 est déjà cartographié, votre trajectoire est amorcée, et la CSRD vous pousse dans la bonne direction. Vous avez 18 mois pour transformer cette conformité subie en avantage concurrentiel. Les 3 priorités qui suivent sont conçues pour ça."
    ],
    keyTakeaways: [
      "Structurer la gouvernance climat avec un reporting trimestriel au COMEX",
      "Combler l'écart de perception via un programme managers ciblé",
      "Lancer la trajectoire SBTi avant l'obligation CSRD pour 12 mois d'avance"
    ],
    date: "15 février 2026"
  },

  section2: {
    priorities: [
      { title: "Structurer la gouvernance climat avec un reporting trimestriel au COMEX", why: "Votre DG alloue du budget mais ne voit pas les résultats. Un tableau de bord trimestriel crée la boucle de feedback nécessaire.", effort: "Rapide" as const, budget: "~5k€", impactX: 20, impactY: 85 },
      { title: "Déployer un programme de sensibilisation ciblé managers", why: "L'écart de perception vient du middle management. Les managers sont le goulot d'étranglement entre la stratégie et le terrain.", effort: "Projet" as const, budget: "15-25k€", impactX: 50, impactY: 80 },
      { title: "Lancer la trajectoire SBTi avant l'obligation CSRD", why: "Vous avez les données. Formaliser maintenant vous donne 12 mois d'avance sur vos concurrents et crédibilise votre démarche.", effort: "Projet" as const, budget: "20-40k€", impactX: 75, impactY: 90 }
    ],
    antiRecommendation: "Ne lancez pas de certification B Corp à ce stade. Le coût (50-80k) et l'effort ne sont pas justifiés par votre positionnement marché B2B. Concentrez ces ressources sur la trajectoire SBTi qui a un impact business direct."
  },

  section3: {
    globalScore: 62,
    globalGrade: "B",
    dimensions: [
      { name: "Gouvernance climat", score: 73, grade: "B" },
      { name: "Mesure et données", score: 67, grade: "B" },
      { name: "Stratégie et trajectoire", score: 53, grade: "B" },
      { name: "Culture et engagement", score: 47, grade: "C" }
    ],
    sectorAverages: {
      'Gouvernance climat': 65,
      'Mesure et données': 58,
      'Stratégie et trajectoire': 50,
      'Culture et engagement': 55,
    }
  },

  section4: {
    perceptionData: [
      { label: "Direction engagée", rse: 8.2, prediction: 6.5, terrain: 5.1 },
      { label: "Moyens suffisants", rse: 5.5, prediction: 4.0, terrain: 3.8 },
      { label: "Objectifs clairs", rse: 7.0, prediction: 5.5, terrain: 3.2 },
      { label: "Équipes impliquées", rse: 6.8, prediction: 5.0, terrain: 5.5 },
      { label: "Progrès réels", rse: 6.5, prediction: 5.8, terrain: 4.9 },
      { label: "Climat = opportunité", rse: 7.5, prediction: 4.5, terrain: 5.2 },
      { label: "Managers relaient", rse: 5.0, prediction: 3.5, terrain: 2.8 },
      { label: "Communication honnête", rse: 7.2, prediction: 5.0, terrain: 4.1 }
    ],
    populationEstimated: { moteurs: 15, engages: 45, indifferents: 25, sceptiques: 10, refractaires: 5 },
    populationReal: { moteurs: 12, engages: 26, indifferents: 38, sceptiques: 18, refractaires: 6 },
    verbatims: [
      { text: "On nous demande de trier nos déchets mais les vrais enjeux sont dans l'approvisionnement, pas dans nos poubelles.", department: "Production", sentiment: 'critical' as const },
      { text: "La direction a pris le sujet au sérieux avec le bilan carbone, c'est un bon signal.", department: "Finance", sentiment: 'positive' as const },
      { text: "Je ne sais pas vraiment ce qu'on attend de moi concrètement sur ces sujets.", department: "Commercial", sentiment: 'neutral' as const },
      { text: "Les objectifs existent mais personne ne nous les a jamais présentés clairement.", department: "RH", sentiment: 'critical' as const },
      { text: "Mon manager n'en parle jamais, donc ça ne peut pas être si important.", department: "Logistique", sentiment: 'neutral' as const },
    ]
  },

  section5: {
    currentFTE: 0.5,
    recommendedFTE: 2.0,
    analysisText: "Avec 800 collaborateurs et un scope 3 significatif, votre démarche nécessite au minimum 1.5 à 2 ETP dédiés. Actuellement, votre responsable RSE y consacre environ 50% de son temps, le reste étant absorbé par la qualité et la conformité réglementaire.",
    recommendations: [
      "Recruter un(e) chargé(e) de mission climat à temps plein (coût estimé : 45-55k€/an)",
      "Formaliser le temps RSE dans la fiche de poste du/de la responsable actuel(le)",
      "Identifier des relais dans chaque direction métier (réseau d'ambassadeurs)"
    ]
  },

  section6: {
    hasFootprint: true,
    total: 12500,
    scope1: 1800,
    scope2: 950,
    scope3: 9750,
    perEmployee: 15.6,
    perRevenue: 0.25,
    sectorAverage: 18.2,
    sectorAverageRevenue: 0.31
  },

  section7: {
    deadlines: [
      { date: "Janvier 2026", obligation: "Reporting CSRD", description: "Premier reporting pour les entreprises de +500 salariés cotées", status: "En cours" as const },
      { date: "Juin 2026", obligation: "Bilan GES réglementaire", description: "Mise à jour obligatoire tous les 4 ans pour +500 salariés", status: "Pas commence" as const },
      { date: "Janvier 2027", obligation: "Taxonomie européenne", description: "Alignement des activités sur les critères techniques", status: "Pas commence" as const },
      { date: "Janvier 2027", obligation: "Devoir de vigilance", description: "Plan de vigilance incluant les risques climatiques", status: "En cours" as const },
      { date: "2027-2028", obligation: "Exigences donneurs d'ordre", description: "Scope 3 fournisseurs exigé par vos clients grands comptes", status: "Pas commence" as const },
      { date: "2028", obligation: "Affichage environnemental", description: "Score environnemental obligatoire sur certains produits", status: "Pas commence" as const }
    ]
  },

  section8: {
    tiles: [
      { name: "Bilan Carbone", status: "Realise" as const, relevance: null },
      { name: "BEGES réglementaire", status: "Realise" as const, relevance: null },
      { name: "Stratégie climat", status: "En cours" as const, relevance: null },
      { name: "Trajectoire SBTi", status: "Pas fait" as const, relevance: "Essentiel" as const },
      { name: "Reporting CSRD", status: "En cours" as const, relevance: null },
      { name: "Plan de mobilité", status: "Pas fait" as const, relevance: "Recommande" as const },
      { name: "Achats responsables", status: "Pas fait" as const, relevance: "Essentiel" as const },
      { name: "Formation collaborateurs", status: "Realise" as const, relevance: null },
      { name: "Éco-conception", status: "Pas fait" as const, relevance: "Recommande" as const },
      { name: "Certification environnementale", status: "Pas fait" as const, relevance: "Optionnel" as const },
      { name: "Budget climat dédié", status: "Realise" as const, relevance: null },
      { name: "Poste dédié RSE", status: "En cours" as const, relevance: null }
    ]
  },

  section9: {
    quarters: [
      { label: "T1 2026", actions: ["Gouvernance : reporting trimestriel COMEX", "Lancer l'audit SBTi"] },
      { label: "T2 2026", actions: ["Programme sensibilisation managers", "Politique achats responsables"] },
      { label: "T3 2026", actions: ["Validation trajectoire SBTi", "Plan de mobilité"] },
      { label: "T4 2026", actions: ["Premier reporting CSRD", "Bilan annuel et ajustement"] }
    ]
  }
}

// Legacy exports for backward compatibility
export const MOCK_SYNTHESIS = {
  paragraphs: mockDiagnostic.section1.paragraphs,
  analyst: {
    name: mockDiagnostic.client.analyst.name,
    title: mockDiagnostic.client.analyst.title,
    date: mockDiagnostic.section1.date,
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
  { number: 1, title: mockDiagnostic.section2.priorities[0].title, why: mockDiagnostic.section2.priorities[0].why, effort: 'Rapide', budget: '<10k€' },
  { number: 2, title: mockDiagnostic.section2.priorities[1].title, why: mockDiagnostic.section2.priorities[1].why, effort: 'Projet', budget: '10-50k€' },
  { number: 3, title: mockDiagnostic.section2.priorities[2].title, why: mockDiagnostic.section2.priorities[2].why, effort: 'Projet', budget: '10-50k€' },
]

export const MOCK_ANTI_RECOMMENDATION = {
  title: 'Ce que nous ne recommandons PAS',
  text: mockDiagnostic.section2.antiRecommendation,
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

const DIMENSION_DETAILS: Record<string, { analysis: string; sectorPosition: string; sectorPositive: boolean }> = {
  'Gouvernance climat': {
    analysis: "Votre gouvernance est votre point fort. Le sujet est porté par la direction et un référent est identifié. Le principal axe de progression : formaliser un reporting régulier au COMEX pour créer une boucle de feedback.",
    sectorPosition: "Top 30% de votre secteur",
    sectorPositive: true,
  },
  'Mesure et données': {
    analysis: "Votre Bilan Carbone est récent et couvre les 3 scopes. La principale faiblesse : le suivi n'est pas encore automatisé. Vous dépendez d'un exercice annuel ponctuel plutôt que d'un monitoring continu.",
    sectorPosition: "Dans la moyenne sectorielle",
    sectorPositive: true,
  },
  'Stratégie et trajectoire': {
    analysis: "Une stratégie existe mais reste déclarative. Les objectifs ne sont pas encore adossés à une trajectoire quantifiée (type SBTi). C'est le levier principal pour crédibiliser votre démarche.",
    sectorPosition: "En dessous de la moyenne sectorielle",
    sectorPositive: false,
  },
  'Culture et engagement': {
    analysis: "C'est votre principale zone de fragilité. L'écart entre votre perception et celle de vos équipes est significatif (−3.8 points en moyenne). Les managers ne relaient pas suffisamment la démarche vers le terrain.",
    sectorPosition: "En dessous de la moyenne sectorielle",
    sectorPositive: false,
  },
}

export const MOCK_MATURITY = {
  globalScore: mockDiagnostic.section3.globalScore,
  globalLetter: mockDiagnostic.section3.globalGrade,
  globalLabel: 'Structuré',
  globalColor: '#2D6A4F',
  dimensions: mockDiagnostic.section3.dimensions.map(d => {
    const details = DIMENSION_DETAILS[d.name] || { analysis: '', sectorPosition: '', sectorPositive: true }
    return {
      id: d.name.toLowerCase().replace(/ /g, '_'),
      label: d.name,
      score: d.score,
      letter: d.grade,
      color: d.grade === 'A' ? '#1B4332' : d.grade === 'B' ? '#2D6A4F' : d.grade === 'C' ? '#B87333' : '#DC4A4A',
      analysis: details.analysis,
      sectorPosition: details.sectorPosition,
      sectorPositive: details.sectorPositive,
    }
  }) as DimensionScore[],
  profileSummary: "Vous êtes en phase de structuration. Les fondations sont posées — gouvernance identifiée, données collectées — mais la démarche n'a pas encore infusé dans la culture de l'organisation. Le passage de « conformité » à « conviction » est votre prochain palier.",
  sectorAverages: { gouvernance: 58, mesure: 65, strategie: 62, culture: 52, global: 59 },
}

export const PERCEPTION_LABELS = mockDiagnostic.section4.perceptionData.map(d => d.label)

export const MOCK_PERCEPTION_GAPS = {
  rseScores: mockDiagnostic.section4.perceptionData.map(d => d.rse),
  rsePredictions: mockDiagnostic.section4.perceptionData.map(d => d.prediction),
  employeeScores: mockDiagnostic.section4.perceptionData.map(d => d.terrain),
}

export const MOCK_POPULATION_COMPARISON = {
  rseEstimate: [
    mockDiagnostic.section4.populationEstimated.moteurs,
    mockDiagnostic.section4.populationEstimated.engages,
    mockDiagnostic.section4.populationEstimated.indifferents,
    mockDiagnostic.section4.populationEstimated.sceptiques,
    mockDiagnostic.section4.populationEstimated.refractaires,
  ],
  employeeReal: [
    mockDiagnostic.section4.populationReal.moteurs,
    mockDiagnostic.section4.populationReal.engages,
    mockDiagnostic.section4.populationReal.indifferents,
    mockDiagnostic.section4.populationReal.sceptiques,
    mockDiagnostic.section4.populationReal.refractaires,
  ],
}

export const MOCK_DG_COMPARISON = {
  hasResponded: true,
  budgetDeclared: '200 000 € à 500 000 €',
  budgetPerceived: '50 000 € à 200 000 €',
  dgMeansScore: 7.5,
  rseMeansScore: 5.8,
}

export const MOCK_HUMAN_CAPITAL = {
  currentFTE: mockDiagnostic.section5.currentFTE,
  recommendedFTE: mockDiagnostic.section5.recommendedFTE,
  population: [8, 22, 35, 25, 10],
  analysis: [mockDiagnostic.section5.analysisText],
}

export const MOCK_FOOTPRINT = {
  hasFootprint: mockDiagnostic.section6.hasFootprint,
  total: mockDiagnostic.section6.total,
  scope1: mockDiagnostic.section6.scope1,
  scope2: mockDiagnostic.section6.scope2,
  scope3: mockDiagnostic.section6.scope3,
  employees: 800,
  revenue: 50000,
  intensityPerEmployee: mockDiagnostic.section6.perEmployee,
  intensityPerRevenue: mockDiagnostic.section6.perRevenue,
  sectorAvgIntensity: mockDiagnostic.section6.sectorAverage,
  sectorAverageRevenue: mockDiagnostic.section6.sectorAverageRevenue,
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

export interface Deadline {
  date: string
  title: string
  description: string
  status: 'Prêt' | 'En cours' | 'Pas commencé'
  urgent: boolean
}

export const MOCK_DEADLINES: Deadline[] = [
  { date: 'Janvier 2026', title: 'CSRD — Premier rapport de durabilité', description: "Publication obligatoire pour les entreprises de plus de 250 salariés.", status: 'En cours', urgent: true },
  { date: 'Mars 2026', title: 'Taxonomie européenne — Reporting', description: "Analyse d'éligibilité et d'alignement.", status: 'Pas commencé', urgent: true },
  { date: 'Juin 2026', title: 'Bilan GES réglementaire', description: "Mise à jour obligatoire du bilan GES.", status: 'En cours', urgent: false },
  { date: 'Janvier 2027', title: 'Devoir de vigilance', description: "Intégration des risques climatiques.", status: 'Pas commencé', urgent: false },
  { date: 'Juin 2027', title: 'RE2020 — Conformité bâtiments', description: "Échéance pour les bâtiments tertiaires.", status: 'Prêt', urgent: false },
  { date: 'Janvier 2028', title: 'CSRD — Deuxième cycle', description: "Deuxième publication avec indicateurs de progression.", status: 'Pas commencé', urgent: false },
]

export interface TileEnrichment {
  status: 'done' | 'in_progress' | 'not_started'
  relevance: 'essential' | 'recommended' | 'optional'
  celsiusOffer?: string
}

export const MOCK_TILE_ENRICHMENTS: Record<string, TileEnrichment> = {
  bilan_carbone: { status: 'done', relevance: 'essential' },
  strategie_climat: { status: 'in_progress', relevance: 'essential' },
  objectifs_reduction: { status: 'not_started', relevance: 'essential', celsiusOffer: 'Accompagnement trajectoire SBTi — 6 à 8 semaines' },
  rapport_rse: { status: 'not_started', relevance: 'essential', celsiusOffer: 'Reporting CSRD clé en main — à partir de 15k€' },
  certification: { status: 'not_started', relevance: 'optional' },
  formation: { status: 'in_progress', relevance: 'recommended', celsiusOffer: 'Fresque du Climat + ateliers métiers sur mesure' },
  eco_conception: { status: 'not_started', relevance: 'recommended', celsiusOffer: 'ACV produit & démarche d\'éco-conception' },
  achats_responsables: { status: 'not_started', relevance: 'essential', celsiusOffer: 'Audit fournisseurs & politique achats responsables' },
  mobilite: { status: 'done', relevance: 'recommended' },
  acv: { status: 'not_started', relevance: 'optional' },
  compensation: { status: 'not_started', relevance: 'optional' },
  initiatives_collectives: { status: 'in_progress', relevance: 'recommended' },
}

export interface QuarterlyAction {
  label: string
  priority: number
}

export interface Quarter {
  quarter: string
  actions: QuarterlyAction[]
}

export const MOCK_QUARTERLY_PLAN: Quarter[] = [
  { quarter: 'T1 2026', actions: [{ label: 'Constituer le comité climat', priority: 1 }, { label: 'Nommer les ambassadeurs internes', priority: 2 }] },
  { quarter: 'T2 2026', actions: [{ label: 'Premier comité climat', priority: 1 }, { label: 'Fresque du Climat managers', priority: 2 }, { label: 'Audit fournisseurs top 20', priority: 3 }] },
  { quarter: 'T3 2026', actions: [{ label: 'Intégrer le climat dans le budget 2027', priority: 1 }, { label: 'Ateliers métiers climat', priority: 2 }] },
  { quarter: 'T4 2026', actions: [{ label: 'Bilan du comité climat', priority: 1 }, { label: 'Critères carbone dans les appels d\'offres', priority: 3 }, { label: 'Mesure d\'impact sensibilisation', priority: 2 }] },
]
