import { Shield, Lock, Server } from 'lucide-react'

export function SecuritySection() {
  return (
    <section className="py-24 bg-void">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-white mb-4">
            Segurança Enterprise
          </h2>
          <p className="text-muted-text">
            Seus dados protegidos por arquitetura de ponta.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Shield className="w-12 h-12 text-telemetry-blue mb-4" />
            <h3 className="text-white font-medium mb-2">
              Isolamento Multi-Tenant
            </h3>
            <p className="text-muted-text text-sm">
              Dados de cada empresa rigorosamente separados, garantindo total
              privacidade e controle.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Lock className="w-12 h-12 text-telemetry-blue mb-4" />
            <h3 className="text-white font-medium mb-2">
              Criptografia Avançada
            </h3>
            <p className="text-muted-text text-sm">
              Proteção máxima em trânsito e em repouso com as melhores práticas
              de mercado.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Server className="w-12 h-12 text-telemetry-blue mb-4" />
            <h3 className="text-white font-medium mb-2">
              Alta Disponibilidade
            </h3>
            <p className="text-muted-text text-sm">
              Infraestrutura redundante com uptime garantido, suportando
              operações de missão crítica.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
