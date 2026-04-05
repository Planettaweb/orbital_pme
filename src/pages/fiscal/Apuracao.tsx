import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Edit2,
  FileUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'
import { useFileImport } from '@/hooks/use-file-import'
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

export default function ApuracaoFiscal() {
  const [taxes, setTaxes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTax, setEditingTax] = useState<any>(null)
  const { toast } = useToast()

  const fetchTaxes = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from('fiscal_taxes')
      .select('*')
      .order('due_date', { ascending: true })
    if (data) setTaxes(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTaxes()
  }, [])

  const { fileInputRef, handleFileUpload, triggerImport, isImporting } =
    useFileImport(
      'fiscal_taxes',
      (values, tenantId) =>
        values[0] && values[2]
          ? {
              tenant_id: tenantId,
              name: values[0].trim(),
              amount: parseFloat(values[1]?.trim() || '0'),
              due_date: values[2].trim(),
              status: values[3]?.trim() || 'pending',
            }
          : null,
      (node, tenantId) =>
        node.querySelector('name')?.textContent &&
        node.querySelector('due_date')?.textContent
          ? {
              tenant_id: tenantId,
              name: node.querySelector('name')!.textContent!,
              amount: parseFloat(
                node.querySelector('amount')?.textContent || '0',
              ),
              due_date: node.querySelector('due_date')!.textContent!,
              status: node.querySelector('status')?.textContent || 'pending',
            }
          : null,
      'tax',
      fetchTaxes,
    )

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('fiscal_taxes').delete().eq('id', id)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Excluído com sucesso.' })
      fetchTaxes()
    }
  }

  const handleUpdate = async () => {
    if (!editingTax) return
    const { error } = await supabase
      .from('fiscal_taxes')
      .update({
        name: editingTax.name,
        amount: editingTax.amount,
        due_date: editingTax.due_date,
        status: editingTax.status,
      })
      .eq('id', editingTax.id)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Atualizado com sucesso.' })
      setEditingTax(null)
      fetchTaxes()
    }
  }

  const pending = taxes.filter((t) => t.status !== 'paid')
  const totalPending = pending.reduce((acc, t) => acc + Number(t.amount), 0)
  const totalPaid = taxes
    .filter((t) => t.status === 'paid')
    .reduce((acc, t) => acc + Number(t.amount), 0)
  const nextTax = pending.sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
  )[0]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Apuração de Impostos</h1>
          <p className="text-muted-foreground">
            Gerencie tributos e importe dados (XML/CSV).
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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border rounded-xl p-6 shadow-sm h-32 flex flex-col justify-between">
          <div className="flex justify-between text-muted-foreground">
            <span className="text-sm font-medium">Pendentes</span>
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold">
            R${' '}
            {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm h-32 flex flex-col justify-between">
          <div className="flex justify-between text-muted-foreground">
            <span className="text-sm font-medium">Pagos</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-telemetry-blue text-white rounded-xl p-6 shadow-sm h-32 flex flex-col justify-between">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-white/90">
              Próximo Vencimento
            </span>
            <Calendar className="w-4 h-4 text-white/80" />
          </div>
          <div>
            <div className="text-lg font-bold truncate">
              {nextTax?.name || 'Nenhum'}
            </div>
            <div className="text-sm text-white/80">
              {nextTax ? format(new Date(nextTax.due_date), 'dd/MM/yyyy') : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20 font-semibold">
          Guias e Tributos
        </div>
        <div className="divide-y">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : taxes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum imposto cadastrado.
            </div>
          ) : (
            taxes.map((tax) => (
              <div
                key={tax.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/10"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tax.status === 'paid' ? 'bg-green-100 text-green-600' : tax.status === 'late' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}
                  >
                    {tax.status === 'paid' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : tax.status === 'late' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{tax.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: {format(new Date(tax.due_date), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right mr-4">
                    <div className="font-bold">
                      R${' '}
                      {Number(tax.amount).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tax.status === 'paid'
                        ? 'Pago'
                        : tax.status === 'late'
                          ? 'Em Atraso'
                          : 'Pendente'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTax(tax)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(tax.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Dialog
        open={!!editingTax}
        onOpenChange={(o) => !o && setEditingTax(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Imposto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={editingTax?.name || ''}
                onChange={(e) =>
                  setEditingTax({ ...editingTax, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Valor</Label>
              <Input
                type="number"
                value={editingTax?.amount || ''}
                onChange={(e) =>
                  setEditingTax({ ...editingTax, amount: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Vencimento</Label>
              <Input
                type="date"
                value={editingTax?.due_date || ''}
                onChange={(e) =>
                  setEditingTax({ ...editingTax, due_date: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={editingTax?.status || ''}
                onValueChange={(v) =>
                  setEditingTax({ ...editingTax, status: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="late">Atrasado</SelectItem>
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
