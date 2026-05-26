export default function Jobs() {
  const jobs = [
    { titel: "Hochzeitsfotograf gesucht", ort: "München", budget: "2.500€", datum: "August 2026" },
    { titel: "Produktfotografie E-Commerce", ort: "Hamburg", budget: "1.200€", datum: "Juni 2026" },
    { titel: "Reportagefotograf Events", ort: "Wien", budget: "800€/Tag", datum: "laufend" },
    { titel: "Architekturfotografie Neubau", ort: "Zürich", budget: "3.000€", datum: "Juli 2026" },
  ]
  return (
    <main style={{fontFamily:'sans-serif',maxWidth:'1200px',margin:'0 auto',padding:'20px'}}>
      <a href="/" style={{color:'#D85A30'}}>← zurück</a>
      <h1 style={{color:'#D85A30',margin:'20px 0'}}>💼 Jobs</h1>
      <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        {jobs.map((j,i) => (
          <div key={i} style={{border:'1px solid #ddd',borderRadius:'12px',padding:'20px',background:'#fafafa',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <h2 style={{fontSize:'18px',marginBottom:'6px'}}>{j.titel}</h2>
              <p style={{color:'#666',fontSize:'14px'}}>📍 {j.ort} · 📅 {j.datum}</p>
            </div>
            <div style={{textAlign:'right'}}>
              <p style={{color:'#D85A30',fontWeight:'bold',fontSize:'18px'}}>{j.budget}</p>
              <button style={{marginTop:'8px',background:'#D85A30',color:'white',border:'none',borderRadius:'8px',padding:'8px 16px',cursor:'pointer'}}>Bewerben</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
