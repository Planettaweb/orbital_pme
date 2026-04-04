import { ShieldCheck } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'

export function SecuritySection() {
  return (
    <section className="py-12 container mx-auto px-4">
      <GlassCard className="flex flex-col lg:flex-row items-center justify-between p-12 gap-12 bg-white/[0.02]">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-serif text-white">
            Built for High Gravity
          </h2>
          <p className="text-muted-text max-w-lg">
            Enterprise-grade security architecture designed to withstand the
            pressure of regulatory audits and data sovereignty requirements.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-sm text-starlight pt-4">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-horizon-gold rounded-full" />
              SOC2 TYPE II
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-horizon-gold rounded-full" />
              IMMUTABLE LOGGING
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-horizon-gold rounded-full" />
              RBAC
            </li>
          </ul>
        </div>

        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-horizon-gold/20 rounded-full blur-2xl animate-pulse-slow" />
          <div className="relative w-32 h-32 rounded-full border border-horizon-gold/30 bg-void/50 flex items-center justify-center">
            <ShieldCheck className="w-12 h-12 text-horizon-gold" />
            <div
              className="absolute inset-0 rounded-full border border-horizon-gold/10 animate-ping opacity-20"
              style={{ animationDuration: '3s' }}
            />
          </div>
        </div>
      </GlassCard>
    </section>
  )
}
