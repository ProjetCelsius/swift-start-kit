-- ============================================
-- BOUSSOLE CLIMAT — Migration 003: Seed demo data
-- 3 diagnostics at different stages for testing
-- Run AFTER creating a test user via Supabase Auth
-- ============================================

-- ⚠️  Replace these UUIDs with real auth.users IDs after signup
-- You need at least 2 users: 1 analyst + 1 client
-- Steps:
--   1. Create users in Supabase Auth dashboard or via signup
--   2. Replace the UUIDs below
--   3. Run this migration

-- Placeholder UUIDs (replace with real ones)
DO $$
DECLARE
  analyst_uid uuid := '00000000-0000-0000-0000-000000000001'; -- Replace after auth setup
  client1_uid uuid := '00000000-0000-0000-0000-000000000002'; -- Replace after auth setup
  client2_uid uuid := '00000000-0000-0000-0000-000000000003'; -- Replace after auth setup
  client3_uid uuid := '00000000-0000-0000-0000-000000000004'; -- Replace after auth setup
  org1_id uuid;
  org2_id uuid;
  org3_id uuid;
  diag1_id uuid;
  diag2_id uuid;
  diag3_id uuid;
BEGIN

-- ─── Profiles ──────────────────────────────────
INSERT INTO public.profiles (id, role, first_name, last_name, title) VALUES
  (analyst_uid, 'analyst', 'Guillaume', 'Pakula', 'Analyste Climat Senior'),
  (client1_uid, 'client', 'Claire', 'Lefèvre', 'Directrice Générale'),
  (client2_uid, 'client', 'Thomas', 'Moreau', 'Responsable RSE'),
  (client3_uid, 'client', 'Julie', 'Dupont', 'Directrice Développement Durable')
ON CONFLICT (id) DO UPDATE SET first_name = EXCLUDED.first_name;

-- ─── Organizations ─────────────────────────────
INSERT INTO public.organizations (id, name, sector_naf, headcount_range, revenue_range, number_of_sites, rse_start_year)
VALUES
  (gen_random_uuid(), 'Groupe Méridien', '25.11Z', '501-1000', '50-200M', 4, 2021),
  (gen_random_uuid(), 'NovaTech Solutions', '62.01Z', '51-250', '10-50M', 2, 2023),
  (gen_random_uuid(), 'Maison Duval', '10.71A', '11-50', '1-10M', 1, null)
RETURNING id INTO org1_id; -- Only gets the last one, we need all 3

-- Actually, let's do it properly:
DELETE FROM public.organizations WHERE name IN ('Groupe Méridien', 'NovaTech Solutions', 'Maison Duval');

INSERT INTO public.organizations (name, sector_naf, headcount_range, revenue_range, number_of_sites, rse_start_year)
VALUES ('Groupe Méridien', '25.11Z', '501-1000', '50-200M', 4, 2021)
RETURNING id INTO org1_id;

INSERT INTO public.organizations (name, sector_naf, headcount_range, revenue_range, number_of_sites, rse_start_year)
VALUES ('NovaTech Solutions', '62.01Z', '51-250', '10-50M', 2, 2023)
RETURNING id INTO org2_id;

INSERT INTO public.organizations (name, sector_naf, headcount_range, revenue_range, number_of_sites, rse_start_year)
VALUES ('Maison Duval', '10.71A', '11-50', '1-10M', 1, null)
RETURNING id INTO org3_id;

-- Link clients to organizations
UPDATE public.profiles SET organization_id = org1_id WHERE id = client1_uid;
UPDATE public.profiles SET organization_id = org2_id WHERE id = client2_uid;
UPDATE public.profiles SET organization_id = org3_id WHERE id = client3_uid;

-- ─── Diagnostic 1: Groupe Méridien — DELIVERED ─
INSERT INTO public.diagnostics (organization_id, analyst_id, client_user_id, status, analysis_step, restitution_date, unlocked_at)
VALUES (org1_id, analyst_uid, client1_uid, 'delivered', 'ready', now() - interval '3 days', now() - interval '3 days')
RETURNING id INTO diag1_id;

