import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Monitor, Moon, Sun, Shield } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as preferências da sua conta e configurações do sistema.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Segurança
            </CardTitle>
            <CardDescription>
              Gerencie a segurança da sua conta e acessos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticação de Dois Fatores (2FA)</Label>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança à sua conta
                  administrativa.
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>
              Customize como o sistema é exibido no seu dispositivo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="w-full"
              >
                <Sun className="w-4 h-4 mr-2" />
                Claro
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="w-full"
              >
                <Moon className="w-4 h-4 mr-2" />
                Escuro
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className="w-full"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Sistema
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessão Atual</CardTitle>
            <CardDescription>
              Informações sobre sua conexão e credenciais ativas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-md border border-border/50">
              <div className="flex justify-between items-center py-1 border-b">
                <span className="text-muted-foreground">Login de Acesso:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">ID do Usuário:</span>
                <span className="font-medium font-mono text-xs">
                  {user?.id}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
