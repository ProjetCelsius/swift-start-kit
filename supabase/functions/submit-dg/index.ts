// ============================================
// BOUSSOLE CLIMAT — Edge Function: submit-dg
// Receives DG responses, validates token, single-use
// Deploy: supabase functions deploy submit-dg
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface DgPayload {
  token: string
  dg1_governance: string
  dg2_budget: string
  dg3_roi_horizon: string
  dg4_main_benefit: string
  dg5_means_score: number
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: DgPayload = await req.json()

    // Validate
    if (!payload.token) {
      return new Response(
        JSON.stringify({ error: 'Token requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!payload.dg1_governance || !payload.dg2_budget || !payload.dg3_roi_horizon || !payload.dg4_main_benefit) {
      return new Response(
        JSON.stringify({ error: 'Toutes les questions sont obligatoires' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (typeof payload.dg5_means_score !== 'number' || payload.dg5_means_score < 1 || payload.dg5_means_score > 10) {
      return new Response(
        JSON.stringify({ error: 'Le score doit être entre 1 et 10' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Verify token
    const { data: diagnostic, error: diagError } = await supabase
      .from('diagnostics')
      .select('id, status')
      .eq('dg_token', payload.token)
      .single()

    if (diagError || !diagnostic) {
      return new Response(
        JSON.stringify({ error: 'Lien invalide ou expiré' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if DG already responded (dg_responses has unique constraint on diagnostic_id)
    const { data: existingDg } = await supabase
      .from('dg_responses')
      .select('id')
      .eq('diagnostic_id', diagnostic.id)
      .maybeSingle()

    if (existingDg) {
      return new Response(
        JSON.stringify({ error: 'La direction a déjà répondu à ce questionnaire', already_submitted: true }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert
    const { error: insertError } = await supabase
      .from('dg_responses')
      .insert({
        diagnostic_id: diagnostic.id,
        dg1_governance: payload.dg1_governance.trim(),
        dg2_budget: payload.dg2_budget.trim(),
        dg3_roi_horizon: payload.dg3_roi_horizon.trim(),
        dg4_main_benefit: payload.dg4_main_benefit.trim(),
        dg5_means_score: payload.dg5_means_score,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'enregistrement' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
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
