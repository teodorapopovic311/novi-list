'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Search, 
  Menu, 
  X, 
  BookOpen, 
  Heart, 
  MessageCircle, 
  User, 
  LogOut,
  Plus,
  Gift,
  ShoppingBag,
  Wallet,
  Package
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { AnimatedBook } from '@/components/animated-book'

export function Header() {
  const pathname = usePathname()
  const { 
    script, 
    setScript, 
    t, 
    user, 
    isAuthenticated, 
    logout, 
    searchQuery, 
    setSearchQuery,
    conversations 
  } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const unreadMessages = conversations.filter(c => 
    c.lastMessage && !c.lastMessage.read && c.lastMessage.senderId !== user?.id
  ).length

  const navLinks = [
    { href: '/', label: t('home'), icon: BookOpen },
    { href: '/pretraga', label: t('browse'), icon: Search },
    { href: '/na-dar', label: t('donate'), icon: Gift },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <AnimatedBook size="sm" />
            <span className="font-serif text-xl font-bold text-primary">
              Novi list
            </span>
          </Link>
          
          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-wood-light/30 focus-visible:ring-primary"
              />
            </div>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <Button 
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Script toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScript(script === 'latin' ? 'cyrillic' : 'latin')}
              className="font-medium text-xs px-2"
            >
              {script === 'latin' ? 'ЋИР' : 'LAT'}
            </Button>
            
            {isAuthenticated ? (
              <>
                {/* Sell button */}
                <Link href="/prodaj" className="hidden sm:block">
                  <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    {t('sell')}
                  </Button>
                </Link>
                
                {/* Messages */}
                <Link href="/poruke">
                  <Button variant="ghost" size="icon" className="relative">
                    <MessageCircle className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent">
                        {unreadMessages}
                      </Badge>
                    )}
                  </Button>
                </Link>
                
                {/* Wishlist */}
                <Link href="/lista-zelja">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                
                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profil" className="flex items-center gap-2 cursor-pointer font-medium">
                        <User className="h-4 w-4" />
                        {script === 'latin' ? 'Moj nalog' : 'Мој налог'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/lista-zelja" className="flex items-center gap-2 cursor-pointer">
                        <Heart className="h-4 w-4" />
                        {script === 'latin' ? 'Lista želja' : 'Листа жеља'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/moji-oglasi" className="flex items-center gap-2 cursor-pointer">
                        <BookOpen className="h-4 w-4" />
                        {t('myListings')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/narudzbine" className="flex items-center gap-2 cursor-pointer">
                        <ShoppingBag className="h-4 w-4" />
                        {t('orders')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/poruke" className="flex items-center gap-2 cursor-pointer">
                        <MessageCircle className="h-4 w-4" />
                        {script === 'latin' ? 'Poruke' : 'Поруке'}
                        {unreadMessages > 0 && (
                          <Badge className="ml-auto h-5 px-1.5 bg-accent text-accent-foreground text-xs">
                            {unreadMessages}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/novcanik" className="flex items-center gap-2 cursor-pointer">
                        <Wallet className="h-4 w-4" />
                        {t('wallet')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/prodavac" className="flex items-center gap-2 cursor-pointer">
                        <Package className="h-4 w-4" />
                        {script === 'latin' ? 'Prodavac panel' : 'Продавац панел'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/prijava">
                  <Button variant="ghost" size="sm">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/registracija" className="hidden sm:block">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    {t('register')}
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-wood-light/30"
            />
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button 
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
            {isAuthenticated && (
              <Link href="/prodaj" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  {t('sell')}
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
