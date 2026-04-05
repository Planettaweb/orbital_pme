import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useTenant } from '@/hooks/use-tenant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import {
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Edit2,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

export default function Clientes() {
  const { activeTenant } = useTenant()
  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const defaultForm = {
    id: '',
    name: '',
    document: '',
    email: '',
    phone: '',
    risk_level: 'low',
  }
  const [formData, setFormData] = useState(defaultForm)

  const fetchCustomers = async () => {
    if (!activeTenant) return
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('tenant_id', activeTenant)
      .order('created_at', { ascending: false })
    if (data) setCustomers(data)
  }

  useEffect(() => {
    fetchCustomers()
  }, [activeTenant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTenant) return
    setLoading(true)

    const payload = {
      name: formData.name,
      document: formData.document,
      email: formData.email,
      phone: formData.phone,
      risk_level: formData.risk_level,
      tenant_id: activeTenant,
    }

    const { error } = formData.id
      ? await supabase.from('customers').update(payload).eq('id', formData.id)
      : await supabase.from('customers').insert([payload])

    if (error) {
      toast.error('Erro ao salvar cliente')
    } else {
      toast.success('Cliente salvo com sucesso!')
      setIsModalOpen(false)
      fetchCustomers()
      setFormData(defaultForm)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return
    const { error } = await supabase.from('customers').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir cliente')
    else {
      toast.success('Cliente excluído com sucesso')
      fetchCustomers()
    }
  }

  const openModal = (customer?: any) => {
    if (customer) {
      setFormData({
        id: customer.id,
        name: customer.name || '',
        document: customer.document || '',
        email: customer.email || '',
        phone: customer.phone || '',
        risk_level: customer.risk_level || 'low',
      })
    } else {
      setFormData(defaultForm)
    }
    setIsModalOpen(true)
  }

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.document?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase()),
  )

  const riskColors: any = {
    low: 'text-emerald-600 bg-emerald-500/10',
    medium: 'text-amber-600 bg-amber-500/10',
    high: 'text-rose-600 bg-rose-500/10',
  }
  const riskLabels: any = {
    low: 'Baixo Risco',
    medium: 'Risco Médio',
    high: 'Alto Risco',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Clientes Devedores
          </h1>
          <p className="text-muted-foreground text-sm">
            Gerencie sua carteira de clientes e níveis de risco.
          </p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome, documento ou email..."
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
                <th className="px-6 py-3 font-medium">Contato</th>
                <th className="px-6 py-3 font-medium">Comportamento</th>
                <th className="px-6 py-3 font-medium">Risco</th>
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
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {c.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Doc: {c.document || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">{c.email || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {c.payment_behavior || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${riskColors[c.risk_level] || riskColors.low}`}
                      >
                        {c.risk_level === 'high' ? (
                          <ShieldAlert className="w-3 h-3" />
                        ) : c.risk_level === 'medium' ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <ShieldCheck className="w-3 h-3" />
                        )}
                        {riskLabels[c.risk_level] || 'Desconhecido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openModal(c)}
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c.id)}
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
        title={formData.id ? 'Editar Cliente' : 'Novo Cliente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nome completo ou Razão Social"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Documento</label>
              <Input
                value={formData.document}
                onChange={(e) =>
                  setFormData({ ...formData, document: e.target.value })
                }
                placeholder="CPF/CNPJ"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@exemplo.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nível de Risco</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.risk_level}
              onChange={(e) =>
                setFormData({ ...formData, risk_level: e.target.value })
              }
            >
              <option value="low">Baixo Risco</option>
              <option value="medium">Risco Médio</option>
              <option value="high">Alto Risco</option>
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
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
