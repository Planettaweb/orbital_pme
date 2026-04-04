import { GlassCard } from '@/components/GlassCard'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function DashboardSection() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-serif text-white mb-4">
          Global Consolidation
        </h2>
        <p className="text-muted-text">
          Real-time visibility into your financial universe.
        </p>
      </div>

      <GlassCard className="max-w-5xl mx-auto p-0 overflow-hidden border-white/10 bg-[#050505]/80 backdrop-blur-md">
        {/* Dashboard Header */}
        <div className="border-b border-white/10 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs font-mono text-muted-text mb-2">
              CLOSE PROGRESS
            </div>
            <div className="flex items-center gap-4">
              <div className="w-64">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-horizon-gold shadow-[0_0_10px_rgba(255,210,142,0.5)] w-[78%]" />
                </div>
              </div>
              <span className="font-mono text-horizon-gold">78%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="font-mono border-white/10 text-muted-text"
            >
              Q3_2024
            </Badge>
            <Badge className="bg-telemetry-blue/10 text-telemetry-blue hover:bg-telemetry-blue/20 border-0 font-mono">
              LIVE
            </Badge>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="p-6">
            <div className="text-xs font-mono text-muted-text mb-1">
              CASH POSITION
            </div>
            <div className="text-2xl font-mono text-white">$42,891,020</div>
          </div>
          <div className="p-6">
            <div className="text-xs font-mono text-muted-text mb-1">
              EXCEPTIONS
            </div>
            <div className="text-2xl font-mono text-horizon-gold">3</div>
          </div>
          <div className="p-6">
            <div className="text-xs font-mono text-muted-text mb-1">
              AUTO-MATCH RATE
            </div>
            <div className="text-2xl font-mono text-telemetry-blue">99.4%</div>
          </div>
        </div>

        {/* Data Table Mockup */}
        <div className="border-t border-white/10">
          <div className="grid grid-cols-12 gap-4 p-4 text-xs font-mono text-muted-text border-b border-white/5 bg-white/[0.02]">
            <div className="col-span-4">ENTITY</div>
            <div className="col-span-3">STATUS</div>
            <div className="col-span-3">VARIANCE</div>
            <div className="col-span-2 text-right">LAST_UPDATED</div>
          </div>
          {[
            {
              name: 'US_CORP_01',
              status: 'CLOSED',
              statusColor: 'text-green-400 bg-green-400/10',
              var: '0.00%',
              time: '2m ago',
            },
            {
              name: 'EMEA_SUB_04',
              status: 'REVIEW',
              statusColor: 'text-amber-400 bg-amber-400/10',
              var: '1.24%',
              time: '5m ago',
            },
            {
              name: 'APAC_JV_02',
              status: 'CLOSED',
              statusColor: 'text-green-400 bg-green-400/10',
              var: '0.00%',
              time: '12m ago',
            },
            {
              name: 'LATAM_OPS_01',
              status: 'PROCESSING',
              statusColor: 'text-blue-400 bg-blue-400/10',
              var: '--',
              time: '1m ago',
            },
          ].map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 p-4 text-sm border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center"
            >
              <div className="col-span-4 font-medium text-white">
                {row.name}
              </div>
              <div className="col-span-3">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono ${row.statusColor}`}
                >
                  {row.status}
                </span>
              </div>
              <div className="col-span-3 font-mono text-muted-text">
                {row.var}
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
