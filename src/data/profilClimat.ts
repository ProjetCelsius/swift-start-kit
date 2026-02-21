export interface ProfilClimat {
  code: string
  name: string
  phrase: string
  family: string
  entrepriseType: string
}

export const profilClimatData: Record<string, ProfilClimat> = {
  "SMFD": {
    code: "SMFD",
    name: "Les fondations sont là",
    phrase: "On fait les choses dans les règles, et on les fait bien.",
    family: "Les Méthodiques",
    entrepriseType: "Saint-Gobain"
  },
  "SMFO": {
    code: "SMFO",
    name: "Un coup d'avance sur la réglementation",
    phrase: "La réglementation, on ne la subit pas — on la devance.",
    family: "Les Méthodiques",
    entrepriseType: "Dassault Systèmes"
  },
  "SMVD": {
    code: "SMVD",
    name: "On sait où on en est",
    phrase: "La donnée est solide, la conviction est là.",
    family: "Les Méthodiques",
    entrepriseType: "L'Oréal"
  },
  "SMVO": {
    code: "SMVO",
    name: "L'Architecte",
    phrase: "On construit méthodiquement ce que d'autres annoncent.",
    family: "Les Méthodiques",
    entrepriseType: "Schneider Electric"
  },
  "SAFD": {
    code: "SAFD",
    name: "La feuille de route est lancée",
    phrase: "On nous a demandé de structurer, on a livré.",
    family: "Les Opérationnels",
    entrepriseType: "ETI industrielle CSRD"
  },
  "SAFO": {
    code: "SAFO",
    name: "Déjà en route",
    phrase: "Pendant que les autres lisent le règlement, nous on a commencé.",
    family: "Les Opérationnels",
    entrepriseType: "Vinci Energies"
  },
  "SAVD": {
    code: "SAVD",
    name: "On protège ce qu'on a bâti",
    phrase: "Le sujet est porté. On investit dans la résilience.",
    family: "Les Opérationnels",
    entrepriseType: "Groupe ADP"
  },
  "SAVO": {
    code: "SAVO",
    name: "La transformation en silence",
    phrase: "On transforme avec méthode, par conviction, sans bruit.",
    family: "Les Opérationnels",
    entrepriseType: "Interface"
  },
  "CMFD": {
    code: "CMFD",
    name: "Le terrain avance, les chiffres suivent",
    phrase: "Les équipes sont mobilisées, les chiffres confirment.",
    family: "Les Éclairés",
    entrepriseType: "SNCF"
  },
  "CMFO": {
    code: "CMFO",
    name: "L'engagement crée du marché",
    phrase: "L'engagement nourrit la donnée, la donnée ouvre les marchés.",
    family: "Les Éclairés",
    entrepriseType: "Decathlon"
  },
  "CMVD": {
    code: "CMVD",
    name: "On voit venir, on se prépare",
    phrase: "La conviction est collective, la donnée solide. On anticipe.",
    family: "Les Éclairés",
    entrepriseType: "La Poste"
  },
  "CMVO": {
    code: "CMVO",
    name: "Le Catalyseur",
    phrase: "Les gens savent, les gens veulent, les gens avancent.",
    family: "Les Éclairés",
    entrepriseType: "Patagonia"
  },
  "CAFD": {
    code: "CAFD",
    name: "Le marché pousse, les équipes répondent",
    phrase: "Les clients l'exigent, les équipes se mobilisent.",
    family: "Les Engagés",
    entrepriseType: "Sous-traitant automobile"
  },
  "CAFO": {
    code: "CAFO",
    name: "L'élan est pris",
    phrase: "Engagement + vitesse + opportunité. On avance.",
    family: "Les Engagés",
    entrepriseType: "BlaBlaCar"
  },
  "CAVD": {
    code: "CAVD",
    name: "Ancrés dans nos valeurs",
    phrase: "On croit, on agit, on ne transige pas.",
    family: "Les Engagés",
    entrepriseType: "Biocoop"
  },
  "CAVO": {
    code: "CAVO",
    name: "Le premier de cordée",
    phrase: "On défriche. On ouvre la voie. On entraîne.",
    family: "Les Engagés",
    entrepriseType: "Back Market"
  }
}
