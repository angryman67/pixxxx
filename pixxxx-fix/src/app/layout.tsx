import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'pixxxx.de – Von Fotografen. Für Fotografen.', template: '%s | pixxxx.de' },
  description: 'Die Fotografen-Community im DACH-Raum.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: '#0A0A08', color: '#F0EDE8', fontFamily: "'DM Sans', sans-serif" }}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}

function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 40px',
      background: 'rgba(10,10,8,0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    }}>
      <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', letterSpacing: '3px' }}>
        pixx<span style={{ color: '#D85A30' }}>xx</span>.de
      </a>
      <div style={{ display: 'flex', gap: '32px' }}>
        {[['Community', '/'], ['Locations', '/locations'], ['Jobs', '/jobs'], ['Upload', '/upload']].map(([label, href]) => (
          <a key={label} href={href} style={{ fontSize: '13px', color: '#888780', letterSpacing: '0.5px', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F0EDE8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#888780')}>
            {label}
          </a>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <a href="/auth/signin" style={{
          background: 'none', border: '0.5px solid rgba(255,255,255,0.18)',
          borderRadius: '8px', padding: '7px 18px', fontSize: '13px', color: '#F0EDE8', cursor: 'pointer',
        }}>Anmelden</a>
        <a href="/auth/signin" style={{
          background: '#D85A30', border: 'none',
          borderRadius: '8px', padding: '7px 18px', fontSize: '13px', color: '#fff', cursor: 'pointer', fontWeight: 500,
        }}>Kostenlos starten</a>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer style={{
      padding: '32px 40px',
      borderTop: '0.5px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
    }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '3px' }}>
        pixx<span style={{ color: '#D85A30' }}>xx</span>.de
      </div>
      <div style={{ display: 'flex', gap: '24px' }}>
        {['Impressum', 'Datenschutz', 'AGB', 'Kontakt'].map(l => (
          <a key={l} href="#" style={{ fontSize: '12px', color: '#888780' }}>{l}</a>
        ))}
      </div>
      <div style={{ fontSize: '12px', color: '#888780' }}>© 2026 pixxxx.de</div>
    </footer>
  )
}
