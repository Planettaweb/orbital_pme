import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode
  requireAdmin?: boolean
}) {
  const { user, loading, tenantRole, tenantStatus } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (tenantStatus === 'pending') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-4">
        <h2 className="text-2xl font-bold">Aguardando Aprovação</h2>
        <p className="text-muted-foreground">
          Sua conta foi registrada e está aguardando a aprovação do
          administrador.
        </p>
      </div>
    )
  }

  if (requireAdmin && tenantRole !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
