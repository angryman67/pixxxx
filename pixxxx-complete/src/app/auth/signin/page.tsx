'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignInPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSignIn = async (provider: string) => {
    setLoading(provider)
    await signIn(provider, { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--black)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="font-display text-4xl tracking-widest mb-3">
            pixx<span style={{ color: 'var(--coral)' }}>xx</span>.de
          </div>
          <p className="text-sm font-light" style={{ color: 'var(--muted)' }}>
            Von Fotografen. Für Fotografen.
          </p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--card)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <h1 className="font-display text-3xl tracking-widest mb-2">ANMELDEN</h1>
          <p className="text-sm mb-8 font-light" style={{ color: 'var(--muted)' }}>
            Wähle deinen bevorzugten Login-Anbieter.
          </p>

          <div className="flex flex-col gap-3">
            <button onClick={() => handleSignIn('google')} disabled={!!loading}
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: '#fff', color: '#333' }}>
              {loading === 'google' ? '⏳ Wird geladen...' : '🔵 Mit Google anmelden'}
            </button>

            <button onClick={() => handleSignIn('github')} disabled={!!loading}
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: '#24292e', color: '#fff' }}>
              {loading === 'github' ? '⏳ Wird geladen...' : '⚫ Mit GitHub anmelden'}
            </button>
          </div>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--muted)' }}>
            Mit der Anmeldung stimmst du unseren{' '}
            <a href="#" className="underline hover:text-pixxxx-text">AGB</a> und der{' '}
            <a href="#" className="underline hover:text-pixxxx-text">Datenschutzerklärung</a> zu.
          </p>
        </div>
      </div>
    </div>
  )
}
