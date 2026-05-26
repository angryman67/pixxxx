"use client"
export default function Upload() {
  return (
    <main style={{fontFamily:'sans-serif',maxWidth:'800px',margin:'0 auto',padding:'20px'}}>
      <a href="/" style={{color:'#D85A30'}}>← zurück</a>
      <h1 style={{color:'#D85A30',margin:'20px 0'}}>📷 Foto hochladen</h1>
      <div style={{border:'2px dashed #D85A30',borderRadius:'16px',padding:'60px',textAlign:'center',background:'#fff5f0'}}>
        <p style={{fontSize:'48px',marginBottom:'16px'}}>📸</p>
        <p style={{fontSize:'18px',marginBottom:'8px'}}>Foto hier ablegen</p>
        <p style={{color:'#666',marginBottom:'20px'}}>oder</p>
        <input type="file" accept="image/*" style={{display:'none'}} id="fileInput"/>
        <label htmlFor="fileInput" style={{background:'#D85A30',color:'white',padding:'12px 24px',borderRadius:'8px',cursor:'pointer'}}>
          Datei auswählen
        </label>
      </div>
    </main>
  )
}
