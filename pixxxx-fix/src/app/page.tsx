export default function HomePage() {
  const s = {
    section: { padding: '100px 40px' } as React.CSSProperties,
    label: { fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase' as const, color: '#D85A30', marginBottom: '16px' },
    h2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,5vw,72px)', letterSpacing: '2px', lineHeight: 1, marginBottom: '16px' },
    muted: { color: '#888780' } as React.CSSProperties,
    card: { background: '#1C1C1A', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '16px' } as React.CSSProperties,
  }

  const photos = [
    { bg: 'linear-gradient(135deg,#1C1C1A,#2A1F1A)', emoji: '🏔️', loc: 'Zugspitze, BY', rating: '4.9' },
    { bg: 'linear-gradient(135deg,#1A2030,#0D1525)', emoji: '🏛️', loc: 'Wien, AT', rating: '4.8', mt: true },
    { bg: 'linear-gradient(135deg,#0D1A15,#0A1510)', emoji: '🌲', loc: 'Lauterbrunnen, CH', rating: '4.7' },
    { bg: 'linear-gradient(135deg,#201510,#2A1A0D)', emoji: '🌙', loc: 'Hamburg, HH', rating: '4.7', mt: true },
  ]

  const features = [
    { emoji: '📷', title: 'Bilder hochladen & teilen', desc: 'JPG, PNG, TIFF und RAW (NEF, CR3). EXIF-Daten werden automatisch erkannt.', color: 'rgba(216,90,48,0.15)' },
    { emoji: '⭐', title: '4-dimensionale Bewertung', desc: 'Komposition, Licht, Technik und Wirkung – echtes Feedback von der Community.', color: 'rgba(239,159,39,0.15)' },
    { emoji: '📍', title: 'Locations im DACH-Raum', desc: 'Kuratierte Foto-Spots mit GPS-Koordinaten und Tipps von anderen Fotografen.', color: 'rgba(29,158,117,0.15)' },
    { emoji: '💼', title: 'Job-Board', desc: 'Freelance, Festanstellung und Projekte – alle Jobs für Fotografen im DACH-Raum.', color: 'rgba(24,95,165,0.15)' },
    { emoji: '💡', title: 'Tipps & Technik', desc: 'Wissen aus der Community: Belichtung, Objektive, Locations – von Profis erklärt.', color: 'rgba(127,119,221,0.15)' },
    { emoji: '📊', title: 'Analytics Dashboard', desc: 'Views, Likes, Ratings und Follower auf einen Blick – verstehe wie deine Bilder ankommen.', color: 'rgba(8,80,65,0.2)' },
  ]

  const feedCards = [
    { av: 'SB', name: 'Sandra B.', loc: 'Wien, AT', bg: 'linear-gradient(135deg,#1A2030,#0D1525)', emoji: '🏛️', tag: 'Architektur · f/2.8', likes: 41, comments: 13, rating: '4.8' },
    { av: 'TW', name: 'Thomas W.', loc: 'Lauterbrunnen, CH', bg: 'linear-gradient(135deg,#0D1A15,#0A1510)', emoji: '🌲', tag: 'Landschaft · f/11', likes: 18, comments: 4, rating: '3.9' },
    { av: 'LR', name: 'Lisa R.', loc: 'Hamburg, HH', bg: 'linear-gradient(135deg,#201510,#2A1A0D)', emoji: '🌙', tag: 'Astro · ISO 6400', likes: 56, comments: 21, rating: '4.7' },
    { av: 'MK', name: 'Martin K.', loc: 'Berchtesgaden, BY', bg: 'linear-gradient(135deg,#1C1C1A,#2A1F1A)', emoji: '🏔️', tag: 'Landschaft · Golden Hour', likes: 24, comments: 7, rating: '4.2' },
  ]

  return (
    <div style={{ background: '#0A0A08' }}>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 40px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 65% 40%, rgba(216,90,48,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(216,90,48,0.12)', border: '0.5px solid rgba(216,90,48,0.3)', fontSize: '12px', color: '#F0997B', letterSpacing: '0.5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D85A30', animation: 'pulse-dot 2s infinite' }} />
            Jetzt in der Beta – tritt der Community bei
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(64px,9vw,120px)', lineHeight: 0.9, letterSpacing: '2px', marginBottom: '28px' }}>
            VON<br />
            <span style={{ color: '#D85A30' }}>FOTO</span>
            <span style={{ WebkitTextStroke: '1px rgba(240,237,232,0.25)', color: 'transparent' }}>GRAFEN</span><br />
            FÜR<br />
            <span style={{ color: '#D85A30' }}>FOTO</span>GRAFEN
          </h1>

          <p style={{ fontSize: '17px', color: '#888780', lineHeight: 1.7, maxWidth: '480px', marginBottom: '40px', fontWeight: 300 }}>
            Die <strong style={{ color: '#F0EDE8', fontWeight: 500 }}>Community-Plattform</strong> für Fotografen in Deutschland, Österreich und der Schweiz.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '56px', flexWrap: 'wrap' }}>
            <a href="/upload" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px', background: '#D85A30', color: '#fff', fontWeight: 500, fontSize: '15px' }}>
              📷 Jetzt mitmachen
            </a>
            <a href="#feed" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.18)', color: '#F0EDE8', fontSize: '15px' }}>
              Bilder entdecken →
            </a>
          </div>

          <div style={{ display: 'flex', gap: '48px' }}>
            {[['2.400+', 'Fotografen'], ['18.000+', 'Bilder'], ['340+', 'Locations']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', letterSpacing: '1px' }}>{n}</div>
                <div style={{ fontSize: '12px', color: '#888780', letterSpacing: '0.5px', marginTop: '4px' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating photos */}
        <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '380px' }}>
          {photos.map((p, i) => (
            <div key={i} className="animate-float" style={{ borderRadius: '12px', overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.08)', marginTop: p.mt ? '24px' : '0', animationDelay: `${-i * 1.5}s` }}>
              <div style={{ background: p.bg, aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>{p.emoji}</div>
              <div style={{ padding: '8px 10px', display: 'flex', justifyContent: 'space-between', background: 'rgba(28,28,26,0.95)' }}>
                <span style={{ fontSize: '10px', color: '#888780' }}>{p.loc}</span>
                <span style={{ fontSize: '10px', color: '#EF9F27' }}>★ {p.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ ...s.section, background: '#141412' }}>
        <div style={s.label}>Was dich erwartet</div>
        <div style={s.h2}>ALLES FÜR<br /><span style={{ color: '#D85A30' }}>DEINE PASSION</span></div>
        <p style={{ ...s.muted, fontSize: '16px', fontWeight: 300, maxWidth: '500px', lineHeight: 1.6, marginBottom: '56px' }}>
          Eine Plattform die wirklich versteht was Fotografen brauchen.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {features.map(f => (
            <div key={f.title} style={{ ...s.card, padding: '26px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '14px', background: f.color }}>{f.emoji}</div>
              <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#888780', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEED */}
      <section id="feed" style={s.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <div style={s.label}>Community Feed</div>
            <div style={s.h2}>NEUESTE <span style={{ color: '#D85A30' }}>UPLOADS</span></div>
          </div>
          <a href="/upload" style={{ background: '#D85A30', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500 }}>Alle Bilder →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
          {feedCards.map(c => (
            <div key={c.name} style={{ ...s.card, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(216,90,48,0.2)', color: '#F0997B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 500 }}>{c.av}</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#888780' }}>📍 {c.loc}</div>
                </div>
              </div>
              <div style={{ background: c.bg, height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', position: 'relative' }}>
                {c.emoji}
                <div style={{ position: 'absolute', bottom: '8px', left: '10px', fontSize: '10px', padding: '3px 8px', borderRadius: '100px', background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.8)', border: '0.5px solid rgba(255,255,255,0.12)' }}>{c.tag}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px' }}>
                <span style={{ fontSize: '12px', color: '#888780' }}>❤️ {c.likes}</span>
                <span style={{ fontSize: '12px', color: '#888780' }}>💬 {c.comments}</span>
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#EF9F27' }}>★ {c.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 40px', textAlign: 'center', borderTop: '0.5px solid rgba(255,255,255,0.07)', background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(216,90,48,0.09) 0%, transparent 70%)' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px,6vw,96px)', letterSpacing: '2px', lineHeight: 1, marginBottom: '20px' }}>
          WERDE TEIL DER<br /><span style={{ color: '#D85A30' }}>COMMUNITY</span>
        </h2>
        <p style={{ fontSize: '16px', color: '#888780', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.6, fontWeight: 300 }}>
          Kostenlos starten, Bilder hochladen und von tausenden Fotografen inspirieren lassen.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/auth/signin" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '12px', background: '#D85A30', color: '#fff', fontWeight: 500, fontSize: '15px' }}>
            📷 Kostenlos registrieren
          </a>
          <a href="#feed" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.18)', color: '#F0EDE8', fontSize: '15px' }}>
            Community entdecken
          </a>
        </div>
      </section>
    </div>
  )
}
