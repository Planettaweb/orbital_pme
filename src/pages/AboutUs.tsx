import { Link } from 'react-router-dom'
import { ArrowLeft, Rocket, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import logoImg from '@/assets/logo-5cfdc.png'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center animate-in fade-in duration-500">
      <div className="w-full max-w-5xl px-4 py-12 md:py-24">
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="pl-0 hover:bg-transparent hover:text-primary"
          >
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar para o Início
            </Link>
          </Button>
        </div>

        <div className="flex flex-col items-center text-center space-y-8 mb-20">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-48 h-48 md:w-56 md:h-56 bg-card border border-border/50 rounded-full shadow-xl flex items-center justify-center p-6 relative z-10 overflow-hidden">
              <img
                src={logoImg}
                alt="Logo PNW"
                className="w-full h-full object-contain drop-shadow-md transform transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Inovação que Impulsiona o seu Negócio
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Nascemos com o propósito de simplificar e automatizar a rotina
              financeira e fiscal de pequenas e médias empresas. Combinamos
              tecnologia de ponta com usabilidade intuitiva para dar a você o
              controle total do seu ecossistema corporativo.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center text-center space-y-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <Rocket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold">Inovação Constante</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Estamos sempre à frente, buscando as melhores soluções
              tecnológicas para otimizar seus processos e maximizar seus
              resultados.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center text-center space-y-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold">Segurança Total</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Seus dados são o nosso maior ativo. Utilizamos criptografia de
              ponta e infraestrutura robusta para garantir conformidade e
              proteção absoluta.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center text-center space-y-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold">Agilidade e Foco</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Menos burocracia, mais resultados. Nosso sistema foi desenhado
              meticulosamente para ser rápido, eficiente e adaptável à sua
              rotina diária.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-primary/5 rounded-3xl p-10 md:p-16 text-center border border-primary/20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Pronto para transformar sua empresa?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
            Faça parte do ecossistema de empresas que já revolucionaram sua
            gestão financeira e fiscal com a nossa plataforma tecnológica.
          </p>
          <Button
            size="lg"
            className="rounded-full px-10 py-6 text-lg font-medium shadow-xl hover:shadow-primary/25 transition-all"
            asChild
          >
            <Link to="https://planettaweb.com.br">
              {' '}
              target="_blank" rel="noopener noreferrer" Conheça mais a nossa
              empresa.
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
