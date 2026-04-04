import { ExternalLink, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutUs() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/5 border border-white/10 p-8 md:p-16 relative overflow-hidden text-center">
          {/* Decorative Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-telemetry-blue/10 border border-telemetry-blue/30 flex items-center justify-center mb-6">
              <Rocket className="w-10 h-10 text-telemetry-blue" />
            </div>

            <h1 className="text-4xl md:text-5xl font-serif text-white">
              Quem Somos
            </h1>

            <div className="text-lg text-muted-text space-y-6 leading-relaxed text-left max-w-2xl mx-auto">
              <p>
                O Orbital PME nasceu da expertise da{' '}
                <strong>Planetta Web</strong>, uma agência focada em criar
                soluções tecnológicas robustas e escaláveis para negócios do
                futuro.
              </p>
              <p>
                Entendemos que a pequena e média empresa sofre com a
                fragmentação de ferramentas, inadimplência descontrolada e
                riscos fiscais ocultos. Por isso, criamos uma plataforma única,
                em formato SaaS multitenant, para colocar a sua gestão em piloto
                automático.
              </p>
              <p>
                Nossa missão é fornecer tecnologia de ponta, antes restrita a
                grandes corporações, para PMEs que buscam eficiência, segurança
                e crescimento estruturado.
              </p>
            </div>

            <div className="pt-8">
              <Button
                asChild
                className="bg-white text-black hover:bg-gray-200 rounded-none px-8 font-mono tracking-wider h-12"
              >
                <a
                  href="https://planettaweb.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  CONHEÇA A PLANETTA WEB
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
