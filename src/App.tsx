import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { DemoProvider, useDemoIfAvailable } from './hooks/useDemo'
import DevToolbar from './components/DevToolbar'
import ClientLayout from './components/layout/ClientLayout'
import Login from './pages/Login'
import ClientHomeDashboard from './pages/client/ClientHomeDashboard'
import QuestionnaireBloc1 from './pages/client/QuestionnaireBloc1'
import QuestionnaireBloc2 from './pages/client/QuestionnaireBloc2'
import QuestionnaireBloc3 from './pages/client/QuestionnaireBloc3'
import QuestionnaireBloc4 from './pages/client/QuestionnaireBloc4'
import QuestionnaireBlock from './pages/client/QuestionnaireBlock'
import SurveyPage from './pages/respondent/SurveyPage'
import DgPage from './pages/respondent/DgPage'
import JournalPage from './pages/client/JournalPage'
import MessagesPage from './pages/client/MessagesPage'
import SondageSuiviPage from './pages/client/SondageSuiviPage'
import AnalystProfilePage from './pages/client/AnalystProfilePage'
import AttentePage from './pages/client/AttentePage'
import DiagnosticPage from './pages/client/DiagnosticPage'
import OnboardingSetupPage from './pages/client/OnboardingSetupPage'
import EntretiensPage from './pages/client/EntretiensPage'
import QuestionnaireRsePage from './pages/client/QuestionnaireRsePage'
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDiagnosticDetail from './pages/admin/AdminDiagnosticDetail'
import AdminStats from './pages/admin/AdminStats'
import NewDiagnostic from './pages/admin/NewDiagnostic'
import {
  QuestionnairePage,
  DiagnosticSectionPage,
  AidePage,
} from './pages/client/Placeholders'

function AppRoutes() {
  const { user, loading } = useAuth()
  const demo = useDemoIfAvailable()
  const isDemo = demo?.enabled ?? false
  const isAuthenticated = isDemo || !!user

  if (loading && !isDemo) {
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
    <>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/client/dashboard" /> : <Login />} />
        
        {/* Espace Client */}
        <Route element={isAuthenticated ? <ClientLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
          <Route path="/client" element={<Navigate to="/client/dashboard" replace />} />
          <Route path="/client/dashboard" element={<ClientHomeDashboard />} />
          <Route path="/client/onboarding" element={<OnboardingSetupPage />} />
          <Route path="/client/questionnaire" element={<QuestionnairePage />} />
          <Route path="/client/questionnaire/bloc1" element={<QuestionnaireBloc1 />} />
          <Route path="/client/questionnaire/bloc2" element={<QuestionnaireBloc2 />} />
          <Route path="/client/questionnaire/bloc3" element={<QuestionnaireBloc3 />} />
          <Route path="/client/questionnaire/bloc4" element={<QuestionnaireBloc4 />} />
          <Route path="/client/questionnaire/bloc-1" element={<QuestionnaireBloc1 />} />
          <Route path="/client/questionnaire/bloc-2" element={<QuestionnaireBloc2 />} />
          <Route path="/client/questionnaire/bloc-3" element={<QuestionnaireBloc3 />} />
          <Route path="/client/questionnaire/bloc-4" element={<QuestionnaireBloc4 />} />
          <Route path="/client/questionnaire/:blockId" element={<QuestionnaireBlock />} />
          <Route path="/client/sondage" element={<SondageSuiviPage />} />
          <Route path="/client/attente" element={<AttentePage />} />
          <Route path="/client/entretiens" element={<EntretiensPage />} />
          <Route path="/client/questionnaire-rse" element={<QuestionnaireRsePage />} />
          <Route path="/client/diagnostic" element={<DiagnosticPage />} />
          <Route path="/client/diagnostic/:sectionId" element={<DiagnosticSectionPage />} />
          <Route path="/client/journal" element={<JournalPage />} />
          <Route path="/client/messages" element={<MessagesPage />} />
          <Route path="/client/aide" element={<AidePage />} />
          <Route path="/client/analyste" element={<AnalystProfilePage />} />
          {/* Legacy redirects */}
          <Route path="/questionnaire/*" element={<Navigate to="/client/questionnaire/bloc1" replace />} />
          <Route path="/sondage" element={<Navigate to="/client/sondage" replace />} />
          <Route path="/diagnostic" element={<Navigate to="/client/diagnostic" replace />} />
          <Route path="/journal" element={<Navigate to="/client/journal" replace />} />
          <Route path="/messages" element={<Navigate to="/client/messages" replace />} />
        </Route>

        {/* Espace Répondant (public) */}
        <Route path="/sondage/:token" element={<SurveyPage />} />
        <Route path="/dg/:token" element={<DgPage />} />

        {/* Espace Admin */}
        <Route element={isAuthenticated || isDemo ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/diagnostic/:id" element={<AdminDiagnosticDetail />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/nouveau" element={<NewDiagnostic />} />
          <Route path="/admin/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Paramètres</h1><p className="text-sm mt-2" style={{ color: 'var(--color-texte-secondary)' }}>À implémenter.</p></div>} />
          {/* Legacy redirects */}
          <Route path="/admin/new" element={<Navigate to="/admin/nouveau" replace />} />
          <Route path="/admin/diagnostics/:id" element={<Navigate to="/admin/diagnostic/:id" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <DevToolbar />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </DemoProvider>
    </BrowserRouter>
  )
}
