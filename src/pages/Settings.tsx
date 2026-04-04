import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Monitor, ShieldAlert, Key } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handle2FAToggle = (checked: boolean) => {
    if (checked) {
      toast.info(
        'Configuração de 2FA iniciada. Escaneie o QR Code no seu app autenticador. (Simulação)',
      )
      setTwoFactorEnabled(true)
    } else {
      toast.success('Autenticação de Dois Fatores desativada.')
      setTwoFactorEnabled(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Preferências do sistema e segurança avançada.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>
            Escolha o tema da interface da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              className="flex-1 justify-start gap-2"
              onClick={() => setTheme('light')}
            >
              <Sun className="w-4 h-4" /> Claro
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              className="flex-1 justify-start gap-2"
              onClick={() => setTheme('dark')}
            >
              <Moon className="w-4 h-4" /> Escuro
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              className="flex-1 justify-start gap-2"
              onClick={() => setTheme('system')}
            >
              <Monitor className="w-4 h-4" /> Sistema
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Segurança Avançada (MFA/2FA)
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta seguindo os
            padrões bancários.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <Label className="text-base">Autenticação de Dois Fatores</Label>
              <p className="text-sm text-muted-foreground">
                Requerer um código do Google Authenticator ao fazer login.
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handle2FAToggle}
            />
          </div>

          {twoFactorEnabled && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-600 dark:text-amber-400">
                  2FA Ativado
                </h4>
                <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1">
                  Sua conta está protegida. Guarde seus códigos de recuperação
                  em um local seguro.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessão Atual</CardTitle>
          <CardDescription>Detalhes da sua conexão ativa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">ID do Usuário</span>
              <span className="font-mono text-xs overflow-hidden text-ellipsis ml-4">
                {user?.id}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Último Login</span>
              <span>
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString('pt-BR')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
