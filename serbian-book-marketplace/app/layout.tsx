import React from "react"
import type { Metadata, Viewport } from 'next'
import { Crimson_Pro, Source_Sans_3 } from 'next/font/google'

import './globals.css'
import { AppProvider } from '@/lib/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const crimsonPro = Crimson_Pro({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-serif',
  display: 'swap',
})

const sourceSans = Source_Sans_3({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Novi list - Srpski marketplace za knjige',
  description: 'Kupujte, prodajte i poklanjajte knjige na jednom mestu. Vaše omiljeno mesto za ljubitelje knjiga u Srbiji.',
  keywords: ['knjige', 'prodaja knjiga', 'kupovina knjiga', 'poklanjanje knjiga', 'srbija', 'marketplace'],
}

export const viewport: Viewport = {
  themeColor: '#6B4423',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sr">
      <body className={`${crimsonPro.variable} ${sourceSans.variable} font-sans antialiased`}>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
