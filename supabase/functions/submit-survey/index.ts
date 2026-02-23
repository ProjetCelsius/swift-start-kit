// ============================================
// BOUSSOLE CLIMAT — Edge Function: submit-survey
// Receives anonymous survey responses, validates token, inserts
// Deploy: supabase functions deploy submit-survey
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SurveyPayload {
  token: string
  population?: 'direction' | 'manager' | 'collaborateur'
  s1: number
  s2: number
  s3: number
  s4: number
  s5: number
  s6: number
  s7: number
  s8: number
  s9_profile: 'moteur' | 'engage' | 'indifferent' | 'sceptique' | 'refractaire'
  s10_verbatim?: string
  fingerprint?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: SurveyPayload = await req.json()

    // Validate required fields
    const scores = [payload.s1, payload.s2, payload.s3, payload.s4, payload.s5, payload.s6, payload.s7, payload.s8]
    for (const score of scores) {
      if (typeof score !== 'number' || score < 1 || score > 10) {
        return new Response(
          JSON.stringify({ error: 'Chaque score doit être entre 1 et 10' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (!payload.token || !payload.s9_profile) {
      return new Response(
        JSON.stringify({ error: 'Token et profil requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const validProfiles = ['moteur', 'engage', 'indifferent', 'sceptique', 'refractaire']
    if (!validProfiles.includes(payload.s9_profile)) {
      return new Response(
        JSON.stringify({ error: 'Profil invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create service-role client (bypasses RLS for anonymous insertion)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Verify token and get diagnostic
    const { data: diagnostic, error: diagError } = await supabase
      .from('diagnostics')
      .select('id, status, survey_distinguish_populations')
      .eq('survey_token', payload.token)
      .single()

    if (diagError || !diagnostic) {
      return new Response(
        JSON.stringify({ error: 'Lien de sondage invalide ou expiré' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check diagnostic is in a state that accepts survey responses
    const acceptingStatuses = ['survey_pending', 'questionnaire', 'analysis']
    if (!acceptingStatuses.includes(diagnostic.status)) {
      return new Response(
        JSON.stringify({ error: 'Ce sondage n\'accepte plus de réponses' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Optional: check fingerprint for duplicate detection (soft block, not hard)
    if (payload.fingerprint) {
      const { data: existing } = await supabase
        .from('survey_responses')
        .select('id')
        .eq('diagnostic_id', diagnostic.id)
        .eq('fingerprint', payload.fingerprint)
        .maybeSingle()

      if (existing) {
        return new Response(
          JSON.stringify({ error: 'Vous avez déjà répondu à ce sondage', already_submitted: true }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Insert response
    const { error: insertError } = await supabase
      .from('survey_responses')
      .insert({
        diagnostic_id: diagnostic.id,
        population: diagnostic.survey_distinguish_populations ? payload.population : null,
        s1: payload.s1,
        s2: payload.s2,
        s3: payload.s3,
        s4: payload.s4,
        s5: payload.s5,
        s6: payload.s6,
        s7: payload.s7,
        s8: payload.s8,
        s9_profile: payload.s9_profile,
        s10_verbatim: payload.s10_verbatim?.trim() || null,
        fingerprint: payload.fingerprint || null,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'enregistrement' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get updated count for the client's survey tracking page
    const { count } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact', head: true })
      .eq('diagnostic_id', diagnostic.id)

    return new Response(
      JSON.stringify({ success: true, total_responses: count }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
