"use client"
import Link from "next/link"

export function Navbar() {
  return (
    <nav style={{background:'#1a1a1a',padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <Link href="/" style={{color:'#D85A30',fontWeight:'bold',fontSize:'20px',textDecoration:'none'}}>pixxxx.de</Link>
      <div style={{display:'flex',gap:'20px'}}>
        <Link href="/locations" style={{color:'white',textDecoration:'none'}}>📍 Locations</Link>
        <Link href="/jobs" style={{color:'white',textDecoration:'none'}}>💼 Jobs</Link>
        <Link href="/upload" style={{color:'white',textDecoration:'none'}}>📷 Upload</Link>
        <Link href="/api/auth/signin" style={{background:'#D85A30',color:'white',padding:'6px 14px',borderRadius:'8px',textDecoration:'none'}}>Login</Link>
      </div>
    </nav>
  )
}
