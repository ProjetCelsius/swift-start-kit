// ============================================
// BOUSSOLE CLIMAT — Edge Function: generate-diagnostic
// Fetches all data for a diagnostic, builds the prompt,
// calls Claude API, parses structured response, inserts sections
// Deploy: supabase functions deploy generate-diagnostic
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

// ─── Prompt builder ────────────────────────────
function buildDiagnosticPrompt(data: DiagnosticData): string {
  return `Tu es un analyste climat senior chez Projet Celsius, bureau d'études spécialisé en stratégie climat, bilan carbone et ACV. Tu rédiges un diagnostic de maturité climat pour une organisation.

## Données du diagnostic

### Organisation
- Nom : ${data.organization.name}
- Secteur NAF : ${data.organization.sector_naf || 'Non précisé'}
- Effectif : ${data.organization.headcount_range || 'Non précisé'}
- Chiffre d'affaires : ${data.organization.revenue_range || 'Non précisé'}
- Sites : ${data.organization.number_of_sites || 'Non précisé'}
- RSE depuis : ${data.organization.rse_start_year || 'Non précisé'}

### Bloc 1 — Avancement des démarches
${data.tiles.map(t => `- ${t.tile_key}: ${t.status}${t.comment ? ` (commentaire: ${t.comment})` : ''}`).join('\n')}

### Bloc 2 — Score de maturité
Score global : ${data.maturityScore}/100
Dimensions :
${data.maturityDimensions.map(d => `- ${d.name}: ${d.score}/100 (${d.grade})`).join('\n')}

### Bloc 3 — Enjeux et contexte
${data.bloc3Responses.map(r => `- ${r.question_key}: ${r.response_text || r.response_value || JSON.stringify(r.response_json)}`).join('\n')}

### Bloc 4 — Perception RSE
Scores RSE (auto-évaluation) : ${data.bloc4Rse.map(r => `${r.question_key}=${r.response_value}`).join(', ')}
Prédictions RSE : ${data.bloc4Predictions.map(r => `${r.question_key}=${r.response_value}`).join(', ')}

### Sondage collaborateurs (${data.surveyCount} répondants)
Moyennes : ${data.surveyAverages ? `S1=${data.surveyAverages.s1.toFixed(1)}, S2=${data.surveyAverages.s2.toFixed(1)}, S3=${data.surveyAverages.s3.toFixed(1)}, S4=${data.surveyAverages.s4.toFixed(1)}, S5=${data.surveyAverages.s5.toFixed(1)}, S6=${data.surveyAverages.s6.toFixed(1)}, S7=${data.surveyAverages.s7.toFixed(1)}, S8=${data.surveyAverages.s8.toFixed(1)}` : 'Pas assez de réponses'}
Distribution profils : ${data.surveyProfiles ? JSON.stringify(data.surveyProfiles) : 'Non disponible'}
Verbatims notables : ${data.surveyVerbatims?.slice(0, 5).join(' | ') || 'Aucun'}

### Questionnaire DG
${data.dgResponse ? `
- Gouvernance : ${data.dgResponse.dg1_governance}
- Budget : ${data.dgResponse.dg2_budget}
- Horizon ROI : ${data.dgResponse.dg3_roi_horizon}
- Bénéfice principal : ${data.dgResponse.dg4_main_benefit}
- Score moyens : ${data.dgResponse.dg5_means_score}/10
` : 'Pas de réponse DG'}

## Instructions de rédaction

Rédige les 9 sections du diagnostic au format JSON structuré. Chaque section doit être factuelle, personnalisée, et basée sur les données ci-dessus. Adopte un ton professionnel mais accessible, direct, sans jargon inutile. Ose les constats francs (positifs comme négatifs).

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, avec cette structure exacte :

{
  "section_1": {
    "paragraph_1": "Premier paragraphe de synthèse (forces de l'organisation)...",
    "paragraph_2": "Deuxième paragraphe (point d'alerte principal, basé sur les écarts de perception)...",
    "paragraph_3": "Troisième paragraphe (opportunité et échéance, tournée vers l'action)..."
  },
  "section_2": {
    "priorities": [
      {
        "title": "Priorité 1 — titre actionnable",
        "why_now": "Pourquoi maintenant, basé sur les données...",
        "effort_tag": "quick|project|transformation",
        "budget_tag": "<10k|10-50k|>50k"
      }
    ],
    "anti_recommendation": {
      "title": "Ce que nous ne recommandons PAS",
      "explanation": "Basé sur le profil de l'organisation..."
    }
  },
  "section_3": {
    "global_score": ${data.maturityScore},
    "global_grade": "${data.maturityGrade}",
    "dimensions": [
      {
        "name": "Gouvernance climat",
        "score": 0,
        "grade": "A|B|C|D",
        "analysis": "Analyse personnalisée de cette dimension...",
        "sector_position": "Position vs secteur..."
      }
    ]
  },
  "section_4": {
    "gaps_analysis": [
      {
        "question_key": "P1",
        "rse_score": 0,
        "prediction_score": 0,
        "survey_score": 0,
        "interpretation": "Ce que cet écart signifie concrètement..."
      }
    ],
    "population_analysis": "Analyse de la distribution des profils...",
    "dg_analysis": "Analyse du regard croisé RSE/DG (ou null si pas de réponse DG)..."
  },
  "section_5": {
    "current_fte": 0,
    "recommended_fte": 0,
    "analysis": "Analyse du dimensionnement RH climat..."
  },
  "section_6": {
    "has_carbon_footprint": true,
    "total_emissions": null,
    "analysis": "Analyse de l'empreinte et contexte sectoriel..."
  },
  "section_7": {
    "deadlines": [
      {
        "name": "Obligation réglementaire",
        "date": "YYYY-MM",
        "description": "Description...",
        "readiness": "ready|in_progress|not_started"
      }
    ]
  },
  "section_9": {
    "twelve_month_plan": [
      { "quarter": "T1 2026", "actions": ["Action 1", "Action 2"] }
    ],
    "summary": "Conclusion du diagnostic en 2-3 phrases..."
  }
}

IMPORTANT : 3 priorités exactement dans section_2. Remplis les scores de section_3 à partir des données fournies. Section 8 n'est pas dans le JSON (elle est auto-générée à partir des tuiles).`
}

