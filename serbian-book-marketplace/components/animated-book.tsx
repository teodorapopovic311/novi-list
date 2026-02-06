'use client'

import { cn } from '@/lib/utils'

interface AnimatedBookProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AnimatedBook({ size = 'md', className }: AnimatedBookProps) {
  const sizes = {
    sm: {
      container: 'w-12 h-10',
      coverWidth: 24,
      coverHeight: 40,
      spineWidth: 4,
      pageWidth: 22,
      pageHeight: 38,
    },
    md: {
      container: 'w-24 h-20',
      coverWidth: 48,
      coverHeight: 80,
      spineWidth: 8,
      pageWidth: 44,
      pageHeight: 76,
    },
    lg: {
      container: 'w-48 h-40',
      coverWidth: 96,
      coverHeight: 160,
      spineWidth: 14,
      pageWidth: 88,
      pageHeight: 152,
    },
  }

  const s = sizes[size]
  const textLines = size === 'sm' ? 5 : size === 'md' ? 10 : 18

  return (
    <div className={cn('relative', className)} style={{ perspective: '1000px' }}>
      {/* Book container - open book view */}
      <div 
        className="relative"
        style={{ 
          width: s.coverWidth * 2 + s.spineWidth,
          height: s.coverHeight,
          transformStyle: 'preserve-3d',
          transform: 'rotateX(5deg)',
        }}
      >
        {/* Back cover (left side, lying flat) */}
        <div 
          className="absolute rounded-l-sm bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700"
          style={{
            width: s.coverWidth,
            height: s.coverHeight,
            left: 0,
            boxShadow: '-2px 4px 8px rgba(0,0,0,0.4)',
            zIndex: 1,
          }}
        >
          {/* Back cover decoration */}
          <div 
            className="absolute border border-amber-600/30 rounded-sm"
            style={{ inset: size === 'sm' ? 2 : size === 'md' ? 4 : 8 }}
          />
        </div>

        {/* Spine (center) */}
        <div 
          className="absolute bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950"
          style={{
            width: s.spineWidth,
            height: s.coverHeight,
            left: s.coverWidth,
            boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)',
            zIndex: 5,
          }}
        />

        {/* Static pages (right side - the stack) */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`static-${i}`}
            className="absolute bg-amber-50 rounded-r-sm"
            style={{
              width: s.pageWidth,
              height: s.pageHeight - i * 1,
              left: s.coverWidth + s.spineWidth + 2,
              top: (s.coverHeight - s.pageHeight) / 2 + i * 0.5,
              boxShadow: 'inset -1px 0 2px rgba(139, 90, 43, 0.15)',
              zIndex: 2 + i,
            }}
          />
        ))}

        {/* Flipping pages - origin at the spine (left edge of page) */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`flip-${i}`}
            className="absolute"
            style={{
              width: s.pageWidth,
              height: s.pageHeight,
              left: s.coverWidth + s.spineWidth + 2,
              top: (s.coverHeight - s.pageHeight) / 2,
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center',
              animation: `flipPage 4s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
              zIndex: 15 - i,
            }}
          >
            {/* Front of page */}
            <div 
              className="absolute inset-0 rounded-r-sm bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50"
              style={{
                backfaceVisibility: 'hidden',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {/* Text lines */}
              <div style={{ padding: size === 'sm' ? 3 : size === 'md' ? 6 : 12 }}>
                {[...Array(textLines)].map((_, j) => (
                  <div
                    key={j}
                    className="bg-amber-900/15 rounded-full"
                    style={{ 
                      height: size === 'sm' ? 1 : 2,
                      width: `${50 + Math.sin(j * 1.5) * 30 + 15}%`,
                      marginBottom: size === 'sm' ? 2 : size === 'md' ? 4 : 6,
                      marginLeft: j % 4 === 0 ? '10%' : 0,
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Back of page */}
            <div 
              className="absolute inset-0 rounded-l-sm bg-gradient-to-l from-amber-100 via-orange-50 to-amber-50"
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                boxShadow: '-2px 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {/* Text lines on back */}
              <div style={{ padding: size === 'sm' ? 3 : size === 'md' ? 6 : 12 }}>
                {[...Array(textLines)].map((_, j) => (
                  <div
                    key={j}
                    className="bg-amber-900/12 rounded-full"
                    style={{ 
                      height: size === 'sm' ? 1 : 2,
                      width: `${45 + Math.cos(j * 2) * 35 + 15}%`,
                      marginBottom: size === 'sm' ? 2 : size === 'md' ? 4 : 6,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Front cover (right side, slightly raised) */}
        <div 
          className="absolute rounded-r-sm bg-gradient-to-l from-amber-800 via-amber-700 to-amber-800"
          style={{
            width: s.coverWidth,
            height: s.coverHeight,
            left: s.coverWidth + s.spineWidth,
            transformOrigin: 'left center',
            transform: 'rotateY(-15deg)',
            boxShadow: '4px 4px 12px rgba(0,0,0,0.35)',
            zIndex: 20,
          }}
        >
          {/* Front cover decoration */}
          <div 
            className="absolute border border-amber-500/40 rounded-sm"
            style={{ inset: size === 'sm' ? 2 : size === 'md' ? 4 : 8 }}
          >
            <div 
              className="absolute border border-amber-400/25 rounded-sm"
              style={{ inset: size === 'sm' ? 1 : size === 'md' ? 2 : 4 }}
            />
            {/* Title area */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 bg-amber-400/20 rounded-sm"
              style={{
                width: '60%',
                height: '15%',
                top: '20%',
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Warm glow effect */}
      <div 
        className="absolute inset-0 -z-10 blur-2xl opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, hsl(35, 90%, 60%) 0%, transparent 70%)',
          transform: 'scale(1.8) translateY(10%)',
        }}
      />
      
      <style jsx>{`
        @keyframes flipPage {
          0%, 45% {
            transform: rotateY(0deg);
          }
          50%, 95% {
            transform: rotateY(-180deg);
          }
          100% {
            transform: rotateY(-180deg);
          }
        }
      `}</style>
    </div>
  )
}
