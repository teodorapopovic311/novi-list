"use client"

import { use } from "react"
import { mockUsers, mockBooks } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookCard } from "@/components/book-card"
import { 
  MapPin, 
  Calendar, 
  Star, 
  BookOpen, 
  MessageCircle,
  User as UserIcon
} from "lucide-react"
import Link from "next/link"

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const profileUser = mockUsers.find((u) => u.id === id)
  const userBooks = mockBooks.filter((b) => b.sellerId === id && b.status === "available")

  if (!profileUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <UserIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-serif text-2xl text-foreground mb-2">Korisnik nije pronađen</h1>
        <Button asChild variant="outline" className="mt-4 bg-transparent">
          <Link href="/">Nazad na početnu</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <Card className="bg-card border-border mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileUser.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-serif">
                {profileUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h1 className="font-serif text-2xl text-foreground">{profileUser.name}</h1>
                {profileUser.isVerified && (
                  <Badge className="bg-green-100 text-green-800 w-fit">Verifikovan</Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profileUser.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Član od {new Date(profileUser.createdAt).toLocaleDateString("sr-Latn", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-candle" />
                  {profileUser.rating.toFixed(1)} ({profileUser.reviewCount} recenzija)
                </span>
              </div>

              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/poruke">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Pošalji poruku
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-secondary">
                <p className="font-serif text-2xl font-semibold text-foreground">
                  {userBooks.length}
                </p>
                <p className="text-sm text-muted-foreground">Aktivnih oglasa</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="font-serif text-2xl font-semibold text-foreground">
                  {profileUser.reviewCount}
                </p>
                <p className="text-sm text-muted-foreground">Prodaja</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User's Books */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Oglasi korisnika {profileUser.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Ovaj korisnik trenutno nema aktivnih oglasa</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
