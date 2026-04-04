export default function Terms() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif text-white mb-8 border-b border-white/10 pb-4">
          Termos de Uso e Licenciamento
        </h1>

        <div className="space-y-8 text-muted-text leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-mono text-white tracking-widest uppercase">
              1. Visão Geral
            </h2>
            <p>
              Estes termos governam o uso da plataforma Orbital PME. Ao acessar
              ou utilizar nosso sistema, você concorda com estas condições. A
              plataforma é fornecida no modelo Software as a Service (SaaS),
              garantindo isolamento lógico de dados entre diferentes clientes
              (multitenancy).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-mono text-white tracking-widest uppercase">
              2. Degustação e Trial
            </h2>
            <p>
              Oferecemos um período de testes gratuito ("Degustação") para que a
              empresa cliente possa validar as funcionalidades. Durante este
              período:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-starlight">
              <li>
                O acesso pode ser revogado a qualquer momento após o fim do
                prazo estipulado.
              </li>
              <li>
                Limites de processamento e armazenamento de arquivos podem ser
                aplicados.
              </li>
              <li>
                Não garantimos backup de longo prazo para contas em período de
                teste que não forem convertidas.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-mono text-white tracking-widest uppercase">
              3. Licenciamento Modular
            </h2>
            <p>
              A versão comercial da Orbital PME é contratada de forma modular.
              Você pode escolher assinar um ou mais módulos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-starlight">
              <li>
                <strong>Cobrança Viva:</strong> Faturamento baseado no volume de
                clientes ou títulos gerenciados.
              </li>
              <li>
                <strong>FiscalPulse PME:</strong> Faturamento baseado no volume
                de documentos fiscais processados mensalmente.
              </li>
              <li>
                <strong>Contrato Vivo:</strong> Faturamento baseado no número de
                contratos ativos armazenados.
              </li>
            </ul>
            <p>
              A contratação da licença garante suporte técnico, alta
              disponibilidade e atualizações contínuas de segurança e
              performance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-mono text-white tracking-widest uppercase">
              4. Segurança e Privacidade (Multitenancy)
            </h2>
            <p>
              A Orbital PME adota a estratégia de banco único com isolamento
              lógico (tenant_id) na camada de aplicação. Garantimos que:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-starlight">
              <li>Nenhum cliente (tenant) terá acesso aos dados de outro.</li>
              <li>
                Todas as interações são auditadas por registros rigorosos do
                sistema.
              </li>
              <li>
                Os dados trafegam de forma criptografada em nossa
                infraestrutura.
              </li>
            </ul>
          </section>

          <div className="pt-8 border-t border-white/10 mt-12">
            <p className="text-sm font-mono">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
