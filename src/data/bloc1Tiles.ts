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
  { id: 'bilan_carbone', label: 'Bilan Carbone ou Bilan GES', description: 'Bilan de gaz à effet de serre (scopes 1, 2, 3)' },
  { id: 'beges_r', label: 'Bilan GES réglementaire (BEGES-r)', description: 'Bilan réglementaire obligatoire' },
  { id: 'strategie_climat', label: 'Stratégie climat formalisée', description: 'Plan d\'action structuré avec objectifs et calendrier' },
  { id: 'trajectoire_reduction', label: 'Trajectoire de réduction (SBTi ou autre)', description: 'Cibles quantitatives de réduction des émissions' },
  { id: 'reporting_csrd', label: 'Reporting CSRD / DPEF', description: 'Publication extra-financière formelle' },
  { id: 'mobilite', label: 'Plan de mobilité', description: 'Plan de déplacements et mobilité durable' },
  { id: 'achats_responsables', label: 'Politique achats responsables', description: 'Critères environnementaux dans les achats' },
  { id: 'formation', label: 'Formation / sensibilisation collaborateurs', description: 'Actions de formation climat en interne' },
  { id: 'eco_conception', label: 'Éco-conception produits/services', description: 'Intégration environnementale dans la conception' },
  { id: 'certification', label: 'Certification environnementale', description: 'Label ou certification (ISO 14001, B Corp, etc.)' },
  { id: 'budget_rse', label: 'Budget climat/RSE dédié', description: 'Enveloppe budgétaire dédiée au climat' },
  { id: 'poste_rse', label: 'Poste dédié RSE/climat', description: 'Ressource humaine dédiée à la RSE' },
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
  { value: '<1M', label: 'Moins de 1 M€' },
  { value: '1-10M', label: '1 à 10 M€' },
  { value: '10-50M', label: '10 à 50 M€' },
  { value: '50-200M', label: '50 à 200 M€' },
  { value: '200M-1Md', label: '200 M€ à 1 Md€' },
  { value: '>1Md', label: 'Plus de 1 Md€' },
]
