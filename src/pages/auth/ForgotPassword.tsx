import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      toast.success(
        'Instruções enviadas! Verifique seu e-mail para redefinir a senha.',
      )
      navigate('/login')
    } catch (error: any) {
      toast.error(
        error.message || 'Falha ao solicitar recuperação. Tente novamente.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-12 px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl z-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-horizon-gold/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-horizon-gold/50" />

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full border border-horizon-gold/50 flex items-center justify-center bg-horizon-gold/10">
              <ShieldAlert className="w-6 h-6 text-horizon-gold" />
            </div>
          </div>
          <h1 className="text-2xl font-serif text-white tracking-tight">
            Recuperação de Acesso
          </h1>
          <p className="text-sm font-mono text-muted-text mt-2 uppercase tracking-widest">
            Redefina sua credencial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-mono text-muted-text uppercase"
            >
              E-mail Registrado
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/50 border-white/10 text-white font-mono h-12 focus-visible:ring-horizon-gold/50 rounded-none"
              placeholder="operador@empresa.com.br"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-horizon-gold text-void hover:bg-white transition-all font-mono font-bold tracking-widest uppercase rounded-none"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Solicitar Redefinição'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center justify-center mx-auto gap-2 text-xs font-mono text-muted-text hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Autenticação
          </button>
        </div>
      </div>
    </div>
  )
}
