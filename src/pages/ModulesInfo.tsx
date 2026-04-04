import { Radar, ScrollText, Cpu, CheckCircle2 } from 'lucide-react'

export default function ModulesInfo() {
  const modules = [
    {
      id: 'cobranca',
      title: 'Cobrança Viva',
      icon: Radar,
      color: 'text-horizon-gold',
      bgColor: 'bg-horizon-gold/10',
      borderColor: 'border-horizon-gold/30',
      description:
        'Acabe com a inadimplência através de réguas de cobrança automatizadas. O sistema identifica padrões de atraso e age antes que a dívida se torne um problema irreparável.',
      benefits: [
        'Automação de lembretes (antes, durante e após vencimento)',
        'Segmentação inteligente de devedores',
        'Conciliação facilitada de pagamentos e promessas',
        'Redução drástica do custo operacional de cobrança',
      ],
    },
    {
      id: 'fiscal',
      title: 'FiscalPulse PME',
      icon: Cpu,
      color: 'text-telemetry-blue',
      bgColor: 'bg-telemetry-blue/10',
      borderColor: 'border-telemetry-blue/30',
      description:
        'Seu radar contra multas e inconsistências. Monitoramento constante de notas fiscais e dados cadastrais para prevenir problemas com a Receita Federal.',
      benefits: [
        'Alertas de NF-e rejeitadas ou com divergências',
        'Prevenção contra erros de classificação tributária',
        'Histórico seguro para auditorias rápidas',
        'Integração facilitada para exportação contábil',
      ],
    },
    {
      id: 'contrato',
      title: 'Contrato Vivo',
      icon: ScrollText,
      color: 'text-starlight',
      bgColor: 'bg-starlight/10',
      borderColor: 'border-starlight/30',
      description:
        'Contratos não devem ficar esquecidos em gavetas. Transforme-os em obrigações ativas e monitoradas, garantindo que nenhum prazo ou renovação passe despercebido.',
      benefits: [
        'Alertas programáveis para vencimento e renovação',
        'Centralização de aditivos e documentos anexos',
        'Acompanhamento de obrigações financeiras atreladas',
        'Mitigação de riscos por quebra de contrato',
      ],
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white">
            Nossos Módulos
          </h1>
          <p className="text-muted-text max-w-2xl mx-auto text-lg">
            Aprenda como cada pilar da nossa plataforma funciona para garantir a
            saúde, a segurança e a previsibilidade da sua empresa.
          </p>
        </div>

        <div className="space-y-12">
          {modules.map((mod, index) => (
            <div
              key={mod.id}
              className="bg-white/5 border border-white/10 p-8 md:p-12 relative overflow-hidden group hover:border-white/20 transition-colors"
            >
              {/* Subtle background glow */}
              <div
                className={`absolute top-0 right-0 w-64 h-64 ${mod.bgColor} blur-[100px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`}
              />

              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div
                  className={`w-16 h-16 shrink-0 rounded-2xl border ${mod.borderColor} ${mod.bgColor} flex items-center justify-center`}
                >
                  <mod.icon className={`w-8 h-8 ${mod.color}`} />
                </div>

                <div className="flex-1 space-y-4">
                  <h2 className="text-3xl font-serif text-white">
                    {mod.title}
                  </h2>
                  <p className="text-muted-text text-lg leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="pt-6 grid sm:grid-cols-2 gap-4">
                    {mod.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 ${mod.color} mt-0.5`}
                        />
                        <span className="text-sm text-starlight">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
