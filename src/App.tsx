import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { DemoProvider, useDemoIfAvailable } from './hooks/useDemo'
import DevToolbar from './components/DevToolbar'
import ClientLayout from './components/layout/ClientLayout'
import Login from './pages/Login'
import Dashboard from './pages/client/Dashboard'
import JournalPage from './pages/client/JournalPage'
import MessagesPage from './pages/client/MessagesPage'
import SondageSuiviPage from './pages/client/SondageSuiviPage'
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

// Lazy load heavy questionnaire pages
import { lazy, Suspense } from 'react'
const QuestionnaireBloc1 = lazy(() => import('./pages/client/QuestionnaireBloc1'))
const QuestionnaireBloc2 = lazy(() => import('./pages/client/QuestionnaireBloc2'))
const QuestionnaireBloc3 = lazy(() => import('./pages/client/QuestionnaireBloc3'))
const QuestionnaireBloc4 = lazy(() => import('./pages/client/QuestionnaireBloc4'))
const QuestionnaireBlock = lazy(() => import('./pages/client/QuestionnaireBlock'))
const SurveyPage = lazy(() => import('./pages/respondent/SurveyPage'))
const DgPage = lazy(() => import('./pages/respondent/DgPage'))

function LazyFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-celsius-900)' }} />
    </div>
  )
}

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
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        
        {/* Espace Client */}
        <Route element={isAuthenticated ? <ClientLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/questionnaire/1" element={<Suspense fallback={<LazyFallback />}><QuestionnaireBloc1 /></Suspense>} />
          <Route path="/questionnaire/2" element={<Suspense fallback={<LazyFallback />}><QuestionnaireBloc2 /></Suspense>} />
          <Route path="/questionnaire/3" element={<Suspense fallback={<LazyFallback />}><QuestionnaireBloc3 /></Suspense>} />
          <Route path="/questionnaire/4" element={<Suspense fallback={<LazyFallback />}><QuestionnaireBloc4 /></Suspense>} />
          <Route path="/questionnaire/:blockId" element={<Suspense fallback={<LazyFallback />}><QuestionnaireBlock /></Suspense>} />
          <Route path="/sondage" element={<SondageSuiviPage />} />
          <Route path="/diagnostic/:sectionId" element={<DiagnosticSectionPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/aide" element={<AidePage />} />
        </Route>

        {/* Espace Répondant (public) */}
        <Route path="/sondage/:token" element={<Suspense fallback={<LazyFallback />}><SurveyPage /></Suspense>} />
        <Route path="/dg/:token" element={<Suspense fallback={<LazyFallback />}><DgPage /></Suspense>} />

        {/* Espace Admin */}
        <Route element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/diagnostics/:id" element={<AdminDiagnosticDetail />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/new" element={<NewDiagnostic />} />
          <Route path="/admin/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Paramètres</h1></div>} />
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