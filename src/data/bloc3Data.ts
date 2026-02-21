// ============================================
// BOUSSOLE CLIMAT — Bloc 3 : Enjeux et vision
// ============================================

export const MOTEURS = [
  'Conviction personnelle du dirigeant',
  'Pression réglementaire (CSRD, BEGES, taxonomie)',
  'Demande clients ou donneurs d\'ordre',
  'Attractivité employeur',
  'Réduction des coûts',
  'Accès financements ou marchés publics',
  'Anticipation des risques physiques',
  'Image et réputation',
] as const

export const FREINS = [
  'Manque de budget',
  'Manque de temps / priorités concurrentes',
  'Manque de compétences internes',
  'Manque d\'engagement de la direction',
  'Complexité perçue du sujet',
  'Difficulté à mesurer le ROI',
  'Résistance au changement des équipes',
] as const

export interface RegulatoryRow {
  id: string
  label: string
}

export const REGULATORY_ROWS: RegulatoryRow[] = [
  { id: 'csrd', label: 'Reporting CSRD' },
  { id: 'beges', label: 'Bilan GES réglementaire' },
  { id: 'taxonomie', label: 'Taxonomie européenne' },
  { id: 'vigilance', label: 'Devoir de vigilance' },
  { id: 'donneurs', label: 'Exigences carbone donneurs d\'ordre' },
  { id: 'affichage', label: 'Affichage environnemental produits' },
]

export const REGULATORY_COLUMNS = [
  'Déjà concerné',
  'Sous 12 mois',
  'Sous 2-3 ans',
  'Pas concerné',
  'Je ne sais pas',
] as const

export type RegulatoryAnswer = typeof REGULATORY_COLUMNS[number]
