// ============================================
// BOUSSOLE CLIMAT — Questionnaire definitions
// ============================================

export interface QuestionOption {
  value: number
  label: string
}

export interface Question {
  key: string
  text: string
  helpText?: string
  type: 'scale' | 'text' | 'single_choice'
  options?: QuestionOption[]
}

export interface QuestionBlock {
  block: 1 | 2 | 3 | 4
  title: string
  subtitle: string
  estimatedMinutes: number
  questions: Question[]
}

const SCALE_OPTIONS: QuestionOption[] = [
  { value: 1, label: 'Pas du tout' },
  { value: 2, label: 'Un peu' },
  { value: 3, label: 'Modérément' },
  { value: 4, label: 'Bien engagé' },
]

export const QUESTIONNAIRE_BLOCKS: QuestionBlock[] = [
  {
    block: 1,
    title: 'Votre démarche',
    subtitle: "Décrivez l'état actuel de votre démarche RSE et climat.",
    estimatedMinutes: 10,
    questions: [
      {
        key: 'b1_q1',
        text: 'Votre entreprise a-t-elle formalisé une stratégie RSE ou climat ?',
        helpText: "Une stratégie formalisée inclut des objectifs chiffrés, un calendrier et des responsables identifiés.",
        type: 'scale',
        options: SCALE_OPTIONS,
      },
      {
        key: 'b1_q2',
        text: 'Le sujet climat est-il porté au niveau de la direction générale ?',
        helpText: "Le portage inclut des revues régulières en comité de direction ou au conseil d'administration.",
        type: 'scale',
        options: SCALE_OPTIONS,
      },
      {
        key: 'b1_q3',
        text: 'Disposez-vous de ressources dédiées (équipe, budget) à la transition écologique ?',
        helpText: 'Cela inclut les ETP dédiés, le budget annuel fléché, et les prestataires externes.',
        type: 'scale',
        options: SCALE_OPTIONS,
      },
      {
        key: 'b1_q4',
        text: 'Avez-vous réalisé un bilan carbone ou une analyse de cycle de vie ?',
        helpText: 'Bilan GES scopes 1, 2 et/ou 3, ACV produit, empreinte eau, etc.',
        type: 'scale',
        options: SCALE_OPTIONS,
      },
      {
        key: 'b1_q5',
        text: 'Communiquez-vous de manière régulière sur vos engagements et résultats ?',
        helpText: 'Rapport extra-financier, DPEF, page dédiée sur le site, communication interne.',
        type: 'scale',
        options: SCALE_OPTIONS,
      },
      {
        key: 'b1_q6',
        text: 'Quels sont les principaux freins que vous rencontrez dans votre démarche ?',
        type: 'text',
      },
    ],
  },
  {
    block: 2,
    title: 'Votre maturité',
    subtitle: 'Évaluez le niveau de maturité de votre organisation sur les dimensions clés.',
    estimatedMinutes: 15,
    questions: [],
  },
  {
    block: 3,
    title: 'Vos enjeux',
    subtitle: 'Identifiez et hiérarchisez vos enjeux climat prioritaires.',
    estimatedMinutes: 12,
    questions: [],
  },
  {
    block: 4,
    title: 'La perception',
    subtitle: 'Comment le climat est-il perçu en interne ?',
    estimatedMinutes: 8,
    questions: [],
  },
]
