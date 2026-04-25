import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

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
    } catch (err: any) {
      setError(err.message || 'Invalid code')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-canvas via-surface to-gold-pale p-6">
      <motion.div
        className="bg-white rounded-2xl p-12 max-w-sm w-full text-center shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-1">🏕️ The Playground</h1>
        <div className="inline-block px-3 py-1 rounded-full bg-gold-pale text-ink-secondary text-xs font-semibold mb-5">
          Otherworld 2026
        </div>
        <p className="text-ink-secondary text-sm mb-6">Enter your invite code to join</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="your invite code..."
            className="w-full px-4 py-3 text-center text-base border-2 border-wood rounded-lg bg-surface outline-none focus:border-moss transition-colors"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <div className="text-danger text-sm mt-2 min-h-5">{error}</div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 rounded-lg bg-moss text-white font-semibold text-base hover:bg-moss-light disabled:opacity-50 transition-colors"
          >
            {loading ? 'Checking...' : 'Enter the Playground'}
          </button>
        </form>

        <p className="text-ink-muted text-xs mt-5">Check your messages from Maxim for your code</p>
      </motion.div>
    </div>
  )
}
