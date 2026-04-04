import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, FileText, FileSearch, CheckCircle2 } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    receivablesTotal: 0,
    fiscalAlerts: 0,
    activeContracts: 0,
  })

  useEffect(() => {
    async function loadStats() {
      try {
        // Recebíveis Abertos (Cobrança Viva)
        const { data: receivables } = await supabase
          .from('receivables')
          .select('amount')
          .eq('status', 'open')

        const total =
          receivables?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

        // Alertas Fiscais (FiscalPulse)
        const { count: fiscalCount } = await supabase
          .from('fiscal_documents')
          .select('*', { count: 'exact', head: true })
          .in('risk_level', ['medium', 'high'])

        // Contratos Ativos (Contrato Vivo)
        const { count: contractsCount } = await supabase
          .from('contracts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')

        setStats({
          receivablesTotal: total,
          fiscalAlerts: fiscalCount || 0,
          activeContracts: contractsCount || 0,
        })
      } catch (err) {
        console.error('Error loading stats', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadStats()
    }
  }, [user])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel Executivo</h1>
        <p className="text-muted-foreground mt-2">
          Bem-vindo, {user?.email}. Visão consolidada da sua organização (dados
          em tempo real).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Títulos a Receber
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(stats.receivablesTotal)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor total em aberto
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inconsistências Fiscais
            </CardTitle>
            <FileSearch className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold text-destructive">
                  {stats.fiscalAlerts}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requerem atenção imediata
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contratos Ativos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-12 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats.activeContracts}
                </div>
                <p className="text-xs text-muted-foreground">
                  Contratos vigentes no momento
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nível de Segurança
            </CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Alto</div>
            <p className="text-xs text-muted-foreground">
              Políticas RLS e RBAC ativas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
