'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Heart,
  MessageCircle,
  MapPin,
  BadgeCheck,
  Store,
  Truck,
  CreditCard,
  Banknote,
  Calendar,
  ArrowLeft,
  ShoppingCart
} from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { BookCard } from '@/components/book-card'

interface BookPageProps {
  params: Promise<{ id: string }>
}

export default function BookPage({ params }: BookPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const {
    script,
    t,
    getBookById,
    books,
    isAuthenticated,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    startConversation,
    user
  } = useApp()

  const book = getBookById(id)

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-serif text-2xl font-bold mb-4">
          {script === 'latin' ? 'Knjiga nije pronađena' : 'Књига није пронађена'}
        </h1>
        <Link href="/pretraga">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {script === 'latin' ? 'Nazad na pretragu' : 'Назад на претрагу'}
          </Button>
        </Link>
      </div>
    )
  }

  const inWishlist = isInWishlist(book.id)
  const isOwnListing = user?.id === book.sellerId

  const conditionLabels = {
    'novo': script === 'latin' ? 'Novo' : 'Ново',
    'kao-novo': script === 'latin' ? 'Kao novo' : 'Као ново',
    'odlicno': script === 'latin' ? 'Odlično' : 'Одлично',
    'dobro': script === 'latin' ? 'Dobro' : 'Добро',
    'prihvatljivo': script === 'latin' ? 'Prihvatljivo' : 'Прихватљиво',
  }

  const deliveryLabels = {
    'post': script === 'latin' ? 'Pošta' : 'Пошта',
    'personal': script === 'latin' ? 'Lično preuzimanje' : 'Лично преузимање',
    'both': script === 'latin' ? 'Pošta ili lično' : 'Пошта или лично',
  }

  const relatedBooks = books
    .filter(b => b.id !== book.id && (b.category === book.category || b.author === book.author))
    .slice(0, 4)

  const handleContact = () => {
    if (!isAuthenticated) {
      router.push('/prijava')
      return
    }
    const conversationId = startConversation(book.sellerId, book.id)
    if (conversationId) {
      router.push(`/poruke/${conversationId}`)
    }
  }

  const handleBuy = () => {
    if (!isAuthenticated) {
      router.push('/prijava')
      return
    }
    router.push(`/naruci/${book.id}`)
  }

  const handleWishlist = () => {
    if (!isAuthenticated) {
      router.push('/prijava')
      return
    }
    if (inWishlist) {
      removeFromWishlist(book.id)
    } else {
      addToWishlist(book.id)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {script === 'latin' ? 'Nazad' : 'Назад'}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book image */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-wood-light/30">
            <div className="aspect-[3/4] bg-gradient-to-br from-wood-light/20 to-parchment flex items-center justify-center">
              <div className="relative w-3/4 h-5/6 bg-gradient-to-r from-wood/80 via-wood to-wood/90 rounded-sm shadow-xl">
                <div className="absolute inset-x-0 top-4 h-0.5 bg-candle/30" />
                <div className="absolute inset-x-0 bottom-4 h-0.5 bg-candle/30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span className="text-sm font-serif text-parchment text-center [writing-mode:vertical-rl] rotate-180">
                    {book.title}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Book details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {book.isDonation && (
                <Badge className="bg-accent text-accent-foreground">
                  {script === 'latin' ? 'Na dar' : 'На дар'}
                </Badge>
              )}
              <Badge variant="secondary">{conditionLabels[book.condition]}</Badge>
              <Badge variant="outline">{book.category}</Badge>
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              {book.title}
            </h1>
            <p className="text-lg text-muted-foreground">{book.author}</p>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            {book.isDonation ? t('free') : `${book.price.toLocaleString()} RSD`}
          </div>

          {/* Actions */}
          {!isOwnListing && (
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={handleBuy}
              >
                <ShoppingCart className="h-5 w-5" />
                {book.isDonation
                  ? (script === 'latin' ? 'Zatraži' : 'Затражи')
                  : t('buyNow')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={handleContact}
              >
                <MessageCircle className="h-5 w-5" />
                {t('contactSeller')}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="gap-2"
                onClick={handleWishlist}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-destructive text-destructive' : ''}`} />
                {inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
              </Button>
            </div>
          )}

          {isOwnListing && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm text-primary">
                  {script === 'latin' ? 'Ovo je vaš oglas' : 'Ово је ваш оглас'}
                </p>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Description */}
          {book.description && (
            <div>
              <h2 className="font-semibold mb-2">{t('description')}</h2>
              <p className="text-muted-foreground">{book.description}</p>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-wood-light/20">
              <CardContent className="p-4 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('city')}</p>
                  <p className="font-medium">{book.city}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-wood-light/20">
              <CardContent className="p-4 flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('delivery')}</p>
                  <p className="font-medium">{deliveryLabels[book.deliveryOption]}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-wood-light/20">
              <CardContent className="p-4 flex items-center gap-3">
                {book.paymentMethod === 'card' ? (
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Banknote className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="text-xs text-muted-foreground">{t('payment')}</p>
                  <p className="font-medium">{book.paymentMethod === 'card' ? t('card') : t('cash')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-wood-light/20">
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {script === 'latin' ? 'Objavljeno' : 'Објављено'}
                  </p>
                  <p className="font-medium">
                    {book.createdAt.toLocaleDateString('sr-RS')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Seller info */}
          <Card className="border-wood-light/20">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-4">
                {script === 'latin' ? 'Prodavac' : 'Продавац'}
              </h2>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {book.seller.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{book.seller.name}</span>
                    {book.seller.isBusiness && (
                      <Badge variant="secondary" className="gap-1">
                        <Store className="h-3 w-3" />
                        {t('business')}
                      </Badge>
                    )}
                    {book.seller.isVerified && !book.seller.isBusiness && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {book.seller.city}
                  </div>
                </div>
                {!isOwnListing && (
                  <Button variant="outline" onClick={handleContact}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {script === 'latin' ? 'Poruka' : 'Порука'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related books */}
      {relatedBooks.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold mb-6">
            {script === 'latin' ? 'Slične knjige' : 'Сличне књиге'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relatedBook) => (
              <BookCard key={relatedBook.id} book={relatedBook} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
