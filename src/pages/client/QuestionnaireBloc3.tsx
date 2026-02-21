import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Lock, ChevronRight, GripVertical, X } from 'lucide-react'
import {
  MOTEURS, FREINS,
  REGULATORY_ROWS, REGULATORY_COLUMNS,
  type RegulatoryAnswer,
} from '@/data/bloc3Data'

const STORAGE_KEY = 'boussole_bloc3'
const MAX_CHARS = 500

interface Bloc3State {
  moteurs: string[]
  frein: string
  freinAutre: string
  regulatory: Record<string, RegulatoryAnswer>
  perteMarche: string
  perteDetail: string
  q25: string
  q26: string
  q27: string
}

const defaultState: Bloc3State = {
  moteurs: [],
  frein: '',
  freinAutre: '',
  regulatory: {},
  perteMarche: '',
  perteDetail: '',
  q25: '',
  q26: '',
  q27: '',
}

function loadState(): Bloc3State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState
  } catch { return defaultState }
}

// ── Section wrapper ──────────────────────────────────────
function Section({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      className="rounded-xl p-6 mb-8"
      style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
    >
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-5"
        style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}
      >
        {label}
      </h2>
      {children}
    </div>
  )
}

// ── Char counter textarea ────────────────────────────────
function CountedTextarea({ value, onChange, placeholder, maxChars = MAX_CHARS }: {
  value: string; onChange: (v: string) => void; placeholder: string; maxChars?: number
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={e => { if (e.target.value.length <= maxChars) onChange(e.target.value) }}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none transition-colors italic placeholder:not-italic"
        style={{ borderColor: 'var(--color-border)', minHeight: '120px' }}
        onFocus={e => e.target.style.borderColor = 'var(--color-celsius-900)'}
        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
      />
      <p className="text-right text-xs mt-1" style={{ color: 'var(--color-gris-400)' }}>
        {value.length}/{maxChars}
      </p>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────
export default function QuestionnaireBloc3() {
  const navigate = useNavigate()
  const [state, setState] = useState<Bloc3State>(loadState)
  const [showFeedback, setShowFeedback] = useState(false)

  const update = useCallback(<K extends keyof Bloc3State>(key: K, value: Bloc3State[K]) => {
    setState(prev => ({ ...prev, [key]: value }))
  }, [])

  // Auto-save
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), 500)
    return () => clearTimeout(t)
  }, [state])

  // ── Moteurs handlers ──
  function toggleMoteur(m: string) {
    setState(prev => {
      const has = prev.moteurs.includes(m)
      if (has) return { ...prev, moteurs: prev.moteurs.filter(x => x !== m) }
      if (prev.moteurs.length >= 3) return prev
      return { ...prev, moteurs: [...prev.moteurs, m] }
    })
  }

  function removeMoteur(index: number) {
    setState(prev => ({ ...prev, moteurs: prev.moteurs.filter((_, i) => i !== index) }))
  }

  function moveMoteur(from: number, to: number) {
    setState(prev => {
      const arr = [...prev.moteurs]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return { ...prev, moteurs: arr }
    })
  }

  // ── Feedback view ──
  if (showFeedback) {
    // Load bloc1 to get company size
    let effectif = ''
    try {
      const bloc1 = JSON.parse(localStorage.getItem('boussole_bloc1') ?? '{}')
      effectif = bloc1?.company?.effectif ?? ''
    } catch { /* */ }
    const isLarge = ['251-500', '501-1000', '1001-5000', '5000+'].includes(effectif)

    // Build urgency list
    const urgencyItems = REGULATORY_ROWS.map(row => {
      const answer = state.regulatory[row.id]
      let urgency: 'ready' | 'approaching' | 'urgent' | null = null
      if (answer === 'Déjà concerné') urgency = 'ready'
      else if (answer === 'Sous 12 mois' || answer === 'Sous 2-3 ans') urgency = 'approaching'
      else if (answer === 'Je ne sais pas' && isLarge) urgency = 'urgent'
      return { ...row, answer, urgency }
    }).filter(r => r.urgency !== null)
      .sort((a, b) => {
        const order = { urgent: 0, approaching: 1, ready: 2 }
        return (order[a.urgency!] ?? 3) - (order[b.urgency!] ?? 3)
      })
      .slice(0, 3)

    const urgencyStyle = {
      ready: { bg: 'var(--color-celsius-100)', color: 'var(--color-celsius-900)', label: 'Prêt' },
      approaching: { bg: 'var(--color-corail-100)', color: 'var(--color-corail-500)', label: 'En approche' },
      urgent: { bg: 'var(--color-rouge-100)', color: 'var(--color-rouge-500)', label: 'Urgent' },
    }

    return (
      <div className="max-w-[640px] animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">Carte des échéances réglementaires</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-texte-secondary)' }}>
          Vos 3 échéances les plus urgentes, basées sur vos réponses.
        </p>

        <div
          className="rounded-xl p-6 mb-8"
          style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
        >
          {urgencyItems.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-gris-400)' }}>
              Aucune échéance critique identifiée.
            </p>
          ) : (
            <div className="space-y-3">
              {urgencyItems.map(item => {
                const s = urgencyStyle[item.urgency!]
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full shrink-0"
                      style={{ backgroundColor: s.bg, color: s.color }}
                    >
                      {s.label}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/questionnaire/4')}
          className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
        >
          Passer au Bloc 4 <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  // ── Main form (vertical scroll) ────────────────────────
  return (
    <div className="max-w-[640px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Bloc 3 : Vos enjeux et votre vision</h1>
        <span
          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
          style={{ backgroundColor: 'var(--color-celsius-50)', color: 'var(--color-celsius-900)' }}
        >
          <Clock size={12} /> ~10 min
        </span>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--color-texte-secondary)' }}>
        Identifiez ce qui motive et freine votre démarche, et partagez votre vision.
      </p>

      {/* Q21 — Moteurs */}
      <Section label="Q21 — Qu'est-ce qui motive votre démarche climat ?">
        <p className="text-sm mb-4" style={{ color: 'var(--color-texte-secondary)' }}>
          Sélectionnez jusqu'à 3 moteurs, puis classez-les par importance.
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {MOTEURS.map(m => {
            const isSelected = state.moteurs.includes(m)
            const isDisabled = !isSelected && state.moteurs.length >= 3
            return (
              <button
                key={m}
                onClick={() => toggleMoteur(m)}
                disabled={isDisabled}
                className="px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isSelected ? 'var(--color-celsius-100)' : 'var(--color-fond)',
                  borderColor: isSelected ? 'var(--color-celsius-900)' : 'var(--color-border)',
                  color: isSelected ? 'var(--color-celsius-900)' : 'var(--color-texte)',
                }}
              >
                {m}
              </button>
            )
          })}
        </div>

        {state.moteurs.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-texte-secondary)' }}>
              Classement par importance (glissez pour réordonner) :
            </p>
            <div className="space-y-2">
              {state.moteurs.map((m, i) => (
                <div
                  key={m}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('text/plain', String(i))}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    const from = parseInt(e.dataTransfer.getData('text/plain'))
                    moveMoteur(from, i)
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all"
                  style={{ backgroundColor: 'var(--color-celsius-50)', borderColor: 'var(--color-celsius-100)' }}
                >
                  <GripVertical size={14} style={{ color: 'var(--color-gris-400)' }} />
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: 'var(--color-celsius-900)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium flex-1">{m}</span>
                  <button onClick={() => removeMoteur(i)} className="shrink-0" style={{ color: 'var(--color-gris-400)' }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Q22 — Frein principal */}
      <Section label="Q22 — Quel est le principal frein à votre démarche ?">
        <div className="space-y-2">
          {FREINS.map(f => {
            const isSelected = state.frein === f
            return (
              <button
                key={f}
                onClick={() => update('frein', f)}
                className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 active:scale-[0.98]"
                style={{
                  backgroundColor: isSelected ? 'var(--color-celsius-50)' : 'var(--color-blanc)',
                  borderColor: isSelected ? 'var(--color-celsius-900)' : 'var(--color-border)',
                }}
              >
                {f}
              </button>
            )
          })}
          {/* Autre */}
          <button
            onClick={() => update('frein', 'Autre')}
            className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 active:scale-[0.98]"
            style={{
              backgroundColor: state.frein === 'Autre' ? 'var(--color-celsius-50)' : 'var(--color-blanc)',
              borderColor: state.frein === 'Autre' ? 'var(--color-celsius-900)' : 'var(--color-border)',
            }}
          >
            Autre
          </button>
          {state.frein === 'Autre' && (
            <textarea
              value={state.freinAutre}
              onChange={e => update('freinAutre', e.target.value)}
              placeholder="Précisez votre frein principal..."
              className="w-full px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none transition-colors mt-1"
              style={{ borderColor: 'var(--color-border)', minHeight: '80px' }}
              onFocus={e => e.target.style.borderColor = 'var(--color-celsius-900)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
          )}
        </div>
      </Section>

      {/* Q23 — Échéances réglementaires */}
      <Section label="Q23 — Échéances réglementaires">
        <p className="text-sm mb-4" style={{ color: 'var(--color-texte-secondary)' }}>
          Pour chaque réglementation, indiquez votre situation.
        </p>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left pb-3 pr-2 font-medium" style={{ color: 'var(--color-texte-secondary)' }}></th>
                {REGULATORY_COLUMNS.map(col => (
                  <th key={col} className="pb-3 px-1 text-center font-medium text-xs" style={{ color: 'var(--color-texte-secondary)', minWidth: '80px' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REGULATORY_ROWS.map(row => (
                <tr key={row.id} className="border-t" style={{ borderColor: 'var(--color-border-light)' }}>
                  <td className="py-3 pr-2 font-medium text-sm">{row.label}</td>
                  {REGULATORY_COLUMNS.map(col => {
                    const isSelected = state.regulatory[row.id] === col
                    return (
                      <td key={col} className="py-3 px-1 text-center">
                        <button
                          onClick={() => update('regulatory', { ...state.regulatory, [row.id]: col })}
                          className="w-5 h-5 rounded-full border-2 mx-auto flex items-center justify-center transition-all duration-200"
                          style={{
                            borderColor: isSelected ? 'var(--color-celsius-900)' : 'var(--color-gris-300)',
                            backgroundColor: isSelected ? 'var(--color-celsius-900)' : 'transparent',
                          }}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked */}
        <div className="sm:hidden space-y-5">
          {REGULATORY_ROWS.map(row => (
            <div key={row.id}>
              <p className="text-sm font-medium mb-2">{row.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {REGULATORY_COLUMNS.map(col => {
                  const isSelected = state.regulatory[row.id] === col
                  return (
                    <button
                      key={col}
                      onClick={() => update('regulatory', { ...state.regulatory, [row.id]: col })}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 active:scale-[0.97]"
                      style={{
                        backgroundColor: isSelected ? 'var(--color-celsius-100)' : 'var(--color-fond)',
                        borderColor: isSelected ? 'var(--color-celsius-900)' : 'var(--color-border)',
                        color: isSelected ? 'var(--color-celsius-900)' : 'var(--color-texte-secondary)',
                      }}
                    >
                      {col}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Q24 — Perte de marché */}
      <Section label="Q24 — Avez-vous déjà perdu un marché à cause d'un manque de maturité climat ?">
        <div className="flex gap-3 mb-3">
          {['Oui', 'Non', 'Je ne sais pas'].map(opt => {
            const isSelected = state.perteMarche === opt
            return (
              <button
                key={opt}
                onClick={() => update('perteMarche', opt)}
                className="flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                style={{
                  backgroundColor: isSelected ? 'var(--color-celsius-50)' : 'var(--color-blanc)',
                  borderColor: isSelected ? 'var(--color-celsius-900)' : 'var(--color-border)',
                  color: isSelected ? 'var(--color-celsius-900)' : 'var(--color-texte)',
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>
        {state.perteMarche === 'Oui' && (
          <textarea
            value={state.perteDetail}
            onChange={e => update('perteDetail', e.target.value)}
            placeholder="Pouvez-vous préciser brièvement ?"
            className="w-full px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none transition-colors animate-fade-in"
            style={{ borderColor: 'var(--color-border)', minHeight: '80px' }}
            onFocus={e => e.target.style.borderColor = 'var(--color-celsius-900)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
        )}
      </Section>

      {/* Q25 — Open question */}
      <Section label="Q25 — Votre priorité">
        <p className="text-sm mb-3 font-medium">
          Si vous pouviez changer une seule chose dans votre démarche climat, ce serait quoi ?
        </p>
        <CountedTextarea
          value={state.q25}
          onChange={v => update('q25', v)}
          placeholder="Si vous pouviez changer une seule chose dans votre démarche climat, ce serait quoi ?"
        />
      </Section>

      {/* Q26 — Open question */}
      <Section label="Q26 — Vos attentes">
        <p className="text-sm mb-3 font-medium">
          Qu'attendez-vous concrètement de ce diagnostic ?
        </p>
        <CountedTextarea
          value={state.q26}
          onChange={v => update('q26', v)}
          placeholder="Qu'attendez-vous concrètement de ce diagnostic ?"
        />
      </Section>

      {/* Q27 — Confidential */}
      <div
        className="rounded-xl p-6 mb-8 border-l-4"
        style={{
          backgroundColor: 'var(--color-gold-100)',
          borderLeftColor: 'var(--color-corail-500)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Lock size={16} style={{ color: 'var(--color-corail-500)' }} />
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-corail-500)', letterSpacing: '0.05em' }}
          >
            Q27 — Question confidentielle
          </h2>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--color-texte-secondary)' }}>
          Cette réponse est confidentielle. Elle ne figurera pas dans le rapport partageable et ne sera lue que par votre analyste.
        </p>
        <p className="text-sm mb-3 font-medium">
          Y a-t-il un sujet que vous n'osez pas aborder en interne concernant votre démarche climat ?
        </p>
        <CountedTextarea
          value={state.q27}
          onChange={v => update('q27', v)}
          placeholder="Y a-t-il un sujet que vous n'osez pas aborder en interne concernant votre démarche climat ?"
        />
      </div>

      {/* Validate */}
      <button
        onClick={() => setShowFeedback(true)}
        className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
      >
        Valider et voir mes échéances <ChevronRight size={18} />
      </button>
    </div>
  )
}
