// src/app/layout.tsx

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Navbar } from "@/components/layout/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "pixxxx.de – Von Fotografen. Für Fotografen.",
    template: "%s | pixxxx.de",
  },
  description:
    "Die Fotografen-Community im DACH-Raum. Bilder teilen, bewerten, Locations entdecken, Jobs finden.",
  keywords: ["Fotografie", "Community", "Deutschland", "Österreich", "Schweiz", "DACH", "Fotografen"],
  openGraph: {
    type:    "website",
    locale:  "de_DE",
    url:     "https://pixxxx.de",
    siteName: "pixxxx.de",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50 dark:bg-neutral-950">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
