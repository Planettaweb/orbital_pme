import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Download, TrendingDown, Target, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCsvImport } from '@/hooks/use-csv-import'

export default function RelatoriosFiscais() {
  const [stats, setStats] = useState<any[]>([])

  const fetchStats = async () => {
    const { data } = await supabase
      .from('fiscal_monthly_stats')
      .select('*')
      .order('month_year', { ascending: true })
    if (data) setStats(data)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const { fileInputRef, handleFileUpload, triggerImport } = useCsvImport(
    'fiscal_monthly_stats',
    (values, tenantId) => {
      if (!values[0]) return null
      return {
        tenant_id: tenantId,
        month_year: values[0]?.trim(),
        revenue: parseFloat(values[1]?.trim() || '0'),
        tax: parseFloat(values[2]?.trim() || '0'),
      }
    },
    fetchStats,
    'tenant_id,month_year', // conflict cols for upsert
  )

  const maxRevenue = Math.max(...stats.map((m) => Number(m.revenue)), 1)
  const totalTax = stats.reduce((acc, m) => acc + Number(m.tax), 0)
  const totalRevenue = stats.reduce((acc, m) => acc + Number(m.revenue), 0)
  const effectiveTaxRate =
    totalRevenue > 0 ? ((totalTax / totalRevenue) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Relatórios Fiscais
          </h1>
          <p className="text-muted-foreground">
            Análise de carga tributária e faturamento mensal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button variant="outline" className="bg-card" onClick={triggerImport}>
            <Upload className="w-4 h-4 mr-2" /> Importar Dados
          </Button>
          <Button variant="outline" className="bg-card">
            <Download className="w-4 h-4 mr-2" /> Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">
            Carga Tributária Efetiva
          </div>
          <div className="text-3xl font-bold flex items-center gap-2">
            {effectiveTaxRate}%{' '}
            <TrendingDown className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Média geral do período importado
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">
            Impostos Acumulados
          </div>
          <div className="text-3xl font-bold">
            R$ {totalTax.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Total no período importado
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">
            Risco de Desenquadramento
          </div>
          <div className="text-3xl font-bold text-green-500 flex items-center gap-2">
            Baixo <Target className="w-6 h-6" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Dentro dos limites permitidos
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="font-semibold text-lg">
              Evolução de Faturamento vs Impostos
            </h3>
            <p className="text-sm text-muted-foreground">
              Evolução mensal com base na importação CSV
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-telemetry-blue" />
              <span>Faturamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <span>Impostos</span>
            </div>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-4 mt-8 overflow-x-auto min-w-full">
          {stats.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Importe os dados via CSV para visualizar o gráfico.
            </div>
          ) : (
            stats.map((month, idx) => {
              const revenueHeight = (Number(month.revenue) / maxRevenue) * 100
              const taxHeight = (Number(month.tax) / maxRevenue) * 100
              const isCurrent = idx === stats.length - 1

              return (
                <div
                  key={month.id}
                  className="flex-1 flex flex-col items-center gap-2 group relative min-w-[60px]"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-foreground text-background text-xs rounded-md p-2 pointer-events-none z-10 hidden sm:block whitespace-nowrap shadow-lg">
                    <div className="font-semibold mb-1 border-b border-background/20 pb-1">
                      {month.month_year}
                    </div>
                    <div>
                      Fat: R$ {(Number(month.revenue) / 1000).toFixed(1)}k
                    </div>
                    <div>Imp: R$ {(Number(month.tax) / 1000).toFixed(1)}k</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
                  </div>

                  <div className="w-full flex justify-center items-end h-[200px] gap-1 sm:gap-2">
                    <div
                      className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ${isCurrent ? 'bg-telemetry-blue' : 'bg-telemetry-blue/60'}`}
                      style={{ height: `${revenueHeight}%` }}
                    />
                    <div
                      className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ${isCurrent ? 'bg-red-500' : 'bg-red-400/60'}`}
                      style={{ height: `${taxHeight}%` }}
                    />
                  </div>
                  <div
                    className={`text-xs ${isCurrent ? 'font-bold' : 'text-muted-foreground'}`}
                  >
                    {month.month_year}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
