// ============================================
// BOUSSOLE CLIMAT — Bloc 4 : Perception
// ============================================

export const PERCEPTION_AFFIRMATIONS = [
  "La direction considère le climat comme un sujet stratégique.",
  "Les moyens alloués (budget, équipe, temps) sont suffisants.",
  "Les objectifs climat sont clairs et partagés en interne.",
  "Les équipes se sentent impliquées dans la démarche.",
  "Nous mesurons régulièrement nos progrès.",
  "Le climat est intégré dans nos décisions business.",
  "Nos parties prenantes reconnaissent nos efforts.",
  "Je suis confiant(e) dans notre capacité à atteindre nos objectifs.",
] as const

export interface PopulationProfile {
  id: string
  iconName: string // Lucide icon name
  label: string
  description: string
  color: string
}

export const POPULATION_PROFILES: PopulationProfile[] = [
  { id: 'moteurs', iconName: 'Rocket', label: 'Moteurs', description: 'Portent la démarche', color: '#1B4332' },
  { id: 'engages', iconName: 'CheckCircle', label: 'Engagés', description: 'Participent activement', color: '#2D6A4F' },
  { id: 'indifferents', iconName: 'Minus', label: 'Indifférents', description: 'Suivent le mouvement', color: '#B0AB9F' },
  { id: 'sceptiques', iconName: 'HelpCircle', label: 'Sceptiques', description: 'Doutent de la faisabilité', color: '#B87333' },
  { id: 'refractaires', iconName: 'XCircle', label: 'Réfractaires', description: 'Résistent activement', color: '#DC4A4A' },
]

export const SURVEY_TEMPLATE = `Bonjour, dans le cadre de notre démarche climat, nous souhaitons recueillir votre perception. Anonyme, 5 minutes. Merci.`

export function getRecommendedRespondents(effectif: string): string {
  if (['1-10', '11-50'].includes(effectif)) return 'au moins 10 répondants'
  if (effectif === '51-250') return 'au moins 20 répondants'
  if (['251-500', '501-1000'].includes(effectif)) return 'au moins 30 répondants'
  return 'au moins 50 répondants'
}
