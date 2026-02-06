'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  BookOpen, 
  ShoppingBag, 
  MessageCircle, 
  Heart, 
  Wallet, 
  Star, 
  Settings,
  MapPin,
  Calendar,
  BadgeCheck,
  Package,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookCard } from '@/components/book-card'

export default function DashboardPage() {
  const router = useRouter()
  const { 
    user, 
    isAuthenticated, 
    t, 
    script,
    books,
    wishlist,
    orders,
    getUserOrders,
    getSellerOrders,
    conversations,
    logout
  } = useApp()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/prijava')
    }
  }, [isAuthenticated, router])

  if (!user) return null

  const userBooks = books.filter(b => b.sellerId === user.id)
  const userOrders = getUserOrders(user.id)
  const sellerOrders = getSellerOrders(user.id)
  const wishlistBooks = books.filter(b => wishlist.includes(b.id))
  const unreadMessages = conversations.filter(c => 
    c.lastMessage && !c.lastMessage.read && c.lastMessage.senderId !== user.id
  ).length
  
  const pendingOrders = userOrders.filter(o => o.status === 'pending' || o.status === 'paid')
  const activeSellerOrders = sellerOrders.filter(o => o.status === 'paid' || o.status === 'shipped')

  const stats = [
    { 
      label: script === 'latin' ? 'Moji oglasi' : 'Моји огласи', 
      value: userBooks.length, 
      icon: BookOpen,
      href: '/moji-oglasi',
      color: 'text-primary'
    },
    { 
      label: script === 'latin' ? 'Porudžbine' : 'Поруџбине', 
      value: userOrders.length, 
      icon: ShoppingBag,
      href: '/narudzbine',
      color: 'text-accent'
    },
    { 
      label: script === 'latin' ? 'Lista želja' : 'Листа жеља', 
      value: wishlistBooks.length, 
      icon: Heart,
      href: '/lista-zelja',
      color: 'text-destructive'
    },
    { 
      label: script === 'latin' ? 'Poruke' : 'Поруке', 
      value: conversations.length, 
      icon: MessageCircle,
      href: '/poruke',
      color: 'text-blue-500',
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
  ]

  const quickActions = [
    { 
      label: script === 'latin' ? 'Prodaj knjigu' : 'Продај књигу', 
      href: '/prodaj', 
      icon: BookOpen,
      description: script === 'latin' ? 'Postavi novi oglas' : 'Постави нови оглас'
    },
    { 
      label: script === 'latin' ? 'Pretraži knjige' : 'Претражи књиге', 
      href: '/pretraga', 
      icon: TrendingUp,
      description: script === 'latin' ? 'Pronađi novu knjigu' : 'Пронађи нову књигу'
    },
    { 
      label: script === 'latin' ? 'Novčanik' : 'Новчаник', 
      href: '/novcanik', 
      icon: Wallet,
      description: script === 'latin' ? 'Upravljaj sredstvima' : 'Управљај средствима'
    },
    { 
      label: script === 'latin' ? 'Prodavac panel' : 'Продавац панел', 
      href: '/prodavac', 
      icon: Package,
      description: script === 'latin' ? 'Upravljaj prodajom' : 'Управљај продајом'
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-wood/10 to-transparent border-wood-light/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-serif">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-serif font-bold text-foreground">{user.name}</h1>
                  {user.isVerified && (
                    <Badge variant="secondary" className="gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      {script === 'latin' ? 'Verifikovan' : 'Верификован'}
                    </Badge>
                  )}
                  {user.isBusiness && (
                    <Badge className="bg-accent text-accent-foreground">
                      {script === 'latin' ? 'Biznis' : 'Бизнис'}
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground">{user.email}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.city}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {script === 'latin' ? 'Član od' : 'Члан од'} {user.createdAt.toLocaleDateString('sr-RS')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-candle" />
                    4.8 ({script === 'latin' ? '23 ocene' : '23 оцене'})
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link href="/podesavanja">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Settings className="h-4 w-4" />
                    {script === 'latin' ? 'Podešavanja' : 'Подешавања'}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout} className="gap-2 text-destructive hover:text-destructive bg-transparent">
                  {t('logout')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.href} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-wood-light/30 hover:border-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    {stat.badge && (
                      <Badge className="bg-destructive text-destructive-foreground">
                        {stat.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Alerts / Pending Actions */}
        {(pendingOrders.length > 0 || activeSellerOrders.length > 0) && (
          <Card className="border-candle/30 bg-candle/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-candle" />
                {script === 'latin' ? 'Zahteva pažnju' : 'Захтева пажњу'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingOrders.length > 0 && (
                <Link href="/narudzbine" className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-accent" />
                    <span>
                      {script === 'latin' 
                        ? `${pendingOrders.length} porudžbin${pendingOrders.length === 1 ? 'a' : 'e'} na čekanju`
                        : `${pendingOrders.length} поруџбин${pendingOrders.length === 1 ? 'а' : 'е'} на чекању`
                      }
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              )}
              {activeSellerOrders.length > 0 && (
                <Link href="/prodavac" className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <span>
                      {script === 'latin' 
                        ? `${activeSellerOrders.length} knjig${activeSellerOrders.length === 1 ? 'a' : 'e'} za slanje`
                        : `${activeSellerOrders.length} књиг${activeSellerOrders.length === 1 ? 'а' : 'е'} за слање`
                      }
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-serif font-semibold mb-4">
            {script === 'latin' ? 'Brze akcije' : 'Брзе акције'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full border-wood-light/30">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <action.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <Separator className="bg-wood-light/20" />

        {/* Wishlist Preview */}
        {wishlistBooks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-semibold flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
                {script === 'latin' ? 'Lista želja' : 'Листа жеља'}
              </h2>
              <Link href="/lista-zelja">
                <Button variant="ghost" size="sm" className="gap-1">
                  {script === 'latin' ? 'Vidi sve' : 'Види све'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {wishlistBooks.slice(0, 6).map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* My Listings Preview */}
        {userBooks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {script === 'latin' ? 'Moji oglasi' : 'Моји огласи'}
              </h2>
              <Link href="/moji-oglasi">
                <Button variant="ghost" size="sm" className="gap-1">
                  {script === 'latin' ? 'Vidi sve' : 'Види све'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userBooks.slice(0, 6).map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Wallet Summary */}
        <Card className="border-wood-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-accent" />
              {script === 'latin' ? 'Novčanik' : 'Новчаник'}
            </CardTitle>
            <CardDescription>
              {script === 'latin' ? 'Vaše trenutno stanje' : 'Ваше тренутно стање'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {(user.walletBalance || 0).toLocaleString()} RSD
                </p>
                <p className="text-sm text-muted-foreground">
                  {script === 'latin' ? 'Dostupno za isplatu' : 'Доступно за исплату'}
                </p>
              </div>
              <Link href="/novcanik">
                <Button className="bg-primary hover:bg-primary/90">
                  {script === 'latin' ? 'Upravljaj' : 'Управљај'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
