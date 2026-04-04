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
import { toast } from 'sonner'
import { Loader2, Building2, Shield, CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Tenant = {
  id: string
  name: string
  status: string
  plan: string
  created_at: string
  user_count?: number
}

export default function Clients() {
  const [loading, setLoading] = useState(true)
  const [tenants, setTenants] = useState<Tenant[]>([])

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select(
          `
          id, name, status, plan, created_at,
          tenant_users(count)
        `,
        )
        .order('created_at', { ascending: false })

      if (error) throw error

      const formatted = (data as any[]).map((t) => ({
        ...t,
        user_count: t.tenant_users[0]?.count || 0,
      }))

      setTenants(formatted)
    } catch (error: any) {
      toast.error('Erro ao carregar clientes: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateTenantStatus = async (tenantId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ status: newStatus })
        .eq('id', tenantId)

      if (error) throw error

      setTenants((prev) =>
        prev.map((t) => (t.id === tenantId ? { ...t, status: newStatus } : t)),
      )
      toast.success('Status da licença atualizado com sucesso!')
    } catch (error: any) {
      toast.error('Erro ao atualizar licença: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciar Licenças
        </h1>
        <p className="text-muted-foreground mt-2">
          Painel exclusivo Planettaweb. Controle o acesso e o status de todos os
          clientes (Tenants) cadastrados na plataforma.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1" title={tenant.name}>
                  {tenant.name}
                </CardTitle>
                <Badge
                  variant={
                    tenant.status === 'active'
                      ? 'default'
                      : tenant.status === 'pending'
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  Plano
                </span>
                <span className="font-medium capitalize">{tenant.plan}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Usuários
                </span>
                <span className="font-medium">{tenant.user_count}</span>
              </div>

              <div className="pt-4 border-t space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Ação Rápida (Acesso)
                </label>
                <Select
                  value={tenant.status}
                  onValueChange={(val) => updateTenantStatus(tenant.id, val)}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Alterar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      Liberar Acesso (Active)
                    </SelectItem>
                    <SelectItem value="pending">
                      Suspender Temporariamente (Pending)
                    </SelectItem>
                    <SelectItem value="blocked">Bloquear (Blocked)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}

        {tenants.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            Nenhum cliente cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  )
}
