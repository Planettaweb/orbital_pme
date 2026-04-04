import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, ShieldCheck, Building2 } from 'lucide-react'
import { usePermissions } from '@/hooks/use-permissions'

export default function Profile() {
  const { user } = useAuth()
  const { role } = usePermissions()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [tenantName, setTenantName] = useState('')

  useEffect(() => {
    async function getProfile() {
      if (!user) return

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single()

        if (profile) {
          setFullName(profile.full_name || '')
          setPhone(profile.phone || '')
        }

        const { data: tenantData } = await supabase
          .from('tenant_users')
          .select('tenants(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle()

        if (tenantData?.tenants) {
          // @ts-expect-error - Supabase nested relations type casting
          setTenantName(tenantData.tenants.name || 'Sua Organização')
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [user])

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Perfil atualizado com sucesso!')
    } catch (error: any) {
      toast.error('Erro ao atualizar perfil: ' + error.message)
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

  const roleLabel =
    role === 'admin'
      ? 'Administrador'
      : role === 'analyst'
        ? 'Analista'
        : role === 'viewer'
          ? 'Visualizador'
          : role === 'operator'
            ? 'Operador'
            : 'Sem Acesso / Pendente'

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e credenciais de acesso.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex items-start gap-4">
            <Building2 className="w-8 h-8 text-primary mt-1" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Organização
              </p>
              <h3 className="text-xl font-bold">
                {tenantName || 'Carregando...'}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6 flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-primary mt-1" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nível de Acesso (RBAC)
              </p>
              <h3 className="text-xl font-bold">{roleLabel}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize seus dados de contato básicos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail (Login)</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                O e-mail não pode ser alterado diretamente.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Celular</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
