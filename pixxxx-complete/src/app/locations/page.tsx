import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Locations – Foto-Spots im DACH-Raum' }

const LOCATIONS = [
  { name: 'Zugspitze', country: '🇩🇪 Bayern, DE', emoji: '🏔️', bg: 'linear-gradient(135deg,#1C1C1A,#2A1F1A)', tags: ['Alpenpanorama', 'Astro', 'Sonnenaufgang'], photos: 312, rating: '4.9', coords: '47.4210°N 10.9853°E' },
  { name: 'Hallstatt', country: '🇦🇹 Oberösterreich, AT', emoji: '🏛️', bg: 'linear-gradient(135deg,#0D1A15,#0A1510)', tags: ['Spiegelungen', 'Architektur', 'Herbst'], photos: 248, rating: '4.8', coords: '47.5623°N 13.6493°E' },
  { name: 'Lauterbrunnen', country: '🇨🇭 Bern, CH', emoji: '🌲', bg: 'linear-gradient(135deg,#1A2030,#0D1525)', tags: ['Wasserfälle', 'Nebel', 'Langzeit'], photos: 187, rating: '4.7', coords: '46.5942°N 7.9089°E' },
  { name: 'Kreidefelsen Rügen', country: '🇩🇪 Rügen, DE', emoji: '🌊', bg: 'linear-gradient(135deg,#201510,#2A1A0D)', tags: ['Küste', 'Klippen', 'Sturm'], photos: 203, rating: '4.6', coords: '54.5755°N 13.6614°E' },
  { name: 'Neuschwanstein', country: '🇩🇪 Bayern, DE', emoji: '🏰', bg: 'linear-gradient(135deg,#15151f,#1a1a2a)', tags: ['Architektur', 'Herbst', 'Nebel'], photos: 421, rating: '4.8', coords: '47.5576°N 10.7498°E' },
  { name: 'Großglockner', country: '🇦🇹 Kärnten, AT', emoji: '⛰️', bg: 'linear-gradient(135deg,#1a1a10,#1C1C1A)', tags: ['Hochgebirge', 'Gletscher', 'Panorama'], photos: 167, rating: '4.9', coords: '47.0742°N 12.6944°E' },
  { name: 'Zürichsee', country: '🇨🇭 Zürich, CH', emoji: '🌅', bg: 'linear-gradient(135deg,#0D1A15,#1A2030)', tags: ['See', 'Spiegelungen', 'Goldstunde'], photos: 134, rating: '4.5', coords: '47.2266°N 8.7750°E' },
  { name: 'Watzmann', country: '🇩🇪 Bayern, DE', emoji: '🏔️', bg: 'linear-gradient(135deg,#1C1C1A,#141412)', tags: ['Alpenpanorama', 'Berchtesgaden', 'Winter'], photos: 198, rating: '4.7', coords: '47.5748°N 12.9397°E' },
]

export default function LocationsPage() {
  return (
    <div className="min-h-screen pt-24 px-6 md:px-16 py-16" style={{ background: 'var(--black)' }}>
      <div className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--coral)' }}>Foto-Spots DACH</div>
      <h1 className="font-display tracking-widest mb-4" style={{ fontSize: 'clamp(40px,5vw,72px)', lineHeight: 1 }}>
        TOP <span style={{ color: 'var(--coral)' }}>LOCATIONS</span>
      </h1>
      <p className="text-base font-light max-w-lg mb-12 leading-relaxed" style={{ color: 'var(--muted)' }}>
        Von der Community kuratierte Foto-Spots mit GPS-Koordinaten, Tipps und den besten Zeiten.
      </p>

      {/* Country filter */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {['Alle', '🇩🇪 Deutschland', '🇦🇹 Österreich', '🇨🇭 Schweiz'].map(f => (
          <button key={f} className="text-xs px-4 py-2 rounded-lg transition-colors"
            style={{ background: f === 'Alle' ? 'rgba(216,90,48,0.15)' : 'var(--card)', border: `0.5px solid ${f === 'Alle' ? 'rgba(216,90,48,0.4)' : 'rgba(255,255,255,0.07)'}`, color: f === 'Alle' ? 'var(--coral-light)' : 'var(--muted)' }}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LOCATIONS.map(loc => (
          <div key={loc.name} className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1"
            style={{ background: 'var(--card)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-center text-4xl"
              style={{ background: loc.bg, height: '120px' }}>
              {loc.emoji}
            </div>
            <div className="p-4">
              <div className="font-medium mb-0.5">{loc.name}</div>
              <div className="text-xs mb-3" style={{ color: 'var(--muted)' }}>{loc.country}</div>
              <div className="flex flex-wrap gap-1 mb-3">
                {loc.tags.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                    style={{ border: '0.5px solid rgba(255,255,255,0.1)', color: 'var(--muted)' }}>{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
                <span>📸 {loc.photos} Bilder</span>
                <span style={{ color: 'var(--amber)' }}>★ {loc.rating}</span>
              </div>
              <div className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>{loc.coords}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="text-sm px-6 py-3 rounded-xl font-medium transition-all hover:-translate-y-0.5"
          style={{ border: '0.5px solid rgba(216,90,48,0.3)', color: 'var(--coral-light)', background: 'rgba(216,90,48,0.08)' }}>
          📍 Neuen Spot vorschlagen
        </button>
      </div>
    </div>
  )
}
