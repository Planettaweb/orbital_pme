import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react'
import { Contract } from '@/services/contracts'

interface ContractDashboardProps {
  contracts: Contract[]
}

export function ContractDashboard({ contracts }: ContractDashboardProps) {
  const total = contracts.length
  const active = contracts.filter((c) => c.status === 'active').length

  const today = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  const expiringSoon = contracts.filter((c) => {
    if (c.status !== 'active') return false
    const endDate = new Date(c.end_date)
    return endDate <= thirtyDaysFromNow && endDate >= today
  }).length

  const totalValue = contracts.reduce(
    (acc, c) => acc + (Number(c.value) || 0),
    0,
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Contratos
          </CardTitle>
          <FileText className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{total}</div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Contratos Ativos
          </CardTitle>
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{active}</div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Vencendo em &lt;30 dias
          </CardTitle>
          <AlertCircle className="w-4 h-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{expiringSoon}</div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Valor Total (Ativos)
          </CardTitle>
          <DollarSign className="w-4 h-4 text-starlight" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(totalValue)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
