export default function UploadPage() {
  const input = { width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#F0EDE8', outline: 'none' }
  return (
    <div style={{ background: '#0A0A08', minHeight: '100vh', padding: '120px 40px 60px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#D85A30', marginBottom: '16px' }}>Community</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,5vw,64px)', letterSpacing: '2px', lineHeight: 1, marginBottom: '32px' }}>
          BILD<br /><span style={{ color: '#D85A30' }}>HOCHLADEN</span>
        </h1>
        <div style={{ border: '1.5px dashed rgba(255,255,255,0.15)', borderRadius: '16px', padding: '48px', textAlign: 'center', background: '#1C1C1A', marginBottom: '16px', cursor: 'pointer' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
          <p style={{ fontWeight: 500, marginBottom: '6px' }}>Bild hierher ziehen oder auswählen</p>
          <p style={{ fontSize: '13px', color: '#888780' }}>JPG, PNG, TIFF, RAW (NEF, CR3) · max. 100 MB</p>
        </div>
        <div style={{ background: '#1C1C1A', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#888780', display: 'block', marginBottom: '6px' }}>Titel *</label>
              <input type="text" placeholder="z. B. Morgennebel im Allgäu" style={input} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#888780', display: 'block', marginBottom: '6px' }}>Kategorie</label>
              <select style={input}>
                {['Landschaft','Portrait','Street','Architektur','Wildlife','Astro','Makro','Sport'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#888780', display: 'block', marginBottom: '6px' }}>Beschreibung</label>
            <textarea rows={3} placeholder="Story hinter dem Bild, Location-Tipps..." style={{ ...input, resize: 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#888780', display: 'block', marginBottom: '6px' }}>Kamera</label>
              <input type="text" placeholder="Nikon D850" style={input} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#888780', display: 'block', marginBottom: '6px' }}>Objektiv</label>
              <input type="text" placeholder="14-24mm f/2.8" style={input} />
            </div>
          </div>
        </div>
        <button style={{ width: '100%', padding: '14px', background: '#D85A30', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
          📤 Bild veröffentlichen
        </button>
      </div>
    </div>
  )
}
