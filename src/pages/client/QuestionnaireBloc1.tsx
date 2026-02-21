import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Check, RotateCw, X, ChevronRight, Lock } from 'lucide-react'
import { ADVANCEMENT_TILES, HEADCOUNT_OPTIONS, REVENUE_OPTIONS, type TileStatus } from '@/data/bloc1Tiles'

interface TileState {
  status: TileStatus
  comment: string
}

interface CompanyData {
  raison_sociale: string
  secteur: string
  effectif: string
  chiffre_affaires: string
  nb_sites: string
  annee_rse: string
  pas_de_demarche: boolean
  nom_repondant: string
  fonction_repondant: string
}

const STORAGE_KEY = 'boussole_bloc1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export default function QuestionnaireBloc1() {
  const navigate = useNavigate()
  const saved = loadState()

  const [company, setCompany] = useState<CompanyData>(saved?.company ?? {
    raison_sociale: '', secteur: '', effectif: '', chiffre_affaires: '',
    nb_sites: '', annee_rse: '', pas_de_demarche: false,
    nom_repondant: '', fonction_repondant: '',
  })

  const [tiles, setTiles] = useState<Record<string, TileState>>(
    saved?.tiles ?? Object.fromEntries(
      ADVANCEMENT_TILES.map(t => [t.id, { status: 'not_started' as TileStatus, comment: '' }])
    )
  )

  const [showFeedback, setShowFeedback] = useState(false)
  const [expandedTile, setExpandedTile] = useState<string | null>(null)

  // Auto-save with debounce
  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ company, tiles }))
  }, [company, tiles])

  useEffect(() => {
    const timer = setTimeout(save, 500)
    return () => clearTimeout(timer)
  }, [save])

  function cycleTileStatus(id: string) {
    setTiles(prev => {
      const current = prev[id].status
      const next: TileStatus =
        current === 'not_started' ? 'done' :
        current === 'done' ? 'in_progress' :
        'not_started'
      const newTiles = { ...prev, [id]: { ...prev[id], status: next } }
      // Open comment area if done or in_progress
      if (next !== 'not_started') {
        setExpandedTile(id)
      } else {
        setExpandedTile(prev => prev === id ? null : prev as any)
      }
      return newTiles
    })
  }

  function updateTileComment(id: string, comment: string) {
    setTiles(prev => ({ ...prev, [id]: { ...prev[id], comment } }))
  }

  function updateCompany(field: keyof CompanyData, value: string | boolean) {
    setCompany(prev => ({ ...prev, [field]: value }))
  }

  const statusIcon = (status: TileStatus) => {
    switch (status) {
      case 'done': return <Check size={16} />
      case 'in_progress': return <RotateCw size={16} />
      default: return <X size={14} />
    }
  }

  const statusColor = (status: TileStatus) => {
    switch (status) {
      case 'done': return { bg: 'var(--color-celsius-100)', border: 'var(--color-celsius-900)', text: 'var(--color-celsius-900)' }
      case 'in_progress': return { bg: 'var(--color-corail-100)', border: 'var(--color-corail-500)', text: 'var(--color-corail-500)' }
      default: return { bg: 'var(--color-fond)', border: 'var(--color-border)', text: 'var(--color-gris-400)' }
    }
  }

  const statusLabel = (status: TileStatus) => {
    switch (status) {
      case 'done': return 'Réalisé'
      case 'in_progress': return 'En cours'
      default: return 'Pas encore'
    }
  }

  const doneCount = Object.values(tiles).filter(t => t.status === 'done').length
  const inProgressCount = Object.values(tiles).filter(t => t.status === 'in_progress').length

  if (showFeedback) {
    return (
      <div className="max-w-[640px]">
        <h1 className="text-2xl font-bold mb-2">Passeport Climat</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-texte-secondary)' }}>
          Voici le profil de votre démarche. Il sera enrichi dans les prochaines sections.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {ADVANCEMENT_TILES.map(tile => {
            const state = tiles[tile.id]
            const colors = statusColor(state.status)
            return (
              <div
                key={tile.id}
                className="p-3 rounded-lg border-2 text-center"
                style={{ backgroundColor: colors.bg, borderColor: colors.border }}
              >
                <div className="flex justify-center mb-1" style={{ color: colors.text }}>
                  {statusIcon(state.status)}
                </div>
                <p className="text-xs font-medium leading-tight">{tile.label}</p>
              </div>
            )
          })}
        </div>

        <div className="flex gap-4 mb-6 text-sm">
          <span style={{ color: 'var(--color-celsius-900)' }}>✓ {doneCount} réalisé{doneCount > 1 ? 's' : ''}</span>
          <span style={{ color: 'var(--color-corail-500)' }}>↻ {inProgressCount} en cours</span>
          <span style={{ color: 'var(--color-gris-400)' }}>✗ {12 - doneCount - inProgressCount} pas encore</span>
        </div>

        <button
          onClick={() => navigate('/questionnaire/2')}
          className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
        >
          Passer au Bloc 2 <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-[640px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Bloc 1 : Votre démarche aujourd'hui</h1>
        <span
          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ backgroundColor: 'var(--color-celsius-50)', color: 'var(--color-celsius-900)' }}
        >
          <Clock size={12} /> ~10 min
        </span>
      </div>
      <p className="text-sm mb-8" style={{ color: 'var(--color-texte-secondary)' }}>
        Commençons par faire connaissance avec votre organisation et votre démarche climat actuelle.
      </p>

      {/* Section 1: Company Data */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}>
          Votre organisation
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Raison sociale</label>
            <input
              type="text" value={company.raison_sociale}
              onChange={e => updateCompany('raison_sociale', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
              onFocus={e => e.target.style.borderColor = 'var(--color-celsius-900)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              placeholder="Nom de votre entreprise"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Secteur d'activité</label>
            <input
              type="text" value={company.secteur}
              onChange={e => updateCompany('secteur', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
              onFocus={e => e.target.style.borderColor = 'var(--color-celsius-900)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              placeholder="Ex: Industrie manufacturière, Services, Commerce..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Effectif total</label>
              <select
                value={company.effectif}
                onChange={e => updateCompany('effectif', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <option value="">Sélectionner</option>
                {HEADCOUNT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chiffre d'affaires</label>
              <select
                value={company.chiffre_affaires}
                onChange={e => updateCompany('chiffre_affaires', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <option value="">Sélectionner</option>
                {REVENUE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de sites</label>
              <input
                type="number" min="1" value={company.nb_sites}
                onChange={e => updateCompany('nb_sites', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Démarche RSE depuis</label>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="1990" max="2026" value={company.annee_rse}
                  onChange={e => updateCompany('annee_rse', e.target.value)}
                  disabled={company.pas_de_demarche}
                  className="flex-1 px-3 py-2.5 rounded-lg border text-sm focus:outline-none disabled:opacity-40"
                  style={{ borderColor: 'var(--color-border)' }}
                  placeholder="2020"
                />
              </div>
              <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer" style={{ color: 'var(--color-texte-secondary)' }}>
                <input
                  type="checkbox" checked={company.pas_de_demarche}
                  onChange={e => updateCompany('pas_de_demarche', e.target.checked)}
                  className="rounded"
                />
                Pas de démarche formalisée
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Votre nom</label>
              <input
                type="text" value={company.nom_repondant}
                onChange={e => updateCompany('nom_repondant', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="Prénom Nom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Votre fonction</label>
              <input
                type="text" value={company.fonction_repondant}
                onChange={e => updateCompany('fonction_repondant', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="Ex: Responsable RSE"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Advancement Tiles */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ backgroundColor: 'var(--color-blanc)', boxShadow: 'var(--shadow-card)' }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-celsius-900)', letterSpacing: '0.05em' }}>
          État de votre démarche
        </h2>
        <p className="text-sm mb-5" style={{ color: 'var(--color-texte-secondary)' }}>
          Pour chaque initiative, indiquez si elle est réalisée, en cours, ou pas encore lancée.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ADVANCEMENT_TILES.map(tile => {
            const state = tiles[tile.id]
            const colors = statusColor(state.status)
            const isExpanded = expandedTile === tile.id && state.status !== 'not_started'

            return (
              <div key={tile.id}>
                <button
                  onClick={() => cycleTileStatus(tile.id)}
                  className="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98]"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{tile.label}</p>
                    <div
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: state.status === 'not_started' ? 'var(--color-gris-200)' : colors.border, color: 'white' }}
                    >
                      {statusIcon(state.status)}
                    </div>
                  </div>
                  <span className="text-xs mt-1 inline-block" style={{ color: colors.text }}>
                    {statusLabel(state.status)}
                  </span>
                </button>

                {isExpanded && (
                  <textarea
                    value={state.comment}
                    onChange={e => updateTileComment(tile.id, e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border text-xs resize-none focus:outline-none transition-all"
                    style={{ borderColor: 'var(--color-border)', minHeight: '60px' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-celsius-900)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    placeholder="Précisez : date, prestataire, périmètre..."
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Validate */}
      <button
        onClick={() => setShowFeedback(true)}
        className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        style={{ backgroundColor: 'var(--color-celsius-900)', boxShadow: 'var(--shadow-card)' }}
      >
        Valider et voir mon Passeport Climat <ChevronRight size={18} />
      </button>
    </div>
  )
}
