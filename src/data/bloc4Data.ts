// ============================================
// BOUSSOLE CLIMAT — Bloc 4 : Perception
// ============================================

export const PERCEPTION_AFFIRMATIONS = [
  "La direction de mon entreprise considère le climat comme un sujet stratégique.",
  "Mon entreprise met les moyens nécessaires pour avancer sur le climat.",
  "Nos objectifs climat sont clairs et partagés en interne.",
  "Les équipes se sentent impliquées dans la démarche climat.",
  "Nous mesurons régulièrement nos progrès climat.",
  "Le sujet climat est intégré dans nos décisions business courantes.",
  "Nos parties prenantes externes reconnaissent nos efforts climat.",
  "Je suis confiant(e) dans la capacité de mon entreprise à atteindre ses objectifs climat.",
] as const

export interface PopulationProfile {
  id: string
  icon: string
  label: string
  description: string
  color: string
}

export const POPULATION_PROFILES: PopulationProfile[] = [
  { id: 'moteurs', icon: '🚀', label: 'Moteurs', description: 'Portent la démarche, force de proposition', color: '#1B5E3B' },
  { id: 'engages', icon: '✅', label: 'Engagés', description: 'Adhèrent et participent activement', color: '#2D7A50' },
  { id: 'indifferents', icon: '😐', label: 'Indifférents', description: 'Ni pour ni contre, suivent le mouvement', color: '#F5A623' },
  { id: 'sceptiques', icon: '🤨', label: 'Sceptiques', description: 'Doutent de l\'utilité ou de la faisabilité', color: '#E8734A' },
  { id: 'refractaires', icon: '❌', label: 'Réfractaires', description: 'Résistent activement à la démarche', color: '#DC4A4A' },
]

export const SURVEY_TEMPLATE = `Bonjour,

Dans le cadre de notre démarche climat, nous souhaitons recueillir votre perception sur notre engagement environnemental.

Ce questionnaire est anonyme et prend environ 5 minutes. Vos réponses nous aideront à mieux comprendre où nous en sommes et à identifier nos axes de progression.

Merci pour votre participation !`

export function getRecommendedRespondents(effectif: string): string {
  if (['1-10', '11-50'].includes(effectif)) return 'au moins 10 répondants'
  if (effectif === '51-250') return 'au moins 20 répondants'
  if (['251-500', '501-1000'].includes(effectif)) return 'au moins 30 répondants'
  return 'au moins 50 répondants'
}
