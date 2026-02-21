// Placeholder pages — will be fleshed out in subsequent commits

export function QuestionnairePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Questionnaire</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Sélectionnez un bloc dans la sidebar pour commencer.
      </p>
    </div>
  )
}

export function QuestionnaireBlockPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bloc en cours</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Les questions apparaîtront ici.
      </p>
    </div>
  )
}

export function SondagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sondage interne</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Le suivi des réponses au sondage apparaîtra ici.
      </p>
    </div>
  )
}

export function DiagnosticSectionPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🔒</span>
        <h1 className="text-2xl font-bold">Section verrouillée</h1>
      </div>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Cette section sera déverrouillée après votre appel de restitution avec votre analyste.
      </p>
    </div>
  )
}

export function JournalPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Journal de bord</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Les notes de votre analyste apparaîtront ici au fil de l'analyse.
      </p>
    </div>
  )
}

export function MessagesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Messagerie</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Échangez avec votre analyste.
      </p>
    </div>
  )
}

export function AidePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Aide</h1>
      <p style={{ color: 'var(--color-texte-secondary)' }}>
        Besoin d'aide ? Contactez votre analyste via la messagerie ou planifiez un appel.
      </p>
    </div>
  )
}
