'use client'

import { Gift, Info } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BookCard } from '@/components/book-card'

export default function DonationsPage() {
  const { script, donationBooks, user, isAuthenticated } = useApp()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-accent/20">
          <Gift className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {script === 'latin' ? 'Knjige na dar' : 'Књиге на дар'}
          </h1>
          <p className="text-muted-foreground">
            {script === 'latin' 
              ? 'Besplatne knjige od naše zajednice' 
              : 'Бесплатне књиге од наше заједнице'}
          </p>
        </div>
      </div>
      
      {/* Info alerts */}
      <div className="space-y-4 mb-8">
        <Alert className="border-accent/30 bg-accent/5">
          <Info className="h-4 w-4 text-accent" />
          <AlertTitle>{script === 'latin' ? 'Mesečni limit' : 'Месечни лимит'}</AlertTitle>
          <AlertDescription>
            {script === 'latin' 
              ? 'Svaki korisnik može preuzeti do 2 besplatne knjige mesečno kako bi svi imali priliku.'
              : 'Сваки корисник може преузети до 2 бесплатне књиге месечно како би сви имали прилику.'}
          </AlertDescription>
        </Alert>
        
        {isAuthenticated && user && (
          <Alert className={user.freeBooksThisMonth >= 2 ? 'border-destructive/30 bg-destructive/5' : 'border-primary/30 bg-primary/5'}>
            <Info className={`h-4 w-4 ${user.freeBooksThisMonth >= 2 ? 'text-destructive' : 'text-primary'}`} />
            <AlertTitle>
              {script === 'latin' ? 'Vaš status' : 'Ваш статус'}
            </AlertTitle>
            <AlertDescription>
              {script === 'latin' 
                ? `Preuzeli ste ${user.freeBooksThisMonth} od 2 besplatne knjige ovog meseca.`
                : `Преузели сте ${user.freeBooksThisMonth} од 2 бесплатне књиге овог месеца.`}
              {user.freeBooksThisMonth >= 2 && (
                <span className="block mt-1 font-medium">
                  {script === 'latin' 
                    ? 'Dostigli ste mesečni limit.'
                    : 'Достигли сте месечни лимит.'}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {/* Books grid */}
      {donationBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {donationBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <Card className="border-wood-light/30">
          <CardContent className="p-12 text-center">
            <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {script === 'latin' ? 'Trenutno nema knjiga na dar' : 'Тренутно нема књига на дар'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {script === 'latin' 
                ? 'Vratite se kasnije ili poklonite svoju knjigu zajednici.'
                : 'Вратите се касније или поклоните своју књигу заједници.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
