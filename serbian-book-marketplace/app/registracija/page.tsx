'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, BookOpen, Mail } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Candle } from '@/components/candle'
import { cities } from '@/lib/mock-data'

export default function RegisterPage() {
  const router = useRouter()
  const { script, t, register } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [city, setCity] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError(script === 'latin' ? 'Lozinke se ne poklapaju' : 'Лозинке се не поклапају')
      return
    }
    
    if (password.length < 6) {
      setError(script === 'latin' ? 'Lozinka mora imati najmanje 6 karaktera' : 'Лозинка мора имати најмање 6 карактера')
      return
    }
    
    setLoading(true)
    
    try {
      const success = await register(email, password, name, city)
      if (success) {
        setSuccess(true)
        setTimeout(() => router.push('/'), 2000)
      }
    } catch {
      setError(script === 'latin' ? 'Došlo je do greške' : 'Дошло је до грешке')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-wood-light/30 shadow-lg">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-accent/20">
                <Mail className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h2 className="font-serif text-xl font-semibold mb-2">
              {script === 'latin' ? 'Registracija uspešna!' : 'Регистрација успешна!'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {script === 'latin' 
                ? 'U pravoj aplikaciji, primili biste email za verifikaciju. Preusmeravamo vas na početnu stranicu...' 
                : 'У правој апликацији, примили бисте имејл за верификацију. Преусмеравамо вас на почетну страницу...'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Decorative candle */}
        <div className="flex justify-center mb-6">
          <Candle size="md" />
        </div>
        
        <Card className="border-wood-light/30 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="font-serif text-2xl">{t('register')}</CardTitle>
            <CardDescription>
              {script === 'latin' 
                ? 'Napravite nalog i počnite sa kupovinom' 
                : 'Направите налог и почните са куповином'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {script === 'latin' ? 'Ime i prezime' : 'Име и презиме'}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={script === 'latin' ? 'Vaše ime' : 'Ваше име'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-muted/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vas@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">{t('city')}</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-muted/50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-muted/50"
                />
              </div>
              
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading 
                  ? (script === 'latin' ? 'Registracija...' : 'Регистрација...') 
                  : t('register')}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{t('hasAccount')}</span>{' '}
              <Link href="/prijava" className="text-primary hover:underline font-medium">
                {t('login')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
