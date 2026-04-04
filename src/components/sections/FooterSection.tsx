import { Link } from 'react-router-dom'

export function FooterSection() {
  return (
    <footer className="py-12 border-t border-white/5 bg-[#020202]">
      <div className="container mx-auto px-4 text-center">
        <div className="text-xl font-bold tracking-tight text-white mb-4">
          ORBITAL<span className="font-light text-muted-text">_PME</span>
        </div>
        <p className="text-muted-text text-sm mb-8">
          Gestão autônoma e inteligente para o futuro da sua empresa.
        </p>
        <div className="flex justify-center gap-6 text-sm text-muted-text">
          <Link to="/termos" className="hover:text-white transition-colors">
            Termos de Uso
          </Link>
          <Link to="/quem-somos" className="hover:text-white transition-colors">
            Quem Somos
          </Link>
          <Link to="/contato" className="hover:text-white transition-colors">
            Contato Corporativo
          </Link>
        </div>
        <div className="mt-12 text-xs font-mono text-white/20">
          © {new Date().getFullYear()} Orbital PME. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  )
}
