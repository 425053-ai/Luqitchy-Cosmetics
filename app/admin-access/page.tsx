"use client"

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAccessPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (loading) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        setError('Wrong password')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-border bg-card/90 backdrop-blur p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
        <p className="text-sm text-muted-foreground mb-4">Enter admin password to continue.</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
          required
        />

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full h-11 rounded-xl bg-accent text-accent-foreground font-semibold disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
