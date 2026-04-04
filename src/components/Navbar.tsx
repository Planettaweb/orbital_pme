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
            ORBITAL<span className="font-light text-muted-text">_PME</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/quem-somos"
            className="text-xs font-mono tracking-widest text-muted-text hover:text-white transition-colors"
          >
            QUEM SOMOS
          </Link>
          <Link
            to="/modulos"
            className="text-xs font-mono tracking-widest text-muted-text hover:text-white transition-colors"
          >
            MÓDULOS
          </Link>
          <Link
            to="/contato"
            className="text-xs font-mono tracking-widest text-muted-text hover:text-white transition-colors"
          >
            CONTATO
          </Link>
          <Link
            to="/termos"
            className="text-xs font-mono tracking-widest text-muted-text hover:text-white transition-colors"
          >
            TERMOS
          </Link>
        </nav>

        <Button
          asChild
          variant="outline"
          className="rounded-none border border-horizon-gold/30 text-horizon-gold hover:bg-horizon-gold hover:text-void transition-all duration-300 font-mono text-xs tracking-wider"
        >
          <Link to="/login">ACESSO_SEGURO</Link>
        </Button>
      </div>
    </header>
  )
}
