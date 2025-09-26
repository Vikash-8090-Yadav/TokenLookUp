import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Token Lookup - Ethereum Token Explorer',
  description: 'Discover comprehensive token information instantly. Get real-time data, analytics, and insights for any ERC-20 token on Ethereum using Blockscout API.',
  keywords: ['ethereum', 'token', 'explorer', 'erc20', 'blockchain', 'crypto', 'defi'],
  authors: [{ name: 'Token Lookup' }],
  creator: 'Token Lookup',
  publisher: 'Token Lookup',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tokenlookup.vercel.app'),
  openGraph: {
    title: 'Token Lookup - Ethereum Token Explorer',
    description: 'Discover comprehensive token information instantly. Get real-time data, analytics, and insights for any ERC-20 token on Ethereum.',
    url: 'https://tokenlookup.vercel.app',
    siteName: 'Token Lookup',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token Lookup - Ethereum Token Explorer',
    description: 'Discover comprehensive token information instantly. Get real-time data, analytics, and insights for any ERC-20 token on Ethereum.',
    creator: '@tokenlookup',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
