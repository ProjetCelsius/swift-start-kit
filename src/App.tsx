import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import ClientLayout from './components/layout/ClientLayout'
import Login from './pages/Login'
import Dashboard from './pages/client/Dashboard'
import QuestionnaireBloc1 from './pages/client/QuestionnaireBloc1'
import QuestionnaireBloc2 from './pages/client/QuestionnaireBloc2'
import QuestionnaireBloc3 from './pages/client/QuestionnaireBloc3'
import QuestionnaireBloc4 from './pages/client/QuestionnaireBloc4'
import QuestionnaireBlock from './pages/client/QuestionnaireBlock'
import SurveyPage from './pages/respondent/SurveyPage'
import DgPage from './pages/respondent/DgPage'
import DiagnosticSection1 from './pages/client/diagnostic/DiagnosticSection1'
import DiagnosticSection2 from './pages/client/diagnostic/DiagnosticSection2'
import DiagnosticSection3 from './pages/client/diagnostic/DiagnosticSection3'
import {
  QuestionnairePage,
  SondagePage,
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
        <Route path="/questionnaire/1" element={<QuestionnaireBloc1 />} />
        <Route path="/questionnaire/2" element={<QuestionnaireBloc2 />} />
        <Route path="/questionnaire/3" element={<QuestionnaireBloc3 />} />
        <Route path="/questionnaire/4" element={<QuestionnaireBloc4 />} />
        <Route path="/questionnaire/:blockId" element={<QuestionnaireBlock />} />
        <Route path="/sondage" element={<SondagePage />} />
        <Route path="/diagnostic/1" element={<DiagnosticSection1 />} />
        <Route path="/diagnostic/2" element={<DiagnosticSection2 />} />
        <Route path="/diagnostic/3" element={<DiagnosticSection3 />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/aide" element={<AidePage />} />
      </Route>

      {/* Espace Répondant (public) */}
      <Route path="/sondage/:token" element={<SurveyPage />} />
      <Route path="/dg/:token" element={<DgPage />} />

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
