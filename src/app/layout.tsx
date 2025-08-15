import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Space_Mono, Cabin_Condensed } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
})

const cabinCondensed = Cabin_Condensed({
  subsets: ['latin'],
  variable: '--font-cabin-condensed',
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Impaction - Carbon Footprint Platform',
  description: 'Track environmental impact, receive AI-powered sustainability recommendations, and mint blockchain-verified certificates',
  keywords: ['carbon footprint', 'climate action', 'sustainability', 'blockchain', 'carbon calculator', 'environmental impact'],
  authors: [{ name: 'Impaction Global' }],
  creator: 'Impaction Global',
  publisher: 'Impaction Global',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'Impaction - Carbon Footprint Platform',
    description: 'Track environmental impact, receive AI-powered sustainability recommendations, and mint blockchain-verified certificates',
    url: 'https://impaction.global',
    siteName: 'Impaction',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Impaction - Carbon Footprint Platform',
    description: 'Track environmental impact and receive AI-powered sustainability recommendations',
    creator: '@impactionglobal',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} ${spaceMono.variable} ${cabinCondensed.variable} font-body antialiased`}>
        <ThemeProvider defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}