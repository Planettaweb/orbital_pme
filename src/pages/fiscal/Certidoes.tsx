import {
  Shield,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CertidoesFiscais() {
  const certificates = [
    {
      id: 1,
      name: 'Certidão Negativa Federal (Receita/PGFN)',
      status: 'valid',
      expiresAt: '2026-09-15',
      source: 'Receita Federal',
    },
    {
      id: 2,
      name: 'Certidão Negativa Estadual (Sefaz)',
      status: 'warning',
      expiresAt: '2026-04-10',
      source: 'Sefaz SP',
    },
    {
      id: 3,
      name: 'Certidão Negativa Municipal',
      status: 'expired',
      expiresAt: '2026-03-31',
      source: 'Prefeitura',
    },
    {
      id: 4,
      name: 'Certidão de Regularidade do FGTS (CRF)',
      status: 'valid',
      expiresAt: '2026-08-20',
      source: 'Caixa Econômica',
    },
    {
      id: 5,
      name: 'Certidão Negativa Trabalhista (CNDT)',
      status: 'valid',
      expiresAt: '2026-07-11',
      source: 'TST',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certidões (CND)</h1>
          <p className="text-muted-foreground">
            Monitoramento automatizado da regularidade fiscal da sua empresa.
          </p>
        </div>
        <Button className="bg-telemetry-blue hover:bg-telemetry-blue/90 text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar Todas
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 dark:bg-green-900/30 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xl">3</div>
          </div>
          <div className="text-sm text-muted-foreground">Certidões Válidas</div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xl">1</div>
          </div>
          <div className="text-sm text-muted-foreground">
            Perto do Vencimento
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 text-red-600 dark:bg-red-900/30 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xl">1</div>
          </div>
          <div className="text-sm text-muted-foreground">
            Certidões Vencidas
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="text-sm font-medium mb-1 text-red-500">
            Atenção Necessária
          </div>
          <div className="text-xs text-muted-foreground">
            A empresa pode ser impedida de participar de licitações.
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-card border rounded-xl p-5 shadow-sm hover:border-telemetry-blue/50 transition-colors group relative overflow-hidden"
          >
            <div
              className={`absolute top-0 left-0 w-1 h-full ${
                cert.status === 'valid'
                  ? 'bg-green-500'
                  : cert.status === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="font-semibold leading-tight mb-1">
                  {cert.name}
                </h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  {cert.source}
                </span>
              </div>
              {cert.status === 'valid' && (
                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                  Regular
                </span>
              )}
              {cert.status === 'warning' && (
                <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                  Vence em Breve
                </span>
              )}
              {cert.status === 'expired' && (
                <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                  Irregular / Vencida
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm mt-6">
              <div className="text-muted-foreground">
                Vencimento:{' '}
                <span
                  className={`font-medium ${cert.status === 'expired' ? 'text-red-500' : 'text-foreground'}`}
                >
                  {cert.expiresAt.split('-').reverse().join('/')}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-telemetry-blue hover:text-telemetry-blue group-hover:bg-telemetry-blue/10"
              >
                Ver Certidão <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
