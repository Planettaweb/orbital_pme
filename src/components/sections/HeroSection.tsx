import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col justify-center space-y-8 z-10">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight tracking-tight">
              Financial Close.
              <span className="block italic bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent pb-4">
                On Autopilot.
              </span>
            </h1>
            <p
              className="text-muted-text text-lg md:text-xl max-w-2xl animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Autonomous reconciliation, journal entry, and reporting for the
              modern enterprise. Stabilize your month-end orbit.
            </p>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Button className="h-14 px-8 bg-transparent border border-horizon-gold/30 text-horizon-gold hover:bg-horizon-gold hover:text-void hover:shadow-[0_0_20px_rgba(255,210,142,0.3)] transition-all duration-300 group rounded-none">
              <span className="mr-2">Enter Mission Control</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              className="h-14 px-8 border border-muted text-starlight hover:bg-white/5 hover:border-white hover:text-white rounded-none"
            >
              View Documentation
            </Button>
          </div>

          <div
            className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5 max-w-2xl animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            <div>
              <div className="text-xs font-mono text-muted-text mb-1">
                LATENCY
              </div>
              <div className="text-xl font-mono text-white">0.0024ms</div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted-text mb-1">
                REC_RATE
              </div>
              <div className="text-xl font-mono text-white">99.9%</div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted-text mb-1">
                ERROR_MARGIN
              </div>
              <div className="text-xl font-mono text-horizon-red">NULL</div>
            </div>
          </div>
        </div>

        {/* Telemetry Indicators - Desktop Only */}
        <div className="hidden lg:flex flex-col justify-center items-end space-y-32 opacity-50 select-none pointer-events-none">
          <div className="rotate-90 origin-right translate-x-1/2 text-xs font-mono text-telemetry-blue tracking-widest whitespace-nowrap">
            SYSTEM STATUS: NOMINAL
          </div>
          <div className="rotate-90 origin-right translate-x-1/2 text-xs font-mono text-telemetry-blue tracking-widest whitespace-nowrap">
            ORBIT: STABLE
          </div>
        </div>
      </div>
    </section>
  )
}
