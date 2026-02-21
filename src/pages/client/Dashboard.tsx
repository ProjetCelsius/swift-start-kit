import { useAuth, MOCK_ANALYST } from '../../hooks/useAuth'
import { Calendar, ArrowRight, Lock } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const analyst = MOCK_ANALYST

  const questionnaireProgress = 0 // 0-100
  // const surveyCount = 0
  // const diagnosticUnlocked = false

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold mb-3">
          Bienvenue {user?.first_name}
        </h1>
        <p className="text-base leading-relaxed" style={{ color: 'var(--color-texte-secondary)' }}>
          Votre diagnostic Boussole Climat est en préparation. La première étape : 
          répondre au questionnaire ci-dessous. Comptez environ 45 minutes, à votre 
          rythme. Vous pouvez interrompre et reprendre à tout moment.
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Questionnaire</span>
          <span className="text-sm" style={{ color: 'var(--color-texte-secondary)' }}>
            {questionnaireProgress}%
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-gris-200)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${questionnaireProgress}%`,
              backgroundColor: 'var(--color-celsius-900)',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {['Démarche', 'Maturité', 'Enjeux', 'Perception'].map((label) => (
            <span
              key={label}
              className="text-xs"
              style={{ color: 'var(--color-texte-secondary)' }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        className="w-full py-4 rounded-lg text-white font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90"
        style={{ backgroundColor: 'var(--color-celsius-900)' }}
      >
        Commencer le questionnaire
        <ArrowRight size={20} />
      </button>

      {/* Analyst card */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: 'var(--color-blanc)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="label-uppercase mb-4">Votre analyste</div>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0"
            style={{ backgroundColor: 'var(--color-celsius-800)' }}
          >
            {analyst.first_name[0]}{analyst.last_name[0]}
          </div>
          <div>
            <div className="font-semibold">{analyst.first_name} {analyst.last_name}</div>
            <div className="text-sm" style={{ color: 'var(--color-texte-secondary)' }}>
              {analyst.title}
            </div>
          </div>
        </div>
        <button
          className="mt-4 w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'var(--color-corail-500)',
            color: 'white',
          }}
        >
          <Calendar size={16} />
          Planifier l'appel de lancement
        </button>
      </div>

      {/* Diagnostic preview (blurred) */}
      <div className="relative rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="p-6 space-y-4" style={{ filter: 'blur(8px)', userSelect: 'none' }}>
          <div className="h-6 w-48 rounded" style={{ backgroundColor: 'var(--color-gris-200)' }} />
          <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--color-gris-100)' }} />
          <div className="h-4 w-5/6 rounded" style={{ backgroundColor: 'var(--color-gris-100)' }} />
          <div className="h-4 w-4/6 rounded" style={{ backgroundColor: 'var(--color-gris-100)' }} />
          <div className="h-32 w-full rounded-lg" style={{ backgroundColor: 'var(--color-gris-100)' }} />
          <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--color-gris-100)' }} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60">
          <Lock size={32} style={{ color: 'var(--color-gris-400)' }} className="mb-3" />
          <span className="text-sm font-medium" style={{ color: 'var(--color-texte-secondary)' }}>
            Déverrouillé après votre restitution
          </span>
        </div>
      </div>
    </div>
  )
}
