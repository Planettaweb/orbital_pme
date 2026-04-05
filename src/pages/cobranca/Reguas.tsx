import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useTenant } from '@/hooks/use-tenant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import {
  Plus,
  Mail,
  MessageSquare,
  Smartphone,
  Search,
  Edit2,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

export default function Reguas() {
  const { activeTenant } = useTenant()
  const [rules, setRules] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const defaultForm = {
    id: '',
    name: '',
    days_offset: '0',
    channel: 'email',
    template: '',
  }
  const [formData, setFormData] = useState(defaultForm)

  const fetchRules = async () => {
    if (!activeTenant) return
    const { data } = await supabase
      .from('billing_rules')
      .select('*')
      .eq('tenant_id', activeTenant)
      .order('days_offset', { ascending: true })
    if (data) setRules(data)
  }

  useEffect(() => {
    fetchRules()
  }, [activeTenant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTenant) return
    setLoading(true)

    const payload = {
      ...formData,
      tenant_id: activeTenant,
      days_offset: parseInt(formData.days_offset),
    }
    if (!payload.id) delete (payload as any).id

    const { error } = payload.id
      ? await supabase
          .from('billing_rules')
          .update(payload)
          .eq('id', payload.id)
      : await supabase.from('billing_rules').insert([payload])

    if (error) toast.error('Erro ao salvar régua')
    else {
      toast.success('Régua salva com sucesso!')
      setIsModalOpen(false)
      fetchRules()
      setFormData(defaultForm)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta regra?')) return
    const { error } = await supabase.from('billing_rules').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir regra')
    else {
      toast.success('Regra excluída com sucesso')
      fetchRules()
    }
  }

  const openModal = (rule?: any) => {
    setFormData(
      rule
        ? { ...rule, days_offset: rule.days_offset.toString() }
        : defaultForm,
    )
    setIsModalOpen(true)
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase
      .from('billing_rules')
      .update({ active: !current })
      .eq('id', id)
    fetchRules()
    toast.success(!current ? 'Regra ativada' : 'Regra pausada')
  }

  const getChannelIcon = (ch: string) => {
    if (ch === 'whatsapp')
      return <MessageSquare className="w-5 h-5 text-emerald-500" />
    if (ch === 'sms') return <Smartphone className="w-5 h-5 text-sky-500" />
    return <Mail className="w-5 h-5 text-muted-foreground" />
  }

  const formatOffset = (days: number) => {
    if (days === 0) return 'No dia do vencimento'
    if (days < 0) return `${Math.abs(days)} dias antes`
    return `${days} dias de atraso`
  }

  const filtered = rules.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Régua de Cobrança
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure os fluxos automáticos de lembretes e cobranças.
          </p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Nova Regra
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-4 mb-4 flex items-center gap-4 shadow-sm bg-muted/20">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome da regra..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border rounded-lg shadow-sm">
            Nenhuma regra encontrada.
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className={`p-5 rounded-lg border bg-card shadow-sm relative overflow-hidden transition-all ${!r.active ? 'opacity-60 grayscale-[0.5]' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-muted/50 border">
                    {getChannelIcon(r.channel)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">
                      {r.name}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {r.channel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openModal(r)}
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(r.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                  <Switch
                    checked={r.active}
                    onCheckedChange={() => toggleActive(r.id, r.active)}
                  />
                </div>
              </div>
              <div className="bg-muted/40 p-3 rounded-md mb-4 border border-muted">
                <div className="text-xs font-medium text-foreground mb-1">
                  Gatilho de Disparo:
                </div>
                <div className="text-sm font-semibold text-primary">
                  {formatOffset(r.days_offset)}
                </div>
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2 italic">
                "{r.template || 'Template padrão do sistema'}"
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? 'Editar Regra' : 'Nova Regra de Cobrança'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome da Regra</label>
            <Input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Lembrete 3 dias antes"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Momento (Dias)</label>
              <Input
                type="number"
                required
                value={formData.days_offset}
                onChange={(e) =>
                  setFormData({ ...formData, days_offset: e.target.value })
                }
                placeholder="-3 para antes, 3 para depois"
              />
              <p className="text-[10px] text-muted-foreground">
                Negativo para antes do vencimento.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Canal</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.channel}
                onChange={(e) =>
                  setFormData({ ...formData, channel: e.target.value })
                }
              >
                <option value="email">E-mail</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem (Template)</label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Olá {{nome}}, seu boleto vence em..."
              value={formData.template}
              onChange={(e) =>
                setFormData({ ...formData, template: e.target.value })
              }
            />
            <p className="text-[10px] text-muted-foreground">
              Variáveis: {'{{nome}}'}, {'{{valor}}'}, {'{{vencimento}}'}
            </p>
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
              {loading ? 'Salvando...' : 'Salvar Regra'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
