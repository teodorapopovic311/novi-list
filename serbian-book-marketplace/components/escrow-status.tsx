"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  CreditCard, 
  Package, 
  CheckCircle, 
  Clock,
  AlertCircle
} from "lucide-react"
import type { Order } from "@/lib/types"

interface EscrowStatusProps {
  order: Order
  isSeller?: boolean
  onConfirmDelivery?: () => void
  onMarkShipped?: () => void
}

const escrowSteps = [
  { 
    id: "pending", 
    label: "Narudžbina kreirana", 
    icon: Clock,
    description: "Čeka se uplata kupca"
  },
  { 
    id: "paid", 
    label: "Plaćeno", 
    icon: CreditCard,
    description: "Novac je na escrow računu"
  },
  { 
    id: "shipped", 
    label: "Poslato", 
    icon: Package,
    description: "Prodavac je poslao paket"
  },
  { 
    id: "delivered", 
    label: "Isporučeno", 
    icon: CheckCircle,
    description: "Kupac je potvrdio prijem"
  },
]

export function EscrowStatus({ order, isSeller, onConfirmDelivery, onMarkShipped }: EscrowStatusProps) {
  const currentStepIndex = escrowSteps.findIndex(s => s.id === order.status)
  
  const getStatusBadge = () => {
    switch (order.status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Čeka uplatu</Badge>
      case "paid":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Plaćeno - čeka slanje</Badge>
      case "shipped":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Na putu</Badge>
      case "delivered":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Završeno</Badge>
      case "cancelled":
        return <Badge variant="destructive">Otkazano</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-lg text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Escrow zaštita
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            Vaš novac je siguran do potvrde prijema. Prodavac dobija isplatu tek kada potvrdite da ste primili knjigu.
          </p>
          
          {/* Progress Steps */}
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
            <div 
              className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `${(currentStepIndex / (escrowSteps.length - 1)) * 100}%` }}
            />
            
            <div className="relative flex justify-between">
              {escrowSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index <= currentStepIndex
                const isCurrent = index === currentStepIndex
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                        isCompleted 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs mt-2 text-center max-w-[80px] ${
                      isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {order.status === "shipped" && !isSeller && onConfirmDelivery && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Potvrdite prijem tek kada fizički primite i pregledate knjigu. 
                Nakon potvrde, novac se prebacuje prodavcu.
              </p>
            </div>
            <Button 
              onClick={onConfirmDelivery}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Potvrdi prijem knjige
            </Button>
          </div>
        )}

        {order.status === "paid" && isSeller && onMarkShipped && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-start gap-3 mb-4">
              <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Pošaljite knjigu kupcu i označite kao poslato. 
                Unesite broj za praćenje pošiljke ako je dostupan.
              </p>
            </div>
            <Button 
              onClick={onMarkShipped}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Package className="w-4 h-4 mr-2" />
              Označi kao poslato
            </Button>
          </div>
        )}

        {/* Escrow Amount */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Na escrow računu:</span>
            <span className="font-serif text-lg font-semibold text-foreground">
              {order.totalAmount.toLocaleString("sr-Latn")} RSD
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
