import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export type Contract = Database['public']['Tables']['contracts']['Row']
export type ContractInsert = Database['public']['Tables']['contracts']['Insert']
export type ContractUpdate = Database['public']['Tables']['contracts']['Update']

export const getContracts = async () => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const createContract = async (contract: ContractInsert) => {
  const { data, error } = await supabase
    .from('contracts')
    .insert(contract)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateContract = async (id: string, contract: ContractUpdate) => {
  const { data, error } = await supabase
    .from('contracts')
    .update(contract)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteContract = async (id: string) => {
  const { error } = await supabase.from('contracts').delete().eq('id', id)

  if (error) throw error
}

export const getUserTenants = async () => {
  const { data, error } = await supabase
    .from('tenant_users')
    .select('tenant_id')

  if (error) throw error
  return data
}
