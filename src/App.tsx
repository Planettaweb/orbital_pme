/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { AuthProvider } from './hooks/use-auth'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ModulesInfo from './pages/ModulesInfo'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Users from './pages/admin/Users'
import Tenants from './pages/admin/Tenants'
import Roles from './pages/admin/Roles'
import Clients from './pages/admin/Clients'
import { ProtectedRoute } from './components/ProtectedRoute'
import ClientesCob from './pages/cobranca/Clientes'
import RecebiveisCob from './pages/cobranca/Recebiveis'
import ReguasCob from './pages/cobranca/Reguas'
import IntegracoesCob from './pages/cobranca/Integracoes'
import DocumentosFiscais from './pages/fiscal/Documentos'
import ApuracaoFiscal from './pages/fiscal/Apuracao'
import CertidoesFiscais from './pages/fiscal/Certidoes'
import RelatoriosFiscais from './pages/fiscal/Relatorios'

// ONLY IMPORT AND RENDER WORKING PAGES, NEVER ADD PLACEHOLDER COMPONENTS OR PAGES IN THIS FILE
// AVOID REMOVING ANY CONTEXT PROVIDERS FROM THIS FILE (e.g. TooltipProvider, Toaster, Sonner)

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/modulos" element={<ModulesInfo />} />
            <Route path="/quem-somos" element={<AboutUs />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/termos" element={<Terms />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/clients"
              element={
                <ProtectedRoute requirePlatformAdmin>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tenants"
              element={
                <ProtectedRoute requireAdmin>
                  <Tenants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute requireAdmin>
                  <Roles />
                </ProtectedRoute>
              }
            />

            {/* Cobrança Routes */}
            <Route
              path="/cobranca/clientes"
              element={
                <ProtectedRoute>
                  <ClientesCob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cobranca/recebiveis"
              element={
                <ProtectedRoute>
                  <RecebiveisCob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cobranca/reguas"
              element={
                <ProtectedRoute>
                  <ReguasCob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cobranca/integracoes"
              element={
                <ProtectedRoute>
                  <IntegracoesCob />
                </ProtectedRoute>
              }
            />

            {/* FiscalPulse PME Routes */}
            <Route
              path="/fiscal/documentos"
              element={
                <ProtectedRoute>
                  <DocumentosFiscais />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fiscal/apuracao"
              element={
                <ProtectedRoute>
                  <ApuracaoFiscal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fiscal/certidoes"
              element={
                <ProtectedRoute>
                  <CertidoesFiscais />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fiscal/relatorios"
              element={
                <ProtectedRoute>
                  <RelatoriosFiscais />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
