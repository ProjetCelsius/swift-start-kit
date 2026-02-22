import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, FileText, FileSpreadsheet, Image, Check, BarChart3, FileCheck, Briefcase, Building2, DollarSign, X } from 'lucide-react'

interface DocCategory {
  id: string
  icon: React.ReactNode
  title: string
  description: string
}

// TODO: In production, these categories should be dynamically loaded from the setup configuration
// (what the analyst checked during launch call Tab 1). For now, all 6 are shown in demo mode.
const SUGGESTED_DOCS: DocCategory[] = [
  { id: 'bilan', icon: <BarChart3 size={20} style={{ color: '#1B4332' }} />, title: 'Bilan Carbone ou Bilan GES existant', description: 'Dernier bilan réalisé, même ancien' },
  { id: 'rapport', icon: <FileCheck size={20} style={{ color: '#1B4332' }} />, title: 'Rapport RSE / DPEF / rapport extra-financier', description: 'Le plus récent disponible' },
  { id: 'politique', icon: <FileText size={20} style={{ color: '#1B4332' }} />, title: 'Politique ou charte environnementale', description: 'Document interne formalisant vos engagements' },
  { id: 'plan', icon: <Briefcase size={20} style={{ color: '#1B4332' }} />, title: "Plan d'action climat existant", description: 'Feuille de route, trajectoire, objectifs chiffrés' },
  { id: 'organigramme', icon: <Building2 size={20} style={{ color: '#1B4332' }} />, title: 'Organigramme', description: 'Pour comprendre la structure décisionnelle' },
  { id: 'budget', icon: <DollarSign size={20} style={{ color: '#1B4332' }} />, title: 'Budget RSE/climat', description: 'Répartition des investissements climat' },
]

interface UploadedFile {
  id: string
  name: string
  size: string
  date: string
  type: 'pdf' | 'excel' | 'image' | 'other'
  categoryId: string | null // null = uncategorized
}

function getFileType(file: File): 'pdf' | 'excel' | 'image' | 'other' {
  if (file.name.endsWith('.pdf')) return 'pdf'
  if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) return 'excel'
  if (file.type.startsWith('image/')) return 'image'
  return 'other'
}

