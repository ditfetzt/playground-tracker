import { useAuth } from '../../context/AuthContext'
import { MoistureGauge } from './MoistureGauge'
import { LogOut } from 'lucide-react'

export function Header() {
  const { profile, logout } = useAuth()

  return (
    <header className="flex items-center gap-4 flex-wrap glass-card-intense rounded-xl px-6 py-4 mb-3">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold flex items-center gap-2 rainbow-text">
          🏕️ The Playground
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full glow-badge text-text-secondary tracking-wide">
            OW 2026
          </span>
        </h1>
      </div>

      <MoistureGauge />

      {profile && (
        <div className="ml-auto flex items-center gap-2 text-sm font-medium">
          <span className="text-xl">{profile.emoji || '🙋'}</span>
          <span>{profile.name}</span>
          <button
            onClick={logout}
            className="ml-1 p-1.5 rounded-md border border-border-glow hover:border-glow-ember hover:text-glow-ember text-text-secondary transition-colors"
            title="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>
      )}
    </header>
  )
}
