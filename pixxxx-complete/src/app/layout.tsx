import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: { default: 'pixxxx.de – Von Fotografen. Für Fotografen.', template: '%s | pixxxx.de' },
  description: 'Die Fotografen-Community im DACH-Raum. Bilder teilen, bewerten, Locations entdecken, Jobs finden.',
  keywords: ['Fotografie', 'Community', 'Deutschland', 'Österreich', 'Schweiz', 'DACH'],
  openGraph: {
    type: 'website', locale: 'de_DE', url: 'https://pixxxx.de', siteName: 'pixxxx.de',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="font-body bg-pixxxx-black text-pixxxx-text antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
