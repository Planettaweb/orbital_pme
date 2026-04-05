import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2, Shield, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

type Role = {
  id: string
  name: string
  description: string
}

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name')

      if (error) throw error
      setRoles(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar perfis: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description &&
        r.description.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Perfis (RBAC)
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize os níveis de acesso cadastrados no sistema.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Perfis e Níveis de Permissão
          </CardTitle>
          <CardDescription>
            Estes são os perfis de segurança utilizados para restringir ou
            liberar funcionalidades para os usuários da organização.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por perfil..."
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
                      Nome (Role)
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Descrição e Escopo
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredRoles.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium capitalize">
                        {r.name === 'admin'
                          ? 'Administrador'
                          : r.name === 'analyst'
                            ? 'Analista'
                            : r.name === 'viewer'
                              ? 'Visualizador'
                              : r.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({r.name})
                        </span>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {r.description || 'Sem descrição cadastrada'}
                      </td>
                    </tr>
                  ))}
                  {filteredRoles.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="p-8 text-center text-muted-foreground"
                      >
                        Nenhum perfil encontrado.
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
