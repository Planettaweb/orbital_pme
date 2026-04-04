import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-void/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            ORBITAL<span className="font-light text-muted-text">_FINANCE</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['PLATFORM', 'INTELLIGENCE', 'COMPLIANCE'].map((item) => (
            <Link
              key={item}
              to="#"
              className="text-xs font-mono tracking-widest text-muted-text hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <Button
          variant="outline"
          className="rounded-none border border-horizon-gold/30 text-horizon-gold hover:bg-horizon-gold hover:text-void transition-all duration-300 font-mono text-xs tracking-wider"
        >
          LOGIN_SECURE
        </Button>
      </div>
    </header>
  )
}
