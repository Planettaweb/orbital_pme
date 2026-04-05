import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Shield,
  AlertCircle,
  ShieldAlert,
  Trash2,
  Edit2,
  FileUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useFileImport } from '@/hooks/use-file-import'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CertidoesFiscais() {
  const [certificates, setCertificates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCert, setEditingCert] = useState<any>(null)
  const { toast } = useToast()

  const fetchCerts = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from('fiscal_certificates')
      .select('*')
      .order('expires_at', { ascending: true })
    if (data) setCertificates(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCerts()
  }, [])

  const { fileInputRef, handleFileUpload, triggerImport, isImporting } =
    useFileImport(
      'fiscal_certificates',
      (values, tenantId) =>
        values[0] && values[2]
          ? {
              tenant_id: tenantId,
              name: values[0].trim(),
              status: values[1]?.trim() || 'valid',
              expires_at: values[2].trim(),
              source: values[3]?.trim() || '-',
            }
          : null,
      (node, tenantId) =>
        node.querySelector('name')?.textContent &&
        node.querySelector('expires_at')?.textContent
          ? {
              tenant_id: tenantId,
              name: node.querySelector('name')!.textContent!,
              status: node.querySelector('status')?.textContent || 'valid',
              expires_at: node.querySelector('expires_at')!.textContent!,
              source: node.querySelector('source')?.textContent || '-',
            }
          : null,
      'certificate',
      fetchCerts,
    )

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('fiscal_certificates')
      .delete()
      .eq('id', id)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Certidão excluída.' })
      fetchCerts()
    }
  }

  const handleUpdate = async () => {
    if (!editingCert) return
    const { error } = await supabase
      .from('fiscal_certificates')
      .update({
        name: editingCert.name,
        expires_at: editingCert.expires_at,
        status: editingCert.status,
        source: editingCert.source,
      })
      .eq('id', editingCert.id)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Atualizada com sucesso.' })
      setEditingCert(null)
      fetchCerts()
    }
  }

  const validCount = certificates.filter((c) => c.status === 'valid').length
  const warningCount = certificates.filter((c) => c.status === 'warning').length
  const expiredCount = certificates.filter((c) => c.status === 'expired').length

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Certidões (CND)</h1>
          <p className="text-muted-foreground">
            Monitoramento da regularidade fiscal e importação de XML/CSV.
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

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xl">{validCount}</div>
          </div>
          <div className="text-sm text-muted-foreground">Válidas</div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xl">{warningCount}</div>
          </div>
          <div className="text-sm text-muted-foreground">
            Perto do Vencimento
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xl">{expiredCount}</div>
          </div>
          <div className="text-sm text-muted-foreground">Vencidas</div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-8 text-muted-foreground">
          Carregando...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-card border rounded-xl p-5 shadow-sm relative overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${cert.status === 'valid' ? 'bg-green-500' : cert.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
              />
              <div className="flex justify-between items-start pl-2">
                <div>
                  <h3 className="font-semibold mb-1">{cert.name}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {cert.source}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingCert(cert)}
                    className="h-8 w-8"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(cert.id)}
                    className="h-8 w-8 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 pl-2 text-sm text-muted-foreground">
                Vencimento:{' '}
                <span
                  className={`font-medium ${cert.status === 'expired' ? 'text-red-500' : 'text-foreground'}`}
                >
                  {format(new Date(cert.expires_at), 'dd/MM/yyyy')}
                </span>
              </div>
            </div>
          ))}
          {certificates.length === 0 && (
            <div className="col-span-2 p-8 text-center text-muted-foreground border rounded-xl">
              Nenhuma certidão cadastrada.
            </div>
          )}
        </div>
      )}

      <Dialog
        open={!!editingCert}
        onOpenChange={(o) => !o && setEditingCert(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Certidão</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={editingCert?.name || ''}
                onChange={(e) =>
                  setEditingCert({ ...editingCert, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Fonte</Label>
              <Input
                value={editingCert?.source || ''}
                onChange={(e) =>
                  setEditingCert({ ...editingCert, source: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Vencimento</Label>
              <Input
                type="date"
                value={editingCert?.expires_at || ''}
                onChange={(e) =>
                  setEditingCert({ ...editingCert, expires_at: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={editingCert?.status || ''}
                onValueChange={(v) =>
                  setEditingCert({ ...editingCert, status: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valid">Válida</SelectItem>
                  <SelectItem value="warning">Perto do Vencimento</SelectItem>
                  <SelectItem value="expired">Vencida</SelectItem>
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
