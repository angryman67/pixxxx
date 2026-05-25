export default function LocationsPage() {
  const card = { background: '#1C1C1A', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' as const }
  const locations = [
    { name: 'Zugspitze', country: '🇩🇪 Bayern, DE', bg: 'linear-gradient(135deg,#1C1C1A,#2A1F1A)', emoji: '🏔️', tags: ['Alpenpanorama','Astro','Sonnenaufgang'], photos: 312, rating: '4.9' },
    { name: 'Hallstatt', country: '🇦🇹 Oberösterreich, AT', bg: 'linear-gradient(135deg,#0D1A15,#0A1510)', emoji: '🏛️', tags: ['Spiegelungen','Architektur','Herbst'], photos: 248, rating: '4.8' },
    { name: 'Lauterbrunnen', country: '🇨🇭 Bern, CH', bg: 'linear-gradient(135deg,#1A2030,#0D1525)', emoji: '🌲', tags: ['Wasserfälle','Nebel','Langzeit'], photos: 187, rating: '4.7' },
    { name: 'Kreidefelsen Rügen', country: '🇩🇪 Rügen, DE', bg: 'linear-gradient(135deg,#201510,#2A1A0D)', emoji: '🌊', tags: ['Küste','Klippen','Sturm'], photos: 203, rating: '4.6' },
    { name: 'Neuschwanstein', country: '🇩🇪 Bayern, DE', bg: 'linear-gradient(135deg,#15151f,#1a1a2a)', emoji: '🏰', tags: ['Architektur','Herbst','Nebel'], photos: 421, rating: '4.8' },
    { name: 'Großglockner', country: '🇦🇹 Kärnten, AT', bg: 'linear-gradient(135deg,#1a1a10,#1C1C1A)', emoji: '⛰️', tags: ['Hochgebirge','Gletscher','Panorama'], photos: 167, rating: '4.9' },
    { name: 'Zürichsee', country: '🇨🇭 Zürich, CH', bg: 'linear-gradient(135deg,#0D1A15,#1A2030)', emoji: '🌅', tags: ['See','Spiegelungen','Goldstunde'], photos: 134, rating: '4.5' },
    { name: 'Watzmann', country: '🇩🇪 Bayern, DE', bg: 'linear-gradient(135deg,#1C1C1A,#141412)', emoji: '🏔️', tags: ['Alpenpanorama','Winter','Berchtesgaden'], photos: 198, rating: '4.7' },
  ]
  return (
    <div style={{ background: '#0A0A08', minHeight: '100vh', padding: '120px 40px 60px' }}>
      <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#D85A30', marginBottom: '16px' }}>Foto-Spots DACH</div>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,5vw,72px)', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>
        TOP <span style={{ color: '#D85A30' }}>LOCATIONS</span>
      </h1>
      <p style={{ color: '#888780', fontSize: '16px', fontWeight: 300, maxWidth: '500px', lineHeight: 1.6, marginBottom: '40px' }}>
        Von der Community kuratierte Foto-Spots mit GPS-Koordinaten und Tipps.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
        {locations.map(l => (
          <div key={l.name} style={card}>
            <div style={{ background: l.bg, height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>{l.emoji}</div>
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{l.name}</div>
              <div style={{ fontSize: '11px', color: '#888780', marginBottom: '8px' }}>{l.country}</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {l.tags.map(t => <span key={t} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '100px', border: '0.5px solid rgba(255,255,255,0.1)', color: '#888780' }}>{t}</span>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888780' }}>
                <span>📸 {l.photos} Bilder</span>
                <span style={{ color: '#EF9F27' }}>★ {l.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
