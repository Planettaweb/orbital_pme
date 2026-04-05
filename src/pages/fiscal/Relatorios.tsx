import { Download, TrendingDown, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RelatoriosFiscais() {
  const months = [
    { name: 'Nov', revenue: 45000, tax: 6750, isCurrent: false },
    { name: 'Dez', revenue: 52000, tax: 7800, isCurrent: false },
    { name: 'Jan', revenue: 48000, tax: 7200, isCurrent: false },
    { name: 'Fev', revenue: 61000, tax: 9150, isCurrent: false },
    { name: 'Mar', revenue: 59000, tax: 8850, isCurrent: false },
    { name: 'Abr', revenue: 65000, tax: 9750, isCurrent: true },
  ]
  const maxRevenue = Math.max(...months.map((m) => m.revenue))

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
        <Button variant="outline" className="bg-card">
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">
            Carga Tributária Efetiva
          </div>
          <div className="text-3xl font-bold flex items-center gap-2">
            15.0% <TrendingDown className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            -0.5% em relação ao trimestre anterior
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">
            Impostos Acumulados (Ano)
          </div>
          <div className="text-3xl font-bold">R$ 34.950</div>
          <div className="text-xs text-muted-foreground mt-2">
            Simples Nacional, INSS, FGTS e outros
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
            Faturamento 45% abaixo do limite (R$ 4.8M)
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="font-semibold text-lg">
              Evolução de Faturamento vs Impostos
            </h3>
            <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-telemetry-blue" />
              <span>Faturamento Bruto</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <span>Impostos</span>
            </div>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-4 mt-8">
          {months.map((month) => {
            const revenueHeight = (month.revenue / maxRevenue) * 100
            const taxHeight = (month.tax / maxRevenue) * 100

            return (
              <div
                key={month.name}
                className="flex-1 flex flex-col items-center gap-2 group relative"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-foreground text-background text-xs rounded-md p-2 pointer-events-none z-10 hidden sm:block whitespace-nowrap shadow-lg">
                  <div className="font-semibold mb-1 border-b border-background/20 pb-1">
                    {month.name}/2026
                  </div>
                  <div>Fat: R$ {(month.revenue / 1000).toFixed(1)}k</div>
                  <div>Imp: R$ {(month.tax / 1000).toFixed(1)}k</div>
                  {/* Triangle for the tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
                </div>

                <div className="w-full flex justify-center items-end h-[200px] gap-1 sm:gap-2">
                  <div
                    className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ${month.isCurrent ? 'bg-telemetry-blue' : 'bg-telemetry-blue/60'}`}
                    style={{ height: `${revenueHeight}%` }}
                  />
                  <div
                    className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ${month.isCurrent ? 'bg-red-500' : 'bg-red-400/60'}`}
                    style={{ height: `${taxHeight}%` }}
                  />
                </div>
                <div
                  className={`text-sm ${month.isCurrent ? 'font-bold' : 'text-muted-foreground'}`}
                >
                  {month.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
