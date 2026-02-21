// ============================================
// BOUSSOLE CLIMAT — Bloc 2 : Maturité climat
// 4 dimensions × 5 questions = 20 questions
// ============================================

export interface MaturityOption {
  level: 1 | 2 | 3 | 4
  text: string
}

export interface MaturityQuestion {
  key: string
  title: string
  options: [MaturityOption, MaturityOption, MaturityOption, MaturityOption]
}

export interface MaturityDimension {
  id: string
  label: string
  questions: MaturityQuestion[]
}

export const MATURITY_DIMENSIONS: MaturityDimension[] = [
  {
    id: 'gouvernance',
    label: 'Gouvernance climat',
    questions: [
      {
        key: 'g1',
        title: 'Portage de la démarche',
        options: [
          { level: 1, text: "Le sujet climat n'est porté par personne en particulier dans l'organisation." },
          { level: 2, text: "Un référent a été désigné mais sans mandat formel ni temps dédié." },
          { level: 3, text: "Un responsable dédié pilote la démarche avec un reporting régulier en comité de direction." },
          { level: 4, text: "Le climat est intégré dans la gouvernance au plus haut niveau, avec un comité dédié et des objectifs liés à la rémunération des dirigeants." },
        ],
      },
      {
        key: 'g2',
        title: 'Stratégie et feuille de route',
        options: [
          { level: 1, text: "Aucune stratégie climat formalisée n'existe à ce jour." },
          { level: 2, text: "Des actions ponctuelles sont menées sans vision d'ensemble structurée." },
          { level: 3, text: "Une feuille de route climat existe avec des objectifs chiffrés et un calendrier." },
          { level: 4, text: "La stratégie climat est alignée sur une trajectoire scientifique (SBTi ou équivalent) et intégrée au plan stratégique global." },
        ],
      },
      {
        key: 'g3',
        title: 'Budget et ressources',
        options: [
          { level: 1, text: "Aucun budget spécifique n'est alloué aux actions climat." },
          { level: 2, text: "Un budget ponctuel est mobilisé au cas par cas pour certaines actions." },
          { level: 3, text: "Un budget annuel dédié existe, avec des ressources humaines identifiées." },
          { level: 4, text: "Le budget climat est pluriannuel, intégré au plan d'investissement, avec un suivi du ROI carbone." },
        ],
      },
      {
        key: 'g4',
        title: 'Intégration dans les décisions',
        options: [
          { level: 1, text: "Le critère climat n'est pas pris en compte dans les décisions d'investissement ou stratégiques." },
          { level: 2, text: "Le climat est évoqué occasionnellement mais sans critère formel." },
          { level: 3, text: "Un critère carbone est systématiquement intégré dans les décisions d'investissement majeures." },
          { level: 4, text: "Un prix interne du carbone est appliqué et un processus de due diligence climat est en place pour toutes les décisions stratégiques." },
        ],
      },
      {
        key: 'g5',
        title: 'Conformité réglementaire',
        options: [
          { level: 1, text: "La veille réglementaire climat est inexistante ou non structurée." },
          { level: 2, text: "Les obligations réglementaires sont connues mais la conformité n'est pas systématiquement vérifiée." },
          { level: 3, text: "Un dispositif de veille et de conformité est en place, couvrant CSRD, taxonomie et réglementations sectorielles." },
          { level: 4, text: "L'entreprise anticipe les évolutions réglementaires et participe activement aux consultations sectorielles." },
        ],
      },
    ],
  },
  {
    id: 'mesure',
    label: 'Mesure et données',
    questions: [
      {
        key: 'm1',
        title: 'Bilan carbone',
        options: [
          { level: 1, text: "Aucun bilan carbone n'a été réalisé." },
          { level: 2, text: "Un premier bilan a été réalisé mais il est partiel (scopes 1 et 2 uniquement)." },
          { level: 3, text: "Un bilan complet (scopes 1, 2 et 3) est réalisé régulièrement avec une méthodologie reconnue." },
          { level: 4, text: "Le bilan est annuel, vérifié par un tiers, couvre l'ensemble de la chaîne de valeur et alimente un tableau de bord en temps réel." },
        ],
      },
      {
        key: 'm2',
        title: 'Qualité des données',
        options: [
          { level: 1, text: "Les données environnementales sont inexistantes ou dispersées." },
          { level: 2, text: "Des données existent mais sont collectées de manière non structurée et peu fiables." },
          { level: 3, text: "Un système de collecte structuré est en place avec des données vérifiables et traçables." },
          { level: 4, text: "Les données sont automatisées, auditées et intégrées dans le système d'information de l'entreprise." },
        ],
      },
      {
        key: 'm3',
        title: 'Indicateurs de suivi',
        options: [
          { level: 1, text: "Aucun indicateur climat n'est suivi de manière régulière." },
          { level: 2, text: "Quelques indicateurs sont suivis de manière ponctuelle sans cadre défini." },
          { level: 3, text: "Un tableau de bord avec des KPIs climat est suivi trimestriellement et partagé en interne." },
          { level: 4, text: "Les KPIs climat sont intégrés au reporting financier et communiqués aux parties prenantes externes." },
        ],
      },
      {
        key: 'm4',
        title: 'Scope 3 et chaîne de valeur',
        options: [
          { level: 1, text: "Le scope 3 n'a jamais été évalué." },
          { level: 2, text: "Une estimation partielle du scope 3 a été réalisée sur quelques catégories." },
          { level: 3, text: "Le scope 3 est mesuré sur les catégories significatives avec des données fournisseurs." },
          { level: 4, text: "Un programme d'engagement fournisseurs est en place pour améliorer la qualité des données scope 3 et réduire les émissions amont/aval." },
        ],
      },
      {
        key: 'm5',
        title: 'Analyse de risques climat',
        options: [
          { level: 1, text: "Les risques climatiques (physiques et de transition) n'ont pas été identifiés." },
          { level: 2, text: "Une première identification qualitative des risques a été réalisée." },
          { level: 3, text: "Une analyse de risques structurée (type TCFD) est réalisée avec des scénarios." },
          { level: 4, text: "L'analyse de risques est intégrée dans la cartographie des risques de l'entreprise avec des plans d'adaptation chiffrés." },
        ],
      },
    ],
  },
  {
    id: 'action',
    label: 'Actions et résultats',
    questions: [
      {
        key: 'a1',
        title: 'Plan de réduction des émissions',
        options: [
          { level: 1, text: "Aucun plan de réduction n'est formalisé." },
          { level: 2, text: "Des actions de réduction ponctuelles sont menées sans objectif global." },
          { level: 3, text: "Un plan de réduction pluriannuel existe avec des jalons intermédiaires et un suivi." },
          { level: 4, text: "Le plan est aligné sur une trajectoire 1.5°C/2°C, avec des résultats mesurés et publiés annuellement." },
        ],
      },
      {
        key: 'a2',
        title: 'Efficacité énergétique',
        options: [
          { level: 1, text: "Aucune action structurée sur l'efficacité énergétique n'est en place." },
          { level: 2, text: "Des actions d'économie d'énergie sont menées de manière opportuniste." },
          { level: 3, text: "Un plan d'efficacité énergétique couvre les principaux postes avec un suivi des consommations." },
          { level: 4, text: "Un système de management de l'énergie (ISO 50001 ou équivalent) est en place avec des objectifs ambitieux de décarbonation." },
        ],
      },
      {
        key: 'a3',
        title: 'Éco-conception et offre',
        options: [
          { level: 1, text: "L'impact environnemental des produits/services n'est pas pris en compte." },
          { level: 2, text: "Quelques initiatives d'éco-conception existent sur certains produits." },
          { level: 3, text: "Une démarche d'éco-conception systématique est intégrée dans le processus de développement." },
          { level: 4, text: "L'ensemble de l'offre est évalué via des ACV et l'entreprise développe des modèles économiques bas-carbone." },
        ],
      },
      {
        key: 'a4',
        title: 'Achats et fournisseurs',
        options: [
          { level: 1, text: "Les critères environnementaux ne sont pas intégrés dans la politique achats." },
          { level: 2, text: "Des critères environnementaux sont intégrés dans certains appels d'offres." },
          { level: 3, text: "Une politique achats responsables couvre les fournisseurs stratégiques avec des critères carbone." },
          { level: 4, text: "Un programme d'accompagnement fournisseurs est en place avec des objectifs de réduction partagés et un suivi régulier." },
        ],
      },
      {
        key: 'a5',
        title: 'Mobilité et logistique',
        options: [
          { level: 1, text: "Aucune action sur la mobilité ou la logistique durable n'est en place." },
          { level: 2, text: "Des initiatives ponctuelles existent (covoiturage, vélos, etc.) sans plan structuré." },
          { level: 3, text: "Un plan de mobilité durable est déployé avec des objectifs de réduction des déplacements et du fret." },
          { level: 4, text: "La flotte est en cours d'électrification, le télétravail est structuré, et la logistique intègre des critères carbone dans le choix des transporteurs." },
        ],
      },
    ],
  },
  {
    id: 'culture',
    label: 'Culture et engagement',
    questions: [
      {
        key: 'c1',
        title: 'Sensibilisation des collaborateurs',
        options: [
          { level: 1, text: "Aucune action de sensibilisation climat n'a été menée auprès des équipes." },
          { level: 2, text: "Des communications ponctuelles sont diffusées mais sans programme structuré." },
          { level: 3, text: "Un programme de sensibilisation régulier existe (Fresque du Climat, ateliers, e-learning)." },
          { level: 4, text: "La culture climat est intégrée dans l'onboarding, la formation continue et les objectifs individuels." },
        ],
      },
      {
        key: 'c2',
        title: 'Engagement de la direction',
        options: [
          { level: 1, text: "La direction ne communique pas sur le sujet climat." },
          { level: 2, text: "La direction évoque le sujet climat de manière occasionnelle." },
          { level: 3, text: "La direction porte publiquement les engagements climat et participe aux revues de performance." },
          { level: 4, text: "La direction est exemplaire, formée, et les objectifs climat sont liés aux évaluations de performance des managers." },
        ],
      },
      {
        key: 'c3',
        title: 'Participation des collaborateurs',
        options: [
          { level: 1, text: "Les collaborateurs ne sont pas impliqués dans la démarche climat." },
          { level: 2, text: "Quelques volontaires participent à des initiatives environnementales ponctuelles." },
          { level: 3, text: "Des ambassadeurs climat sont formés et animent la démarche dans les équipes." },
          { level: 4, text: "Un programme de participation structuré permet à chaque collaborateur de contribuer avec des objectifs et une reconnaissance." },
        ],
      },
      {
        key: 'c4',
        title: 'Communication externe',
        options: [
          { level: 1, text: "Aucune communication externe sur les engagements climat." },
          { level: 2, text: "Une communication ponctuelle existe (site web, rapport annuel) sans cadre structuré." },
          { level: 3, text: "Un rapport de durabilité est publié annuellement avec des engagements précis et des résultats." },
          { level: 4, text: "La communication est transparente, vérifiée par un tiers, et l'entreprise participe à des coalitions sectorielles (SBTi, RE100, etc.)." },
        ],
      },
      {
        key: 'c5',
        title: 'Innovation et prospective',
        options: [
          { level: 1, text: "L'innovation ne prend pas en compte les enjeux climatiques." },
          { level: 2, text: "Quelques projets d'innovation intègrent des critères environnementaux." },
          { level: 3, text: "Un budget R&D est fléché vers des solutions bas-carbone et l'innovation durable." },
          { level: 4, text: "L'entreprise développe des solutions disruptives bas-carbone et explore activement de nouveaux modèles économiques régénératifs." },
        ],
      },
    ],
  },
]

// Flatten all questions with their dimension index for easy pagination
export function getAllQuestions() {
  const result: { question: MaturityQuestion; dimensionIndex: number; dimensionLabel: string; questionIndexInDimension: number }[] = []
  MATURITY_DIMENSIONS.forEach((dim, di) => {
    dim.questions.forEach((q, qi) => {
      result.push({ question: q, dimensionIndex: di, dimensionLabel: dim.label, questionIndexInDimension: qi })
    })
  })
  return result
}
