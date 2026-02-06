'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, Book, Script, TranslationKey, Conversation, Message, Order } from './types'
import { translations } from './types'
import { mockUsers, mockBooks, mockConversations, mockMessages, mockOrders } from './mock-data'

interface AppContextType {
  // Script/Language
  script: Script
  setScript: (script: Script) => void
  t: (key: TranslationKey) => string
  
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, city: string) => Promise<boolean>
  logout: () => void
  
  // Books
  books: Book[]
  featuredBooks: Book[]
  donationBooks: Book[]
  getBookById: (id: string) => Book | undefined
  getBooksBySeller: (sellerId: string) => Book[]
  addBook: (book: Omit<Book, 'id' | 'seller' | 'createdAt'>) => void
  
  // Wishlist
  wishlist: string[]
  addToWishlist: (bookId: string) => void
  removeFromWishlist: (bookId: string) => void
  isInWishlist: (bookId: string) => boolean
  
  // Messages
  conversations: Conversation[]
  messages: Message[]
  getConversation: (id: string) => Conversation | undefined
  getMessagesForConversation: (conversationId: string) => Message[]
  sendMessage: (conversationId: string, content: string) => void
  startConversation: (otherUserId: string, bookId?: string) => string
  
  // Orders
  orders: Order[]
  getUserOrders: (userId: string) => Order[]
  getSellerOrders: (sellerId: string) => Order[]
  createOrder: (bookId: string) => Order | null
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredBooks: Book[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [script, setScript] = useState<Script>('latin')
  const [user, setUser] = useState<User | null>(null)
  const [books, setBooks] = useState<Book[]>(mockBooks)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  
  const t = useCallback((key: TranslationKey): string => {
    return translations[script][key] || key
  }, [script])
  
  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Mock login - find user by email
    const foundUser = mockUsers.find(u => u.email === email)
    if (foundUser) {
      setUser(foundUser)
      return true
    }
    // For demo, create a temporary user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      isBusiness: false,
      isVerified: false,
      city: 'Beograd',
      createdAt: new Date(),
      walletBalance: 0,
      freeBooksThisMonth: 0,
    }
    setUser(newUser)
    return true
  }, [])
  
  const register = useCallback(async (email: string, _password: string, name: string, city: string): Promise<boolean> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      isBusiness: false,
      isVerified: false,
      city,
      createdAt: new Date(),
      walletBalance: 0,
      freeBooksThisMonth: 0,
    }
    setUser(newUser)
    return true
  }, [])
  
  const logout = useCallback(() => {
    setUser(null)
    setWishlist([])
  }, [])
  
  const featuredBooks = books.filter(b => !b.isDonation).slice(0, 6)
  const donationBooks = books.filter(b => b.isDonation)
  
  const getBookById = useCallback((id: string) => books.find(b => b.id === id), [books])
  const getBooksBySeller = useCallback((sellerId: string) => books.filter(b => b.sellerId === sellerId), [books])
  
  const addBook = useCallback((bookData: Omit<Book, 'id' | 'seller' | 'createdAt'>) => {
    if (!user) return
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`,
      seller: user,
      createdAt: new Date(),
    }
    setBooks(prev => [newBook, ...prev])
  }, [user])
  
  const addToWishlist = useCallback((bookId: string) => {
    setWishlist(prev => [...prev, bookId])
  }, [])
  
  const removeFromWishlist = useCallback((bookId: string) => {
    setWishlist(prev => prev.filter(id => id !== bookId))
  }, [])
  
  const isInWishlist = useCallback((bookId: string) => wishlist.includes(bookId), [wishlist])
  
  const getConversation = useCallback((id: string) => conversations.find(c => c.id === id), [conversations])
  
  const getMessagesForConversation = useCallback((conversationId: string) => {
    return messages.filter(m => m.conversationId === conversationId).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    )
  }, [messages])
  
  const sendMessage = useCallback((conversationId: string, content: string) => {
    if (!user) return
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: user.id,
      content,
      createdAt: new Date(),
      read: false,
    }
    setMessages(prev => [...prev, newMessage])
    setConversations(prev => prev.map(c => 
      c.id === conversationId 
        ? { ...c, lastMessage: newMessage, updatedAt: new Date() }
        : c
    ))
  }, [user])
  
  const startConversation = useCallback((otherUserId: string, bookId?: string): string => {
    if (!user) return ''
    const otherUser = mockUsers.find(u => u.id === otherUserId)
    if (!otherUser) return ''
    
    // Check if conversation already exists
    const existing = conversations.find(c => 
      c.participants.some(p => p.id === otherUserId) && 
      c.participants.some(p => p.id === user.id) &&
      (!bookId || c.bookId === bookId)
    )
    if (existing) return existing.id
    
    const book = bookId ? getBookById(bookId) : undefined
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [user, otherUser],
      bookId,
      book,
      updatedAt: new Date(),
    }
    setConversations(prev => [newConversation, ...prev])
    return newConversation.id
  }, [user, conversations, getBookById])
  
  const getUserOrders = useCallback((userId: string) => 
    orders.filter(o => o.buyerId === userId), [orders])
  
  const getSellerOrders = useCallback((sellerId: string) => 
    orders.filter(o => o.sellerId === sellerId), [orders])
  
  const createOrder = useCallback((bookId: string): Order | null => {
    if (!user) return null
    const book = getBookById(bookId)
    if (!book) return null
    
    const shippingFee = book.deliveryOption === 'personal' ? 0 : 350
    const platformFee = Math.round(book.price * 0.1)
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      bookId,
      book,
      buyerId: user.id,
      buyer: user,
      sellerId: book.sellerId,
      seller: book.seller,
      status: 'pending',
      totalAmount: book.price + shippingFee,
      shippingFee,
      platformFee,
      donationAmount: 0,
      createdAt: new Date(),
    }
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }, [user, getBookById])
  
  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      const updates: Partial<Order> = { status }
      if (status === 'shipped') {
        updates.trackingNumber = `PE${Date.now().toString().slice(-9)}RS`
      }
      if (status === 'delivered') {
        updates.deliveredAt = new Date()
        updates.disputeDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000)
      }
      return { ...o, ...updates }
    }))
  }, [])
  
  const filteredBooks = searchQuery
    ? books.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books
  
  return (
    <AppContext.Provider value={{
      script,
      setScript,
      t,
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      books,
      featuredBooks,
      donationBooks,
      getBookById,
      getBooksBySeller,
      addBook,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      conversations,
      messages,
      getConversation,
      getMessagesForConversation,
      sendMessage,
      startConversation,
      orders,
      getUserOrders,
      getSellerOrders,
      createOrder,
      updateOrderStatus,
      searchQuery,
      setSearchQuery,
      filteredBooks,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
