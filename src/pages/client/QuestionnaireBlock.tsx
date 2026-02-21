import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { QUESTIONNAIRE_BLOCKS, type QuestionOption, type Question } from '@/data/questionnaire'
import { ChevronLeft, ChevronRight, Clock, HelpCircle, Check } from 'lucide-react'

type Answers = Record<string, number | string>

function getStorageKey(block: number) {
  return `boussole_bloc_${block}`
}

function loadAnswers(block: number): Answers {
  try {
    const raw = localStorage.getItem(getStorageKey(block))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAnswers(block: number, answers: Answers) {
  localStorage.setItem(getStorageKey(block), JSON.stringify(answers))
}

export default function QuestionnaireBlock() {
  const { blockId } = useParams<{ blockId: string }>()
  const navigate = useNavigate()
  const blockNum = Number(blockId) as 1 | 2 | 3 | 4
  const block = QUESTIONNAIRE_BLOCKS.find((b: { block: number }) => b.block === blockNum)

  const [answers, setAnswers] = useState<Answers>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [showHelp, setShowHelp] = useState<string | null>(null)

  useEffect(() => {
    if (block) {
      setAnswers(loadAnswers(block.block))
      setCurrentQ(0)
      setShowHelp(null)
    }
  }, [blockNum])

  if (!block || block.questions.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">{block?.title ?? 'Bloc introuvable'}</h1>
        <p style={{ color: 'var(--color-texte-secondary)' }}>
          {block ? 'Ce bloc sera disponible prochainement.' : "Ce bloc n'existe pas."}
        </p>
        <button
          onClick={() => navigate('/questionnaire')}
          className="mt-6 text-sm font-medium flex items-center gap-1"
          style={{ color: 'var(--color-celsius-900)' }}
        >
          <ChevronLeft size={16} /> Retour
        </button>
      </div>
    )
  }

  const questions = block.questions
  const q = questions[currentQ]
  const total = questions.length
  const answeredCount = questions.filter((qq: Question) => answers[qq.key] !== undefined && answers[qq.key] !== '').length
  const progress = Math.round((answeredCount / total) * 100)
  const isLast = currentQ === total - 1
  const isFirst = currentQ === 0

  function handleScale(value: number) {
    const next = { ...answers, [q.key]: value }
    setAnswers(next)
    saveAnswers(block!.block, next)
    // Auto-advance after short delay
    if (!isLast) {
      setTimeout(() => setCurrentQ(prev => prev + 1), 300)
    }
  }

  function handleText(value: string) {
    const next = { ...answers, [q.key]: value }
    setAnswers(next)
    saveAnswers(block!.block, next)
  }

  return (
    <div className="max-w-[640px]">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/questionnaire')}
          className="text-sm font-medium flex items-center gap-1 mb-4"
          style={{ color: 'var(--color-texte-secondary)' }}
        >
          <ChevronLeft size={16} /> Questionnaire
        </button>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold">{block.title}</h1>
          <span
            className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
            style={{ backgroundColor: 'var(--color-celsius-50)', color: 'var(--color-celsius-900)' }}
          >
            <Clock size={12} /> ~{block.estimatedMinutes} min
          </span>
        </div>
        <p className="text-sm" style={{ color: 'var(--color-texte-secondary)' }}>
          {block.subtitle}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span style={{ color: 'var(--color-texte-secondary)' }}>
            Question {currentQ + 1} / {total}
          </span>
          <span className="font-semibold" style={{ color: 'var(--color-celsius-900)' }}>
            {progress}%
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-gris-200)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: 'var(--color-celsius-900)',
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{
          backgroundColor: 'var(--color-blanc)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-start gap-3 mb-6">
          <span
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: answers[q.key] !== undefined && answers[q.key] !== ''
                ? 'var(--color-celsius-900)'
                : 'var(--color-gris-200)',
              color: answers[q.key] !== undefined && answers[q.key] !== ''
                ? 'white'
                : 'var(--color-texte-secondary)',
            }}
          >
            {answers[q.key] !== undefined && answers[q.key] !== '' ? <Check size={14} /> : currentQ + 1}
          </span>
          <p className="text-base font-medium leading-relaxed">{q.text}</p>
        </div>

        {/* Help text toggle */}
        {q.helpText && (
          <div className="mb-5">
            <button
              onClick={() => setShowHelp(showHelp === q.key ? null : q.key)}
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: 'var(--color-celsius-800)' }}
            >
              <HelpCircle size={14} />
              {showHelp === q.key ? "Masquer l'aide" : "Besoin d'aide ?"}
            </button>
            {showHelp === q.key && (
              <p
                className="mt-2 text-sm p-3 rounded-lg"
                style={{
                  backgroundColor: 'var(--color-celsius-50)',
                  color: 'var(--color-texte-secondary)',
                }}
              >
                {q.helpText}
              </p>
            )}
          </div>
        )}

        {/* Scale input */}
        {q.type === 'scale' && q.options && (
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt: QuestionOption) => {
              const selected = answers[q.key] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => handleScale(opt.value)}
                  className="p-3 rounded-lg text-sm font-medium text-left transition-all duration-150 border-2"
                  style={{
                    backgroundColor: selected ? 'var(--color-celsius-50)' : 'var(--color-blanc)',
                    borderColor: selected ? 'var(--color-celsius-900)' : 'var(--color-border)',
                    color: selected ? 'var(--color-celsius-900)' : 'var(--color-texte)',
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2"
                    style={{
                      backgroundColor: selected ? 'var(--color-celsius-900)' : 'var(--color-gris-200)',
                      color: selected ? 'white' : 'var(--color-texte-secondary)',
                    }}
                  >
                    {opt.value}
                  </span>
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Text input */}
        {q.type === 'text' && (
          <textarea
            className="w-full p-3 rounded-lg text-sm border-2 resize-none focus:outline-none transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-blanc)',
            }}
            rows={4}
            placeholder="Votre réponse…"
            value={(answers[q.key] as string) || ''}
            onChange={e => handleText(e.target.value)}
            onFocus={e => (e.target.style.borderColor = 'var(--color-celsius-900)')}
            onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(prev => prev - 1)}
          disabled={isFirst}
          className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-30 transition-colors"
          style={{ color: 'var(--color-texte-secondary)' }}
        >
          <ChevronLeft size={16} /> Précédent
        </button>

        {isLast ? (
          <button
            onClick={() => navigate('/questionnaire')}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-colors"
            style={{ backgroundColor: 'var(--color-celsius-900)' }}
          >
            <Check size={16} /> Terminer ce bloc
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ(prev => prev + 1)}
            className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ color: 'var(--color-celsius-900)' }}
          >
            Suivant <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Question dots */}
      <div className="flex items-center justify-center gap-1.5 mt-8">
        {questions.map((qq: Question, i: number) => (
          <button
            key={qq.key}
            onClick={() => setCurrentQ(i)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-200"
            style={{
              backgroundColor:
                i === currentQ
                  ? 'var(--color-celsius-900)'
                  : answers[qq.key] !== undefined && answers[qq.key] !== ''
                    ? 'var(--color-celsius-600)'
                    : 'var(--color-gris-300)',
              transform: i === currentQ ? 'scale(1.3)' : 'scale(1)',
            }}
            title={`Question ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
