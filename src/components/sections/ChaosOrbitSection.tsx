export function ChaosOrbitSection() {
  return (
    <section className="py-24 bg-white/[0.02] border-y border-white/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif text-white mb-8">
          Saia da Órbita do Caos
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="text-horizon-red text-4xl mb-4 font-mono">01</div>
            <h3 className="text-xl text-white mb-2">Inadimplência Elevada</h3>
            <p className="text-muted-text text-sm">
              Falta de visibilidade clara e processos manuais que dificultam o
              recebimento.
            </p>
          </div>
          <div className="p-6">
            <div className="text-horizon-red text-4xl mb-4 font-mono">02</div>
            <h3 className="text-xl text-white mb-2">Risco Fiscal</h3>
            <p className="text-muted-text text-sm">
              Inconsistências e divergências que geram multas inesperadas e
              passivos ocultos.
            </p>
          </div>
          <div className="p-6">
            <div className="text-horizon-red text-4xl mb-4 font-mono">03</div>
            <h3 className="text-xl text-white mb-2">Perda de Prazos</h3>
            <p className="text-muted-text text-sm">
              Renovações automáticas indesejadas por falta de monitoramento
              inteligente.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
