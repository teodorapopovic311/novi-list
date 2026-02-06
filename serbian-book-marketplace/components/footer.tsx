'use client'

import Link from 'next/link'
import { BookOpen, Heart } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Candle } from '@/components/candle'

export function Footer() {
  const { script } = useApp()
  
  const links = {
    latin: {
      about: 'O nama',
      contact: 'Kontakt',
      terms: 'Uslovi korišćenja',
      privacy: 'Politika privatnosti',
      help: 'Pomoć',
      howItWorks: 'Kako funkcioniše',
      forBusiness: 'Za prodavnice',
      blog: 'Blog',
    },
    cyrillic: {
      about: 'О нама',
      contact: 'Контакт',
      terms: 'Услови коришћења',
      privacy: 'Политика приватности',
      help: 'Помоћ',
      howItWorks: 'Како функционише',
      forBusiness: 'За продавнице',
      blog: 'Блог',
    },
  }
  
  const t = links[script]

  return (
    <footer className="border-t border-border bg-muted/30 wood-texture">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Candle size="sm" />
              <span className="font-serif text-xl font-bold text-primary">
                Novi list
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {script === 'latin' 
                ? 'Vaše omiljeno mesto za kupovinu, prodaju i poklanjanje knjiga.' 
                : 'Ваше омиљено место за куповину, продају и поклањање књига.'}
            </p>
          </div>
          
          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              {script === 'latin' ? 'Brzi linkovi' : 'Брзи линкови'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pretraga" className="text-muted-foreground hover:text-primary transition-colors">
                  {script === 'latin' ? 'Pretraži knjige' : 'Претражи књиге'}
                </Link>
              </li>
              <li>
                <Link href="/na-dar" className="text-muted-foreground hover:text-primary transition-colors">
                  {script === 'latin' ? 'Knjige na dar' : 'Књиге на дар'}
                </Link>
              </li>
              <li>
                <Link href="/prodaj" className="text-muted-foreground hover:text-primary transition-colors">
                  {script === 'latin' ? 'Prodaj knjigu' : 'Продај књигу'}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              {script === 'latin' ? 'Podrška' : 'Подршка'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pomoc" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.help}
                </Link>
              </li>
              <li>
                <Link href="/kako-funkcionise" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.howItWorks}
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              {script === 'latin' ? 'Pravne informacije' : 'Правне информације'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/o-nama" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/uslovi" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link href="/privatnost" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {script === 'latin' 
              ? '© 2025 Novi list. Sva prava zadržana.' 
              : '© 2025 Нови лист. Сва права задржана.'}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {script === 'latin' ? 'Napravljeno sa' : 'Направљено са'}
            <Heart className="h-4 w-4 text-destructive fill-destructive" />
            {script === 'latin' ? 'za ljubitelje knjiga' : 'за љубитеље књига'}
            <BookOpen className="h-4 w-4 text-primary" />
          </p>
        </div>
      </div>
    </footer>
  )
}
