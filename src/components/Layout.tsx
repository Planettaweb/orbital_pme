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
  X,
  ChevronDown,
  Briefcase,
  FileSignature,
  Landmark,
  Receipt,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ThemeProvider } from './theme-provider'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const NavItem = ({ to, icon: Icon, children, onClick, active }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
      active
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    )}
  >
    <Icon className="w-4 h-4" />
    {children}
  </Link>
)

const NavGroup = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors group">
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4" />
          {title}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200 opacity-50 group-hover:opacity-100',
            isOpen && 'rotate-180',
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pl-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

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
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static flex flex-col',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Orbital Finance</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col">
            <nav className="space-y-4 flex-1">
              <div className="space-y-1">
                <NavItem
                  to="/dashboard"
                  icon={LayoutDashboard}
                  onClick={() => setIsSidebarOpen(false)}
                  active={location.pathname === '/dashboard'}
                >
                  Painel Executivo
                </NavItem>
              </div>

              {isAdmin && (
                <NavGroup
                  title="Administração"
                  icon={Shield}
                  defaultOpen={location.pathname.startsWith('/admin')}
                >
                  {isPlatformAdmin && (
                    <NavItem
                      to="/admin/clients"
                      icon={Building2}
                      onClick={() => setIsSidebarOpen(false)}
                      active={location.pathname === '/admin/clients'}
                    >
                      Empresas (Tenants)
                    </NavItem>
                  )}
                  <NavItem
                    to="/admin/users"
                    icon={Users}
                    onClick={() => setIsSidebarOpen(false)}
                    active={location.pathname === '/admin/users'}
                  >
                    Usuários
                  </NavItem>
                  <NavItem
                    to="/admin/roles"
                    icon={Shield}
                    onClick={() => setIsSidebarOpen(false)}
                    active={location.pathname === '/admin/roles'}
                  >
                    Cargos & Permissões
                  </NavItem>
                  <NavItem
                    to="/admin/tenants"
                    icon={Settings2}
                    onClick={() => setIsSidebarOpen(false)}
                    active={location.pathname === '/admin/tenants'}
                  >
                    Organização
                  </NavItem>
                </NavGroup>
              )}

              <NavGroup
                title="Cobrança Viva"
                icon={Receipt}
                defaultOpen={location.pathname.startsWith('/cobranca')}
              >
                <NavItem
                  to="/cobranca/clientes"
                  icon={Users}
                  onClick={() => setIsSidebarOpen(false)}
                  active={location.pathname === '/cobranca/clientes'}
                >
                  Clientes
                </NavItem>
                <NavItem
                  to="/cobranca/recebiveis"
                  icon={Wallet}
                  onClick={() => setIsSidebarOpen(false)}
                  active={location.pathname === '/cobranca/recebiveis'}
                >
                  Títulos & Faturas
                </NavItem>
                <NavItem
                  to="/cobranca/reguas"
                  icon={GitBranch}
                  onClick={() => setIsSidebarOpen(false)}
                  active={location.pathname === '/cobranca/reguas'}
                >
                  Régua de Cobrança
                </NavItem>
                <NavItem
                  to="/cobranca/integracoes"
                  icon={Share2}
                  onClick={() => setIsSidebarOpen(false)}
                  active={location.pathname === '/cobranca/integracoes'}
                >
                  Integrações (API)
                </NavItem>
              </NavGroup>

              <NavGroup
                title="FiscalPulse PME"
                icon={Landmark}
                defaultOpen={location.pathname.startsWith('/fiscal')}
              >
                <NavItem
                  to="/fiscal/documentos"
                  icon={FileText}
                  onClick={() => setIsSidebarOpen(false)}
                  active={location.pathname === '/fiscal/documentos'}
                >
                  Documentos Fiscais
                </NavItem>
                <NavItem
                  to="/fiscal/apuracao"
                  icon={Calculator}
                  onClick={() => setIsSidebarOpen(false)}
                  active={location.pathname === '/fiscal/apuracao'}
                >
                  Apuração (Impostos)
                </NavItem>
                <NavItem
                  to="/fiscal/certidoes"
                  icon={CheckSquare}
                  onClick={() => setIsSidebarOpen(false)}
                  active={location.pathname === '/fiscal/certidoes'}
                >
                  Certidões (CND)
                </NavItem>
                <NavItem
                  to="/fiscal/relatorios"
                  icon={BarChart3}
                  onClick={() => setIsSidebarOpen(false)}
                  active={location.pathname === '/fiscal/relatorios'}
                >
                  Relatórios Fiscais
                </NavItem>
              </NavGroup>

              <NavGroup
                title="Contrato Vivo"
                icon={Briefcase}
                defaultOpen={location.pathname.startsWith('/contratos')}
              >
                <NavItem
                  to="/contratos"
                  icon={FileSignature}
                  onClick={() => setIsSidebarOpen(false)}
                  active={location.pathname === '/contratos'}
                >
                  Gestão de Contratos
                </NavItem>
              </NavGroup>
            </nav>
            <div className="border-t pt-4 mt-4 shrink-0 space-y-1">
              <NavItem
                to="/profile"
                icon={UserIcon}
                onClick={() => setIsSidebarOpen(false)}
                active={location.pathname === '/profile'}
              >
                Meu Perfil
              </NavItem>
              <NavItem
                to="/settings"
                icon={Settings}
                onClick={() => setIsSidebarOpen(false)}
                active={location.pathname === '/settings'}
              >
                Configurações
              </NavItem>
              <button
                onClick={() => {
                  setIsSidebarOpen(false)
                  signOut()
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive hover:text-destructive-foreground text-muted-foreground text-sm font-medium transition-colors"
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
