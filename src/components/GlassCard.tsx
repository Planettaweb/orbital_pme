import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'panel' | 'interactive'
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-glass glass-edge rounded-lg p-6 relative overflow-hidden transition-all duration-300',
        variant === 'interactive' &&
          'hover:bg-white/[0.05] cursor-pointer group',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
