'use client'

import React from "react"

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Banknote, Truck, MapPin, Check, Shield } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface OrderPageProps {
  params: Promise<{ id: string }>
}

export default function OrderPage({ params }: OrderPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { script, t, getBookById, isAuthenticated, user, createOrder } = useApp()
  
  const book = getBookById(id)
  
  const [deliveryChoice, setDeliveryChoice] = useState<'post' | 'personal'>('post')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  
  const shippingFee = deliveryChoice === 'post' ? 350 : 0
  const platformFee = book ? Math.round(book.price * 0.1) : 0
  const total = book ? book.price + shippingFee : 0

  if (!isAuthenticated) {
    router.push('/prijava')
    return null
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-serif text-2xl font-bold mb-4">
          {script === 'latin' ? 'Knjiga nije pronađena' : 'Књига није пронађена'}
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {script === 'latin' ? 'Nazad' : 'Назад'}
        </Button>
      </div>
    )
  }

  if (success && orderId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-4">
            {script === 'latin' ? 'Narudžbina uspešna!' : 'Наруџбина успешна!'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {book.isDonation 
              ? (script === 'latin' 
                  ? 'Vaš zahtev za besplatnu knjigu je poslat prodavcu.'
                  : 'Ваш захтев за бесплатну књигу је послат продавцу.')
              : (script === 'latin' 
                  ? 'Vaša narudžbina je primljena. Novac će biti zadržan u escrow-u do isporuke.'
                  : 'Ваша наруџбина је примљена. Новац ће бити задржан у escrow-у до испоруке.')}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push('/narudzbine')}>
              {t('orders')}
            </Button>
            <Button onClick={() => router.push('/')}>
              {t('home')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const order = createOrder(book.id)
    if (order) {
      setOrderId(order.id)
      setSuccess(true)
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {script === 'latin' ? 'Nazad' : 'Назад'}
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
          {book.isDonation 
            ? (script === 'latin' ? 'Zatraži knjigu' : 'Затражи књигу')
            : (script === 'latin' ? 'Naruči knjigu' : 'Наручи књигу')}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery options */}
              {book.deliveryOption !== 'personal' && (
                <Card className="border-wood-light/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      {t('delivery')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={deliveryChoice} onValueChange={(v) => setDeliveryChoice(v as 'post' | 'personal')}>
                      {book.deliveryOption !== 'personal' && (
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-wood-light/20 hover:bg-muted/50">
                          <RadioGroupItem value="post" id="post" />
                          <Label htmlFor="post" className="flex-1 cursor-pointer">
                            <span className="font-medium">{t('post')}</span>
                            <span className="text-muted-foreground ml-2">+350 RSD</span>
                          </Label>
                        </div>
                      )}
                      {book.deliveryOption !== 'post' && (
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-wood-light/20 hover:bg-muted/50">
                          <RadioGroupItem value="personal" id="personal" />
                          <Label htmlFor="personal" className="flex-1 cursor-pointer">
                            <span className="font-medium">{t('personal')}</span>
                            <span className="text-muted-foreground ml-2">
                              {script === 'latin' ? 'Besplatno' : 'Бесплатно'}
                            </span>
                          </Label>
                        </div>
                      )}
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}
              
              {/* Shipping address */}
              {deliveryChoice === 'post' && (
                <Card className="border-wood-light/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {script === 'latin' ? 'Adresa za dostavu' : 'Адреса за доставу'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        {script === 'latin' ? 'Puna adresa' : 'Пуна адреса'} *
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={script === 'latin' ? 'Ulica, broj, grad, poštanski broj' : 'Улица, број, град, поштански број'}
                        required
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {script === 'latin' ? 'Broj telefona' : 'Број телефона'} *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+381 6X XXX XXXX"
                        required
                        className="bg-muted/50"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Payment method info */}
              {!book.isDonation && (
                <Card className="border-wood-light/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {book.paymentMethod === 'card' ? (
                        <CreditCard className="h-5 w-5" />
                      ) : (
                        <Banknote className="h-5 w-5" />
                      )}
                      {t('payment')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-muted/50 border border-wood-light/20">
                      <p className="font-medium">
                        {book.paymentMethod === 'card' ? t('card') : t('cash')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {book.paymentMethod === 'card' 
                          ? (script === 'latin' 
                              ? 'Plaćanje karticom putem sigurnog procesora.'
                              : 'Плаћање картицом путем сигурног процесора.')
                          : (script === 'latin'
                              ? 'Plaćanje pri preuzimanju pošiljke.'
                              : 'Плаћање при преузимању пошиљке.')}
                      </p>
                    </div>
                    
                    {book.paymentMethod === 'card' && (
                      <Alert className="mt-4 border-primary/30 bg-primary/5">
                        <Shield className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-sm">
                          {script === 'latin' 
                            ? 'Novac će biti zadržan u escrow-u dok ne potvrdite prijem knjige. Imate 48h za prijavu problema.'
                            : 'Новац ће бити задржан у escrow-у док не потврдите пријем књиге. Имате 48ч за пријаву проблема.'}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading 
                  ? (script === 'latin' ? 'Obrada...' : 'Обрада...') 
                  : book.isDonation
                    ? (script === 'latin' ? 'Pošalji zahtev' : 'Пошаљи захтев')
                    : (script === 'latin' ? `Plati ${total.toLocaleString()} RSD` : `Плати ${total.toLocaleString()} RSD`)}
              </Button>
            </form>
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-wood-light/30">
              <CardHeader>
                <CardTitle>
                  {script === 'latin' ? 'Pregled narudžbine' : 'Преглед наруџбине'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Book info */}
                <div className="flex gap-3">
                  <div className="w-16 h-20 bg-gradient-to-br from-wood-light/20 to-parchment rounded flex items-center justify-center shrink-0">
                    <div className="w-10 h-14 bg-wood/80 rounded-sm" />
                  </div>
                  <div>
                    <h3 className="font-medium line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('price')}</span>
                    <span>{book.isDonation ? t('free') : `${book.price.toLocaleString()} RSD`}</span>
                  </div>
                  {!book.isDonation && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('delivery')}</span>
                        <span>{shippingFee === 0 ? t('free') : `${shippingFee} RSD`}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {script === 'latin' ? 'Provizija platforme' : 'Провизија платформе'}
                        </span>
                        <span className="text-muted-foreground">{platformFee} RSD</span>
                      </div>
                    </>
                  )}
                </div>
                
                <Separator />
                
                {/* Total */}
                <div className="flex justify-between font-semibold text-lg">
                  <span>{script === 'latin' ? 'Ukupno' : 'Укупно'}</span>
                  <span className="text-primary">
                    {book.isDonation ? t('free') : `${total.toLocaleString()} RSD`}
                  </span>
                </div>
                
                {/* Seller info */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">
                    {script === 'latin' ? 'Prodavac' : 'Продавац'}
                  </p>
                  <p className="text-sm font-medium">{book.seller.name}</p>
                  <p className="text-xs text-muted-foreground">{book.city}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
