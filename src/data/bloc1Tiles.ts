// ============================================
// BOUSSOLE CLIMAT — Bloc 1 : Tuiles d'avancement
// ============================================

export type TileStatus = 'done' | 'in_progress' | 'not_started'

export interface AdvancementTile {
  id: string
  label: string
  description: string
}

export const ADVANCEMENT_TILES: AdvancementTile[] = [
  { id: 'bilan_carbone', label: 'Bilan Carbone / Bilan GES', description: 'Bilan de gaz à effet de serre (scopes 1, 2, 3)' },
  { id: 'strategie_climat', label: 'Stratégie climat / feuille de route', description: "Plan d'action structuré avec objectifs et calendrier" },
  { id: 'objectifs_reduction', label: 'Objectifs chiffrés de réduction', description: 'Cibles quantitatives de réduction des émissions' },
  { id: 'rapport_rse', label: 'Rapport RSE / DPEF / rapport de durabilité', description: 'Publication extra-financière formelle' },
  { id: 'certification', label: 'Certification (ISO 14001, B Corp, etc.)', description: 'Label ou certification environnementale' },
  { id: 'formation', label: 'Formation / sensibilisation des équipes', description: 'Actions de formation climat en interne' },
  { id: 'eco_conception', label: 'Éco-conception produits ou services', description: 'Intégration environnementale dans la conception' },
  { id: 'achats_responsables', label: 'Politique achats responsables', description: 'Critères environnementaux dans les achats' },
  { id: 'mobilite', label: 'Plan de mobilité durable', description: 'Plan de déplacements et mobilité verte' },
  { id: 'acv', label: 'Analyse de Cycle de Vie (ACV)', description: "Évaluation des impacts environnementaux d'un produit ou service" },
  { id: 'compensation', label: 'Compensation / contribution carbone', description: 'Projets de compensation ou contribution climat' },
  { id: 'initiatives_collectives', label: 'Participation à des initiatives collectives', description: 'Engagement dans des démarches sectorielles ou territoriales' },
]

export const HEADCOUNT_OPTIONS = [
  { value: '1-10', label: '1 à 10 salariés' },
  { value: '11-50', label: '11 à 50 salariés' },
  { value: '51-250', label: '51 à 250 salariés' },
  { value: '251-500', label: '251 à 500 salariés' },
  { value: '501-1000', label: '501 à 1 000 salariés' },
  { value: '1001-5000', label: '1 001 à 5 000 salariés' },
  { value: '5000+', label: 'Plus de 5 000 salariés' },
]

export const REVENUE_OPTIONS = [
  { value: '<1M', label: "Moins de 1 M€" },
  { value: '1-10M', label: '1 à 10 M€' },
  { value: '10-50M', label: '10 à 50 M€' },
  { value: '50-200M', label: '50 à 200 M€' },
  { value: '200M-1Md', label: '200 M€ à 1 Md€' },
  { value: '>1Md', label: 'Plus de 1 Md€' },
]
