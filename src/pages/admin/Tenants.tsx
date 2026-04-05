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
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Loader2,
  Building,
  ShieldCheck,
  Activity,
  Palette,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function Tenants() {
  const { tenantId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tenant, setTenant] = useState<any>(null)

  useEffect(() => {
    if (tenantId) fetchTenant()
  }, [tenantId])

  const fetchTenant = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single()
      if (error) throw error
      if (!data.branding) data.branding = { primary_color: '#000000', logo: '' }
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
        .update({
          name: tenant.name,
          branding: tenant.branding,
          max_files_per_contract: tenant.max_files_per_contract,
          max_file_size_mb: tenant.max_file_size_mb,
        })
        .eq('id', tenant.id)
      if (error) throw error
      toast.success('Organização e branding atualizados com sucesso.')
    } catch (error: any) {
      toast.error('Erro ao salvar dados.')
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Organização e Parametrização
        </h1>
        <p className="text-muted-foreground mt-2">
          Personalize sua área de trabalho e acompanhe os limites do seu plano
          atual.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" /> Perfil e Branding
            </CardTitle>
            <CardDescription>
              Configure a identidade visual que será exibida para os usuários da
              sua empresa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orgName">Nome da Empresa</Label>
                <Input
                  id="orgName"
                  value={tenant?.name || ''}
                  onChange={(e) =>
                    setTenant({ ...tenant, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Cor Primária
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      className="w-14 p-1 h-10 cursor-pointer rounded-md border"
                      value={tenant?.branding?.primary_color || '#000000'}
                      onChange={(e) =>
                        setTenant({
                          ...tenant,
                          branding: {
                            ...tenant.branding,
                            primary_color: e.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      type="text"
                      className="font-mono uppercase"
                      value={tenant?.branding?.primary_color || '#000000'}
                      onChange={(e) =>
                        setTenant({
                          ...tenant,
                          branding: {
                            ...tenant.branding,
                            primary_color: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>URL da Logomarca</Label>
                  <Input
                    placeholder="https://exemplo.com/logo.png"
                    value={tenant?.branding?.logo || ''}
                    onChange={(e) =>
                      setTenant({
                        ...tenant,
                        branding: { ...tenant.branding, logo: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-2">
                  <Label>Arquivos por Contrato (Max)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={tenant?.max_files_per_contract || 5}
                    onChange={(e) =>
                      setTenant({
                        ...tenant,
                        max_files_per_contract: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Limite de uploads por contrato.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Tamanho Máx. Arquivo (MB)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={tenant?.max_file_size_mb || 10}
                    onChange={(e) =>
                      setTenant({
                        ...tenant,
                        max_file_size_mb: parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Tamanho máximo em Megabytes.
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{' '}
                Salvar Organização
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-primary" /> Meu Plano:{' '}
                <span className="capitalize text-foreground">
                  {tenant?.plan || 'N/A'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">
                  Status da Conta
                </span>
                <Badge
                  variant={
                    tenant?.status === 'active'
                      ? 'default'
                      : tenant?.status === 'trial'
                        ? 'secondary'
                        : 'destructive'
                  }
                  className="capitalize"
                >
                  {tenant?.status || 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">
                  Limite de Usuários
                </span>
                <span className="font-medium text-sm">
                  {tenant?.user_limit || '∞'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">
                  Limite de Registros
                </span>
                <span className="font-medium text-sm">
                  {tenant?.record_limit || '∞'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" /> Alertas
                  Automáticos
                </span>
                <Badge
                  variant={tenant?.active_alerts ? 'outline' : 'secondary'}
                >
                  {tenant?.active_alerts ? 'Ativos' : 'Inativos'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="w-5 h-5 text-primary" /> Data Isolation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Este ambiente é completamente isolado (RLS). Nenhum dado gerado
                por esta organização (Tenant ID:{' '}
                <code className="bg-muted px-1 py-0.5 rounded">
                  {tenant?.id?.split('-')[0]}
                </code>
                ) pode ser acessado por outras empresas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
