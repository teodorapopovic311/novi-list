'use client'

import { cn } from '@/lib/utils'

interface CandleProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Candle({ size = 'md', className }: CandleProps) {
  const sizes = {
    sm: { candle: 'w-3 h-10', flame: 'w-2 h-4', wick: 'w-0.5 h-2' },
    md: { candle: 'w-5 h-16', flame: 'w-3 h-6', wick: 'w-0.5 h-2' },
    lg: { candle: 'w-7 h-24', flame: 'w-4 h-8', wick: 'w-1 h-3' },
  }

  const s = sizes[size]

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {/* Glow effect */}
      <div 
        className={cn(
          'absolute rounded-full bg-candle-glow/30 blur-xl animate-glow',
          size === 'sm' && 'w-12 h-12 -top-4',
          size === 'md' && 'w-20 h-20 -top-6',
          size === 'lg' && 'w-28 h-28 -top-8'
        )} 
      />
      
      {/* Flame */}
      <div className="relative">
        <div 
          className={cn(
            s.flame,
            'bg-gradient-to-t from-candle via-orange-400 to-yellow-200',
            'rounded-full rounded-t-[50%] animate-flicker',
            'shadow-[0_0_10px_hsl(var(--candle-glow)),0_0_20px_hsl(var(--candle-glow)/0.5)]'
          )}
          style={{
            clipPath: 'polygon(50% 0%, 20% 100%, 80% 100%)',
          }}
        />
        {/* Inner flame */}
        <div 
          className={cn(
            'absolute bottom-0 left-1/2 -translate-x-1/2',
            'bg-gradient-to-t from-orange-300 to-yellow-100',
            'rounded-full animate-flicker',
            size === 'sm' && 'w-1 h-2',
            size === 'md' && 'w-1.5 h-3',
            size === 'lg' && 'w-2 h-4'
          )}
          style={{
            clipPath: 'polygon(50% 0%, 30% 100%, 70% 100%)',
            animationDelay: '0.1s',
          }}
        />
      </div>
      
      {/* Wick */}
      <div className={cn(s.wick, 'bg-gray-800 rounded-full')} />
      
      {/* Candle body */}
      <div 
        className={cn(
          s.candle,
          'bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200',
          'rounded-t-sm rounded-b-md',
          'shadow-inner'
        )}
      >
        {/* Wax drips */}
        <div className="absolute -left-0.5 top-2 w-1.5 h-3 bg-amber-100 rounded-full opacity-80" />
        <div className="absolute -right-0.5 top-4 w-1 h-2 bg-amber-50 rounded-full opacity-70" />
      </div>
      
      {/* Candle holder */}
      <div 
        className={cn(
          'bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900',
          'rounded-sm shadow-md',
          size === 'sm' && 'w-5 h-1.5',
          size === 'md' && 'w-8 h-2',
          size === 'lg' && 'w-10 h-3'
        )}
      />
    </div>
  )
}

export function CandleGroup({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-end gap-3', className)}>
      <Candle size="sm" />
      <Candle size="md" />
      <Candle size="sm" />
    </div>
  )
}
