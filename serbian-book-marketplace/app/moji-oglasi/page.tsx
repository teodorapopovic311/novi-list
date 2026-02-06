'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Plus } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookCard } from '@/components/book-card'

export default function MyListingsPage() {
  const router = useRouter()
  const { script, t, isAuthenticated, user, getBooksBySeller } = useApp()

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-4">
          {script === 'latin' ? 'Morate biti prijavljeni' : 'Морате бити пријављени'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {script === 'latin' 
            ? 'Prijavite se da biste videli svoje oglase.'
            : 'Пријавите се да бисте видели своје огласе.'}
        </p>
        <Button onClick={() => router.push('/prijava')}>
          {t('login')}
        </Button>
      </div>
    )
  }

  const myBooks = getBooksBySeller(user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {t('myListings')}
            </h1>
            <p className="text-muted-foreground">
              {script === 'latin' 
                ? `${myBooks.length} ${myBooks.length === 1 ? 'aktivan oglas' : 'aktivnih oglasa'}`
                : `${myBooks.length} ${myBooks.length === 1 ? 'активан оглас' : 'активних огласа'}`}
            </p>
          </div>
        </div>
        <Link href="/prodaj">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            {script === 'latin' ? 'Novi oglas' : 'Нови оглас'}
          </Button>
        </Link>
      </div>

      {myBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <Card className="border-wood-light/30">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {script === 'latin' ? 'Nemate aktivnih oglasa' : 'Немате активних огласа'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {script === 'latin' 
                ? 'Postavite svoj prvi oglas i počnite sa prodajom ili poklanjanjem.'
                : 'Поставите свој први оглас и почните са продајом или поклањањем.'}
            </p>
            <Link href="/prodaj">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {script === 'latin' ? 'Postavi oglas' : 'Постави оглас'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
