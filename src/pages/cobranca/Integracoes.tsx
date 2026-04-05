import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useTenant } from '@/hooks/use-tenant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Key, Webhook, Copy, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Integracoes() {
  const { activeTenant } = useTenant()
  const [keys, setKeys] = useState<any[]>([])
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('api')

  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false)

  const [keyName, setKeyName] = useState('')
  const [webhookData, setWebhookData] = useState({ url: '', secret: '' })
  const [newKeyGenerated, setNewKeyGenerated] = useState<string | null>(null)

  const fetchData = async () => {
    if (!activeTenant) return
    const [k, w] = await Promise.all([
      supabase.from('api_keys').select('*').eq('tenant_id', activeTenant),
      supabase.from('webhooks').select('*').eq('tenant_id', activeTenant),
    ])
    if (k.data) setKeys(k.data)
    if (w.data) setWebhooks(w.data)
  }

  useEffect(() => {
    fetchData()
  }, [activeTenant])

  const generateApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTenant) return
    const rawKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const prefix = rawKey.substring(0, 8)
    const { error } = await supabase.from('api_keys').insert([
      {
        tenant_id: activeTenant,
        name: keyName,
        key_prefix: prefix,
        key_hash: 'hash_' + rawKey,
      },
    ])

    if (error) toast.error('Erro ao gerar chave')
    else {
      setNewKeyGenerated(rawKey)
      toast.success('Chave gerada! Copie-a agora.')
      fetchData()
    }
  }

  const saveWebhook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTenant) return
    const { error } = await supabase.from('webhooks').insert([
      {
        tenant_id: activeTenant,
        url: webhookData.url,
        secret:
          webhookData.secret ||
          `whsec_${Math.random().toString(36).substring(2, 15)}`,
        events: ['invoice.created', 'payment.received'],
      },
    ])

    if (error) toast.error('Erro ao salvar Webhook')
    else {
      toast.success('Webhook configurado com sucesso!')
      setIsWebhookModalOpen(false)
      setWebhookData({ url: '', secret: '' })
      fetchData()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado para a área de transferência!')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrações API</h1>
          <p className="text-muted-foreground text-sm">
            Conecte seus sistemas externos via API ou Webhooks.
          </p>
        </div>
      </div>

      <div className="flex border-b">
        <button
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'api' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('api')}
        >
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4" /> API Keys
          </div>
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'webhooks' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('webhooks')}
        >
          <div className="flex items-center gap-2">
            <Webhook className="w-4 h-4" /> Webhooks
          </div>
        </button>
      </div>

      {activeTab === 'api' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setIsKeyModalOpen(true)
                setNewKeyGenerated(null)
                setKeyName('')
              }}
            >
              Gerar Nova Chave
            </Button>
          </div>
          <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
                <tr>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Prefixo</th>
                  <th className="px-6 py-3">Criada em</th>
                  <th className="px-6 py-3">Último Uso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {keys.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      Nenhuma chave de API gerada.
                    </td>
                  </tr>
                ) : (
                  keys.map((k) => (
                    <tr
                      key={k.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{k.name}</td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {k.key_prefix}...
                      </td>
                      <td className="px-6 py-4">
                        {new Date(k.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {k.last_used_at
                          ? new Date(k.last_used_at).toLocaleDateString()
                          : 'Nunca'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-end">
            <Button onClick={() => setIsWebhookModalOpen(true)}>
              Novo Webhook
            </Button>
          </div>
          <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
                <tr>
                  <th className="px-6 py-3">URL do Endpoint</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Eventos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {webhooks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      Nenhum webhook configurado.
                    </td>
                  </tr>
                ) : (
                  webhooks.map((w) => (
                    <tr
                      key={w.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium font-mono text-xs text-primary">
                        {w.url}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${w.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}
                        >
                          {w.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {w.events?.length || 0} eventos inscritos
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        title="Gerar API Key"
      >
        {!newKeyGenerated ? (
          <form onSubmit={generateApiKey} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Chave</label>
              <Input
                required
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Ex: Produção ERP"
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsKeyModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Gerar Chave</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 p-5 rounded-lg flex flex-col items-center justify-center text-center space-y-2 border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                Chave Gerada com Sucesso!
              </p>
              <p className="text-xs text-muted-foreground">
                Copie esta chave agora. Por segurança, não a exibiremos
                novamente.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                readOnly
                value={newKeyGenerated}
                className="font-mono text-xs h-10"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(newKeyGenerated)}
                className="h-10 w-10 shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => setIsKeyModalOpen(false)}
            >
              Concluir
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        title="Configurar Webhook"
      >
        <form onSubmit={saveWebhook} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">URL do Endpoint</label>
            <Input
              required
              type="url"
              value={webhookData.url}
              onChange={(e) =>
                setWebhookData({ ...webhookData, url: e.target.value })
              }
              placeholder="https://seu-sistema.com/webhooks/cobranca"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Secret (Opcional)</label>
            <Input
              value={webhookData.secret}
              onChange={(e) =>
                setWebhookData({ ...webhookData, secret: e.target.value })
              }
              placeholder="Deixe em branco para auto-gerar"
            />
            <p className="text-[10px] text-muted-foreground">
              Usado para assinar os payloads, garantindo autenticidade.
            </p>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsWebhookModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar Webhook</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
