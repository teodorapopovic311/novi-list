'use client'

import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookCard } from '@/components/book-card'

export default function WishlistPage() {
  const router = useRouter()
  const { script, t, isAuthenticated, wishlist, books } = useApp()

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-4">
          {script === 'latin' ? 'Morate biti prijavljeni' : 'Морате бити пријављени'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {script === 'latin' 
            ? 'Prijavite se da biste videli svoju listu želja.'
            : 'Пријавите се да бисте видели своју листу жеља.'}
        </p>
        <Button onClick={() => router.push('/prijava')}>
          {t('login')}
        </Button>
      </div>
    )
  }

  const wishlistBooks = books.filter(b => wishlist.includes(b.id))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-destructive/10">
          <Heart className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {t('wishlist')}
          </h1>
          <p className="text-muted-foreground">
            {script === 'latin' 
              ? `${wishlistBooks.length} ${wishlistBooks.length === 1 ? 'knjiga' : 'knjiga'} sačuvano`
              : `${wishlistBooks.length} ${wishlistBooks.length === 1 ? 'књига' : 'књига'} сачувано`}
          </p>
        </div>
      </div>

      {wishlistBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <Card className="border-wood-light/30">
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {script === 'latin' ? 'Lista želja je prazna' : 'Листа жеља је празна'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {script === 'latin' 
                ? 'Dodajte knjige u listu želja klikom na srce.'
                : 'Додајте књиге у листу жеља кликом на срце.'}
            </p>
            <Button variant="outline" onClick={() => router.push('/pretraga')}>
              {t('browse')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
