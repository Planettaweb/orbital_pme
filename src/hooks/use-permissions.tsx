import { useAuth } from './use-auth'

export function usePermissions() {
  const { tenantRole } = useAuth()

  return {
    isAdmin: tenantRole === 'admin',
    isAnalyst: tenantRole === 'analyst' || tenantRole === 'admin',
    isViewer: !!tenantRole,
    role: tenantRole,
  }
}
