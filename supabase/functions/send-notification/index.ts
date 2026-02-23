// ============================================
// BOUSSOLE CLIMAT — Edge Function: send-notification
// Sends transactional emails via Resend
// Deploy: supabase functions deploy send-notification
// ============================================

import { corsHeaders } from '../_shared/cors.ts'

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = 'Projet Celsius <diagnostic@projetcelsius.fr>'

type NotificationType =
  | 'diagnostic_created'      // Client: your diagnostic is ready to start
  | 'survey_invitation'       // Respondents: please fill the survey
  | 'survey_reminder'         // Respondents: reminder
  | 'dg_invitation'           // DG: please fill the questionnaire
  | 'analysis_started'        // Client: your analyst has started
  | 'diagnostic_ready'        // Client: your diagnostic is ready
  | 'journal_update'          // Client: new journal entry from analyst
  | 'message_received'        // Client/Analyst: new message

interface NotificationPayload {
  type: NotificationType
  to: string | string[]
  data: Record<string, any>
}

const TEMPLATES: Record<NotificationType, (data: any) => { subject: string; html: string }> = {
  diagnostic_created: (d) => ({
    subject: `Votre diagnostic Boussole Climat est prêt à démarrer`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <div style="background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%); padding: 28px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; font-size: 20px; margin: 0;">Boussole Climat</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 4px 0 0;">Projet Celsius</p>
        </div>
        <div style="background: #fff; padding: 28px 32px; border: 1px solid #EDEAE3; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; color: #2A2A28; line-height: 1.6;">Bonjour ${d.client_name},</p>
          <p style="font-size: 15px; color: #2A2A28; line-height: 1.6;">Votre diagnostic de maturité climat a été créé. ${d.analyst_name} sera votre analyste dédié(e) tout au long du processus.</p>
          <p style="font-size: 15px; color: #2A2A28; line-height: 1.6;">Pour commencer, connectez-vous à votre espace et complétez le questionnaire en 3 blocs (~30 minutes) :</p>
          <a href="${d.app_url}" style="display: inline-block; background: #1B4332; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 16px 0;">Accéder à mon diagnostic</a>
          <p style="font-size: 13px; color: #7A766D; margin-top: 24px;">Si vous avez des questions, contactez directement ${d.analyst_name} via la messagerie intégrée.</p>
        </div>
      </div>
    `,
  }),

  survey_invitation: (d) => ({
    subject: `${d.org_name} vous invite à participer à un sondage climat`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <div style="background: #F7F5F0; padding: 24px 28px; border-radius: 12px; border: 1px solid #EDEAE3;">
          <h1 style="font-size: 18px; color: #2A2A28; margin: 0 0 8px;">Votre avis compte</h1>
          <p style="font-size: 14px; color: #7A766D; line-height: 1.6; margin: 0 0 16px;">${d.org_name} réalise un diagnostic de maturité climat et souhaite recueillir la perception de ses collaborateurs. Vos réponses sont <strong>100% anonymes</strong>.</p>
          ${d.custom_message ? `<p style="font-size: 14px; color: #2A2A28; line-height: 1.6; background: #fff; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #B87333; margin: 0 0 16px;"><em>"${d.custom_message}"</em></p>` : ''}
          <a href="${d.survey_url}" style="display: inline-block; background: #1B4332; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Répondre au sondage (3 min)</a>
          <p style="font-size: 12px; color: #B0AB9F; margin-top: 16px;">Ce sondage est réalisé par Projet Celsius. Aucune donnée personnelle n'est collectée.</p>
        </div>
      </div>
    `,
  }),

  survey_reminder: (d) => ({
    subject: `Rappel : sondage climat ${d.org_name} — 3 minutes`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <div style="background: #F7F5F0; padding: 24px 28px; border-radius: 12px; border: 1px solid #EDEAE3;">
          <p style="font-size: 14px; color: #7A766D; line-height: 1.6;">Vous n'avez pas encore répondu au sondage climat de ${d.org_name}. Il ne prend que 3 minutes et vos réponses sont anonymes.</p>
          <p style="font-size: 13px; color: #B87333; font-weight: 600;">${d.responses_count} de vos collègues ont déjà répondu.</p>
          <a href="${d.survey_url}" style="display: inline-block; background: #1B4332; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 12px 0;">Répondre maintenant</a>
        </div>
      </div>
    `,
  }),

  dg_invitation: (d) => ({
    subject: `Questionnaire Direction — Diagnostic climat ${d.org_name}`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <div style="background: #F7F5F0; padding: 24px 28px; border-radius: 12px; border: 1px solid #EDEAE3;">
          <h1 style="font-size: 18px; color: #2A2A28; margin: 0 0 8px;">Regard de la Direction</h1>
          <p style="font-size: 14px; color: #7A766D; line-height: 1.6;">Dans le cadre du diagnostic climat de ${d.org_name}, nous souhaitons recueillir le regard de la direction générale. 5 questions, 2 minutes.</p>
          <a href="${d.dg_url}" style="display: inline-block; background: #1B4332; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 12px 0;">Répondre</a>
          <p style="font-size: 12px; color: #B0AB9F; margin-top: 16px;">Vos réponses seront croisées avec le sondage interne pour enrichir le diagnostic.</p>
        </div>
      </div>
    `,
  }),

  analysis_started: (d) => ({
    subject: `Votre analyste a commencé l'étude de votre diagnostic`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <div style="background: #fff; padding: 24px 28px; border-radius: 12px; border: 1px solid #EDEAE3;">
          <p style="font-size: 15px; color: #2A2A28; line-height: 1.6;">Bonjour ${d.client_name},</p>
          <p style="font-size: 15px; color: #2A2A28; line-height: 1.6;">${d.analyst_name} a commencé l'analyse de vos résultats. Le diagnostic sera prêt sous <strong>5 à 7 jours ouvrés</strong>. Vous serez notifié(e) dès qu'il sera disponible.</p>
          <p style="font-size: 13px; color: #7A766D;">Suivez l'avancement dans votre espace Boussole Climat.</p>
        </div>
      </div>
    `,
  }),

  diagnostic_ready: (d) => ({
    subject: `🎯 Votre diagnostic Boussole Climat est prêt`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <div style="background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%); padding: 28px 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.15); border-radius: 14px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 24px; font-weight: 700;">${d.grade}</span>
          </div>
          <h1 style="color: #fff; font-size: 20px; margin: 0;">Votre diagnostic est prêt</h1>
        </div>
        <div style="background: #fff; padding: 28px 32px; border: 1px solid #EDEAE3; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 15px; color: #2A2A28; line-height: 1.6;">Bonjour ${d.client_name},</p>
          <p style="font-size: 15px; color: #2A2A28; line-height: 1.6;">${d.analyst_name} a finalisé votre diagnostic de maturité climat. Il comprend 9 sections avec des recommandations personnalisées.</p>
          <a href="${d.app_url}" style="display: inline-block; background: #1B4332; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 16px 0;">Découvrir mon diagnostic</a>
          <p style="font-size: 13px; color: #7A766D;">Un appel de restitution avec ${d.analyst_name} sera proposé pour discuter des résultats.</p>
        </div>
      </div>
    `,
  }),

  journal_update: (d) => ({
    subject: `Nouvelle note de ${d.analyst_name} dans votre journal de bord`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <div style="background: #fff; padding: 24px 28px; border-radius: 12px; border: 1px solid #EDEAE3;">
          <p style="font-size: 14px; color: #7A766D;">${d.analyst_name} a ajouté une note :</p>
          <div style="background: #F7F5F0; padding: 16px; border-radius: 8px; margin: 12px 0; border-left: 3px solid #1B4332;">
            <p style="font-size: 14px; color: #2A2A28; line-height: 1.6; margin: 0;">${d.preview}</p>
          </div>
          <a href="${d.app_url}" style="font-size: 13px; color: #B87333; font-weight: 600;">Voir dans le journal →</a>
        </div>
      </div>
    `,
  }),

  message_received: (d) => ({
    subject: `Nouveau message de ${d.sender_name}`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <div style="background: #fff; padding: 24px 28px; border-radius: 12px; border: 1px solid #EDEAE3;">
          <p style="font-size: 14px; color: #7A766D;">${d.sender_name} :</p>
          <p style="font-size: 14px; color: #2A2A28; line-height: 1.6;">${d.preview}</p>
          <a href="${d.app_url}" style="font-size: 13px; color: #B87333; font-weight: 600;">Répondre →</a>
        </div>
      </div>
    `,
  }),
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: NotificationPayload = await req.json()

    if (!payload.type || !payload.to || !payload.data) {
      return new Response(
        JSON.stringify({ error: 'type, to, et data sont requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const template = TEMPLATES[payload.type]
    if (!template) {
      return new Response(
        JSON.stringify({ error: `Type de notification inconnu: ${payload.type}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { subject, html } = template(payload.data)
    const recipients = Array.isArray(payload.to) ? payload.to : [payload.to]

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured')
    }

    // Send to each recipient
    const results = await Promise.allSettled(
      recipients.map(async (to) => {
        const res = await fetch(RESEND_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
        })
        if (!res.ok) {
          const errText = await res.text()
          throw new Error(`Resend error for ${to}: ${errText}`)
        }
        return res.json()
      })
    )

    const sent = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length

    return new Response(
      JSON.stringify({ success: true, sent, failed }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Send notification error:', err)
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
