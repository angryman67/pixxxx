export default function Home() {
  return (
    <main style={{fontFamily:'sans-serif',maxWidth:'1200px',margin:'0 auto',padding:'20px'}}>
      <h1 style={{color:'#D85A30'}}>pixxxx.de</h1>
      <p>Die Fotografen-Community für DACH</p>
      <nav style={{display:'flex',gap:'20px',margin:'20px 0'}}>
        <a href="/locations">📍 Locations</a>
        <a href="/jobs">💼 Jobs</a>
        <a href="/upload">📷 Upload</a>
        <a href="/api/auth/signin">🔐 Login</a>
      </nav>
    </main>
  )
}
