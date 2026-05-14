import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function LoginScreen() {
  const { login } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      await login(code.trim())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-10 max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold rainbow-text mb-1">The Playground</h1>
        <p className="text-[13px] font-bold tracking-widest text-muted-foreground mb-6">OTHERWORLD 2026 — MOIST.</p>
        <p className="text-sm text-muted-foreground mb-5">Enter your invite code</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="your invite code..."
            className="text-center"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Checking...' : 'Enter'}
          </Button>
        </form>
      </div>
    </div>
  )
}
