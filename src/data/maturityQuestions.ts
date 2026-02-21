// ============================================
// BOUSSOLE CLIMAT — Bloc 2 : Maturité climat
// 4 dimensions × 5 questions = 20 questions
// ============================================

export interface MaturityQuestion {
  id: number
  dimension: string
  dimensionIndex: number
  title: string
  options: { level: number; text: string }[]
}

export const maturityQuestions: MaturityQuestion[] = [
  // === DIMENSION 1 — GOUVERNANCE CLIMAT (Q1-Q5) ===
  {
    id: 1, dimension: "Gouvernance climat", dimensionIndex: 0,
    title: "Portage de la démarche",
    options: [
      { level: 1, text: "Le sujet climat n'est pas porté par un responsable identifié" },
      { level: 2, text: "Un référent existe mais n'a pas de mandat formel ni de budget" },
      { level: 3, text: "Un responsable est nommé avec un budget et des objectifs, mais n'a pas d'accès direct au COMEX" },
      { level: 4, text: "Le climat est un sujet de COMEX avec un responsable dédié, un budget sanctuarisé et des KPIs suivis" }
    ]
  },
  {
    id: 2, dimension: "Gouvernance climat", dimensionIndex: 0,
    title: "Intégration stratégique",
    options: [
      { level: 1, text: "Le climat n'apparaît pas dans les documents stratégiques de l'entreprise" },
      { level: 2, text: "Le climat est mentionné dans la communication institutionnelle mais pas dans la stratégie opérationnelle" },
      { level: 3, text: "Des objectifs climat existent et sont intégrés dans certains plans d'action métiers" },
      { level: 4, text: "La stratégie climat est intégrée dans le plan stratégique global et conditionne les décisions d'investissement" }
    ]
  },
  {
    id: 3, dimension: "Gouvernance climat", dimensionIndex: 0,
    title: "Allocation de ressources",
    options: [
      { level: 1, text: "Pas de budget identifié pour les actions climat" },
      { level: 2, text: "Un budget existe mais il est ponctuel (mission par mission, pas pluriannuel)" },
      { level: 3, text: "Un budget annuel est dédié mais il est le premier à être coupé en cas de tensions" },
      { level: 4, text: "Le budget climat est pluriannuel, sanctuarisé, et indexé sur des objectifs de réduction mesurables" }
    ]
  },
  {
    id: 4, dimension: "Gouvernance climat", dimensionIndex: 0,
    title: "Reporting et suivi",
    options: [
      { level: 1, text: "Aucun suivi régulier des indicateurs climat" },
      { level: 2, text: "Un bilan carbone a été réalisé mais pas de suivi dans le temps" },
      { level: 3, text: "Des indicateurs sont suivis annuellement et présentés en interne" },
      { level: 4, text: "Un tableau de bord climat est mis à jour au moins trimestriellement et présenté au COMEX" }
    ]
  },
  {
    id: 5, dimension: "Gouvernance climat", dimensionIndex: 0,
    title: "Engagement de la direction",
    options: [
      { level: 1, text: "La direction considère le climat comme une contrainte réglementaire à gérer" },
      { level: 2, text: "La direction reconnaît l'importance du sujet mais ne s'implique pas personnellement" },
      { level: 3, text: "La direction porte le sujet publiquement et participe ponctuellement aux travaux" },
      { level: 4, text: "La direction est le premier ambassadeur, prend des décisions stratégiques fondées sur les données climat" }
    ]
  },
  // === DIMENSION 2 — MESURE ET DONNÉES (Q6-Q10) ===
  {
    id: 6, dimension: "Mesure et données", dimensionIndex: 1,
    title: "Qualité de la mesure carbone",
    options: [
      { level: 1, text: "L'entreprise n'a jamais quantifié ses émissions de gaz à effet de serre" },
      { level: 2, text: "Un bilan a été réalisé mais sur un périmètre partiel (scopes 1 et 2 uniquement, ou données très estimées)" },
      { level: 3, text: "Un bilan complet existe (scopes 1-2-3) avec des données majoritairement réelles" },
      { level: 4, text: "Le bilan est exhaustif, régulièrement mis à jour, avec des facteurs d'émission spécifiques et des données vérifiées" }
    ]
  },
  {
    id: 7, dimension: "Mesure et données", dimensionIndex: 1,
    title: "Couverture du scope 3",
    options: [
      { level: 1, text: "Le scope 3 n'a pas été évalué ou a été ignoré volontairement" },
      { level: 2, text: "Quelques postes du scope 3 ont été estimés de manière grossière" },
      { level: 3, text: "Les principaux postes du scope 3 sont couverts avec des données sectorielles" },
      { level: 4, text: "Le scope 3 est cartographié en détail, avec engagement des fournisseurs clés sur leurs propres données" }
    ]
  },
  {
    id: 8, dimension: "Mesure et données", dimensionIndex: 1,
    title: "Utilisation des données",
    options: [
      { level: 1, text: "Les données carbone, si elles existent, ne sont pas utilisées pour la prise de décision" },
      { level: 2, text: "Les données sont utilisées pour le reporting mais pas pour orienter les choix opérationnels" },
      { level: 3, text: "Les données carbone influencent certaines décisions (achats, logistique, immobilier)" },
      { level: 4, text: "Chaque décision d'investissement significative intègre une analyse d'impact carbone" }
    ]
  },
  {
    id: 9, dimension: "Mesure et données", dimensionIndex: 1,
    title: "Fiabilité et traçabilité",
    options: [
      { level: 1, text: "Les sources de données ne sont pas documentées" },
      { level: 2, text: "Les données sont collectées mais la méthodologie varie d'une année à l'autre" },
      { level: 3, text: "Un processus de collecte est formalisé et reproductible" },
      { level: 4, text: "Les données sont auditables, avec une chaîne de traçabilité complète et une méthodologie documentée" }
    ]
  },
  {
    id: 10, dimension: "Mesure et données", dimensionIndex: 1,
    title: "Veille et mise à jour",
    options: [
      { level: 1, text: "Le bilan carbone est un exercice ponctuel, pas un outil de pilotage" },
      { level: 2, text: "Le bilan est refait tous les 3-4 ans, souvent sous contrainte réglementaire" },
      { level: 3, text: "Le bilan est mis à jour annuellement" },
      { level: 4, text: "Les données carbone sont actualisées en continu ou quasi-continu (intégration dans les outils de gestion)" }
    ]
  },
  // === DIMENSION 3 — STRATÉGIE ET TRAJECTOIRE (Q11-Q15) ===
  {
    id: 11, dimension: "Stratégie et trajectoire", dimensionIndex: 2,
    title: "Existence d'une trajectoire",
    options: [
      { level: 1, text: "Aucun objectif de réduction des émissions n'est défini" },
      { level: 2, text: "Un objectif existe mais il est vague sans cible chiffrée ni horizon" },
      { level: 3, text: "Des objectifs chiffrés de réduction sont définis avec un horizon temporel" },
      { level: 4, text: "Une trajectoire compatible avec les accords de Paris est formalisée (SBTi, SNBC ou équivalent)" }
    ]
  },
  {
    id: 12, dimension: "Stratégie et trajectoire", dimensionIndex: 2,
    title: "Plan d'action opérationnel",
    options: [
      { level: 1, text: "Pas de plan d'action climat structuré" },
      { level: 2, text: "Des actions isolées existent (LED, tri des déchets) mais sans vision d'ensemble" },
      { level: 3, text: "Un plan d'action est formalisé avec des responsables, des échéances et des budgets" },
      { level: 4, text: "Le plan d'action est intégré aux feuilles de route métiers, avec des jalons intermédiaires suivis" }
    ]
  },
  {
    id: 13, dimension: "Stratégie et trajectoire", dimensionIndex: 2,
    title: "Approche de la compensation",
    options: [
      { level: 1, text: "La compensation carbone est utilisée comme principal levier de neutralité" },
      { level: 2, text: "La compensation existe mais sans priorisation préalable de la réduction" },
      { level: 3, text: "La réduction est prioritaire, la compensation est utilisée pour les émissions résiduelles incompressibles" },
      { level: 4, text: "L'entreprise distingue clairement contribution et compensation, et investit dans des projets à haute intégrité" }
    ]
  },
  {
    id: 14, dimension: "Stratégie et trajectoire", dimensionIndex: 2,
    title: "Adaptation et résilience",
    options: [
      { level: 1, text: "L'entreprise n'a pas évalué sa vulnérabilité aux impacts du changement climatique" },
      { level: 2, text: "Le sujet est identifié mais aucune analyse formelle n'a été réalisée" },
      { level: 3, text: "Une analyse de risques climatiques physiques a été menée et des mesures d'adaptation identifiées" },
      { level: 4, text: "Un plan d'adaptation est en place, intégré à la gestion des risques de l'entreprise" }
    ]
  },
  {
    id: 15, dimension: "Stratégie et trajectoire", dimensionIndex: 2,
    title: "Innovation et transformation du modèle",
    options: [
      { level: 1, text: "Le modèle d'affaires n'a pas été questionné au prisme du climat" },
      { level: 2, text: "Des réflexions existent sur l'évolution du modèle mais restent exploratoires" },
      { level: 3, text: "Des projets pilotes de transformation sont en cours (nouveaux produits/services bas-carbone)" },
      { level: 4, text: "Le modèle d'affaires a été significativement transformé pour être compatible avec une économie bas-carbone" }
    ]
  },
  // === DIMENSION 4 — CULTURE ET ENGAGEMENT (Q16-Q20) ===
  {
    id: 16, dimension: "Culture et engagement", dimensionIndex: 3,
    title: "Sensibilisation des collaborateurs",
    options: [
      { level: 1, text: "Aucune action de sensibilisation climat n'a été menée" },
      { level: 2, text: "Des actions ponctuelles ont eu lieu (Fresque du Climat, conférence) mais sans suivi" },
      { level: 3, text: "Un programme de sensibilisation récurrent touche une majorité de collaborateurs" },
      { level: 4, text: "La culture climat est intégrée dans l'onboarding, la formation continue et les rituels d'entreprise" }
    ]
  },
  {
    id: 17, dimension: "Culture et engagement", dimensionIndex: 3,
    title: "Implication des métiers",
    options: [
      { level: 1, text: "Le sujet climat est perçu comme relevant uniquement de la RSE ou de la direction" },
      { level: 2, text: "Quelques métiers sont impliqués ponctuellement (achats, logistique)" },
      { level: 3, text: "Des référents climat existent dans plusieurs directions et participent à la démarche" },
      { level: 4, text: "Chaque direction a des objectifs climat intégrés dans ses KPIs et un plan d'action dédié" }
    ]
  },
  {
    id: 18, dimension: "Culture et engagement", dimensionIndex: 3,
    title: "Communication interne",
    options: [
      { level: 1, text: "Les résultats et actions climat ne sont pas communiqués en interne" },
      { level: 2, text: "Une communication ponctuelle existe (newsletter RSE, rapport annuel)" },
      { level: 3, text: "La communication climat est régulière et utilise plusieurs canaux internes" },
      { level: 4, text: "Les résultats climat sont partagés avec la même visibilité que les résultats financiers" }
    ]
  },
  {
    id: 19, dimension: "Culture et engagement", dimensionIndex: 3,
    title: "Engagement des parties prenantes externes",
    options: [
      { level: 1, text: "Les fournisseurs et clients ne sont pas impliqués dans la démarche climat" },
      { level: 2, text: "Des questionnaires carbone sont envoyés aux fournisseurs mais sans suivi" },
      { level: 3, text: "Les principaux fournisseurs sont engagés dans une démarche de réduction, les clients sont informés" },
      { level: 4, text: "L'écosystème (fournisseurs, clients, partenaires) est activement mobilisé avec des objectifs partagés" }
    ]
  },
  {
    id: 20, dimension: "Culture et engagement", dimensionIndex: 3,
    title: "Capacité d'action du responsable climat/RSE",
    options: [
      { level: 1, text: "Le responsable climat n'a pas les moyens d'agir (pas de budget, pas de mandat, pas d'accès aux décideurs)" },
      { level: 2, text: "Le responsable a un mandat mais des moyens limités et doit constamment justifier son existence" },
      { level: 3, text: "Le responsable a un budget, une équipe réduite et un accès régulier aux décideurs" },
      { level: 4, text: "Le responsable climat a une équipe structurée, un budget significatif et un rôle stratégique reconnu" }
    ]
  }
]

export const DIMENSION_NAMES = [
  'Gouvernance climat',
  'Mesure et données',
  'Stratégie et trajectoire',
  'Culture et engagement',
]
