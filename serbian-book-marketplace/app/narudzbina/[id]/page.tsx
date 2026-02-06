"use client"

import { use, useState } from "react"
import { useApp } from "@/lib/context"
import { mockOrders, mockBooks, mockUsers } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { EscrowStatus } from "@/components/escrow-status"
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Phone,
  MessageCircle,
  Truck
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useApp()
  const [order, setOrder] = useState(() => mockOrders.find((o) => o.id === id))

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-serif text-2xl text-foreground mb-2">Prijavite se</h1>
        <p className="text-muted-foreground mb-6">
          Morate biti prijavljeni da biste videli narudžbine.
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/prijava">Prijavi se</Link>
        </Button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-serif text-2xl text-foreground mb-2">Narudžbina nije pronađena</h1>
        <Button asChild variant="outline" className="mt-4 bg-transparent">
          <Link href="/narudzbine">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nazad na narudžbine
          </Link>
        </Button>
      </div>
    )
  }

  const book = mockBooks.find((b) => b.id === order.bookId)
  const isSeller = order.sellerId === user.id
  const otherUser = mockUsers.find((u) => u.id === (isSeller ? order.buyerId : order.sellerId))

  const handleConfirmDelivery = () => {
    setOrder((prev) => prev ? { ...prev, status: "delivered" } : prev)
  }

  const handleMarkShipped = () => {
    setOrder((prev) => prev ? { ...prev, status: "shipped" } : prev)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button asChild variant="ghost" className="mb-6 -ml-2">
        <Link href="/narudzbine">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nazad na narudžbine
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-foreground">
          Narudžbina #{order.id.slice(-6).toUpperCase()}
        </h1>
        <Badge variant="outline" className="text-sm">
          {isSeller ? "Vi ste prodavac" : "Vi ste kupac"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Book Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-foreground">Knjiga</CardTitle>
            </CardHeader>
            <CardContent>
              {book && (
                <div className="flex gap-4">
                  <div className="relative w-20 h-28 flex-shrink-0">
                    <Image
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-foreground">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <p className="text-lg font-semibold text-primary mt-2">
                      {book.price.toLocaleString("sr-Latn")} RSD
                    </p>
                    <Link 
                      href={`/knjiga/${book.id}`}
                      className="text-sm text-primary hover:underline mt-1 inline-block"
                    >
                      Pogledaj oglas
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Other Party Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                {isSeller ? "Kupac" : "Prodavac"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {otherUser && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-serif text-lg text-primary">
                        {otherUser.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{otherUser.name}</p>
                      <p className="text-sm text-muted-foreground">{otherUser.city}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/poruke">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Pošalji poruku
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-foreground flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Dostava
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Adresa dostave</p>
                  <p className="text-foreground">{order.shippingAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="text-foreground">+381 63 123 4567</p>
                </div>
              </div>
              {order.trackingNumber && (
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Broj pošiljke</p>
                    <p className="text-foreground font-mono">{order.trackingNumber}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Escrow Status */}
          <EscrowStatus 
            order={order} 
            isSeller={isSeller}
            onConfirmDelivery={handleConfirmDelivery}
            onMarkShipped={handleMarkShipped}
          />

          {/* Order Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-foreground">Pregled narudžbine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cena knjige</span>
                <span className="text-foreground">{book?.price.toLocaleString("sr-Latn")} RSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dostava</span>
                <span className="text-foreground">{order.shippingCost.toLocaleString("sr-Latn")} RSD</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Ukupno</span>
                <span className="text-primary text-lg">{order.totalAmount.toLocaleString("sr-Latn")} RSD</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Naručeno: {new Date(order.createdAt).toLocaleDateString("sr-Latn", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
