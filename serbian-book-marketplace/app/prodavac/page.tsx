"use client"

import { useState } from "react"
import { useApp } from "@/lib/context"
import { mockOrders, mockBooks } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Package,
  TrendingUp,
  DollarSign,
  BookOpen,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SellerDashboardPage() {
  const { user } = useApp()
  const [orders, setOrders] = useState(mockOrders)
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [trackingNumber, setTrackingNumber] = useState("")

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-serif text-2xl text-foreground mb-2">Prijavite se</h1>
        <p className="text-muted-foreground mb-6">
          Morate biti prijavljeni da biste pristupili prodavačkom panelu.
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/prijava">Prijavi se</Link>
        </Button>
      </div>
    )
  }

  const sellerOrders = orders.filter((o) => o.sellerId === user.id)
  const sellerBooks = mockBooks.filter((b) => b.sellerId === user.id)
  
  const pendingShipment = sellerOrders.filter((o) => o.status === "paid")
  const shipped = sellerOrders.filter((o) => o.status === "shipped")
  const completed = sellerOrders.filter((o) => o.status === "delivered")
  
  const totalEarnings = completed.reduce((sum, o) => sum + o.totalAmount, 0)
  const pendingEarnings = [...pendingShipment, ...shipped].reduce((sum, o) => sum + o.totalAmount, 0)

  const handleMarkShipped = () => {
    if (!selectedOrderId) return
    
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrderId
          ? { ...o, status: "shipped", trackingNumber: trackingNumber || undefined }
          : o
      )
    )
    setShippingDialogOpen(false)
    setSelectedOrderId(null)
    setTrackingNumber("")
  }

  const openShippingDialog = (orderId: string) => {
    setSelectedOrderId(orderId)
    setShippingDialogOpen(true)
  }

  const getBook = (bookId: string) => mockBooks.find((b) => b.id === bookId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Prodavački panel</h1>
          <p className="text-muted-foreground mt-1">Upravljajte vašim oglasima i narudžbinama</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/prodaj">
            <BookOpen className="w-4 h-4 mr-2" />
            Novi oglas
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ukupna zarada</p>
                <p className="font-serif text-xl font-semibold text-foreground">
                  {totalEarnings.toLocaleString("sr-Latn")} RSD
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Na čekanju</p>
                <p className="font-serif text-xl font-semibold text-foreground">
                  {pendingEarnings.toLocaleString("sr-Latn")} RSD
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktivni oglasi</p>
                <p className="font-serif text-xl font-semibold text-foreground">
                  {sellerBooks.filter((b) => b.status === "available").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Za slanje</p>
                <p className="font-serif text-xl font-semibold text-foreground">
                  {pendingShipment.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="pending" className="data-[state=active]:bg-card">
            <Clock className="w-4 h-4 mr-2" />
            Za slanje ({pendingShipment.length})
          </TabsTrigger>
          <TabsTrigger value="shipped" className="data-[state=active]:bg-card">
            <Truck className="w-4 h-4 mr-2" />
            Poslato ({shipped.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-card">
            <CheckCircle className="w-4 h-4 mr-2" />
            Završeno ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingShipment.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nemate narudžbina koje čekaju slanje</p>
              </CardContent>
            </Card>
          ) : (
            pendingShipment.map((order) => {
              const book = getBook(order.bookId)
              return (
                <Card key={order.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {book && (
                        <div className="relative w-16 h-24 flex-shrink-0">
                          <Image
                            src={book.coverImage || "/placeholder.svg"}
                            alt={book.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-serif font-semibold text-foreground">{book?.title}</h3>
                            <p className="text-sm text-muted-foreground">{book?.author}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Čeka slanje
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                #{order.id.slice(-6).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <p className="font-serif text-lg font-semibold text-primary">
                            {order.totalAmount.toLocaleString("sr-Latn")} RSD
                          </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Dostava: {order.shippingAddress}
                          </p>
                          <Button
                            onClick={() => openShippingDialog(order.id)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Označi kao poslato
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="shipped" className="space-y-4">
          {shipped.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Truck className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nemate poslate narudžbine</p>
              </CardContent>
            </Card>
          ) : (
            shipped.map((order) => {
              const book = getBook(order.bookId)
              return (
                <Card key={order.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {book && (
                        <div className="relative w-16 h-24 flex-shrink-0">
                          <Image
                            src={book.coverImage || "/placeholder.svg"}
                            alt={book.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-serif font-semibold text-foreground">{book?.title}</h3>
                            <p className="text-sm text-muted-foreground">{book?.author}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                <Truck className="w-3 h-3 mr-1" />
                                Na putu
                              </Badge>
                              {order.trackingNumber && (
                                <span className="text-xs font-mono text-muted-foreground">
                                  {order.trackingNumber}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="font-serif text-lg font-semibold text-primary">
                            {order.totalAmount.toLocaleString("sr-Latn")} RSD
                          </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Čeka se potvrda kupca
                          </p>
                          <Button asChild variant="outline">
                            <Link href={`/narudzbina/${order.id}`}>
                              Detalji
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completed.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nemate završene narudžbine</p>
              </CardContent>
            </Card>
          ) : (
            completed.map((order) => {
              const book = getBook(order.bookId)
              return (
                <Card key={order.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {book && (
                        <div className="relative w-16 h-24 flex-shrink-0">
                          <Image
                            src={book.coverImage || "/placeholder.svg"}
                            alt={book.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-serif font-semibold text-foreground">{book?.title}</h3>
                            <p className="text-sm text-muted-foreground">{book?.author}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Završeno
                              </Badge>
                            </div>
                          </div>
                          <p className="font-serif text-lg font-semibold text-green-600">
                            +{order.totalAmount.toLocaleString("sr-Latn")} RSD
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Shipping Dialog */}
      <Dialog open={shippingDialogOpen} onOpenChange={setShippingDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-foreground">Označi kao poslato</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Potvrdite da ste poslali paket. Možete dodati broj za praćenje pošiljke.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tracking" className="text-foreground">
                Broj pošiljke (opciono)
              </Label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="npr. RS123456789"
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">
                Dodajte broj za praćenje da kupac može pratiti pošiljku.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShippingDialogOpen(false)}>
              Otkaži
            </Button>
            <Button 
              onClick={handleMarkShipped}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Truck className="w-4 h-4 mr-2" />
              Potvrdi slanje
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
