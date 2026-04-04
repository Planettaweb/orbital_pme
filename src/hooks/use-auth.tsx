import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

export interface AuthContextType {
  user: User | null
  session: Session | null
  tenantRole: string | null
  tenantId: string | null
  tenantStatus: string | null
  isPlatformAdmin: boolean
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, any>,
  ) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [tenantRole, setTenantRole] = useState<string | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [tenantStatus, setTenantStatus] = useState<string | null>(null)
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (!session?.user) {
        setTenantRole(null)
        setTenantId(null)
        setTenantStatus(null)
        setIsPlatformAdmin(false)
        setLoading(false)
      } else {
        setLoading(true)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (!session?.user) {
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let mounted = true
    if (user?.id) {
      setLoading(true)
      supabase
        .from('tenant_users')
        .select('tenant_id, role, status, tenants(name, status)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()
        .then(({ data, error }) => {
          if (!mounted) return
          if (error) {
            console.error('Error fetching tenant role:', error)
          }
          if (data) {
            setTenantRole(data.role)
            setTenantId(data.tenant_id)

            const tenantData = data.tenants as any
            const tStatus = tenantData?.status
            if (tStatus === 'blocked' || data.status === 'blocked') {
              setTenantStatus('blocked')
            } else if (tStatus === 'pending' || data.status === 'pending') {
              setTenantStatus('pending')
            } else {
              setTenantStatus('active')
            }

            if (
              data.role === 'admin' &&
              tenantData?.name?.toLowerCase().includes('planettaweb')
            ) {
              setIsPlatformAdmin(true)
            } else {
              setIsPlatformAdmin(false)
            }
          } else {
            setTenantRole(null)
            setTenantId(null)
            setTenantStatus(null)
            setIsPlatformAdmin(false)
          }
          setLoading(false)
        })
    }
    return () => {
      mounted = false
    }
  }, [user?.id])

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, any>,
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: metadata,
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: new Error('E-mail ou senha incorretos.') }
      }
      return { error }
    }

    if (data.user) {
      const { data: tenantData } = await supabase
        .from('tenant_users')
        .select('status')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (tenantData?.status === 'pending') {
        await supabase.auth.signOut()
        return {
          error: new Error(
            'Sua conta está aguardando aprovação do administrador.',
          ),
        }
      }
    }

    return { error: null }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        tenantRole,
        tenantId,
        tenantStatus,
        isPlatformAdmin,
        signUp,
        signIn,
        signOut,
        resetPassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
