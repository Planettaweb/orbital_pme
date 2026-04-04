import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Send, ShieldCheck } from 'lucide-react'

export default function Contact() {
  const [isHuman, setIsHuman] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isHuman) {
      toast.error('Por favor, confirme que você é humano.')
      return
    }

    setIsLoading(true)
    // Mock API call
    setTimeout(() => {
      toast.success(
        'Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.',
      )
      setIsLoading(false)
      ;(e.target as HTMLFormElement).reset()
      setIsHuman(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-white mb-4">
            Contato Corporativo
          </h1>
          <p className="text-muted-text">
            Tem dúvidas sobre implantação, planos ou recursos? Envie-nos uma
            mensagem e nossos consultores especializados responderão
            rapidamente.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-mono text-muted-text uppercase"
              >
                Nome Completo
              </Label>
              <Input
                id="name"
                required
                className="bg-black/50 border-white/10 text-white rounded-none h-12"
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="company"
                className="text-xs font-mono text-muted-text uppercase"
              >
                Empresa
              </Label>
              <Input
                id="company"
                required
                className="bg-black/50 border-white/10 text-white rounded-none h-12"
                placeholder="Sua empresa"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-mono text-muted-text uppercase"
            >
              E-mail Corporativo
            </Label>
            <Input
              id="email"
              type="email"
              required
              className="bg-black/50 border-white/10 text-white rounded-none h-12"
              placeholder="nome@empresa.com.br"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="message"
              className="text-xs font-mono text-muted-text uppercase"
            >
              Mensagem
            </Label>
            <textarea
              id="message"
              required
              rows={4}
              className="w-full bg-black/50 border border-white/10 text-white rounded-none p-3 text-sm focus:outline-none focus:ring-1 focus:ring-horizon-gold/50 transition-shadow resize-none"
              placeholder="Como podemos ajudar sua operação?"
            />
          </div>

          {/* Mock Captcha */}
          <div className="bg-black/30 border border-white/5 p-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsHuman(!isHuman)}
              className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${isHuman ? 'bg-horizon-gold border-horizon-gold' : 'border-white/20 bg-black/50 hover:border-white/50'}`}
            >
              {isHuman && <ShieldCheck className="w-4 h-4 text-void" />}
            </button>
            <span className="text-sm font-mono text-muted-text">
              Confirmo que sou um humano (Proteção Anti-Spam)
            </span>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-white text-black hover:bg-gray-200 transition-colors font-mono tracking-widest uppercase rounded-none"
          >
            {isLoading ? (
              'ENVIANDO TRANSMISSÃO...'
            ) : (
              <span className="flex items-center gap-2">
                ENVIAR MENSAGEM <Send className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
