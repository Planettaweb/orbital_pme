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
} from 'lucide-react'
import { toast } from 'sonner'

export default function Clientes() {
  const { activeTenant } = useTenant()
  const [customers, setCustomers] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    email: '',
    phone: '',
    risk_level: 'low',
  })

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
    const { error } = await supabase
      .from('customers')
      .insert([{ ...formData, tenant_id: activeTenant }])
    if (error) {
      toast.error('Erro ao salvar cliente')
    } else {
      toast.success('Cliente cadastrado com sucesso!')
      setIsModalOpen(false)
      fetchCustomers()
      setFormData({
        name: '',
        document: '',
        email: '',
        phone: '',
        risk_level: 'low',
      })
    }
    setLoading(false)
  }

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
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome ou documento..."
              className="pl-9 bg-background"
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
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Nenhum cliente cadastrado em sua carteira.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
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
        title="Novo Cliente"
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
