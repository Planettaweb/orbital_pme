import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export function useFileImport(
  tableName: string,
  mapCsvRow: (values: string[], tenantId: string) => any,
  mapXmlNode: (node: Element, tenantId: string) => any,
  xmlNodeSelector: string,
  onSuccess: () => void,
  conflictColumns?: string,
) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [isImporting, setIsImporting] = useState(false)

  const triggerImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string

        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session?.user) throw new Error('Usuário não autenticado.')

        const { data: tenantUser } = await supabase
          .from('tenant_users')
          .select('tenant_id')
          .eq('user_id', session.user.id)
          .single()

        if (!tenantUser) throw new Error('Tenant não encontrado.')

        const records = []

        if (file.name.toLowerCase().endsWith('.csv')) {
          const lines = text.split('\n').filter((line) => line.trim())
          if (lines.length < 2)
            throw new Error('Arquivo CSV vazio ou sem dados.')
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map((v) => v.trim())
            const record = mapCsvRow(values, tenantUser.tenant_id)
            if (record) records.push(record)
          }
        } else if (file.name.toLowerCase().endsWith('.xml')) {
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(text, 'text/xml')
          const nodes = xmlDoc.querySelectorAll(xmlNodeSelector)
          if (nodes.length === 0)
            throw new Error(
              'Nenhum dado encontrado no XML com o seletor especificado.',
            )
          nodes.forEach((node) => {
            const record = mapXmlNode(node, tenantUser.tenant_id)
            if (record) records.push(record)
          })
        } else {
          throw new Error('Formato de arquivo não suportado. Use CSV ou XML.')
        }

        if (records.length === 0)
          throw new Error('Nenhum registro válido encontrado.')

        let query = supabase.from(tableName as any).upsert(records)
        if (conflictColumns) {
          query = supabase
            .from(tableName as any)
            .upsert(records, { onConflict: conflictColumns })
        }

        const { error } = await query
        if (error) throw error

        toast({
          title: 'Sucesso',
          description: `${records.length} registros importados com sucesso.`,
        })
        onSuccess()
      } catch (err: any) {
        toast({
          title: 'Erro na importação',
          description: err.message,
          variant: 'destructive',
        })
      } finally {
        setIsImporting(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  return { fileInputRef, handleFileUpload, triggerImport, isImporting }
}
