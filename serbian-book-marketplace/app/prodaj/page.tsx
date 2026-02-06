'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Gift, Check } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { categories, cities } from '@/lib/mock-data'
import type { BookCondition, DeliveryOption, PaymentMethod } from '@/lib/types'

export default function SellPage() {
  const router = useRouter()
  const { script, t, isAuthenticated, user, addBook } = useApp()
  
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [condition, setCondition] = useState<BookCondition | ''>('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [isDonation, setIsDonation] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption | ''>('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('')
  const [city, setCity] = useState(user?.city || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const conditions: { value: BookCondition; label: string; labelCyrillic: string }[] = [
    { value: 'novo', label: 'Novo', labelCyrillic: 'Ново' },
    { value: 'kao-novo', label: 'Kao novo', labelCyrillic: 'Као ново' },
    { value: 'odlicno', label: 'Odlično', labelCyrillic: 'Одлично' },
    { value: 'dobro', label: 'Dobro', labelCyrillic: 'Добро' },
    { value: 'prihvatljivo', label: 'Prihvatljivo', labelCyrillic: 'Прихватљиво' },
  ]

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-4">
          {script === 'latin' ? 'Morate biti prijavljeni' : 'Морате бити пријављени'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {script === 'latin' 
            ? 'Prijavite se da biste mogli da postavite oglas.'
            : 'Пријавите се да бисте могли да поставите оглас.'}
        </p>
        <Button onClick={() => router.push('/prijava')}>
          {t('login')}
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-4">
            {script === 'latin' ? 'Oglas je postavljen!' : 'Оглас је постављен!'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {script === 'latin' 
              ? 'Vaša knjiga je sada vidljiva svim korisnicima.'
              : 'Ваша књига је сада видљива свим корисницима.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push('/moji-oglasi')}>
              {t('myListings')}
            </Button>
            <Button onClick={() => { setSuccess(false); setTitle(''); setAuthor(''); setDescription(''); setCondition(''); setCategory(''); setPrice(''); setIsDonation(false); }}>
              {script === 'latin' ? 'Postavi novi' : 'Постави нови'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!condition || !deliveryOption || !paymentMethod || !category) return
    
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const selectedCategory = categories.find(c => c.id === category)
    
    addBook({
      title,
      author,
      description: description || undefined,
      condition,
      price: isDonation ? 0 : parseInt(price),
      isDonation,
      deliveryOption,
      paymentMethod,
      city,
      images: [],
      sellerId: user!.id,
      category: selectedCategory?.name || 'Ostalo',
    })
    
    setLoading(false)
    setSuccess(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            {script === 'latin' ? 'Postavi oglas' : 'Постави оглас'}
          </h1>
          <p className="text-muted-foreground">
            {script === 'latin' 
              ? 'Prodaj ili pokloni svoju knjigu zajednici'
              : 'Продај или поклони своју књигу заједници'}
          </p>
        </div>
        
        <Card className="border-wood-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {script === 'latin' ? 'Informacije o knjizi' : 'Информације о књизи'}
            </CardTitle>
            <CardDescription>
              {script === 'latin' 
                ? 'Unesite podatke o knjizi koju želite da prodate ili poklonite.'
                : 'Унесите податке о књизи коју желите да продате или поклоните.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{t('title')} *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={script === 'latin' ? 'Naziv knjige' : 'Назив књиге'}
                  required
                  className="bg-muted/50"
                />
              </div>
              
              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author">{t('author')} *</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={script === 'latin' ? 'Ime autora' : 'Име аутора'}
                  required
                  className="bg-muted/50"
                />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={script === 'latin' ? 'Opišite stanje knjige, izdanje, itd.' : 'Опишите стање књиге, издање, итд.'}
                  className="bg-muted/50 min-h-[100px]"
                />
              </div>
              
              {/* Category & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('category')} *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder={script === 'latin' ? 'Izaberite' : 'Изаберите'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {script === 'latin' ? c.name : c.nameCyrillic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{t('condition')} *</Label>
                  <Select value={condition} onValueChange={(v) => setCondition(v as BookCondition)} required>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder={script === 'latin' ? 'Izaberite' : 'Изаберите'} />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {script === 'latin' ? c.label : c.labelCyrillic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Donation toggle */}
              <Card className={`border-2 transition-colors ${isDonation ? 'border-accent bg-accent/5' : 'border-wood-light/20'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gift className={`h-5 w-5 ${isDonation ? 'text-accent' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="font-medium">
                          {script === 'latin' ? 'Pokloni ovu knjigu' : 'Поклони ову књигу'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {script === 'latin' 
                            ? 'Knjiga će biti besplatna za preuzimanje'
                            : 'Књига ће бити бесплатна за преузимање'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isDonation}
                      onCheckedChange={setIsDonation}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Price (if not donation) */}
              {!isDonation && (
                <div className="space-y-2">
                  <Label htmlFor="price">{t('price')} (RSD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    required={!isDonation}
                    className="bg-muted/50"
                  />
                </div>
              )}
              
              {/* Delivery & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('delivery')} *</Label>
                  <Select value={deliveryOption} onValueChange={(v) => setDeliveryOption(v as DeliveryOption)} required>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder={script === 'latin' ? 'Izaberite' : 'Изаберите'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">{script === 'latin' ? 'Pošta' : 'Пошта'}</SelectItem>
                      <SelectItem value="personal">{script === 'latin' ? 'Lično preuzimanje' : 'Лично преузимање'}</SelectItem>
                      <SelectItem value="both">{script === 'latin' ? 'Oba načina' : 'Оба начина'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{t('payment')} *</Label>
                  <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)} required>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder={script === 'latin' ? 'Izaberite' : 'Изаберите'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">{script === 'latin' ? 'Kartica' : 'Картица'}</SelectItem>
                      <SelectItem value="cash">{script === 'latin' ? 'Pouzeće' : 'Поузеће'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* City */}
              <div className="space-y-2">
                <Label>{t('city')} *</Label>
                <Select value={city} onValueChange={setCity} required>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder={script === 'latin' ? 'Izaberite grad' : 'Изаберите град'} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading 
                  ? (script === 'latin' ? 'Postavljanje...' : 'Постављање...') 
                  : (script === 'latin' ? 'Postavi oglas' : 'Постави оглас')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
