'use client'

import React from "react"

import Link from 'next/link'
import { ArrowRight, Gift, BookOpen, Sparkles, Rocket, Baby, Microscope, Laugh, Feather, User } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookCard } from '@/components/book-card'
import { AnimatedBook } from '@/components/animated-book'
import { Candle, CandleGroup } from '@/components/candle'
import { categories } from '@/lib/mock-data'

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Sparkles,
  Rocket,
  Baby,
  Microscope,
  Laugh,
  Feather,
  User,
}

export default function HomePage() {
  const { script, t, featuredBooks, donationBooks } = useApp()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-wood/20 via-background to-background">
        {/* Decorative candles */}
        <div className="absolute top-10 left-10 opacity-40 hidden lg:block">
          <CandleGroup />
        </div>
        <div className="absolute top-20 right-16 opacity-30 hidden lg:block">
          <Candle size="lg" />
        </div>
        
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-candle-glow/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Content */}
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
            {/* Animated Book */}
            <div className="relative">
              <div className="absolute -inset-8 bg-candle-glow/20 blur-3xl rounded-full" />
              <AnimatedBook size="lg" className="relative z-10" />
            </div>
            
            {/* Text content */}
            <div className="text-center lg:text-left space-y-6 max-w-xl">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                {t('heroTitle')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-pretty">
                {t('heroSubtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 pt-2">
                <Link href="/pretraga">
                  <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-lg px-8 text-primary-foreground">
                    <BookOpen className="h-5 w-5" />
                    {t('browse')}
                  </Button>
                </Link>
                <Link href="/na-dar">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8 border-wood-light/50 bg-transparent hover:bg-wood-light/10">
                    <Gift className="h-5 w-5" />
                    {t('donate')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-muted/30 to-transparent" />
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-muted/30 wood-texture">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            {t('categories')}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.icon] || BookOpen
              return (
                <Link key={category.id} href={`/pretraga?kategorija=${category.id}`}>
                  <Card className="h-full hover:shadow-md transition-all hover:-translate-y-1 bg-card border-wood-light/20">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {script === 'latin' ? category.name : category.nameCyrillic}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* Featured Books Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              {t('featuredBooks')}
            </h2>
            <Link href="/pretraga">
              <Button variant="ghost" className="gap-2 text-primary">
                {script === 'latin' ? 'Prikaži sve' : 'Прикажи све'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredBooks.slice(0, 8).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Donation Books Section */}
      <section className="py-16 bg-gradient-to-b from-accent/10 via-accent/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-accent/20">
                <Gift className="h-6 w-6 text-accent" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                {t('freeBooks')}
              </h2>
            </div>
            <Link href="/na-dar">
              <Button variant="ghost" className="gap-2 text-accent">
                {script === 'latin' ? 'Prikaži sve' : 'Прикажи све'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {donationBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          {/* Monthly limit info */}
          <Card className="mt-8 border-accent/30 bg-accent/5">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-2 rounded-full bg-accent/20 shrink-0">
                <Gift className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {script === 'latin' ? 'Mesečni limit' : 'Месечни лимит'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {script === 'latin' 
                    ? 'Svaki korisnik može preuzeti do 2 besplatne knjige mesečno. Ovo osigurava da svi imaju priliku da dođu do knjiga na dar.'
                    : 'Сваки корисник може преузети до 2 бесплатне књиге месечно. Ово осигурава да сви имају прилику да дођу до књига на дар.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-12 text-center">
            {script === 'latin' ? 'Kako funkcioniše?' : 'Како функционише?'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: script === 'latin' ? 'Registrujte se' : 'Региструјте се',
                description: script === 'latin' 
                  ? 'Napravite nalog za nekoliko sekundi i počnite sa kupovinom ili prodajom.'
                  : 'Направите налог за неколико секунди и почните са куповином или продајом.',
              },
              {
                step: '2',
                title: script === 'latin' ? 'Pronađite knjigu' : 'Пронађите књигу',
                description: script === 'latin'
                  ? 'Pretražite hiljade knjiga ili postavite oglas za prodaju/poklanjanje.'
                  : 'Претражите хиљаде књига или поставите оглас за продају/поклањање.',
              },
              {
                step: '3',
                title: script === 'latin' ? 'Sigurna transakcija' : 'Сигурна трансакција',
                description: script === 'latin'
                  ? 'Platite karticom ili pouzećem. Vaš novac je zaštićen do isporuke.'
                  : 'Платите картицом или поузећем. Ваш новац је заштићен до испоруке.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            {script === 'latin' ? 'Spremni da počnete?' : 'Спремни да почнете?'}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {script === 'latin'
              ? 'Pridružite se zajednici ljubitelja knjiga već danas.'
              : 'Придружите се заједници љубитеља књига већ данас.'}
          </p>
          <Link href="/registracija">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              {t('register')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
