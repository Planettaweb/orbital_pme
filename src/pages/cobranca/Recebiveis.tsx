import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useTenant } from '@/hooks/use-tenant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import {
  Plus,
  Upload,
  Calendar as CalendarIcon,
  Handshake,
  AlertCircle,
  Search,
  Edit2,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export default function Recebiveis() {
  const { activeTenant } = useTenant()
  const [receivables, setReceivables] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPromiseModalOpen, setIsPromiseModalOpen] = useState(false)
  const [selectedReceivable, setSelectedReceivable] = useState<string | null>(
    null,
  )
  const [loading, setLoading] = useState(false)

  const defaultForm = {
    id: '',
    customer_id: '',
    amount: '',
    due_date: '',
    status: 'open',
  }
  const [formData, setFormData] = useState(defaultForm)
  const [promiseData, setPromiseData] = useState({
    promise_date: '',
    notes: '',
  })

  const fetchData = async () => {
    if (!activeTenant) return
    const [recvRes, custRes] = await Promise.all([
      supabase
        .from('receivables')
        .select('*, customer:customers(name)')
        .eq('tenant_id', activeTenant)
        .order('due_date', { ascending: true }),
      supabase
        .from('customers')
        .select('id, name')
        .eq('tenant_id', activeTenant),
    ])
    if (recvRes.data) setReceivables(recvRes.data)
    if (custRes.data) setCustomers(custRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [activeTenant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTenant) return
    setLoading(true)

    const payload = {
      ...formData,
      tenant_id: activeTenant,
      amount: parseFloat(formData.amount),
    }
    if (!payload.id) delete (payload as any).id

    const { error } = payload.id
      ? await supabase.from('receivables').update(payload).eq('id', payload.id)
      : await supabase.from('receivables').insert([payload])

    if (error) toast.error('Erro ao salvar título')
    else {
      toast.success('Título salvo com sucesso!')
      setIsModalOpen(false)
      fetchData()
      setFormData(defaultForm)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este título?')) return
    const { error } = await supabase.from('receivables').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir título')
    else {
      toast.success('Título excluído com sucesso')
      fetchData()
    }
  }

  const handlePromiseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTenant || !selectedReceivable) return
    setLoading(true)
    const { error } = await supabase.from('billing_actions').insert([
      {
        tenant_id: activeTenant,
        receivable_id: selectedReceivable,
        type: 'promise',
        status: 'completed',
        promise_date: promiseData.promise_date,
        notes: promiseData.notes,
      },
    ])
    if (error) toast.error('Erro ao registrar promessa')
    else {
      toast.success('Promessa registrada com sucesso!')
      setIsPromiseModalOpen(false)
      setPromiseData({ promise_date: '', notes: '' })
      await supabase
        .from('receivables')
        .update({ status: 'promised' })
        .eq('id', selectedReceivable)
      fetchData()
    }
    setLoading(false)
  }

  const openModal = (receivable?: any) => {
    setFormData(receivable || defaultForm)
    setIsModalOpen(true)
  }

  const filtered = receivables.filter(
    (r) =>
      r.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      r.status.toLowerCase().includes(search.toLowerCase()),
  )

  const statusColors: any = {
    open: 'text-blue-600 bg-blue-500/10',
    overdue: 'text-rose-600 bg-rose-500/10',
    paid: 'text-emerald-600 bg-emerald-500/10',
    promised: 'text-amber-600 bg-amber-500/10',
  }
  const statusLabels: any = {
    open: 'Aberto',
    overdue: 'Atrasado',
    paid: 'Pago',
    promised: 'Promessa',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Títulos e Faturas
          </h1>
          <p className="text-muted-foreground text-sm">
            Acompanhe recebíveis e registre promessas de pagamento.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => toast.info('Importação em desenvolvimento.')}
          >
            <Upload className="w-4 h-4" /> Importar
          </Button>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus className="w-4 h-4" /> Novo Título
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por cliente ou status..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Valor</th>
                <th className="px-6 py-3 font-medium">Vencimento</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Nenhum título encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">
                      {r.customer?.name}
                    </td>
                    <td className="px-6 py-4">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(r.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        {new Date(r.due_date + 'T12:00:00').toLocaleDateString(
                          'pt-BR',
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[r.status] || statusColors.open}`}
                      >
                        {statusLabels[r.status] || r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {r.status !== 'paid' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-500/10"
                          onClick={() => {
                            setSelectedReceivable(r.id)
                            setIsPromiseModalOpen(true)
                          }}
                        >
                          <Handshake className="w-3 h-3 mr-1" /> Promessa
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal(r)}
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(r.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? 'Editar Título' : 'Novo Título'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cliente</label>
            <select
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.customer_id}
              onChange={(e) =>
                setFormData({ ...formData, customer_id: e.target.value })
              }
            >
              <option value="">Selecione um cliente...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor (R$)</label>
              <Input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <label className="text-sm font-medium">Vencimento</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.due_date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? (
                      format(
                        new Date(formData.due_date + 'T12:00:00'),
                        'dd/MM/yyyy',
                        { locale: ptBR },
                      )
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      formData.due_date
                        ? new Date(formData.due_date + 'T12:00:00')
                        : undefined
                    }
                    onSelect={(date) =>
                      setFormData({
                        ...formData,
                        due_date: date ? format(date, 'yyyy-MM-dd') : '',
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <input
                type="hidden"
                required
                value={formData.due_date}
                name="due_date"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="open">Aberto</option>
              <option value="overdue">Atrasado</option>
              <option value="promised">Promessa</option>
              <option value="paid">Pago</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Título'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isPromiseModalOpen}
        onClose={() => setIsPromiseModalOpen(false)}
        title="Registrar Promessa"
      >
        <form onSubmit={handlePromiseSubmit} className="space-y-4">
          <div className="bg-blue-500/10 p-3 rounded-md flex items-start gap-3 text-blue-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>
              A promessa suspende temporariamente a régua de cobrança automática
              para este título.
            </p>
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium">Data Prometida</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !promiseData.promise_date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {promiseData.promise_date ? (
                    format(
                      new Date(promiseData.promise_date + 'T12:00:00'),
                      'dd/MM/yyyy',
                      { locale: ptBR },
                    )
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    promiseData.promise_date
                      ? new Date(promiseData.promise_date + 'T12:00:00')
                      : undefined
                  }
                  onSelect={(date) => {
                    setPromiseData({
                      ...promiseData,
                      promise_date: date ? format(date, 'yyyy-MM-dd') : '',
                    })
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <input
              type="hidden"
              required
              value={promiseData.promise_date}
              name="promise_date"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Observações</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Detalhes da negociação..."
              value={promiseData.notes}
              onChange={(e) =>
                setPromiseData({ ...promiseData, notes: e.target.value })
              }
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPromiseModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
