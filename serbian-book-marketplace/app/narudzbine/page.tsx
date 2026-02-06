'use client'

import React from "react"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Package, Truck, Check, AlertTriangle, Clock } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { OrderStatus } from '@/lib/types'

export default function OrdersPage() {
  const router = useRouter()
  const { script, t, isAuthenticated, user, getUserOrders, getSellerOrders, updateOrderStatus } = useApp()

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-4">
          {script === 'latin' ? 'Morate biti prijavljeni' : 'Морате бити пријављени'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {script === 'latin' 
            ? 'Prijavite se da biste videli svoje narudžbine.'
            : 'Пријавите се да бисте видели своје наруџбине.'}
        </p>
        <Button onClick={() => router.push('/prijava')}>
          {t('login')}
        </Button>
      </div>
    )
  }

  const buyerOrders = getUserOrders(user.id)
  const sellerOrders = getSellerOrders(user.id)

  const statusConfig: Record<OrderStatus, { label: string; labelCyrillic: string; color: string; icon: React.ReactNode }> = {
    pending: { 
      label: 'Na čekanju', 
      labelCyrillic: 'На чекању', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: <Clock className="h-4 w-4" />
    },
    paid: { 
      label: 'Plaćeno', 
      labelCyrillic: 'Плаћено', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <Package className="h-4 w-4" />
    },
    shipped: { 
      label: 'Poslato', 
      labelCyrillic: 'Послато', 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: <Truck className="h-4 w-4" />
    },
    delivered: { 
      label: 'Isporučeno', 
      labelCyrillic: 'Испоручено', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: <Check className="h-4 w-4" />
    },
    disputed: { 
      label: 'Sporno', 
      labelCyrillic: 'Спорно', 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    completed: { 
      label: 'Završeno', 
      labelCyrillic: 'Завршено', 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: <Check className="h-4 w-4" />
    },
  }

  const OrderCard = ({ order, isSeller }: { order: typeof buyerOrders[0]; isSeller: boolean }) => {
    const status = statusConfig[order.status]
    const canMarkDelivered = isSeller && order.status === 'shipped'
    const canDispute = !isSeller && order.status === 'delivered' && order.disputeDeadline && new Date() < order.disputeDeadline
    const canGenerateLabel = isSeller && order.status === 'paid'

    return (
      <Card className="border-wood-light/30">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Book image */}
            <div className="w-20 h-28 bg-gradient-to-br from-wood-light/20 to-parchment rounded flex items-center justify-center shrink-0">
              <div className="w-12 h-18 bg-wood/80 rounded-sm" />
            </div>
            
            {/* Order details */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link href={`/knjiga/${order.bookId}`} className="font-medium hover:text-primary">
                    {order.book.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{order.book.author}</p>
                </div>
                <Badge variant="outline" className={status.color}>
                  <span className="flex items-center gap-1">
                    {status.icon}
                    {script === 'latin' ? status.label : status.labelCyrillic}
                  </span>
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    {isSeller 
                      ? (script === 'latin' ? 'Kupac: ' : 'Купац: ')
                      : (script === 'latin' ? 'Prodavac: ' : 'Продавац: ')}
                  </span>
                  <span>{isSeller ? order.buyer.name : order.seller.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {script === 'latin' ? 'Datum: ' : 'Датум: '}
                  </span>
                  <span>{order.createdAt.toLocaleDateString('sr-RS')}</span>
                </div>
                {order.trackingNumber && (
                  <div>
                    <span className="text-muted-foreground">
                      {script === 'latin' ? 'Praćenje: ' : 'Праћење: '}
                    </span>
                    <span className="font-mono text-xs">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-semibold text-primary">
                  {order.totalAmount.toLocaleString()} RSD
                </span>
                
                <div className="flex gap-2">
                  {canGenerateLabel && (
                    <Button 
                      size="sm" 
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                    >
                      {script === 'latin' ? 'Generiši etiketu' : 'Генериши етикету'}
                    </Button>
                  )}
                  {canMarkDelivered && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                    >
                      {script === 'latin' ? 'Označi kao isporučeno' : 'Означи као испоручено'}
                    </Button>
                  )}
                  {canDispute && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => updateOrderStatus(order.id, 'disputed')}
                    >
                      {script === 'latin' ? 'Prijavi problem' : 'Пријави проблем'}
                    </Button>
                  )}
                </div>
              </div>
              
              {canDispute && order.disputeDeadline && (
                <p className="text-xs text-muted-foreground">
                  {script === 'latin' 
                    ? `Rok za prijavu problema: ${order.disputeDeadline.toLocaleString('sr-RS')}`
                    : `Рок за пријаву проблема: ${order.disputeDeadline.toLocaleString('sr-RS')}`}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const EmptyState = ({ isSeller }: { isSeller: boolean }) => (
    <Card className="border-wood-light/30">
      <CardContent className="p-12 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">
          {isSeller 
            ? (script === 'latin' ? 'Nemate prodaja' : 'Немате продаја')
            : (script === 'latin' ? 'Nemate narudžbina' : 'Немате наруџбина')}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {isSeller
            ? (script === 'latin' 
                ? 'Kada neko kupi vašu knjigu, ovde će se pojaviti.'
                : 'Када неко купи вашу књигу, овде ће се појавити.')
            : (script === 'latin' 
                ? 'Kada naručite knjigu, ovde ćete moći da pratite status.'
                : 'Када наручите књигу, овде ћете моћи да пратите статус.')}
        </p>
        <Button variant="outline" onClick={() => router.push(isSeller ? '/prodaj' : '/pretraga')}>
          {isSeller 
            ? (script === 'latin' ? 'Postavi oglas' : 'Постави оглас')
            : t('browse')}
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-primary/10">
          <ShoppingBag className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {t('orders')}
        </h1>
      </div>

      <Tabs defaultValue="buying" className="space-y-6">
        <TabsList>
          <TabsTrigger value="buying">
            {script === 'latin' ? 'Kupujem' : 'Купујем'} ({buyerOrders.length})
          </TabsTrigger>
          <TabsTrigger value="selling">
            {script === 'latin' ? 'Prodajem' : 'Продајем'} ({sellerOrders.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="buying" className="space-y-4">
          {buyerOrders.length > 0 ? (
            buyerOrders.map(order => (
              <OrderCard key={order.id} order={order} isSeller={false} />
            ))
          ) : (
            <EmptyState isSeller={false} />
          )}
        </TabsContent>
        
        <TabsContent value="selling" className="space-y-4">
          {sellerOrders.length > 0 ? (
            sellerOrders.map(order => (
              <OrderCard key={order.id} order={order} isSeller={true} />
            ))
          ) : (
            <EmptyState isSeller={true} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
