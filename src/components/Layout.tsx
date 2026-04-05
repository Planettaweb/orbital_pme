import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { usePermissions } from '@/hooks/use-permissions'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Users,
  LayoutDashboard,
  Settings,
  User as UserIcon,
  LogOut,
  Menu,
  Building2,
  Settings2,
  Wallet,
  GitBranch,
  Share2,
  FileText,
  Calculator,
  CheckSquare,
  BarChart3,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ThemeProvider } from './theme-provider'

export default function Layout() {
  const { user, signOut, isPlatformAdmin } = useAuth()
  const { isAdmin } = usePermissions()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Public routes that shouldn't have the dashboard sidebar
  const isPublicRoute = [
    '/',
    '/login',
    '/forgot-password',
    '/modulos',
    '/quem-somos',
    '/contato',
    '/termos',
  ].includes(location.pathname)

  if (isPublicRoute) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-horizon-gold" />
                <span className="font-bold text-lg tracking-tight">
                  Orbital Finance
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/quem-somos"
                  className="text-sm font-medium hover:text-horizon-gold transition-colors"
                >
                  Quem Somos
                </Link>
                <Link
                  to="/modulos"
                  className="text-sm font-medium hover:text-horizon-gold transition-colors"
                >
                  Módulos
                </Link>
                <Link
                  to="/contato"
                  className="text-sm font-medium hover:text-horizon-gold transition-colors"
                >
                  Contato
                </Link>
                <Link
                  to="/termos"
                  className="text-sm font-medium hover:text-horizon-gold transition-colors"
                >
                  Termos de Uso
                </Link>
              </nav>
              <div className="flex items-center gap-4">
                {user ? (
                  <Link to="/dashboard">
                    <Button
                      variant="default"
                      className="bg-horizon-gold text-void hover:bg-white"
                    >
                      Acessar Painel
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="default"
                      className="bg-horizon-gold text-void hover:bg-white"
                    >
                      Acesso Seguro
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    )
  }

  // Dashboard Layout
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="h-16 flex items-center px-6 border-b">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Orbital Finance</span>
            </Link>
          </div>
          <div className="p-4 flex flex-col h-[calc(100vh-4rem)]">
            <nav className="space-y-2 flex-1">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                Painel Executivo
              </Link>
              {isAdmin && (
                <>
                  <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
                    Administração
                  </div>
                  {isPlatformAdmin && (
                    <Link
                      to="/admin/clients"
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium text-horizon-gold"
                    >
                      <Building2 className="w-4 h-4" />
                      Empresas (Tenants)
                    </Link>
                  )}
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
                  >
                    <Users className="w-4 h-4" />
                    Usuários
                  </Link>
                  <Link
                    to="/admin/roles"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    Cargos & Permissões
                  </Link>
                  <Link
                    to="/admin/tenants"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
                  >
                    <Settings2 className="w-4 h-4" />
                    Organização
                  </Link>
                </>
              )}

              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
                Cobrança Viva
              </div>
              <Link
                to="/cobranca/clientes"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                Clientes
              </Link>
              <Link
                to="/cobranca/recebiveis"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <Wallet className="w-4 h-4" />
                Títulos & Faturas
              </Link>
              <Link
                to="/cobranca/reguas"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <GitBranch className="w-4 h-4" />
                Régua de Cobrança
              </Link>
              <Link
                to="/cobranca/integracoes"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Integrações (API)
              </Link>

              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
                FiscalPulse PME
              </div>
              <Link
                to="/fiscal/documentos"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Documentos Fiscais
              </Link>
              <Link
                to="/fiscal/apuracao"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <Calculator className="w-4 h-4" />
                Apuração (Impostos)
              </Link>
              <Link
                to="/fiscal/certidoes"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <CheckSquare className="w-4 h-4" />
                Certidões (CND)
              </Link>
              <Link
                to="/fiscal/relatorios"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                Relatórios Fiscais
              </Link>
            </nav>
            <div className="border-t pt-4 space-y-2">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <UserIcon className="w-4 h-4" />
                Meu Perfil
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive hover:text-destructive-foreground text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b bg-card md:hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold">Orbital Finance</span>
            <div className="w-6" /> {/* Spacer */}
          </header>
          <main className="flex-1 p-6 overflow-auto bg-muted/20">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
