import { Check, Info } from 'lucide-react'

export function ChaosOrbitSection() {
  return (
    <section className="min-h-[600px] flex flex-col lg:flex-row relative border-y border-white/5">
      {/* Central Divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 z-20 hidden lg:block">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-void border border-white/20 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      </div>

      {/* Chaos Side */}
      <div className="flex-1 bg-[#0a0a0c] relative overflow-hidden p-12 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at center, #333 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 space-y-6 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
          <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono text-muted-text">
            DECOUPLED_SYSTEMS
          </div>
          <h3 className="text-3xl font-serif text-white">The Chaos State</h3>
          <ul className="space-y-4">
            {[
              'Siloed Data Streams',
              'Reactive Decision Making',
              'Human Error Vulnerability',
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-muted-text"
              >
                <Info className="w-4 h-4" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Orbit Side */}
      <div className="flex-1 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] relative overflow-hidden p-12 lg:p-24 flex flex-col justify-center">
        {/* Starfield Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-500/10 to-transparent" />

        <div className="relative z-10 space-y-6">
          <div className="inline-block px-3 py-1 bg-horizon-gold/10 border border-horizon-gold/30 text-xs font-mono text-horizon-gold">
            SYNCHRONIZED_ORBIT
          </div>
          <h3 className="text-3xl font-serif text-white">The Orbital State</h3>
          <ul className="space-y-4">
            {[
              'Unified Data Plane',
              'Predictive Insights',
              'Immutable Audit Trails',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-starlight">
                <div className="w-4 h-4 rounded-full bg-horizon-gold/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-horizon-gold" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
