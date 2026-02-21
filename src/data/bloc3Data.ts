// ============================================
// BOUSSOLE CLIMAT — Bloc 3 : Enjeux et vision
// ============================================

export const MOTEURS = [
  'Conviction personnelle du dirigeant',
  'Pression réglementaire',
  'Demande clients / donneurs d\'ordre',
  'Attentes des salariés',
  'Réduction des coûts',
  'Image et réputation',
  'Anticipation des risques',
  'Accès aux financements verts',
] as const

export const FREINS = [
  'Manque de budget',
  'Manque de temps / ressources',
  "Manque d'expertise interne",
  'Pas de soutien de la direction',
  'Sujet pas prioritaire pour le business',
  'Complexité réglementaire',
  'Difficulté à mesurer le ROI',
] as const

export interface RegulatoryRow {
  id: string
  label: string
}

export const REGULATORY_ROWS: RegulatoryRow[] = [
  { id: 'csrd', label: 'CSRD' },
  { id: 'taxonomie', label: 'Taxonomie européenne' },
  { id: 'snbc', label: 'SNBC / Stratégie nationale' },
  { id: 'loi_climat', label: 'Loi Climat et Résilience' },
  { id: 'vigilance', label: 'Devoir de vigilance' },
  { id: 're2020', label: 'RE2020 / décret tertiaire' },
]

export const REGULATORY_COLUMNS = [
  'Déjà concerné',
  'Sous 12 mois',
  'Sous 2-3 ans',
  'Pas concerné',
  'Je ne sais pas',
] as const

export type RegulatoryAnswer = typeof REGULATORY_COLUMNS[number]
