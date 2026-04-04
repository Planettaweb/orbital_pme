import { Button } from '@/components/ui/button'

export function FooterSection() {
  return (
    <footer className="py-32 container mx-auto px-4 text-center relative z-10">
      <div className="space-y-8 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-white">
          Ready to Stabilize Orbit?
        </h2>
        <p className="text-muted-text text-lg">
          Join the financial teams operating at zero gravity.
        </p>

        <Button className="h-16 px-10 text-lg bg-horizon-gold text-void hover:bg-white hover:scale-105 transition-all duration-300 font-medium">
          Activate Automated Close
        </Button>

        <div className="pt-12 border-t border-white/5 mt-12 flex flex-col items-center gap-2">
          <p className="text-xs font-mono text-muted-text tracking-widest uppercase">
            SECURE CONNECTION ESTABLISHED // ENCRYPTED: AES-256
          </p>
          <p className="text-xs text-white/20">
            © 2024 ORBITAL FINANCE. ALL SYSTEMS NOMINAL.
          </p>
        </div>
      </div>
    </footer>
  )
}
