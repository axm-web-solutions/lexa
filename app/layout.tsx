import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Figtree } from 'next/font/google'
import { AnalyticsWithConsent } from '@/components/analytics-consent'
import './globals.css'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const body = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lexa — Entiende tus derechos',
  description: 'Orientación legal clara, privada y accesible para dar el siguiente paso. Información jurídica general; no sustituye al consejo de un abogado.',
  applicationName: 'Lexa',
  keywords: ['orientación legal', 'chatbot jurídico', 'información legal', 'derechos', 'privacidad', 'suscripción jurídica'],
  generator: 'v0.app',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Lexa',
    title: 'Lexa — Entiende tus derechos',
    description: 'Orientación legal clara, privada y accesible. Información general; no es asesoría jurídica.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0c0b0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">
        {children}
        <AnalyticsWithConsent />
      </body>
    </html>
  )
}
