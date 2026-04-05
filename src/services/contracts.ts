import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export type Contract = Database['public']['Tables']['contracts']['Row'] & {
  value?: number
}
export type ContractInsert =
  Database['public']['Tables']['contracts']['Insert'] & { value?: number }
export type ContractUpdate =
  Database['public']['Tables']['contracts']['Update'] & { value?: number }

export type ContractAttachment = {
  id: string
  tenant_id: string
  contract_id: string
  file_name: string
  file_path: string
  file_size: number
  content_type: string
  created_at: string
}

export const getContracts = async () => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Contract[]
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

// -- Attachments and Limits --

export const getContractAttachments = async (contractId: string) => {
  const { data, error } = await supabase
    .from('contract_attachments')
    .select('*')
    .eq('contract_id', contractId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as ContractAttachment[]
}

export const uploadContractAttachment = async (
  file: File,
  contractId: string,
  tenantId: string,
) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${tenantId}/${contractId}/${fileName}`

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('contracts')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  // Save metadata
  const { data, error: dbError } = await supabase
    .from('contract_attachments')
    .insert({
      tenant_id: tenantId,
      contract_id: contractId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      content_type: file.type,
    })
    .select()
    .single()

  if (dbError) throw dbError
  return data as ContractAttachment
}

export const deleteContractAttachment = async (
  attachmentId: string,
  filePath: string,
) => {
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('contracts')
    .remove([filePath])

  if (storageError) throw storageError

  // Delete from db
  const { error: dbError } = await supabase
    .from('contract_attachments')
    .delete()
    .eq('id', attachmentId)

  if (dbError) throw dbError
}

export const downloadContractAttachment = async (
  filePath: string,
  fileName: string,
) => {
  const { data, error } = await supabase.storage
    .from('contracts')
    .download(filePath)

  if (error) throw error

  // Create download link
  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const getTenantLimits = async (tenantId: string) => {
  const { data, error } = await supabase
    .from('tenants')
    .select('max_files_per_contract, max_file_size_mb')
    .eq('id', tenantId)
    .single()

  if (error) throw error
  return data
}
