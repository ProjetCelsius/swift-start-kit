import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, FileSpreadsheet, Image, Trash2, Check, BarChart3, FileCheck, Briefcase, Building2, DollarSign } from 'lucide-react'

const SUGGESTED_DOCS = [
  { icon: <BarChart3 size={20} style={{ color: '#1B4332' }} />, title: 'Bilan Carbone ou Bilan GES existant', description: 'Dernier bilan réalisé, même ancien' },
  { icon: <FileCheck size={20} style={{ color: '#1B4332' }} />, title: 'Rapport RSE / DPEF / rapport extra-financier', description: 'Le plus récent disponible' },
  { icon: <FileText size={20} style={{ color: '#1B4332' }} />, title: 'Politique ou charte environnementale', description: 'Document interne formalisant vos engagements' },
  { icon: <Briefcase size={20} style={{ color: '#1B4332' }} />, title: 'Plan d\'action climat existant', description: 'Feuille de route, trajectoire, objectifs chiffrés' },
  { icon: <Building2 size={20} style={{ color: '#1B4332' }} />, title: 'Organigramme', description: 'Pour comprendre la structure décisionnelle' },
  { icon: <DollarSign size={20} style={{ color: '#1B4332' }} />, title: 'Budget RSE/climat', description: 'Répartition des investissements climat' },
]

interface UploadedFile {
  id: string
  name: string
  size: string
  date: string
  type: 'pdf' | 'excel' | 'image' | 'other'
}

// Mock files for demo
const MOCK_FILES: UploadedFile[] = []

function getFileIcon(type: string) {
  if (type === 'pdf') return <FileText size={20} style={{ color: '#7A766D' }} />
  if (type === 'excel') return <FileSpreadsheet size={20} style={{ color: '#7A766D' }} />
  if (type === 'image') return <Image size={20} style={{ color: '#7A766D' }} />
  return <FileText size={20} style={{ color: '#7A766D' }} />
}

export default function DocumentsPage() {
  const [files, setFiles] = useState<UploadedFile[]>(MOCK_FILES)
  const [notes, setNotes] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} Mo` : `${(f.size / 1024).toFixed(0)} Ko`,
      date: new Date().toLocaleDateString('fr-FR'),
      type: f.name.endsWith('.pdf') ? 'pdf' : f.name.endsWith('.xlsx') || f.name.endsWith('.xls') ? 'excel' : f.type.startsWith('image/') ? 'image' : 'other',
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id))

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400, color: '#2A2A28', marginBottom: 8 }}>
          Documents & informations
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#7A766D', lineHeight: 1.5 }}>
          Transmettez les documents utiles à votre analyste. Cette étape est facultative et peut être complétée à tout moment.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => fileInput.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#1B4332' : '#EDEAE3'}`,
          borderRadius: 14, padding: 40, textAlign: 'center', cursor: 'pointer',
          backgroundColor: dragOver ? '#E8F0EB' : 'transparent',
          transition: 'all 0.15s', marginBottom: 16,
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
        <input ref={fileInput} type="file" multiple hidden onChange={e => { if (e.target.files) handleFiles(e.target.files) }} />
      </div>

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
          {files.map(file => (
            <div key={file.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 10,
            }}>
              {getFileIcon(file.type)}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.85rem', color: '#2A2A28', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F', flexShrink: 0 }}>{file.size}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#B0AB9F', flexShrink: 0 }}>{file.date}</span>
              <button
                onClick={() => removeFile(file.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: 0.5, transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
              >
                <Trash2 size={16} style={{ color: '#DC4A4A' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Suggested documents */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.56rem',
          letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#B0AB9F', marginBottom: 12,
        }}>
          DOCUMENTS UTILES
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {SUGGESTED_DOCS.map((doc, i) => {
            const isUploaded = files.some(f => f.name.toLowerCase().includes(doc.title.split(' ')[0].toLowerCase()))
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px',
                backgroundColor: '#FFFFFF', border: '1px solid #EDEAE3', borderRadius: 10,
              }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>{doc.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.85rem', color: '#2A2A28', marginBottom: 2 }}>
                    {doc.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#B0AB9F' }}>
                    {doc.description}
                  </div>
                </div>
                {isUploaded && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px',
                    borderRadius: 12, backgroundColor: '#E8F0EB', flexShrink: 0,
                    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.7rem', color: '#1B4332',
                  }}>
                    <Check size={10} /> Reçu
                  </span>
                )}
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
      </div>

      {/* Auto-save indicator */}
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#B0AB9F' }}>
        ✓ Sauvegarde automatique
      </p>
    </div>
  )
}
