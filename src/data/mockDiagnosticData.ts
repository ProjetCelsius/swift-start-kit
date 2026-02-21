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