// ─── Data collection ───────────────────────────
interface DiagnosticData {
  organization: any
  tiles: any[]
  maturityScore: number
  maturityGrade: string
  maturityDimensions: Array<{ name: string; score: number; grade: string }>
  bloc3Responses: any[]
  bloc4Rse: any[]
  bloc4Predictions: any[]
  surveyCount: number
  surveyAverages: Record<string, number> | null
  surveyProfiles: Record<string, number> | null
  surveyVerbatims: string[] | null
  dgResponse: any | null
}

async function collectDiagnosticData(supabase: any, diagnosticId: string): Promise<DiagnosticData> {
  // Fetch diagnostic with org
  const { data: diag } = await supabase
    .from('diagnostics')
    .select('*, organization:organizations(*)')
    .eq('id', diagnosticId)
    .single()

  // Tiles
  const { data: tiles } = await supabase
    .from('advancement_tiles')
    .select('*')
    .eq('diagnostic_id', diagnosticId)

  // Questionnaire responses by block
  const { data: allResponses } = await supabase
    .from('questionnaire_responses')
    .select('*')
    .eq('diagnostic_id', diagnosticId)

  const bloc2 = (allResponses || []).filter((r: any) => r.block === 2)
  const bloc3 = (allResponses || []).filter((r: any) => r.block === 3)
  const bloc4Rse = (allResponses || []).filter((r: any) => r.block === 4 && r.question_key.startsWith('P'))
  const bloc4Pred = (allResponses || []).filter((r: any) => r.block === 4 && r.question_key.startsWith('PRED'))

  // Compute maturity from bloc2
  const dimensionNames = ['Gouvernance climat', 'Mesure et données', 'Stratégie et trajectoire', 'Culture et engagement']
  const dimensions = dimensionNames.map((name, i) => {
    const dimResponses = bloc2.filter((r: any) => {
      const qNum = parseInt(r.question_key.replace('Q', ''))
      return Math.floor((qNum - 1) / 5) === i
    })
    const avg = dimResponses.length > 0
      ? dimResponses.reduce((sum: number, r: any) => sum + (r.response_value || 0), 0) / dimResponses.length
      : 0
    const score = Math.round(avg * 25) // 1-4 scale → 0-100
    const grade = score >= 75 ? 'A' : score >= 50 ? 'B' : score >= 25 ? 'C' : 'D'
    return { name, score, grade }
  })
  const globalScore = Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length)
  const globalGrade = globalScore >= 75 ? 'A' : globalScore >= 50 ? 'B' : globalScore >= 25 ? 'C' : 'D'

  // Survey aggregates
  const { data: surveyResponses, count: surveyCount } = await supabase
    .from('survey_responses')
    .select('*', { count: 'exact' })
    .eq('diagnostic_id', diagnosticId)

  let surveyAverages = null
  let surveyProfiles = null
  let surveyVerbatims = null

  if (surveyResponses && surveyResponses.length >= 3) {
    const n = surveyResponses.length
    surveyAverages = {
      s1: surveyResponses.reduce((s: number, r: any) => s + r.s1, 0) / n,
      s2: surveyResponses.reduce((s: number, r: any) => s + r.s2, 0) / n,
      s3: surveyResponses.reduce((s: number, r: any) => s + r.s3, 0) / n,
      s4: surveyResponses.reduce((s: number, r: any) => s + r.s4, 0) / n,
      s5: surveyResponses.reduce((s: number, r: any) => s + r.s5, 0) / n,
      s6: surveyResponses.reduce((s: number, r: any) => s + r.s6, 0) / n,
      s7: surveyResponses.reduce((s: number, r: any) => s + r.s7, 0) / n,
      s8: surveyResponses.reduce((s: number, r: any) => s + r.s8, 0) / n,
    }
    const profiles = { moteur: 0, engage: 0, indifferent: 0, sceptique: 0, refractaire: 0 }
    surveyResponses.forEach((r: any) => { profiles[r.s9_profile as keyof typeof profiles]++ })
    surveyProfiles = Object.fromEntries(
      Object.entries(profiles).map(([k, v]) => [k, Math.round((v / n) * 100)])
    )
    surveyVerbatims = surveyResponses
      .map((r: any) => r.s10_verbatim)
      .filter(Boolean)
      .slice(0, 10)
  }

  // DG response
  const { data: dgResponse } = await supabase
    .from('dg_responses')
    .select('*')
    .eq('diagnostic_id', diagnosticId)
    .maybeSingle()

  return {
    organization: diag.organization,
    tiles: tiles || [],
    maturityScore: globalScore,
    maturityGrade: globalGrade,
    maturityDimensions: dimensions,
    bloc3Responses: bloc3,
    bloc4Rse,
    bloc4Predictions: bloc4Pred,
    surveyCount: surveyCount || 0,
    surveyAverages,
    surveyProfiles,
    surveyVerbatims,
    dgResponse,
  }
}

