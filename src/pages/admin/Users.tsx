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
import { toast } from 'sonner'
import { Loader2, UserCheck, UserX, Search, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <span
    className={cn(
      'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      className,
    )}
  >
    {children}
  </span>
)

type TenantUser = {
  id: string
  user_id: string
  role: string
  status: string
  created_at: string
  profiles: {
    email: string
    full_name: string | null
  } | null
}

export default function Users() {
  const [users, setUsers] = useState<TenantUser[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_users')
        .select(
          `
          id, user_id, role, status, created_at,
          profiles (email, full_name)
        `,
        )
        .order('created_at', { ascending: false })

      if (error) throw error
      // @ts-expect-error
      setUsers(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar usuários: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('tenant_users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error
      toast.success('Permissão atualizada com sucesso.')
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      )
    } catch (error: any) {
      toast.error('Erro ao atualizar permissão.')
    }
  }

  const updateStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tenant_users')
        .update({ status: newStatus })
        .eq('id', userId)

      if (error) throw error
      toast.success(
        `Usuário ${newStatus === 'active' ? 'aprovado' : 'bloqueado'} com sucesso.`,
      )
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
      )
    } catch (error: any) {
      toast.error('Erro ao atualizar status.')
    }
  }

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Tem certeza que deseja remover este usuário da organização?',
      )
    )
      return
    try {
      const { error } = await supabase
        .from('tenant_users')
        .delete()
        .eq('id', id)
      if (error) throw error
      toast.success('Usuário removido com sucesso.')
      setUsers(users.filter((u) => u.id !== id))
    } catch (error: any) {
      toast.error('Erro ao remover usuário.')
    }
  }

  const filtered = users.filter(
    (u) =>
      u.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.profiles?.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground mt-2">
            Controle de acessos e permissões (RBAC) da organização.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membros da Organização</CardTitle>
          <CardDescription>
            Lista de todos os usuários vinculados ao seu tenant.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome ou e-mail..."
              className="pl-9 max-w-md bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Usuário
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Nível de Acesso (Role)
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filtered.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <div className="font-medium">
                          {u.profiles?.full_name || 'Sem nome'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {u.profiles?.email}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {u.status === 'pending' ? (
                          <Badge className="text-amber-600 border-amber-500 bg-amber-50 dark:bg-amber-500/10">
                            Pendente
                          </Badge>
                        ) : u.status === 'active' ? (
                          <Badge className="text-green-600 border-green-500 bg-green-50 dark:bg-green-500/10">
                            Ativo
                          </Badge>
                        ) : (
                          <Badge className="text-red-600 border-red-500 bg-red-50 dark:bg-red-500/10">
                            Bloqueado
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <select
                          value={u.role}
                          onChange={(e) => updateRole(u.id, e.target.value)}
                          className="flex h-9 w-[140px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="admin">Administrador</option>
                          <option value="analyst">Analista</option>
                          <option value="viewer">Visualizador</option>
                        </select>
                      </td>
                      <td className="p-4 align-middle text-right space-x-2 whitespace-nowrap">
                        {u.status === 'pending' || u.status === 'blocked' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            onClick={() => updateStatus(u.id, 'active')}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Aprovar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                            onClick={() => updateStatus(u.id, 'blocked')}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Bloquear
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(u.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-muted-foreground"
                      >
                        Nenhum usuário encontrado na busca.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
