import { GlassCard } from '@/components/GlassCard'
import { Badge } from '@/components/ui/badge'

export function DashboardSection() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-serif text-white mb-4">
          Painel Executivo
        </h2>
        <p className="text-muted-text">
          Visibilidade em tempo real do seu universo empresarial.
        </p>
      </div>

      <GlassCard className="max-w-5xl mx-auto p-0 overflow-hidden border-white/10 bg-[#050505]/80 backdrop-blur-md">
        {/* Dashboard Header */}
        <div className="border-b border-white/10 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs font-mono text-muted-text mb-2">
              SAÚDE FINANCEIRA
            </div>
            <div className="flex items-center gap-4">
              <div className="w-64">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-horizon-gold shadow-[0_0_10px_rgba(255,210,142,0.5)] w-[92%]" />
                </div>
              </div>
              <span className="font-mono text-horizon-gold">92%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="font-mono border-white/10 text-muted-text"
            >
              TRIMESTRE_ATUAL
            </Badge>
            <Badge className="bg-telemetry-blue/10 text-telemetry-blue hover:bg-telemetry-blue/20 border-0 font-mono">
              AO VIVO
            </Badge>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="p-6">
            <div className="text-xs font-mono text-muted-text mb-1">
              CONTAS A RECEBER
            </div>
            <div className="text-2xl font-mono text-white">R$ 142.890,20</div>
          </div>
          <div className="p-6">
            <div className="text-xs font-mono text-muted-text mb-1">
              INCONSISTÊNCIAS FISCAIS
            </div>
            <div className="text-2xl font-mono text-horizon-gold">2</div>
          </div>
          <div className="p-6">
            <div className="text-xs font-mono text-muted-text mb-1">
              CONTRATOS A VENCER (30D)
            </div>
            <div className="text-2xl font-mono text-telemetry-blue">4</div>
          </div>
        </div>

        {/* Data Table Mockup */}
        <div className="border-t border-white/10">
          <div className="grid grid-cols-12 gap-4 p-4 text-xs font-mono text-muted-text border-b border-white/5 bg-white/[0.02]">
            <div className="col-span-4">MÓDULO / ALERTA</div>
            <div className="col-span-3">STATUS</div>
            <div className="col-span-3">IMPACTO</div>
            <div className="col-span-2 text-right">ATUALIZAÇÃO</div>
          </div>
          {[
            {
              name: 'Cobrança: Cliente X',
              status: 'EM ATRASO',
              statusColor: 'text-amber-400 bg-amber-400/10',
              impact: 'R$ 15.000,00',
              time: '2m atrás',
            },
            {
              name: 'Fiscal: NF-e Rejeitada',
              status: 'CRÍTICO',
              statusColor: 'text-red-400 bg-red-400/10',
              impact: 'Multa Potencial',
              time: '15m atrás',
            },
            {
              name: 'Contrato: Fornecedor Y',
              status: 'REVISÃO',
              statusColor: 'text-blue-400 bg-blue-400/10',
              impact: 'Renovação',
              time: '1h atrás',
            },
            {
              name: 'Cobrança: Cliente Z',
              status: 'PAGO',
              statusColor: 'text-green-400 bg-green-400/10',
              impact: 'R$ 8.500,00',
              time: '3h atrás',
            },
          ].map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 p-4 text-sm border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center"
            >
              <div className="col-span-4 font-medium text-white truncate pr-2">
                {row.name}
              </div>
              <div className="col-span-3">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono ${row.statusColor}`}
                >
                  {row.status}
                </span>
              </div>
              <div className="col-span-3 font-mono text-muted-text text-sm">
                {row.impact}
              </div>
              <div className="col-span-2 text-right font-mono text-muted-text text-xs">
                {row.time}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  )
}
