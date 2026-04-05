import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Loader2,
  Building2,
  CalendarDays,
  Plus,
  Activity,
  Users,
  Database,
  Search,
  Trash2,
} from 'lucide-react'

type Tenant = {
  id: string
  name: string
  status: string
  plan: string
  user_limit: number
  record_limit: number
  active_alerts: boolean
  created_at: string
  user_count?: number
}

function TenantForm({
  tenant,
  onSuccess,
  onCancel,
}: {
  tenant?: Tenant | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    status: tenant?.status || 'trial',
    plan: tenant?.plan || 'freemium',
    user_limit: tenant?.user_limit || 10,
    record_limit: tenant?.record_limit || 1000,
    active_alerts: tenant?.active_alerts ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (tenant?.id) {
        const { error } = await supabase
          .from('tenants')
          .update(formData)
          .eq('id', tenant.id)
        if (error) throw error
        toast.success('Cliente atualizado com sucesso!')
      } else {
        const { error } = await supabase
          .from('tenants')
          .insert([{ ...formData, id: crypto.randomUUID() }])
        if (error) throw error
        toast.success('Cliente criado com sucesso!')
      }
      onSuccess()
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nome da Empresa</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status da Licença</Label>
          <Select
            value={formData.status}
            onValueChange={(v) => setFormData({ ...formData, status: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="suspended">Suspenso</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Plano</Label>
          <Select
            value={formData.plan}
            onValueChange={(v) => setFormData({ ...formData, plan: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freemium">Freemium</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Limite de Usuários</Label>
          <Input
            type="number"
            value={formData.user_limit}
            onChange={(e) =>
              setFormData({
                ...formData,
                user_limit: parseInt(e.target.value) || 0,
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Limite de Registros</Label>
          <Input
            type="number"
            value={formData.record_limit}
            onChange={(e) =>
              setFormData({
                ...formData,
                record_limit: parseInt(e.target.value) || 0,
              })
            }
            required
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Switch
          checked={formData.active_alerts}
          onCheckedChange={(c) =>
            setFormData({ ...formData, active_alerts: c })
          }
        />
        <Label>Alertas Ativos no Sistema</Label>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  )
}

export default function Clients() {
  const [loading, setLoading] = useState(true)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*, tenant_users(count)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setTenants(
        (data as any[]).map((t) => ({
          ...t,
          user_count: t.tenant_users[0]?.count || 0,
        })),
      )
    } catch (error: any) {
      toast.error('Erro ao carregar clientes: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Tem certeza que deseja excluir este cliente? Todos os dados vinculados serão permanentemente apagados.',
      )
    )
      return
    try {
      const { error } = await supabase.from('tenants').delete().eq('id', id)
      if (error) throw error
      toast.success('Cliente excluído com sucesso!')
      fetchTenants()
    } catch (error: any) {
      toast.error('Erro ao excluir cliente: ' + error.message)
    }
  }

  const filtered = tenants.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Painel SaaS (Planettaweb)
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie clientes, limites de uso, planos e configurações
            multitenant.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTenant(null)}>
              <Plus className="w-4 h-4 mr-2" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTenant
                  ? 'Editar Configurações do Cliente'
                  : 'Cadastrar Novo Cliente'}
              </DialogTitle>
            </DialogHeader>
            <TenantForm
              tenant={editingTenant}
              onSuccess={() => {
                setIsModalOpen(false)
                fetchTenants()
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-lg p-4 mb-4 flex items-center gap-4 shadow-sm bg-muted/20">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome da empresa..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tenant) => (
          <Card key={tenant.id} className="flex flex-col relative group">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={() => handleDelete(tenant.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1" title={tenant.name}>
                  {tenant.name}
                </CardTitle>
                <Badge
                  variant={
                    tenant.status === 'active'
                      ? 'default'
                      : tenant.status === 'trial'
                        ? 'secondary'
                        : 'destructive'
                  }
                  className="ml-2 capitalize shrink-0"
                >
                  {tenant.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1.5 text-xs mt-1">
                <CalendarDays className="w-3.5 h-3.5" />
                Criado em: {new Date(tenant.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" /> Plano
                  </span>
                  <p className="font-medium capitalize">{tenant.plan}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Activity className="w-4 h-4" /> Alertas
                  </span>
                  <p className="font-medium">
                    {tenant.active_alerts ? 'Ativados' : 'Desativados'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Usuários
                  </span>
                  <p className="font-medium">
                    {tenant.user_count} / {tenant.user_limit || '∞'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Database className="w-4 h-4" /> Registros
                  </span>
                  <p className="font-medium">{tenant.record_limit || '∞'}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleEdit(tenant)}
                >
                  Configurar Parâmetros
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
