export default function JobsPage() {
  const jobs = [
    { title: 'Hochzeitsfotograf/in – Saison 2026', company: 'Agentur Bildgold GmbH', city: 'München, BY', type: 'Freelance', pay: 'ab 1.800 € / Tag', emoji: '💒', tc: 'rgba(216,90,48,0.15)', tx: '#F0997B' },
    { title: 'Produktfotograf/in E-Commerce', company: 'Zalando SE', city: 'Wien, AT', type: 'Festanstellung', pay: '42.000 – 52.000 €', emoji: '📦', tc: 'rgba(127,119,221,0.15)', tx: '#A09AE8' },
    { title: 'Reise- und Naturfotograf/in', company: 'GEO Magazin', city: 'Zürich, CH', type: 'Projekt', pay: 'Verhandlungsbasis', emoji: '🌍', tc: 'rgba(29,158,117,0.15)', tx: '#3DC49A' },
    { title: 'Sportfotograf/in – Bundesliga', company: 'DFB Media', city: 'Frankfurt, HE', type: 'Freelance', pay: 'ab 900 € / Spieltag', emoji: '⚽', tc: 'rgba(216,90,48,0.15)', tx: '#F0997B' },
    { title: 'Architekturfotograf/in', company: 'Herzog & de Meuron', city: 'Basel, CH', type: 'Projekt', pay: 'ab 1.200 € / Tag', emoji: '🏛️', tc: 'rgba(29,158,117,0.15)', tx: '#3DC49A' },
    { title: 'Portrait-Fotograf/in Studio', company: 'Condé Nast Germany', city: 'Hamburg, HH', type: 'Festanstellung', pay: '38.000 – 48.000 €', emoji: '👤', tc: 'rgba(127,119,221,0.15)', tx: '#A09AE8' },
  ]
  return (
    <div style={{ background: '#0A0A08', minHeight: '100vh', padding: '120px 40px 60px' }}>
      <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#D85A30', marginBottom: '16px' }}>Job-Board DACH</div>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,5vw,72px)', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' }}>
        JOBS FÜR <span style={{ color: '#D85A30' }}>FOTOGRAFEN</span>
      </h1>
      <p style={{ color: '#888780', fontSize: '16px', fontWeight: 300, maxWidth: '500px', lineHeight: 1.6, marginBottom: '40px' }}>
        Freelance, Festanstellung und Projekte im deutschsprachigen Raum.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {jobs.map(j => (
          <div key={j.title} style={{ background: '#1C1C1A', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{j.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{j.title}</div>
              <div style={{ fontSize: '12px', color: '#888780' }}>🏢 {j.company} · 📍 {j.city}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '100px', background: j.tc, color: j.tx, marginBottom: '6px', display: 'inline-block' }}>{j.type}</div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{j.pay}</div>
            </div>
            <a href="#" style={{ background: '#D85A30', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, flexShrink: 0 }}>Bewerben</a>
          </div>
        ))}
      </div>
    </div>
  )
}
