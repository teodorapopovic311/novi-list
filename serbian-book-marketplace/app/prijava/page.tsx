'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, BookOpen } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Candle } from '@/components/candle'

export default function LoginPage() {
  const router = useRouter()
  const { script, t, login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const success = await login(email, password)
      if (success) {
        router.push('/')
      } else {
        setError(script === 'latin' ? 'Pogrešan email ili lozinka' : 'Погрешан имејл или лозинка')
      }
    } catch {
      setError(script === 'latin' ? 'Došlo je do greške' : 'Дошло је до грешке')
    } finally {
      setLoading(false)
    }
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
            <CardTitle className="font-serif text-2xl">{t('login')}</CardTitle>
            <CardDescription>
              {script === 'latin' 
                ? 'Prijavite se na svoj nalog' 
                : 'Пријавите се на свој налог'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Link href="/zaboravljena-lozinka" className="text-sm text-primary hover:underline">
                    {t('forgotPassword')}
                  </Link>
                </div>
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
              
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading 
                  ? (script === 'latin' ? 'Prijavljivanje...' : 'Пријављивање...') 
                  : t('login')}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{t('noAccount')}</span>{' '}
              <Link href="/registracija" className="text-primary hover:underline font-medium">
                {t('register')}
              </Link>
            </div>
            
            {/* Demo login hint */}
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground">
                {script === 'latin' 
                  ? 'Demo: Unesite bilo koji email za prijavu' 
                  : 'Демо: Унесите било који имејл за пријаву'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
