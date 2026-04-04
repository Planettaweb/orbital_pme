import { Globe, Coins, Repeat, TrendingUp, Building } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'

const parameters = [
  { icon: Globe, label: 'Multi-entity' },
  { icon: Coins, label: 'Revenue' },
  { icon: Repeat, label: 'Billing' },
  { icon: TrendingUp, label: 'Cash Flow' },
  { icon: Building, label: 'Capex' },
]

export function MissionSection() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-sm font-mono text-telemetry-blue tracking-widest">
          MISSION PARAMETERS
        </h2>
        <h3 className="text-3xl font-serif text-white">Multi-Vector Support</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {parameters.map((param, idx) => (
          <GlassCard
            key={idx}
            className="rounded-full aspect-square flex flex-col items-center justify-center gap-4 hover:border-horizon-gold/50 transition-colors duration-500 group"
          >
            <param.icon className="w-8 h-8 text-muted-text group-hover:text-horizon-gold transition-colors duration-300" />
            <span className="text-sm font-mono text-starlight">
              {param.label}
            </span>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
