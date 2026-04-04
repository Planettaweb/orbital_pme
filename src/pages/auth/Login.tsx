import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { ShieldAlert, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp, session } = useAuth()
  const navigate = useNavigate()

  if (session) {
    navigate('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
        toast.success('Acesso liberado. Bem-vindo ao Painel.')
        navigate('/')
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        toast.success(
          'Cadastro realizado. Verifique seu e-mail para confirmar.',
        )
      }
    } catch (error: any) {
      toast.error(error.message || 'Falha na autenticação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-12 px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl z-10 relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-horizon-gold/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-horizon-gold/50" />

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full border border-horizon-gold/50 flex items-center justify-center bg-horizon-gold/10">
              <ShieldAlert className="w-6 h-6 text-horizon-gold" />
            </div>
          </div>
          <h1 className="text-2xl font-serif text-white tracking-tight">
            {isLogin ? 'Autenticação Restrita' : 'Solicitar Acesso'}
          </h1>
          <p className="text-sm font-mono text-muted-text mt-2 uppercase tracking-widest">
            {isLogin ? 'Acesso ao Painel Executivo' : 'Novo Tenant'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-mono text-muted-text uppercase"
            >
              Identificação (E-mail)
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
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-mono text-muted-text uppercase"
            >
              Chave de Segurança (Senha)
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border-white/10 text-white font-mono h-12 focus-visible:ring-horizon-gold/50 rounded-none"
              placeholder="••••••••"
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
            ) : isLogin ? (
              'Entrar no Sistema'
            ) : (
              'Registrar Tenant'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-mono text-muted-text hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
          >
            {isLogin
              ? 'Primeiro acesso? Cadastre-se aqui.'
              : 'Já possui acesso? Faça login.'}
          </button>
        </div>
      </div>
    </div>
  )
}
