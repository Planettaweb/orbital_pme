import { useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase/client'

export function useCsvImport<T>(
  tableName: string,
  mapRow: (values: string[], tenantId: string) => T | null,
  onSuccess: () => void,
  conflictCols?: string,
) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split('\n').filter((l) => l.trim())
        if (lines.length <= 1)
          throw new Error('Arquivo vazio ou sem dados válidos.')

        const { data: tenantData } = await supabase.rpc('get_auth_user_tenants')
        const tenantId = tenantData?.[0]
        if (!tenantId) throw new Error('Tenant não encontrado')

        const records = lines
          .slice(1)
          .map((line) => mapRow(line.split(','), tenantId))
          .filter(Boolean) as T[]

        if (records.length > 0) {
          const query = conflictCols
            ? supabase
                .from(tableName)
                .upsert(records as any, { onConflict: conflictCols })
            : supabase.from(tableName).insert(records as any)

          const { error } = await query
          if (error) throw error
          toast({
            title: 'Sucesso',
            description: `${records.length} registros importados.`,
          })
          onSuccess()
        }
      } catch (err: any) {
        toast({
          title: 'Erro',
          description: err.message,
          variant: 'destructive',
        })
      }
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  const triggerImport = () => fileInputRef.current?.click()

  return { fileInputRef, handleFileUpload, triggerImport }
}
