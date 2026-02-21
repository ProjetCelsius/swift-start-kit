import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import ClientLayout from './components/layout/ClientLayout'
import Login from './pages/Login'
import Dashboard from './pages/client/Dashboard'
import {
  QuestionnairePage,
  QuestionnaireBlockPage,
  SondagePage,
  DiagnosticSectionPage,
  JournalPage,
  MessagesPage,
  AidePage,
} from './pages/client/Placeholders'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-fond)' }}
      >
        <div
          className="w-8 h-8 rounded-lg animate-pulse"
          style={{ backgroundColor: 'var(--color-celsius-900)' }}
        />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      
      {/* Espace Client */}
      <Route element={user ? <ClientLayout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/questionnaire/:blockId" element={<QuestionnaireBlockPage />} />
        <Route path="/sondage" element={<SondagePage />} />
        <Route path="/diagnostic/:sectionId" element={<DiagnosticSectionPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/aide" element={<AidePage />} />
      </Route>

      {/* Espace Répondant (sondage public) */}
      <Route path="/sondage/:token" element={<div>Sondage public — à implémenter</div>} />
      <Route path="/dg/:token" element={<div>Questionnaire DG — à implémenter</div>} />

      {/* Espace Admin (à implémenter) */}
      <Route path="/admin/*" element={<div>Admin — à implémenter</div>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
