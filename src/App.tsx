import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CampProvider } from './context/CampContext'
import { LoginScreen } from './components/LoginScreen'
import { Dashboard } from './components/dashboard/Dashboard'

function AppShell() {
  const { profile } = useAuth()
  if (!profile) return <LoginScreen />
  return <Dashboard />
}

export default function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen">
        <div className="bg-aurora" />
        <div className="particle-field">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        <CampProvider>
          <AppShell />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-popover-foreground)',
                fontSize: '13px',
              },
            }}
          />
        </CampProvider>
      </div>
    </AuthProvider>
  )
}
