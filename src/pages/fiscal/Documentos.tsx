import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  FileUp,
} from 'lucide-react'
import { format } from 'date-fns'
import { useFileImport } from '@/hooks/use-file-import'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DocumentosFiscais() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingDoc, setEditingDoc] = useState<any>(null)
  const { toast } = useToast()

  const fetchDocs = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('fiscal_documents')
      .select('*')
      .order('issue_date', { ascending: false })
    if (data) setDocuments(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  const { fileInputRef, handleFileUpload, triggerImport, isImporting } =
    useFileImport(
      'fiscal_documents',
      (values, tenantId) =>
        values[0]
          ? {
              tenant_id: tenantId,
              document_number: values[0].trim(),
              issue_date:
                values[1]?.trim() || new Date().toISOString().split('T')[0],
              status: values[2]?.trim() || 'valid',
              risk_level: values[3]?.trim() || 'low',
            }
          : null,
      (node, tenantId) =>
        node.querySelector('document_number')?.textContent
          ? {
              tenant_id: tenantId,
              document_number:
                node.querySelector('document_number')!.textContent!,
              issue_date:
                node.querySelector('issue_date')?.textContent ||
                new Date().toISOString().split('T')[0],
              status: node.querySelector('status')?.textContent || 'valid',
              risk_level:
                node.querySelector('risk_level')?.textContent || 'low',
            }
          : null,
      'document',
      fetchDocs,
    )

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('fiscal_documents')
      .delete()
      .eq('id', id)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Excluído com sucesso.' })
      fetchDocs()
    }
  }

  const handleUpdate = async () => {
    if (!editingDoc) return
    const { error } = await supabase
      .from('fiscal_documents')
      .update({
        document_number: editingDoc.document_number,
        issue_date: editingDoc.issue_date,
        status: editingDoc.status,
        risk_level: editingDoc.risk_level,
      })
      .eq('id', editingDoc.id)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Atualizado com sucesso.' })
      setEditingDoc(null)
      fetchDocs()
    }
  }

  const filtered = documents.filter((d) =>
    d.document_number.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documentos Fiscais</h1>
          <p className="text-muted-foreground">
            Monitore notas fiscais (XML/CSV).
          </p>
        </div>
        <input
          type="file"
          accept=".csv,.xml"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <Button
          className="bg-telemetry-blue hover:bg-telemetry-blue/90"
          onClick={triggerImport}
          disabled={isImporting}
        >
          <FileUp className="w-4 h-4 mr-2" />{' '}
          {isImporting ? 'Importando...' : 'Importar (XML/CSV)'}
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
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Emissão</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Risco</th>
                <th className="px-6 py-4 text-right">Ações</th>
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Nenhum documento encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="p-2 bg-telemetry-blue/10 rounded-lg text-telemetry-blue">
                        <FileText className="w-4 h-4" />
                      </div>
                      {doc.document_number}
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(doc.issue_date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      {doc.status === 'valid' ? (
                        <span className="text-green-600">Autorizada</span>
                      ) : doc.status === 'pending' ? (
                        <span className="text-yellow-600">Pendente</span>
                      ) : (
                        <span className="text-red-600">Rejeitada</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {doc.risk_level === 'low' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Baixo
                        </span>
                      ) : doc.risk_level === 'medium' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          <Clock className="w-3.5 h-3.5" /> Médio
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                          <AlertTriangle className="w-3.5 h-3.5" /> Alto
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingDoc(doc)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={!!editingDoc}
        onOpenChange={(o) => !o && setEditingDoc(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Número</Label>
              <Input
                value={editingDoc?.document_number || ''}
                onChange={(e) =>
                  setEditingDoc({
                    ...editingDoc,
                    document_number: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Data de Emissão</Label>
              <Input
                type="date"
                value={editingDoc?.issue_date || ''}
                onChange={(e) =>
                  setEditingDoc({ ...editingDoc, issue_date: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={editingDoc?.status || ''}
                onValueChange={(v) =>
                  setEditingDoc({ ...editingDoc, status: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valid">Autorizada</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Risco</Label>
              <Select
                value={editingDoc?.risk_level || ''}
                onValueChange={(v) =>
                  setEditingDoc({ ...editingDoc, risk_level: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixo</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
