import { Radar, ScrollText, Cpu, Activity } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { Switch } from '@/components/ui/switch'

const modules = [
  {
    title: 'Signal Capture',
    icon: Radar,
    description:
      'Ingest transaction data from any banking or ERP endpoint in real-time.',
  },
  {
    title: 'Reconciliation Engine',
    icon: Cpu,
    description:
      'AI-driven matching logic with 99.9% accuracy on high-volume datasets.',
  },
  {
    title: 'Journal Automation',
    icon: ScrollText,
    description:
      'Auto-post adjusting entries and accruals based on predefined rulesets.',
  },
  {
    title: 'Continuous Monitor',
    icon: Activity,
    description:
      'Always-on anomaly detection to catch irregularities before close.',
  },
]

export function ModulesSection() {
  return (
    <section className="py-24 space-y-24">
      {/* Toggle Section */}
      <div className="flex justify-center items-center gap-8 select-none">
        <span className="text-muted-text font-mono text-sm tracking-widest">
          MANUAL
        </span>
        <div className="relative w-24 h-12 rounded-full bg-white/5 border border-white/10 p-1 flex items-center">
          <div className="absolute right-1 w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10" />
        </div>
        <span className="text-horizon-gold font-mono text-sm tracking-widest font-bold shadow-amber-500/20 drop-shadow-lg">
          AUTONOMOUS
        </span>
      </div>

      {/* Modules Grid */}
      <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod, idx) => (
          <GlassCard
            key={idx}
            variant="interactive"
            className="cursor-crosshair h-full group"
          >
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-horizon-gold/50 transition-colors">
                <mod.icon className="w-6 h-6 text-starlight group-hover:text-horizon-gold transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white mb-2">
                  {mod.title}
                </h3>
                <p className="text-sm text-muted-text leading-relaxed">
                  {mod.description}
                </p>
              </div>
            </div>

            {/* Hover Line Animation */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-horizon-gold w-0 group-hover:w-full transition-all duration-700 ease-out" />
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
