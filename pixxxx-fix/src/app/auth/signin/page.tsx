export default function SignInPage() {
  return (
    <div style={{ background: '#0A0A08', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', letterSpacing: '4px', marginBottom: '8px' }}>
            pixx<span style={{ color: '#D85A30' }}>xx</span>.de
          </div>
          <p style={{ fontSize: '14px', color: '#888780', fontWeight: 300 }}>Von Fotografen. Für Fotografen.</p>
        </div>
        <div style={{ background: '#1C1C1A', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', letterSpacing: '2px', marginBottom: '8px' }}>ANMELDEN</h1>
          <p style={{ fontSize: '13px', color: '#888780', marginBottom: '28px', fontWeight: 300 }}>Wähle deinen bevorzugten Login-Anbieter.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="/api/auth/signin/google" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '12px', background: '#fff', color: '#333', fontSize: '14px', fontWeight: 500 }}>
              🔵 Mit Google anmelden
            </a>
            <a href="/api/auth/signin/github" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '12px', background: '#24292e', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
              ⚫ Mit GitHub anmelden
            </a>
          </div>
          <p style={{ fontSize: '11px', textAlign: 'center', marginTop: '20px', color: '#888780' }}>
            Mit der Anmeldung stimmst du unseren <a href="#" style={{ textDecoration: 'underline' }}>AGB</a> zu.
          </p>
        </div>
      </div>
    </div>
  )
}
