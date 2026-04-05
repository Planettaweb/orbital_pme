import { useState, useEffect, useRef } from 'react'
import { X, Upload, Trash2, Download, FileIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Contract,
  ContractAttachment,
  createContract,
  updateContract,
  getContractAttachments,
  uploadContractAttachment,
  deleteContractAttachment,
  downloadContractAttachment,
  getTenantLimits,
} from '@/services/contracts'

interface ContractModalProps {
  isOpen: boolean
  onClose: () => void
  contract: Contract | null
  tenantId: string
  onSuccess: () => void
}

export function ContractModal({
  isOpen,
  onClose,
  contract,
  tenantId,
  onSuccess,
}: ContractModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  // Form state
  const [title, setTitle] = useState('')
  const [partyName, setPartyName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('active')
  const [value, setValue] = useState('')

  // Attachments state
  const [attachments, setAttachments] = useState<ContractAttachment[]>([])
  const [loadingAttachments, setLoadingAttachments] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [limits, setLimits] = useState({ maxFiles: 5, maxSizeMb: 10 })

  useEffect(() => {
    if (isOpen) {
      if (contract) {
        setTitle(contract.title)
        setPartyName(contract.party_name)
        setStartDate(contract.start_date)
        setEndDate(contract.end_date)
        setStatus(contract.status)
        setValue(contract.value?.toString() || '')
        setActiveTab('details')
        loadAttachments(contract.id)
      } else {
        resetForm()
      }
      loadLimits()
    }
  }, [isOpen, contract])

  const resetForm = () => {
    setTitle('')
    setPartyName('')
    setStartDate('')
    setEndDate('')
    setStatus('active')
    setValue('')
    setAttachments([])
    setActiveTab('details')
  }

  const loadLimits = async () => {
    try {
      const data = await getTenantLimits(tenantId)
      if (data) {
        setLimits({
          maxFiles: data.max_files_per_contract || 5,
          maxSizeMb: data.max_file_size_mb || 10,
        })
      }
    } catch (e) {}
  }

  const loadAttachments = async (contractId: string) => {
    setLoadingAttachments(true)
    try {
      const data = await getContractAttachments(contractId)
      setAttachments(data || [])
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar anexos',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoadingAttachments(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const contractData = {
        title,
        party_name: partyName,
        start_date: startDate,
        end_date: endDate,
        status,
        value: value ? parseFloat(value) : 0,
      }

      if (contract) {
        await updateContract(contract.id, contractData)
        toast({ title: 'Contrato atualizado com sucesso!' })
      } else {
        await createContract({ ...contractData, tenant_id: tenantId })
        toast({ title: 'Contrato criado com sucesso!' })
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar contrato',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !contract) return

    if (attachments.length >= limits.maxFiles) {
      toast({
        title: 'Limite atingido',
        description: `Máximo de ${limits.maxFiles} arquivos.`,
        variant: 'destructive',
      })
      return
    }

    if (file.size > limits.maxSizeMb * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: `Máximo ${limits.maxSizeMb}MB.`,
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    try {
      await uploadContractAttachment(file, contract.id, tenantId)
      toast({ title: 'Arquivo anexado com sucesso!' })
      loadAttachments(contract.id)
    } catch (error: any) {
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteAttachment = async (id: string, path: string) => {
    if (!window.confirm('Excluir este anexo?')) return
    try {
      await deleteContractAttachment(id, path)
      toast({ title: 'Anexo removido!' })
      if (contract) loadAttachments(contract.id)
    } catch (error: any) {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1115] border border-white/10 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
          <h2 className="text-lg font-semibold text-white">
            {contract ? 'Editar Contrato' : 'Novo Contrato'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {contract ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-4 pt-4 shrink-0">
              <TabsList className="w-full bg-white/5 border border-white/10">
                <TabsTrigger
                  value="details"
                  className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  Detalhes
                </TabsTrigger>
                <TabsTrigger
                  value="attachments"
                  className="flex-1 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  Anexos
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="details"
              className="flex-1 overflow-y-auto p-4 m-0"
            >
              <ContractForm
                {...{
                  title,
                  setTitle,
                  partyName,
                  setPartyName,
                  startDate,
                  setStartDate,
                  endDate,
                  setEndDate,
                  status,
                  setStatus,
                  value,
                  setValue,
                  handleSubmit,
                  onClose,
                  loading,
                  isEdit: true,
                }}
              />
            </TabsContent>

            <TabsContent
              value="attachments"
              className="flex-1 overflow-y-auto p-4 m-0 space-y-4"
            >
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-md border border-white/5">
                <div className="text-sm text-muted-foreground">
                  <span className="text-white">{attachments.length}</span> /{' '}
                  {limits.maxFiles} arquivos
                </div>
                <div>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 text-white"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      uploading || attachments.length >= limits.maxFiles
                    }
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}{' '}
                    Anexar
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {loadingAttachments ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Carregando anexos...
                  </div>
                ) : attachments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-white/10 rounded-lg">
                    Nenhum arquivo anexado.
                  </div>
                ) : (
                  attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-md group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileIcon className="w-5 h-5 text-starlight shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-medium text-white truncate">
                            {att.file_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(att.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-white"
                          onClick={() =>
                            downloadContractAttachment(
                              att.file_path,
                              att.file_name,
                            )
                          }
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() =>
                            handleDeleteAttachment(att.id, att.file_path)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-4 overflow-y-auto">
            <ContractForm
              {...{
                title,
                setTitle,
                partyName,
                setPartyName,
                startDate,
                setStartDate,
                endDate,
                setEndDate,
                status,
                setStatus,
                value,
                setValue,
                handleSubmit,
                onClose,
                loading,
                isEdit: false,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ContractForm({
  title,
  setTitle,
  partyName,
  setPartyName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  status,
  setStatus,
  value,
  setValue,
  handleSubmit,
  onClose,
  loading,
  isEdit,
}: any) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80">
          Título do Contrato
        </label>
        <Input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Prestação de Serviços"
          className="bg-black/40 border-white/10 text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white/80">
          Parte Envolvida
        </label>
        <Input
          required
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
          placeholder="Nome da empresa ou pessoa"
          className="bg-black/40 border-white/10 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">
            Data de Início
          </label>
          <Input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-black/40 border-white/10 text-white [color-scheme:dark]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">
            Vencimento
          </label>
          <Input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-black/40 border-white/10 text-white [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Status</label>
          <select
            className="flex h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus-visible:ring-1 focus-visible:ring-starlight"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active" className="bg-[#0f1115]">
              Ativo
            </option>
            <option value="pending" className="bg-[#0f1115]">
              Pendente
            </option>
            <option value="expired" className="bg-[#0f1115]">
              Expirado
            </option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">
            Valor (R$)
          </label>
          <Input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0.00"
            className="bg-black/40 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="pt-6 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-white/10 bg-transparent hover:bg-white/5 text-white"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-starlight text-black hover:bg-starlight/90 font-medium"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isEdit ? (
            'Salvar Alterações'
          ) : (
            'Criar Contrato'
          )}
        </Button>
      </div>
    </form>
  )
}