// ─── Main handler ──────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { diagnostic_id } = await req.json()

    if (!diagnostic_id) {
      return new Response(
        JSON.stringify({ error: 'diagnostic_id requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Auth check: only analysts/admins can trigger generation
    const authHeader = req.headers.get('Authorization')
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader! } } }
    )

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non authentifié' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Service role client for data collection
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Check user is analyst or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['analyst', 'admin'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Accès réservé aux analystes' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update diagnostic status to analyzing
    await supabase
      .from('diagnostics')
      .update({ analysis_step: 'analyzing' })
      .eq('id', diagnostic_id)

    // Collect all data
    const data = await collectDiagnosticData(supabase, diagnostic_id)

    // Build prompt and call Claude
    const prompt = buildDiagnosticPrompt(data)

    const claudeApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!claudeApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    await supabase
      .from('diagnostics')
      .update({ analysis_step: 'writing' })
      .eq('id', diagnostic_id)

    const claudeResponse = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text()
      console.error('Claude API error:', errText)
      throw new Error(`Claude API returned ${claudeResponse.status}`)
    }

    const claudeResult = await claudeResponse.json()
    const rawText = claudeResult.content[0].text

    // Parse JSON (strip potential markdown fences)
    const cleanJson = rawText.replace(/```json\n?|```\n?/g, '').trim()
    let sections
    try {
      sections = JSON.parse(cleanJson)
    } catch (parseErr) {
      console.error('Failed to parse Claude response:', cleanJson.substring(0, 500))
      throw new Error('Réponse IA mal formatée')
    }

    // Insert/upsert sections (1-7, 9 — section 8 is auto-generated from tiles)
    const sectionKeys = ['synthese', 'priorites', 'maturite', 'perception', 'capital_humain', 'empreinte', 'echeances', 'avancement', 'feuille_route']

    const sectionInserts = [1, 2, 3, 4, 5, 6, 7, 9].map(num => ({
      diagnostic_id,
      section_number: num,
      section_key: sectionKeys[num - 1],
      content_json: sections[`section_${num}`] || {},
      status: 'draft' as const,
      generated_by_ai: true,
      last_edited_by: user.id,
    }))

    // Also create section 8 from tiles data
    sectionInserts.push({
      diagnostic_id,
      section_number: 8,
      section_key: 'avancement',
      content_json: { tiles: data.tiles },
      status: 'draft' as const,
      generated_by_ai: false,
      last_edited_by: user.id,
    })

    for (const section of sectionInserts) {
      await supabase
        .from('diagnostic_sections')
        .upsert(section, { onConflict: 'diagnostic_id,section_number' })
    }

    // Update diagnostic status
    await supabase
      .from('diagnostics')
      .update({ 
        analysis_step: 'reviewing',
        status: 'review',
      })
      .eq('id', diagnostic_id)

    // Log journal entry
    await supabase
      .from('journal_entries')
      .insert({
        diagnostic_id,
        author_id: user.id,
        content: 'Diagnostic pré-généré par l\'IA. 9 sections créées en brouillon, en attente de relecture.',
        step_change: 'analysis → review',
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        sections_generated: sectionInserts.length,
        status: 'review',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Generate diagnostic error:', err)
    return new Response(
      JSON.stringify({ error: (err as Error).message || 'Erreur lors de la génération' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
