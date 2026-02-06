'use client'

import React from "react"

import Link from 'next/link'
import { Heart, MapPin, BadgeCheck, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/context'
import type { Book } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BookCardProps {
  book: Book
  className?: string
}

export function BookCard({ book, className }: BookCardProps) {
  const { t, script, isAuthenticated, isInWishlist, addToWishlist, removeFromWishlist } = useApp()
  const inWishlist = isInWishlist(book.id)

  const conditionLabels = {
    'novo': script === 'latin' ? 'Novo' : 'Ново',
    'kao-novo': script === 'latin' ? 'Kao novo' : 'Као ново',
    'odlicno': script === 'latin' ? 'Odlično' : 'Одлично',
    'dobro': script === 'latin' ? 'Dobro' : 'Добро',
    'prihvatljivo': script === 'latin' ? 'Prihvatljivo' : 'Прихватљиво',
  }

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) return
    if (inWishlist) {
      removeFromWishlist(book.id)
    } else {
      addToWishlist(book.id)
    }
  }

  return (
    <Link href={`/knjiga/${book.id}`}>
      <Card className={cn(
        'group overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:shadow-wood/10 hover:-translate-y-1',
        'bg-card border-wood-light/30',
        className
      )}>
        {/* Book cover image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-wood-light/20 to-parchment">
          {/* Placeholder book spine effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-3/4 h-5/6 bg-gradient-to-r from-wood/80 via-wood to-wood/90 rounded-sm shadow-lg">
              {/* Spine lines */}
              <div className="absolute inset-x-0 top-4 h-0.5 bg-candle/30" />
              <div className="absolute inset-x-0 bottom-4 h-0.5 bg-candle/30" />
              
              {/* Title on spine */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                <span className="text-xs font-serif text-parchment text-center line-clamp-3 [writing-mode:vertical-rl] rotate-180">
                  {book.title}
                </span>
              </div>
            </div>
          </div>
          
          {/* Donation badge */}
          {book.isDonation && (
            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground border-0">
              {script === 'latin' ? 'Na dar' : 'На дар'}
            </Badge>
          )}
          
          {/* Wishlist button - always visible when authenticated */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-2 right-2 rounded-full h-8 w-8',
                'bg-background/90 backdrop-blur-sm shadow-sm',
                'hover:bg-background hover:scale-110 transition-all',
                inWishlist && 'bg-destructive/10'
              )}
              onClick={handleWishlistClick}
            >
              <Heart 
                className={cn(
                  'h-4 w-4 transition-colors',
                  inWishlist ? 'fill-destructive text-destructive' : 'text-muted-foreground hover:text-destructive'
                )} 
              />
            </Button>
          )}
        </div>
        
        <CardContent className="p-4 space-y-2">
          {/* Title & Author */}
          <div>
            <h3 className="font-serif font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {book.author}
            </p>
          </div>
          
          {/* Price & Condition */}
          <div className="flex items-center justify-between">
            <span className={cn(
              'font-semibold',
              book.isDonation ? 'text-accent' : 'text-primary'
            )}>
              {book.isDonation ? t('free') : `${book.price.toLocaleString()} RSD`}
            </span>
            <Badge variant="secondary" className="text-xs">
              {conditionLabels[book.condition]}
            </Badge>
          </div>
          
          {/* Seller & Location */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
            <div className="flex items-center gap-1">
              {book.seller.isBusiness ? (
                <Store className="h-3 w-3 text-accent" />
              ) : book.seller.isVerified ? (
                <BadgeCheck className="h-3 w-3 text-primary" />
              ) : null}
              <span className="line-clamp-1">{book.seller.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{book.city}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
