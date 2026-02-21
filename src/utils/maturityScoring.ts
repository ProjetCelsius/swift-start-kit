// ============================================
// BOUSSOLE CLIMAT — Scoring Bloc 2
// ============================================

import { maturityQuestions, DIMENSION_NAMES } from '@/data/maturityQuestions'

export interface DimensionScore {
  name: string
  score: number
  grade: { letter: string; label: string; color: string }
}

export function gradeFromScore(score: number) {
  if (score >= 75) return { letter: 'A', label: 'Avancé', color: '#1B4332' }
  if (score >= 50) return { letter: 'B', label: 'Structuré', color: '#2D6A4F' }
  if (score >= 25) return { letter: 'C', label: 'En construction', color: '#B87333' }
  return { letter: 'D', label: 'Émergent', color: '#DC4A4A' }
}

export function computeDimensionScores(answers: Record<number, number>): DimensionScore[] {
  return DIMENSION_NAMES.map((name, dimIndex) => {
    const dimQuestions = maturityQuestions.filter(q => q.dimensionIndex === dimIndex)
    const sum = dimQuestions.reduce((acc, q) => acc + (answers[q.id] ?? 1), 0)
    const score = ((sum - 5) / 15) * 100
    return { name, score, grade: gradeFromScore(score) }
  })
}

export function computeGlobalScore(dimensionScores: DimensionScore[]) {
  const avg = dimensionScores.reduce((a, d) => a + d.score, 0) / 4
  return { score: avg, grade: gradeFromScore(avg) }
}

/**
 * Profil Climat — two-letter code
 * Axe 1 (S/C): governance questions vs culture questions
 * Axe 2 (M/A): measure questions vs strategy questions
 */
export function computeProfilClimat(answers: Record<number, number>) {
  // Axe 1: Q1+Q3+Q4+Q5 vs Q16+Q17+Q18+Q20
  const govSum = (answers[1] ?? 1) + (answers[3] ?? 1) + (answers[4] ?? 1) + (answers[5] ?? 1)
  const culSum = (answers[16] ?? 1) + (answers[17] ?? 1) + (answers[18] ?? 1) + (answers[20] ?? 1)
  const axe1 = govSum >= culSum ? 'S' : 'C'

  // Axe 2: Q6+Q7+Q9+Q10 vs Q12+Q13+Q14+Q15
  const mesSum = (answers[6] ?? 1) + (answers[7] ?? 1) + (answers[9] ?? 1) + (answers[10] ?? 1)
  const actSum = (answers[12] ?? 1) + (answers[13] ?? 1) + (answers[14] ?? 1) + (answers[15] ?? 1)
  const axe2 = mesSum >= actSum ? 'M' : 'A'

  return { axe1, axe2 }
}
