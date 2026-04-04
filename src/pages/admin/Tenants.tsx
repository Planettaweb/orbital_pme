import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Building, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function Tenants() {
  const { tenantId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tenant, setTenant] = useState<{
    id: string
    name: string
    plan: string
    status: string
  } | null>(null)

  useEffect(() => {
    if (tenantId) {
      fetchTenant()
    }
  }, [tenantId])

  const fetchTenant = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single()

      if (error) throw error
      setTenant(data)
    } catch (error: any) {
      toast.error('Erro ao carregar dados da organização.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenant) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ name: tenant.name })
        .eq('id', tenant.id)

      if (error) throw error
      toast.success('Organização atualizada com sucesso.')
    } catch (error: any) {
      toast.error('Erro ao salvar dados.')
    } finally {
      setSaving(false)
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
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organização</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os dados e o plano da sua empresa.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Detalhes do Tenant
            </CardTitle>
            <CardDescription>
              Informações básicas de identificação multitenant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>ID do Tenant (UUID)</Label>
                <Input
                  value={tenant?.id || ''}
                  disabled
                  className="bg-muted font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgName">Nome da Empresa</Label>
                <Input
                  id="orgName"
                  value={tenant?.name || ''}
                  onChange={(e) =>
                    setTenant((prev) =>
                      prev ? { ...prev, name: e.target.value } : null,
                    )
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plano Atual</Label>
                  <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center text-sm font-medium capitalize">
                    {tenant?.plan || 'N/A'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center text-sm font-medium capitalize text-green-600">
                    {tenant?.status || 'N/A'}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="mt-4 w-full sm:w-auto"
              >
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar Configurações
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Isolamento Multitenant (RLS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sua organização opera em um ambiente seguro. As políticas de{' '}
              <strong>Row Level Security</strong> do banco de dados garantem que
              seus dados estejam completamente isolados e inacessíveis para
              outras organizações.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