function formatSize(size: number): string {
  return size > 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} Mo` : `${(size / 1024).toFixed(0)} Ko`
}

function getFileIcon(type: string) {
  if (type === 'pdf') return <FileText size={16} style={{ color: '#7A766D' }} />
  if (type === 'excel') return <FileSpreadsheet size={16} style={{ color: '#7A766D' }} />
  if (type === 'image') return <Image size={16} style={{ color: '#7A766D' }} />
  return <FileText size={16} style={{ color: '#7A766D' }} />
}

function truncate(str: string, max: number) {
  if (str.length <= max) return str
  const ext = str.lastIndexOf('.') > 0 ? str.slice(str.lastIndexOf('.')) : ''
  return str.slice(0, max - ext.length - 1) + '…' + ext
}

export default function DocumentsPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [notes, setNotes] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [validated, setValidated] = useState(false)
  const [saveIndicator, setSaveIndicator] = useState(false)
  const generalInput = useRef<HTMLInputElement>(null)
  const categoryInputs = useRef<Record<string, HTMLInputElement | null>>({})

  // Debounced save indicator for notes
  useEffect(() => {
    if (!notes) return
    setSaveIndicator(false)
    const t = setTimeout(() => setSaveIndicator(true), 800)
    return () => clearTimeout(t)
  }, [notes])

  const addFiles = useCallback((fileList: FileList, categoryId: string | null) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: formatSize(f.size),
      date: new Date().toLocaleDateString('fr-FR'),
      type: getFileType(f),
      categoryId,
    }))
    setFiles(prev => [...prev, ...newFiles])
    setValidated(false)
  }, [])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    setValidated(false)
  }

  const filesForCategory = (catId: string) => files.filter(f => f.categoryId === catId)
  const uncategorizedFiles = files.filter(f => f.categoryId === null)
  const totalFiles = files.length

  return (
    <div style={{ maxWidth: 960, paddingBottom: 100 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400, color: '#2A2A28', margin: 0 }}>
            Documents & informations
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {validated ? (
              <>
                <span style={{
                  padding: '12px 24px', borderRadius: 9,
                  backgroundColor: '#E8F0EB', color: '#1B4332',
                  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.82rem',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <Check size={14} /> Corpus validé
                </span>
                <button
                  onClick={() => setValidated(false)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#7A766D',
                    textDecoration: 'underline',
                  }}
                >
                  Modifier
                </button>
              </>
            ) : (
              <button
                onClick={() => setValidated(true)}
                style={{
                  padding: '12px 24px', borderRadius: 9,
                  backgroundColor: '#1B4332', color: '#fff',
                  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.82rem',
                  border: 'none', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2D6A4F')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1B4332')}
              >
                Valider le corpus →
              </button>
            )}
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A766D', lineHeight: 1.5, marginBottom: 4 }}>
          Transmettez les documents utiles à votre analyste. Cette étape est facultative et peut être complétée à tout moment.
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: validated ? '#1B4332' : '#B0AB9F' }}>
          {validated
            ? <><Check size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{totalFiles} document{totalFiles > 1 ? 's' : ''} validé{totalFiles > 1 ? 's' : ''}</>
            : <>{totalFiles} document{totalFiles > 1 ? 's' : ''} ajouté{totalFiles > 1 ? 's' : ''} · En attente de validation</>
          }
        </p>
      </div>

      {/* General upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files, null) }}
        onClick={() => generalInput.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#1B4332' : '#EDEAE3'}`,
          borderRadius: 14, padding: 40, textAlign: 'center', cursor: 'pointer',
          backgroundColor: dragOver ? '#E8F0EB' : 'transparent',
          transition: 'all 0.15s', marginBottom: 24,
        }}
        onMouseEnter={e => { if (!dragOver) { e.currentTarget.style.borderColor = '#B87333'; e.currentTarget.style.backgroundColor = '#F5EDE4' } }}
        onMouseLeave={e => { if (!dragOver) { e.currentTarget.style.borderColor = '#EDEAE3'; e.currentTarget.style.backgroundColor = 'transparent' } }}
      >
        <Upload size={48} style={{ color: '#B0AB9F', margin: '0 auto 12px' }} />
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.9rem', color: '#2A2A28', marginBottom: 4 }}>
          Glissez vos fichiers ici ou cliquez pour parcourir
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#B0AB9F' }}>
          PDF, Excel, Word, images · 50 Mo max par fichier
        </p>
        <input ref={generalInput} type="file" multiple hidden onChange={e => { if (e.target.files) addFiles(e.target.files, null) }} />
      </div>

      {/* Uncategorized files */}
      {uncategorizedFiles.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.56rem',
            letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#B0AB9F', marginBottom: 10,
          }}>
            AUTRES DOCUMENTS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {uncategorizedFiles.map(file => (
              <FilePill key={file.id} file={file} onRemove={removeFile} />
            ))}
          </div>
        </div>
      )}

      {/* Document categories */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.56rem',
          letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#B0AB9F', marginBottom: 12,
        }}>
          DOCUMENTS UTILES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {SUGGESTED_DOCS.map(doc => {
            const catFiles = filesForCategory(doc.id)
            const hasFiles = catFiles.length > 0
            return (
              <div
                key={doc.id}
                style={{
                  padding: '14px 18px',
                  backgroundColor: hasFiles ? '#E8F0EB' : '#FFFFFF',
                  border: '1px solid #EDEAE3',
                  borderLeft: hasFiles ? '3px solid #1B4332' : '1px solid #EDEAE3',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onClick={() => categoryInputs.current[doc.id]?.click()}
                onMouseEnter={e => { if (!hasFiles) e.currentTarget.style.backgroundColor = '#F7F5F0' }}
                onMouseLeave={e => { if (!hasFiles) e.currentTarget.style.backgroundColor = '#FFFFFF' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>{doc.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.85rem', color: '#2A2A28' }}>
                        {doc.title}
                      </span>
                      {hasFiles && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 8px',
                          borderRadius: 10, backgroundColor: '#1B4332', flexShrink: 0,
                          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.62rem', color: '#fff',
                        }}>
                          <Check size={9} /> {catFiles.length}
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#B0AB9F', marginBottom: hasFiles ? 10 : 0 }}>
                      {doc.description}
                    </div>
                    {/* File pills for this category */}
                    {catFiles.map(file => (
                      <FilePill key={file.id} file={file} onRemove={removeFile} compact />
                    ))}
                  </div>
                </div>
                <input
                  ref={el => { categoryInputs.current[doc.id] = el }}
                  type="file" multiple hidden
                  onClick={e => e.stopPropagation()}
                  onChange={e => { if (e.target.files) addFiles(e.target.files, doc.id); e.target.value = '' }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.56rem',
          letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#B0AB9F', marginBottom: 12,
        }}>
          INFORMATIONS COMPLÉMENTAIRES
        </div>
        <div style={{ position: 'relative' }}>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Contexte supplémentaire, précisions, documents en attente... Tout ce qui peut aider votre analyste."
            style={{
              width: '100%', minHeight: 120, padding: 16, borderRadius: 10,
              border: '1px solid #EDEAE3', fontSize: '0.85rem',
              fontFamily: 'var(--font-sans)', resize: 'none', outline: 'none',
              color: '#2A2A28', backgroundColor: '#FFFFFF',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = '#1B4332')}
            onBlur={e => (e.target.style.borderColor = '#EDEAE3')}
          />
          <span style={{
            position: 'absolute', bottom: 8, right: 12,
            fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F',
          }}>
            {notes.length}
          </span>
        </div>
        {saveIndicator && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#1B4332', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Check size={12} /> Sauvegardé
          </p>
        )}
      </div>

    </div>
  )
}

/* ── File Pill ── */
function FilePill({ file, onRemove, compact }: { file: UploadedFile; onRemove: (id: string) => void; compact?: boolean }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: compact ? '5px 8px' : '8px 12px',
        backgroundColor: compact ? 'rgba(255,255,255,0.7)' : '#FFFFFF',
        border: '1px solid #EDEAE3', borderRadius: 8,
        marginBottom: compact ? 4 : 0,
      }}
      onClick={e => e.stopPropagation()}
    >
      {getFileIcon(file.type)}
      <span style={{
        fontFamily: 'var(--font-sans)', fontSize: compact ? '0.75rem' : '0.82rem',
        fontWeight: 500, color: '#2A2A28', flex: 1, minWidth: 0,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {truncate(file.name, 30)}
      </span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#B0AB9F', flexShrink: 0 }}>
        {file.size}
      </span>
      <button
        onClick={e => { e.stopPropagation(); onRemove(file.id) }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, opacity: 0.4, transition: 'opacity 0.15s', flexShrink: 0 }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
      >
        <X size={14} style={{ color: '#DC4A4A' }} />
      </button>
    </div>
  )
}
