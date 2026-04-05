import { useState, useEffect } from 'react'
import { Plus, Search, FileText, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  Contract,
  getContracts,
  deleteContract,
  getUserTenants,
} from '@/services/contracts'
import { ContractDashboard } from './components/ContractDashboard'
import { ContractModal } from './components/ContractModal'

export default function Contratos() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [tenantId, setTenantId] = useState<string>('')
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const tenants = await getUserTenants()
      if (tenants && tenants.length > 0) {
        setTenantId(tenants[0].tenant_id)
      }

      const data = await getContracts()
      setContracts(data || [])
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar contratos',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setEditingContract(null)
    setIsOpen(true)
  }

  const openEdit = (contract: Contract) => {
    setEditingContract(contract)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este contrato?')) return

    try {
      await deleteContract(id)
      toast({ title: 'Contrato excluído com sucesso!' })
      fetchData()
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const filteredContracts = contracts.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.party_name.toLowerCase().includes(search.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
            Ativo
          </span>
        )
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
            Expirado
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            Pendente
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Contrato Vivo
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus contratos, vigências e anexos.
          </p>
        </div>
        <Button
          onClick={openNew}
          className="bg-starlight hover:bg-starlight/90 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Contrato
        </Button>
      </div>

      <ContractDashboard contracts={contracts} />

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contratos..."
            className="pl-8 bg-black/20 border-white/10 text-white placeholder:text-muted-foreground/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-white/10 rounded-lg overflow-x-auto bg-black/20 backdrop-blur-sm">
        <table className="w-full text-sm text-left text-white">
          <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium">Título do Contrato</th>
              <th className="px-6 py-4 font-medium">Parte Envolvida</th>
              <th className="px-6 py-4 font-medium">Início</th>
              <th className="px-6 py-4 font-medium">Vencimento</th>
              <th className="px-6 py-4 font-medium">Valor (R$)</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex justify-center items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-starlight animate-pulse"></div>
                    <span>Carregando contratos...</span>
                  </div>
                </td>
              </tr>
            ) : filteredContracts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-16 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <FileText className="w-12 h-12 text-white/20" />
                    <p className="text-lg text-white/60">
                      Nenhum contrato encontrado
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredContracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium">{contract.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {contract.party_name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(contract.start_date).toLocaleDateString('pt-BR', {
                      timeZone: 'UTC',
                    })}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(contract.end_date).toLocaleDateString('pt-BR', {
                      timeZone: 'UTC',
                    })}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {contract.value
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(contract.value)
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(contract.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10"
                        onClick={() => openEdit(contract)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(contract.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ContractModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        contract={editingContract}
        tenantId={tenantId}
        onSuccess={fetchData}
      />
    </div>
  )
}
