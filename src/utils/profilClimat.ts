// ============================================
// BOUSSOLE CLIMAT — Profil Climat calculation
// ============================================

import { profilClimatData, type ProfilClimat } from '@/data/profilClimat'

const CONFORMITE_ITEMS = [
  'Pression réglementaire (CSRD, BEGES, taxonomie)',
  'Demande clients ou donneurs d\'ordre',
  'Accès financements ou marchés publics',
]

/**
 * Axe 1 (S/C) + Axe 2 (M/A): from Bloc 2 answers (keyed by question id 1-20)
 */
export function computeAxes12(bloc2Answers: Record<number, number>) {
  const govSum = (bloc2Answers[1] ?? 1) + (bloc2Answers[3] ?? 1) + (bloc2Answers[4] ?? 1) + (bloc2Answers[5] ?? 1)
  const culSum = (bloc2Answers[16] ?? 1) + (bloc2Answers[17] ?? 1) + (bloc2Answers[18] ?? 1) + (bloc2Answers[20] ?? 1)
  const axe1 = govSum >= culSum ? 'S' : 'C'

  const mesSum = (bloc2Answers[6] ?? 1) + (bloc2Answers[7] ?? 1) + (bloc2Answers[9] ?? 1) + (bloc2Answers[10] ?? 1)
  const actSum = (bloc2Answers[12] ?? 1) + (bloc2Answers[13] ?? 1) + (bloc2Answers[14] ?? 1) + (bloc2Answers[15] ?? 1)
  const axe2 = mesSum >= actSum ? 'M' : 'A'

  return { axe1, axe2 }
}

/**
 * Axe 3 (F/V) — Motif — from ranked moteurs + Q24
 */
export function computeAxe3(ranking: string[], q24: string) {
  let fScore = 0
  let vScore = 0
  ranking.forEach((item, i) => {
    const weight = 3 - i // 3, 2, 1
    if (CONFORMITE_ITEMS.some(c => item.includes(c.substring(0, 15)))) {
      fScore += weight
    } else {
      vScore += weight
    }
  })
  if (q24 === 'Oui') fScore += 1
  return fScore >= vScore ? 'F' : 'V'
}

/**
 * Axe 4 (D/O) — Posture — from Q23 regulatory answers
 */
export function computeAxe4(q23: Record<string, string>) {
  let urgencyCount = 0
  Object.values(q23).forEach(answer => {
    if (answer === 'Déjà concerné' || answer === 'Sous 12 mois') urgencyCount++
  })
  return urgencyCount >= 3 ? 'D' : 'O'
}

/**
 * Full profile computation
 */
export function computeFullProfil(
  bloc2Answers: Record<number, number>,
  ranking: string[],
  q24: string,
  q23: Record<string, string>,
): { code: string; profil: ProfilClimat | null } {
  const { axe1, axe2 } = computeAxes12(bloc2Answers)
  const axe3 = computeAxe3(ranking, q24)
  const axe4 = computeAxe4(q23)
  const code = axe1 + axe2 + axe3 + axe4
  return { code, profil: profilClimatData[code] ?? null }
}
