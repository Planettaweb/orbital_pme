import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Calculator,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'
import { useCsvImport } from '@/hooks/use-csv-import'

export default function ApuracaoFiscal() {
  const [taxes, setTaxes] = useState<any[]>([])
  const { toast } = useToast()

  const fetchTaxes = async () => {
    const { data } = await supabase
      .from('fiscal_taxes')
      .select('*')
      .order('due_date', { ascending: true })
    if (data) setTaxes(data)
  }

  useEffect(() => {
    fetchTaxes()
  }, [])

  const { fileInputRef, handleFileUpload, triggerImport } = useCsvImport(
    'fiscal_taxes',
    (values, tenantId) => {
      if (!values[0] || !values[2]) return null
      return {
        tenant_id: tenantId,
        name: values[0]?.trim(),
        amount: parseFloat(values[1]?.trim() || '0'),
        due_date: values[2]?.trim(),
        status: values[3]?.trim() || 'pending',
      }
    },
    fetchTaxes,
  )

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('fiscal_taxes').delete().eq('id', id)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Imposto excluído.' })
      fetchTaxes()
    }
  }

  const totalPending = taxes
    .filter((t) => t.status !== 'paid')
    .reduce((acc, t) => acc + Number(t.amount), 0)
  const totalPaid = taxes
    .filter((t) => t.status === 'paid')
    .reduce((acc, t) => acc + Number(t.amount), 0)
  const nextTax = taxes
    .filter((t) => t.status !== 'paid')
    .sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    )[0]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Apuração de Impostos
          </h1>
          <p className="text-muted-foreground">
            Gerencie tributos e importe dados via CSV.
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
          <Calculator className="w-4 h-4 mr-2" />
          Importar Impostos (CSV)
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Impostos Pendentes</span>
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold">
            R${' '}
            {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Impostos Pagos</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-telemetry-blue text-white rounded-xl p-6 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/90">
              Próximo Vencimento
            </span>
            <Calendar className="w-4 h-4 text-white/80" />
          </div>
          <div>
            <div className="text-lg font-bold truncate">
              {nextTax?.name || 'Nenhum pendente'}
            </div>
            <div className="text-sm text-white/80">
              {nextTax ? format(new Date(nextTax.due_date), 'dd/MM/yyyy') : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20">
          <h3 className="font-semibold">Guias e Tributos</h3>
        </div>
        <div className="divide-y">
          {taxes.map((tax) => (
            <div
              key={tax.id}
              className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tax.status === 'paid' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : tax.status === 'late' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'}`}
                >
                  {tax.status === 'paid' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : tax.status === 'late' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{tax.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Vencimento: {format(new Date(tax.due_date), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <div className="text-right mr-4">
                  <div className="font-bold">
                    R${' '}
                    {Number(tax.amount).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tax.status === 'paid' && (
                      <span className="text-green-600">Pago</span>
                    )}
                    {tax.status === 'pending' && (
                      <span className="text-yellow-600">Pendente</span>
                    )}
                    {tax.status === 'late' && (
                      <span className="text-red-600 font-medium">
                        Em Atraso
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    disabled={tax.status === 'paid'}
                  >
                    {tax.status === 'paid' ? 'Comprovante' : 'Gerar Guia'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tax.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {taxes.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum imposto cadastrado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