-- ─── Diagnostic 2: NovaTech — ANALYSIS ─────────
INSERT INTO public.diagnostics (organization_id, analyst_id, client_user_id, status, analysis_step)
VALUES (org2_id, analyst_uid, client2_uid, 'analysis', 'writing')
RETURNING id INTO diag2_id;

-- ─── Diagnostic 3: Maison Duval — QUESTIONNAIRE ─
INSERT INTO public.diagnostics (organization_id, analyst_id, client_user_id, status)
VALUES (org3_id, analyst_uid, client3_uid, 'questionnaire')
RETURNING id INTO diag3_id;

-- ─── Diagnostic 1: Advancement tiles ───────────
INSERT INTO public.advancement_tiles (diagnostic_id, tile_key, status, relevance) VALUES
  (diag1_id, 'bilan_carbone', 'done', 'essential'),
  (diag1_id, 'beges_r', 'done', 'essential'),
  (diag1_id, 'strategie_climat', 'in_progress', 'essential'),
  (diag1_id, 'trajectoire_reduction', 'not_done', 'essential'),
  (diag1_id, 'reporting_csrd', 'in_progress', 'essential'),
  (diag1_id, 'mobilite', 'done', 'recommended'),
  (diag1_id, 'achats_responsables', 'not_done', 'essential'),
  (diag1_id, 'formation', 'in_progress', 'recommended'),
  (diag1_id, 'eco_conception', 'not_done', 'recommended'),
  (diag1_id, 'certification', 'not_done', 'optional'),
  (diag1_id, 'budget_rse', 'done', 'recommended'),
  (diag1_id, 'poste_rse', 'in_progress', 'essential');

-- ─── Diagnostic 1: Validated sections ──────────
INSERT INTO public.diagnostic_sections (diagnostic_id, section_number, section_key, status, generated_by_ai, content_json) VALUES
  (diag1_id, 1, 'synthese_editoriale', 'validated', true, '{
    "paragraph_1": "Groupe Méridien a posé des bases solides : un Bilan Carbone récent, un référent climat identifié, une direction qui reconnaît le sujet. Mais ces fondations restent fragiles. La démarche repose largement sur une personne — votre responsable RSE — qui cumule ce rôle avec d''autres missions.",
    "paragraph_2": "Le point d''alerte principal concerne l''écart entre votre perception et celle de vos équipes. Vous estimiez que 60% de vos collaborateurs étaient engagés ou moteurs. La réalité mesurée est de 38%. Ce n''est pas un problème d''adhésion — c''est un problème de communication et de traduction concrète.",
    "paragraph_3": "La bonne nouvelle : votre scope 3 est déjà cartographié, votre trajectoire est amorcée, et la CSRD vous pousse dans la bonne direction. Vous avez 18 mois pour transformer cette conformité subie en avantage concurrentiel."
  }'::jsonb),
  (diag1_id, 2, 'priorites', 'validated', true, '{
    "priorities": [
      {"title": "Structurer la gouvernance climat avec un reporting trimestriel au COMEX", "why_now": "Votre DG alloue du budget mais ne voit pas les résultats.", "effort_tag": "quick", "budget_tag": "<10k"},
      {"title": "Déployer un programme de sensibilisation ciblé managers", "why_now": "L''écart de perception vient du middle management.", "effort_tag": "project", "budget_tag": "10-50k"},
      {"title": "Lancer la trajectoire SBTi avant l''obligation CSRD", "why_now": "Vous avez les données. Formaliser maintenant vous donne 12 mois d''avance.", "effort_tag": "project", "budget_tag": "10-50k"}
    ],
    "anti_recommendation": {"title": "Ne lancez pas de certification B Corp à ce stade", "explanation": "Le coût (50-80k) et l''effort ne sont pas justifiés par votre positionnement marché B2B."}
  }'::jsonb),
  (diag1_id, 3, 'score_maturite', 'validated', true, '{
    "global_score": 62, "global_grade": "B",
    "dimensions": [
      {"name": "Gouvernance climat", "score": 73, "grade": "B", "analysis": "Votre gouvernance est votre point fort.", "sector_position": "Top 30% de votre secteur"},
      {"name": "Mesure et données", "score": 67, "grade": "B", "analysis": "Votre Bilan Carbone est récent et couvre les 3 scopes.", "sector_position": "Dans la moyenne sectorielle"},
      {"name": "Stratégie et trajectoire", "score": 53, "grade": "B", "analysis": "Une stratégie existe mais reste déclarative.", "sector_position": "En dessous de la moyenne sectorielle"},
      {"name": "Culture et engagement", "score": 47, "grade": "C", "analysis": "C''est votre principale zone de fragilité.", "sector_position": "En dessous de la moyenne sectorielle"}
    ]
  }'::jsonb),
  (diag1_id, 9, 'prochaines_etapes', 'validated', true, '{
    "twelve_month_plan": [
      {"quarter": "T1 2026", "actions": ["Constituer le comité climat", "Nommer les ambassadeurs internes"]},
      {"quarter": "T2 2026", "actions": ["Premier comité climat", "Fresque du Climat managers", "Audit fournisseurs top 20"]},
      {"quarter": "T3 2026", "actions": ["Intégrer le climat dans le budget 2027", "Ateliers métiers climat"]},
      {"quarter": "T4 2026", "actions": ["Bilan du comité climat", "Critères carbone appels d''offres"]}
    ],
    "summary": "Focus sur la gouvernance et la montée en compétences des managers au S1, puis formalisation SBTi et intégration opérationnelle au S2."
  }'::jsonb);

