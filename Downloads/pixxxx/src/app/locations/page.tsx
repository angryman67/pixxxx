export default function Locations() {
  const locations = [
    { name: "Rheinfall Schaffhausen", land: "🇨🇭 Schweiz", typ: "Natur", tipp: "Morgens für bestes Licht" },
    { name: "Neuschwanstein", land: "🇩🇪 Deutschland", typ: "Architektur", tipp: "Herbst für Nebel" },
    { name: "Hallstatt", land: "🇦🇹 Österreich", typ: "Dorf", tipp: "Sonnenaufgang am See" },
    { name: "Elbphilharmonie Hamburg", land: "🇩🇪 Deutschland", typ: "Architektur", tipp: "Blaue Stunde" },
    { name: "Dolomiten", land: "🇮🇹 Südtirol", typ: "Natur", tipp: "Alpenglow bei Sonnenuntergang" },
  ]
  return (
    <main style={{fontFamily:'sans-serif',maxWidth:'1200px',margin:'0 auto',padding:'20px'}}>
      <a href="/" style={{color:'#D85A30'}}>← zurück</a>
      <h1 style={{color:'#D85A30',margin:'20px 0'}}>📍 Locations</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'20px'}}>
        {locations.map((l,i) => (
          <div key={i} style={{border:'1px solid #ddd',borderRadius:'12px',padding:'20px',background:'#fafafa'}}>
            <h2 style={{fontSize:'18px',marginBottom:'8px'}}>{l.name}</h2>
            <p style={{color:'#666',fontSize:'14px'}}>{l.land} · {l.typ}</p>
            <p style={{marginTop:'10px',fontSize:'14px',color:'#444'}}>💡 {l.tipp}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
