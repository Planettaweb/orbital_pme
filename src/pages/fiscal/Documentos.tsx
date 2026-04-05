import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  Search,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { useCsvImport } from '@/hooks/use-csv-import'

interface FiscalDocument {
  id: string
  document_number: string
  issue_date: string
  status: string
  risk_level: string | null
}

export default function DocumentosFiscais() {
  const [documents, setDocuments] = useState<FiscalDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('fiscal_documents')
        .select('*')
        .order('issue_date', { ascending: false })
      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const { fileInputRef, handleFileUpload, triggerImport } = useCsvImport(
    'fiscal_documents',
    (values, tenantId) => {
      if (!values[0]) return null
      return {
        tenant_id: tenantId,
        document_number: values[0]?.trim(),
        issue_date: values[1]?.trim() || new Date().toISOString().split('T')[0],
        status: values[2]?.trim() || 'valid',
        risk_level: values[3]?.trim() || 'low',
      }
    },
    fetchDocuments,
  )

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fiscal_documents')
        .delete()
        .eq('id', id)
      if (error) throw error
      toast({ title: 'Sucesso', description: 'Documento excluído.' })
      fetchDocuments()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const filteredDocs = documents.filter((doc) =>
    doc.document_number.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Documentos Fiscais
          </h1>
          <p className="text-muted-foreground">
            Monitore notas fiscais e importe arquivos CSV.
          </p>
        </div>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <Button
          className="bg-telemetry-blue hover:bg-telemetry-blue/90 text-white"
          onClick={triggerImport}
        >
          <Plus className="w-4 h-4 mr-2" />
          Importar CSV
        </Button>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/40 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número..."
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
              <tr>
                <th className="px-6 py-4 font-medium">Documento</th>
                <th className="px-6 py-4 font-medium">Emissão</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Risco</th>
                <th className="px-6 py-4 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Nenhum documento encontrado.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="bg-card hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium flex items-center gap-3">
                      <div className="p-2 bg-telemetry-blue/10 rounded-lg text-telemetry-blue">
                        <FileText className="w-4 h-4" />
                      </div>
                      {doc.document_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(doc.issue_date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.status === 'valid' && (
                        <span className="text-green-600 font-medium">
                          Autorizada
                        </span>
                      )}
                      {doc.status === 'pending' && (
                        <span className="text-yellow-600 font-medium">
                          Pendente
                        </span>
                      )}
                      {doc.status === 'rejected' && (
                        <span className="text-red-600 font-medium">
                          Rejeitada
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.risk_level === 'low' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Baixo
                        </span>
                      )}
                      {doc.risk_level === 'medium' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          <Clock className="w-3.5 h-3.5" /> Médio
                        </span>
                      )}
                      {doc.risk_level === 'high' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          <AlertTriangle className="w-3.5 h-3.5" /> Alto
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