-- ─── Diagnostic 1: Sample journal entries ──────
INSERT INTO public.journal_entries (diagnostic_id, author_id, content, step_change, created_at) VALUES
  (diag1_id, analyst_uid, 'Bienvenue dans votre espace Boussole Climat ! J''ai bien reçu vos réponses au Bloc 1 et 2. Je reviendrai vers vous dès que j''aurai avancé.', null, now() - interval '14 days'),
  (diag1_id, analyst_uid, 'Le sondage collaborateurs a atteint 28 réponses, c''est un très bon taux. Je lance l''analyse.', 'survey_pending → analysis', now() - interval '7 days'),
  (diag1_id, analyst_uid, 'L''écart de perception est le signal le plus fort. J''en fais le fil rouge du diagnostic.', null, now() - interval '5 days'),
  (diag1_id, analyst_uid, 'Diagnostic finalisé ! 9 sections prêtes. Je vous propose un créneau de restitution cette semaine.', 'analysis → ready_for_restitution', now() - interval '3 days');

-- ─── Diagnostic 2: Some questionnaire data ─────
INSERT INTO public.questionnaire_responses (diagnostic_id, block, question_key, response_value) VALUES
  (diag2_id, 2, 'M01_politique_climat', 3),
  (diag2_id, 2, 'M02_objectifs_quantifies', 2),
  (diag2_id, 2, 'M03_bilan_carbone', 3),
  (diag2_id, 2, 'M04_trajectoire', 1),
  (diag2_id, 2, 'M05_reporting', 2);

-- ─── Diagnostic 2: Some survey responses ───────
INSERT INTO public.survey_responses (diagnostic_id, s1, s2, s3, s4, s5, s6, s7, s8, s9_profile) VALUES
  (diag2_id, 6, 5, 4, 7, 5, 6, 3, 5, 'engage'),
  (diag2_id, 7, 6, 5, 6, 4, 7, 4, 6, 'moteur'),
  (diag2_id, 4, 3, 3, 5, 4, 4, 2, 3, 'indifferent'),
  (diag2_id, 5, 4, 4, 6, 5, 5, 3, 4, 'engage'),
  (diag2_id, 3, 2, 2, 4, 3, 3, 2, 3, 'sceptique'),
  (diag2_id, 8, 7, 6, 8, 7, 8, 5, 7, 'moteur'),
  (diag2_id, 5, 5, 4, 5, 4, 5, 3, 4, 'indifferent'),
  (diag2_id, 6, 5, 5, 7, 6, 6, 4, 5, 'engage');

END $$;
