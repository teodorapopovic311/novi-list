'use client'

import { useRouter } from 'next/navigation'
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CreditCard } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function WalletPage() {
  const router = useRouter()
  const { script, t, isAuthenticated, user } = useApp()

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-4">
          {script === 'latin' ? 'Morate biti prijavljeni' : 'Морате бити пријављени'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {script === 'latin' 
            ? 'Prijavite se da biste videli svoj novčanik.'
            : 'Пријавите се да бисте видели свој новчаник.'}
        </p>
        <Button onClick={() => router.push('/prijava')}>
          {t('login')}
        </Button>
      </div>
    )
  }

  // Mock transaction history
  const transactions = [
    {
      id: '1',
      type: 'incoming' as const,
      amount: 1620,
      description: script === 'latin' ? 'Prodaja: Mali princ' : 'Продаја: Мали принц',
      date: new Date('2025-01-10'),
      status: 'completed',
    },
    {
      id: '2',
      type: 'outgoing' as const,
      amount: 180,
      description: script === 'latin' ? 'Provizija platforme' : 'Провизија платформе',
      date: new Date('2025-01-10'),
      status: 'completed',
    },
    {
      id: '3',
      type: 'pending' as const,
      amount: 2200,
      description: script === 'latin' ? 'Prodaja: Derviš i smrt (escrow)' : 'Продаја: Дервиш и смрт (escrow)',
      date: new Date('2025-01-14'),
      status: 'pending',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {t('wallet')}
          </h1>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border-wood-light/30 bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal opacity-90">
                {script === 'latin' ? 'Dostupno stanje' : 'Доступно стање'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {user.walletBalance.toLocaleString()} RSD
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="mt-4 gap-2"
              >
                <CreditCard className="h-4 w-4" />
                {script === 'latin' ? 'Isplati na račun' : 'Исплати на рачун'}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-wood-light/30 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {script === 'latin' ? 'Na čekanju (escrow)' : 'На чекању (escrow)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-muted-foreground">
                2,200 RSD
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {script === 'latin' 
                  ? 'Sredstva koja čekaju potvrdu isporuke'
                  : 'Средства која чекају потврду испоруке'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction history */}
        <Card className="border-wood-light/30">
          <CardHeader>
            <CardTitle>
              {script === 'latin' ? 'Istorija transakcija' : 'Историја трансакција'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      tx.type === 'incoming' 
                        ? 'bg-green-100 text-green-600'
                        : tx.type === 'outgoing'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {tx.type === 'incoming' ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : tx.type === 'outgoing' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.date.toLocaleDateString('sr-RS')}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    tx.type === 'incoming' 
                      ? 'text-green-600'
                      : tx.type === 'outgoing'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                  }`}>
                    {tx.type === 'outgoing' ? '-' : tx.type === 'incoming' ? '+' : ''}
                    {tx.amount.toLocaleString()} RSD
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info card */}
        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">
              {script === 'latin' ? 'Kako funkcioniše escrow?' : 'Како функционише escrow?'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {script === 'latin' 
                ? 'Kada kupac plati karticom, novac se zadržava na platformi dok se ne potvrdi isporuka. Nakon što kupac primi knjigu, ima 48 sati da prijavi problem. Ako nema problema, novac se automatski prebacuje na vaš račun (umanjeno za proviziju od 10%).'
                : 'Када купац плати картицом, новац се задржава на платформи док се не потврди испорука. Након што купац прими књигу, има 48 сати да пријави проблем. Ако нема проблема, новац се аутоматски пребацује на ваш рачун (умањено за провизију од 10%).'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
