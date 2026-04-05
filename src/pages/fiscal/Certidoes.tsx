import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Shield,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useCsvImport } from '@/hooks/use-csv-import'
import { format } from 'date-fns'

export default function CertidoesFiscais() {
  const [certificates, setCertificates] = useState<any[]>([])
  const { toast } = useToast()

  const fetchCerts = async () => {
    const { data } = await supabase
      .from('fiscal_certificates')
      .select('*')
      .order('expires_at', { ascending: true })
    if (data) setCertificates(data)
  }

  useEffect(() => {
    fetchCerts()
  }, [])

  const { fileInputRef, handleFileUpload, triggerImport } = useCsvImport(
    'fiscal_certificates',
    (values, tenantId) => {
      if (!values[0] || !values[2]) return null
      return {
        tenant_id: tenantId,
        name: values[0]?.trim(),
        status: values[1]?.trim() || 'valid',
        expires_at: values[2]?.trim(),
        source: values[3]?.trim() || '-',
      }
    },
    fetchCerts,
  )

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('fiscal_certificates')
      .delete()
      .eq('id', id)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Certidão excluída.' })
      fetchCerts()
    }
  }

  const validCount = certificates.filter((c) => c.status === 'valid').length
  const warningCount = certificates.filter((c) => c.status === 'warning').length
  const expiredCount = certificates.filter((c) => c.status === 'expired').length

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certidões (CND)</h1>
          <p className="text-muted-foreground">
            Monitoramento automatizado da regularidade fiscal.
          </p>
        </div>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <Button
          className="bg-telemetry-blue hover:bg-telemetry-blue/90 text-white"
          onClick={triggerImport}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Importar CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 dark:bg-green-900/30 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xl">{validCount}</div>
          </div>
          <div className="text-sm text-muted-foreground">Certidões Válidas</div>
        </div>
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="font-semibold text-xl">{warningCount}</div>
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
            <div className="font-semibold text-xl">{expiredCount}</div>
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
              className={`absolute top-0 left-0 w-1 h-full ${cert.status === 'valid' ? 'bg-green-500' : cert.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 pl-2">
              <div>
                <h3 className="font-semibold leading-tight mb-1">
                  {cert.name}
                </h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  {cert.source}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {cert.status === 'valid' && (
                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                    Regular
                  </span>
                )}
                {cert.status === 'warning' && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                    Vence em Breve
                  </span>
                )}
                {cert.status === 'expired' && (
                  <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                    Vencida
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(cert.id)}
                  className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mt-6 pl-2">
              <div className="text-muted-foreground">
                Vencimento:{' '}
                <span
                  className={`font-medium ${cert.status === 'expired' ? 'text-red-500' : 'text-foreground'}`}
                >
                  {format(new Date(cert.expires_at), 'dd/MM/yyyy')}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-telemetry-blue hover:text-telemetry-blue group-hover:bg-telemetry-blue/10"
              >
                Ver <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
