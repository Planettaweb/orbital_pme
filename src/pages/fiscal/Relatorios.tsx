import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { TrendingDown, Target, FileUp, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFileImport } from '@/hooks/use-file-import'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function RelatoriosFiscais() {
  const [stats, setStats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingStat, setEditingStat] = useState<any>(null)
  const { toast } = useToast()

  const fetchStats = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from('fiscal_monthly_stats')
      .select('*')
      .order('month_year', { ascending: true })
    if (data) setStats(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const { fileInputRef, handleFileUpload, triggerImport, isImporting } =
    useFileImport(
      'fiscal_monthly_stats',
      (values, tenantId) =>
        values[0]
          ? {
              tenant_id: tenantId,
              month_year: values[0].trim(),
              revenue: parseFloat(values[1]?.trim() || '0'),
              tax: parseFloat(values[2]?.trim() || '0'),
            }
          : null,
      (node, tenantId) =>
        node.querySelector('month_year')?.textContent
          ? {
              tenant_id: tenantId,
              month_year: node.querySelector('month_year')!.textContent!,
              revenue: parseFloat(
                node.querySelector('revenue')?.textContent || '0',
              ),
              tax: parseFloat(node.querySelector('tax')?.textContent || '0'),
            }
          : null,
      'stat',
      fetchStats,
      'tenant_id,month_year',
    )

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('fiscal_monthly_stats')
      .delete()
      .eq('id', id)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Registro excluído.' })
      fetchStats()
    }
  }

  const handleUpdate = async () => {
    if (!editingStat) return
    const { error } = await supabase
      .from('fiscal_monthly_stats')
      .update({
        month_year: editingStat.month_year,
        revenue: editingStat.revenue,
        tax: editingStat.tax,
      })
      .eq('id', editingStat.id)
    if (!error) {
      toast({ title: 'Sucesso', description: 'Registro atualizado.' })
      setEditingStat(null)
      fetchStats()
    }
  }

  const maxRev = Math.max(...stats.map((m) => Number(m.revenue)), 1)
  const totalTax = stats.reduce((acc, m) => acc + Number(m.tax), 0)
  const totalRev = stats.reduce((acc, m) => acc + Number(m.revenue), 0)
  const effRate =
    totalRev > 0 ? ((totalTax / totalRev) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Relatórios Fiscais</h1>
          <p className="text-muted-foreground">
            Análise de carga tributária e importação de XML/CSV.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".csv,.xml"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button
            className="bg-telemetry-blue hover:bg-telemetry-blue/90"
            onClick={triggerImport}
            disabled={isImporting}
          >
            <FileUp className="w-4 h-4 mr-2" />{' '}
            {isImporting ? 'Importando...' : 'Importar (XML/CSV)'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">
            Carga Tributária Efetiva
          </div>
          <div className="text-3xl font-bold flex items-center gap-2">
            {effRate}% <TrendingDown className="w-5 h-5 text-green-500" />
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">
            Impostos Acumulados
          </div>
          <div className="text-3xl font-bold">
            R$ {totalTax.toLocaleString('pt-BR')}
          </div>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">
            Risco de Desenquadramento
          </div>
          <div className="text-3xl font-bold text-green-500 flex items-center gap-2">
            Baixo <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="flex justify-between mb-8">
          <div>
            <h3 className="font-semibold text-lg">Evolução Mensal</h3>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-telemetry-blue" />
              Faturamento
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              Impostos
            </div>
          </div>
        </div>
        <div className="h-64 flex items-end justify-between gap-2 overflow-x-auto min-w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Carregando...
            </div>
          ) : stats.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Sem dados importados.
            </div>
          ) : (
            stats.map((month) => (
              <div
                key={month.id}
                className="flex-1 flex flex-col items-center gap-2 relative group min-w-[60px]"
              >
                <div className="w-full flex justify-center items-end h-[200px] gap-1">
                  <div
                    className="w-full max-w-[40px] rounded-t-sm bg-telemetry-blue"
                    style={{
                      height: `${(Number(month.revenue) / maxRev) * 100}%`,
                    }}
                  />
                  <div
                    className="w-full max-w-[40px] rounded-t-sm bg-red-500"
                    style={{ height: `${(Number(month.tax) / maxRev) * 100}%` }}
                  />
                </div>
                <div className="text-xs">{month.month_year}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20 font-semibold">
          Registros (CRUD)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
              <tr>
                <th className="px-6 py-4">Mês/Ano</th>
                <th className="px-6 py-4">Faturamento</th>
                <th className="px-6 py-4">Impostos</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.map((stat) => (
                <tr key={stat.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">{stat.month_year}</td>
                  <td className="px-6 py-4">
                    R$ {Number(stat.revenue).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    R$ {Number(stat.tax).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingStat(stat)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(stat.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={!!editingStat}
        onOpenChange={(o) => !o && setEditingStat(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Registro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Mês/Ano</Label>
              <Input
                value={editingStat?.month_year || ''}
                onChange={(e) =>
                  setEditingStat({ ...editingStat, month_year: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Faturamento</Label>
              <Input
                type="number"
                value={editingStat?.revenue || ''}
                onChange={(e) =>
                  setEditingStat({ ...editingStat, revenue: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Impostos</Label>
              <Input
                type="number"
                value={editingStat?.tax || ''}
                onChange={(e) =>
                  setEditingStat({ ...editingStat, tax: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
