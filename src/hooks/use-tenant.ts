import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './use-auth'

export function useTenant() {
  const { user } = useAuth()
  const [activeTenant, setActiveTenant] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchTenant = async () => {
      const { data } = await supabase
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .single()

      if (data) setActiveTenant(data.tenant_id)
    }

    fetchTenant()
  }, [user])

  return { activeTenant }
}
