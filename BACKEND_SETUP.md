# 🔧 Backend Setup — Boussole Climat

## Prérequis
- Un compte [Supabase](https://supabase.com) (gratuit suffit pour le MVP)
- Un compte [Anthropic](https://console.anthropic.com) (pour l'API Claude — génération diagnostic)
- Un compte [Resend](https://resend.com) (pour les emails — optionnel pour le MVP)

## Étape 1 : Créer le projet Supabase

1. Aller sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Cliquer "New Project"
3. Nom : `boussole-climat` | Région : `eu-west-3` (Paris) | Mot de passe : générer un fort
4. Attendre ~2 min que le projet soit provisionné

## Étape 2 : Exécuter les migrations SQL

1. Aller dans **SQL Editor** dans le dashboard Supabase
2. Coller et exécuter `supabase/migrations/001_create_tables.sql`
3. Coller et exécuter `supabase/migrations/002_rls_policies.sql`

⚠️ Exécuter dans l'ordre. La migration 002 dépend des tables créées en 001.

## Étape 3 : Configurer les variables d'environnement

1. Aller dans **Settings → API** dans le dashboard Supabase
2. Copier :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
3. Créer un fichier `.env` à la racine du projet :
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

## Étape 4 : Déployer les Edge Functions

### Option A : Via le CLI Supabase (recommandé)
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy submit-survey
supabase functions deploy submit-dg
supabase functions deploy generate-diagnostic
supabase functions deploy send-notification
```

### Option B : Via le dashboard
1. Aller dans **Edge Functions** dans le dashboard
2. Cliquer "Create a new function"
3. Copier le contenu de chaque fichier dans `supabase/functions/`

### Configurer les secrets des Edge Functions
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set RESEND_API_KEY=re_...
```
Ou via le dashboard : **Edge Functions → Manage secrets**

## Étape 5 : Créer le premier utilisateur admin

1. Aller dans **Authentication → Users** dans le dashboard
2. Cliquer "Add user" → "Create new user"
3. Email : `guillaume@projetcelsius.fr` | Mot de passe : [choisir]
4. Copier l'UUID du user créé
5. Dans **SQL Editor**, exécuter :
```sql
INSERT INTO public.profiles (id, role, first_name, last_name, title)
VALUES ('UUID-COPIÉ-ICI', 'admin', 'Guillaume', 'Pakula', 'Analyste Climat Senior');
```

## Étape 6 : Vérifier

1. Lancer l'app : `npm run dev`
2. Se connecter avec l'email/mot de passe créé à l'étape 5
3. L'app devrait basculer du mode démo vers le mode Supabase automatiquement (détecté par `isSupabaseConfigured` dans `src/lib/supabase.ts`)

## Architecture

```
supabase/
├── migrations/
│   ├── 001_create_tables.sql    ← 13 tables
│   └── 002_rls_policies.sql     ← Row Level Security
├── functions/
│   ├── _shared/cors.ts          ← Headers CORS partagés
│   ├── submit-survey/index.ts   ← Soumission sondage (anonyme)
│   ├── submit-dg/index.ts       ← Soumission DG (usage unique)
│   ├── generate-diagnostic/     ← Génération IA via Claude API
│   └── send-notification/       ← Emails via Resend
src/
├── types/database.ts            ← Types TypeScript ← SQL schema
├── lib/supabase.ts              ← Client typé + helper Edge Functions
├── hooks/
│   ├── useDiagnostic.ts         ← CRUD diagnostic + realtime
│   ├── useQuestionnaire.ts      ← Sauvegarde réponses (remplace localStorage)
│   ├── useSurveyTracking.ts     ← Compteur sondage en temps réel
│   ├── useJournal.ts            ← Journal de bord + réponses
│   └── useAnalytics.ts          ← Tracking événements
├── components/
│   ├── diagnostic/
│   │   └── SectionNavigation.tsx ← Breadcrumb + prev/next sections
│   └── ScrollToTop.tsx          ← Reset scroll on route change
```

## Mode démo vs mode réel

L'app détecte automatiquement si Supabase est configuré via `isSupabaseConfigured` dans `src/lib/supabase.ts`. Si les variables d'environnement ne sont pas renseignées, l'app tourne en mode démo avec les données mock existantes. Les hooks (useQuestionnaire, useDiagnostic, etc.) tombent en fallback localStorage / données statiques.

Cela permet de :
- Développer le front sans backend (mode Lovable)
- Faire des démos sans Supabase
- Basculer vers le réel juste en renseignant le `.env`
