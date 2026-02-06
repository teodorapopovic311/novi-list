export type Script = 'latin' | 'cyrillic'

export type BookCondition =
  | 'novo'
  | 'kao-novo'
  | 'odlicno'
  | 'dobro'
  | 'prihvatljivo'

export type DeliveryOption = 'post' | 'personal' | 'both'
export type PaymentMethod = 'card' | 'cash'
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'disputed' | 'completed'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  isBusiness: boolean
  isVerified: boolean
  city: string
  createdAt: Date
  walletBalance: number
  freeBooksThisMonth: number
}

export interface Book {
  id: string
  title: string
  author: string
  description?: string
  condition: BookCondition
  price: number
  isDonation: boolean
  deliveryOption: DeliveryOption
  paymentMethod: PaymentMethod
  city: string
  images: string[]
  sellerId: string
  seller: User
  createdAt: Date
  category: string
}

export interface Order {
  id: string
  bookId: string
  book: Book
  buyerId: string
  buyer: User
  sellerId: string
  seller: User
  status: OrderStatus
  totalAmount: number
  shippingFee: number
  platformFee: number
  donationAmount: number
  trackingNumber?: string
  deliveredAt?: Date
  disputeDeadline?: Date
  createdAt: Date
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: Date
  read: boolean
}

export interface Conversation {
  id: string
  participants: User[]
  bookId?: string
  book?: Book
  lastMessage?: Message
  updatedAt: Date
}

// Translation keys for Serbian latin/cyrillic
export const translations = {
  latin: {
    // Navigation
    home: 'Početna',
    browse: 'Pretraži',
    donate: 'Knjige na dar',
    sell: 'Prodaj',
    login: 'Prijava',
    register: 'Registracija',
    logout: 'Odjava',
    profile: 'Profil',
    wishlist: 'Lista želja',
    messages: 'Poruke',
    myListings: 'Moji oglasi',
    orders: 'Narudžbine',
    wallet: 'Novčanik',

    // Book conditions
    'novo': 'Novo',
    'kao-novo': 'Kao novo',
    'odlicno': 'Odlično',
    'dobro': 'Dobro',
    'prihvatljivo': 'Prihvatljivo',

    // Delivery
    post: 'Pošta',
    personal: 'Lično preuzimanje',
    both: 'Po dogovoru',

    // Payment
    card: 'Kartica',
    cash: 'Pouzeće',

    // Common
    search: 'Pretraži knjige...',
    price: 'Cena',
    free: 'Besplatno',
    city: 'Grad',
    condition: 'Stanje',
    author: 'Autor',
    title: 'Naslov',
    description: 'Opis',
    category: 'Kategorija',
    delivery: 'Dostava',
    payment: 'Plaćanje',
    addToWishlist: 'Dodaj u listu želja',
    removeFromWishlist: 'Ukloni iz liste želja',
    buyNow: 'Kupi',
    contactSeller: 'Kontaktiraj prodavca',
    verified: 'Verifikovan',
    business: 'Prodavnica',

    // Hero
    heroTitle: 'Dobro došli u svet knjiga',
    heroSubtitle: 'Svaka knjiga zaslužuje novi list',

    // Sections
    featuredBooks: 'Istaknute knjige',
    recentListings: 'Novi oglasi',
    freeBooks: 'Knjige na dar',
    categories: 'Kategorije',

    // Auth
    email: 'Email adresa',
    password: 'Lozinka',
    confirmPassword: 'Potvrdi lozinku',
    forgotPassword: 'Zaboravili ste lozinku?',
    noAccount: 'Nemate nalog?',
    hasAccount: 'Već imate nalog?',

    // Messages
    loginRequired: 'Morate biti prijavljeni za ovu akciju',
    monthlyLimitReached: 'Dostigli ste mesečni limit besplatnih knjiga (2)',
  },
  cyrillic: {
    // Navigation
    home: 'Почетна',
    browse: 'Претражи',
    donate: 'Књиге на дар',
    sell: 'Продај',
    login: 'Пријава',
    register: 'Регистрација',
    logout: 'Одјава',
    profile: 'Профил',
    wishlist: 'Листа жеља',
    messages: 'Поруке',
    myListings: 'Моји огласи',
    orders: 'Наруџбине',
    wallet: 'Новчаник',

    // Book conditions
    'novo': 'Ново',
    'kao-novo': 'Као ново',
    'odlicno': 'Одлично',
    'dobro': 'Добро',
    'prihvatljivo': 'Прихватљиво',

    // Delivery
    post: 'Пошта',
    personal: 'Лично преузимање',
    both: 'По договору',

    // Payment
    card: 'Картица',
    cash: 'Поузеће',

    // Common
    search: 'Претражи књиге...',
    price: 'Цена',
    free: 'Беспл��тно',
    city: 'Град',
    condition: 'Стање',
    author: 'Аутор',
    title: 'Наслов',
    description: 'Опис',
    category: 'Категорија',
    delivery: 'Достава',
    payment: 'Плаћање',
    addToWishlist: 'Додај у листу жеља',
    removeFromWishlist: 'Уклони из листе жеља',
    buyNow: 'Купи',
    contactSeller: 'Контактирај продавца',
    verified: 'Верификован',
    business: 'Продавница',

    // Hero
    heroTitle: 'Откријте свет књига',
    heroSubtitle: 'Купујте, продајте и поклањајте књиге у топлој атмосфери',

    // Sections
    featuredBooks: 'Истакнуте књиге',
    recentListings: 'Нови огласи',
    freeBooks: 'Књиге на дар',
    categories: 'Категорије',

    // Auth
    email: 'Имејл адреса',
    password: 'Лозинка',
    confirmPassword: 'Потврди лозинку',
    forgotPassword: 'Заборавили сте лозинку?',
    noAccount: 'Немате налог?',
    hasAccount: 'Већ имате налог?',

    // Messages
    loginRequired: 'Морате бити пријављени за ову акцију',
    monthlyLimitReached: 'Достигли сте месечни лимит бесплатних књига (2)',
  }
}

export type TranslationKey = keyof typeof translations.latin
