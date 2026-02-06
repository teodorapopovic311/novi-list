'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useApp } from '@/lib/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { BookCard } from '@/components/book-card'
import { categories, cities } from '@/lib/mock-data'
import type { BookCondition } from '@/lib/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('kategorija') || ''
  
  const { script, t, books, searchQuery, setSearchQuery } = useApp()
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedConditions, setSelectedConditions] = useState<BookCondition[]>([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showDonationsOnly, setShowDonationsOnly] = useState(false)

  const conditions: { value: BookCondition; label: string; labelCyrillic: string }[] = [
    { value: 'novo', label: 'Novo', labelCyrillic: 'Ново' },
    { value: 'kao-novo', label: 'Kao novo', labelCyrillic: 'Као ново' },
    { value: 'odlicno', label: 'Odlično', labelCyrillic: 'Одлично' },
    { value: 'dobro', label: 'Dobro', labelCyrillic: 'Добро' },
    { value: 'prihvatljivo', label: 'Prihvatljivo', labelCyrillic: 'Прихватљиво' },
  ]

  const filteredBooks = useMemo(() => {
    let result = [...books]
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(b => 
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query)
      )
    }
    
    // Category
    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory)
      if (category) {
        result = result.filter(b => b.category === category.name)
      }
    }
    
    // City
    if (selectedCity) {
      result = result.filter(b => b.city === selectedCity)
    }
    
    // Conditions
    if (selectedConditions.length > 0) {
      result = result.filter(b => selectedConditions.includes(b.condition))
    }
    
    // Price range
    if (priceMin) {
      result = result.filter(b => b.price >= parseInt(priceMin))
    }
    if (priceMax) {
      result = result.filter(b => b.price <= parseInt(priceMax))
    }
    
    // Donations only
    if (showDonationsOnly) {
      result = result.filter(b => b.isDonation)
    }
    
    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'oldest':
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
    }
    
    return result
  }, [books, searchQuery, selectedCategory, selectedCity, selectedConditions, priceMin, priceMax, sortBy, showDonationsOnly])

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedCity('')
    setSelectedConditions([])
    setPriceMin('')
    setPriceMax('')
    setShowDonationsOnly(false)
    setSearchQuery('')
  }

  const hasActiveFilters = selectedCategory || selectedCity || selectedConditions.length > 0 || priceMin || priceMax || showDonationsOnly || searchQuery

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <Label>{t('category')}</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder={script === 'latin' ? 'Sve kategorije' : 'Све категорије'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{script === 'latin' ? 'Sve kategorije' : 'Све категорије'}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {script === 'latin' ? c.name : c.nameCyrillic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* City */}
      <div className="space-y-2">
        <Label>{t('city')}</Label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder={script === 'latin' ? 'Svi gradovi' : 'Сви градови'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{script === 'latin' ? 'Svi gradovi' : 'Сви градови'}</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Condition */}
      <div className="space-y-2">
        <Label>{t('condition')}</Label>
        <div className="space-y-2">
          {conditions.map((c) => (
            <div key={c.value} className="flex items-center gap-2">
              <Checkbox
                id={c.value}
                checked={selectedConditions.includes(c.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedConditions([...selectedConditions, c.value])
                  } else {
                    setSelectedConditions(selectedConditions.filter(v => v !== c.value))
                  }
                }}
              />
              <label htmlFor={c.value} className="text-sm cursor-pointer">
                {script === 'latin' ? c.label : c.labelCyrillic}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price range */}
      <div className="space-y-2">
        <Label>{t('price')} (RSD)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="bg-muted/50"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="bg-muted/50"
          />
        </div>
      </div>
      
      {/* Donations only */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="donations"
          checked={showDonationsOnly}
          onCheckedChange={(checked) => setShowDonationsOnly(!!checked)}
        />
        <label htmlFor="donations" className="text-sm cursor-pointer">
          {script === 'latin' ? 'Samo knjige na dar' : 'Само књиге на дар'}
        </label>
      </div>
      
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          <X className="h-4 w-4 mr-2" />
          {script === 'latin' ? 'Obriši filtere' : 'Обриши филтере'}
        </Button>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="sticky top-24 border-wood-light/30">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">
                {script === 'latin' ? 'Filteri' : 'Филтери'}
              </h2>
              <FilterContent />
            </CardContent>
          </Card>
        </aside>
        
        {/* Main content */}
        <div className="flex-1">
          {/* Search and sort header */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            
            <div className="flex gap-2">
              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden bg-transparent">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {script === 'latin' ? 'Filteri' : 'Филтери'}
                    {hasActiveFilters && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        !
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>{script === 'latin' ? 'Filteri' : 'Филтери'}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{script === 'latin' ? 'Najnovije' : 'Најновије'}</SelectItem>
                  <SelectItem value="oldest">{script === 'latin' ? 'Najstarije' : 'Најстарије'}</SelectItem>
                  <SelectItem value="price-low">{script === 'latin' ? 'Cena: niska - visoka' : 'Цена: ниска - висока'}</SelectItem>
                  <SelectItem value="price-high">{script === 'latin' ? 'Cena: visoka - niska' : 'Цена: висока - ниска'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">
            {script === 'latin' 
              ? `${filteredBooks.length} ${filteredBooks.length === 1 ? 'rezultat' : 'rezultata'}`
              : `${filteredBooks.length} ${filteredBooks.length === 1 ? 'резултат' : 'резултата'}`}
          </p>
          
          {/* Results grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <Card className="border-wood-light/30">
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  {script === 'latin' ? 'Nema rezultata' : 'Нема резултата'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {script === 'latin' 
                    ? 'Pokušajte sa drugim filterima ili pretragom.'
                    : 'Покушајте са другим филтерима или претрагом.'}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                    {script === 'latin' ? 'Obriši filtere' : 'Обриши филтере'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
