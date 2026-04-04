import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { cn } from '@/lib/utils'

export function TurbulenceSection() {
  const [activeItem, setActiveItem] = useState(0)
  const items = [
    'Fragmented data sources across multiple ERPs',
    'Manual spreadsheet reconciliation errors',
    'Lack of real-time visibility into cash flow',
    'Delayed month-end closing cycles',
  ]

  return (
    <section className="py-24 container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-mono text-horizon-red tracking-widest">
              MONTH-END TURBULENCE
            </h2>
            <h3 className="text-4xl font-serif text-white">
              Gravity is dragging you down.
            </h3>
            <p className="text-muted-text">
              Manual processes introduce drag into your financial velocity.
              Eliminate the friction.
            </p>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300 border border-transparent',
                  activeItem === index
                    ? 'bg-white/5 border-white/10'
                    : 'hover:bg-white/5',
                )}
                onMouseEnter={() => setActiveItem(index)}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    activeItem === index
                      ? 'bg-horizon-red shadow-[0_0_10px_#D66D50]'
                      : 'bg-muted-text',
                  )}
                />
                <span
                  className={cn(
                    'font-mono text-sm',
                    activeItem === index ? 'text-white' : 'text-muted-text',
                  )}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <GlassCard className="h-[400px] flex flex-col justify-center items-center relative border-horizon-red/20 bg-void/40">
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-horizon-red/50 to-transparent animate-scan absolute top-0" />
          </div>

          <div className="text-center space-y-6 w-full max-w-xs relative z-10">
            <div className="flex flex-col items-center gap-2 text-horizon-red animate-pulse">
              <AlertTriangle className="w-12 h-12" />
              <span className="font-mono text-xs tracking-widest">
                ALERT: MANUAL_OVERLOAD
              </span>
            </div>

            <div className="space-y-4 w-full">
              {[85, 92, 78].map((val, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-muted-text">
                    <span>PROCESS_THREAD_{i + 1}</span>
                    <span className="text-horizon-red">CRITICAL</span>
                  </div>
                  <div className="h-1 bg-white/10 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full bg-horizon-red"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-horizon-red/10 border border-horizon-red/30 rounded text-horizon-red text-xs font-mono">
              <X className="w-3 h-3" />
              <span>SYNC_FAILED</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
