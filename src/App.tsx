import { useState } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CampProvider } from './context/CampContext'
import { LoginScreen } from './components/LoginScreen'
import { Header } from './components/Dashboard/Header'
import { StatsBar } from './components/Dashboard/StatsBar'
import { TabNav } from './components/Dashboard/TabNav'
import { InventoryView } from './components/Inventory/InventoryView'
import { FinanceView } from './components/Finance/FinanceView'
import { RolesView } from './components/Roles/RolesView'
import { SpacesView } from './components/Spaces/SpacesView'
import { VolunteersView } from './components/Volunteers/VolunteersView'
import { TicketsView } from './components/Tickets/TicketsView'
import { ActivityFeed } from './components/ActivityFeed'

function Dashboard() {
  const { profile } = useAuth()
  const [tab, setTab] = useState('inventory')

  if (!profile) return <LoginScreen />

  return (
    <div className="max-w-6xl mx-auto p-4 max-sm:p-2">
      <Header />
      <StatsBar />
      <TabNav active={tab} onChange={setTab} />

      {tab === 'inventory' && <InventoryView />}
      {tab === 'finance' && <FinanceView />}
      {tab === 'roles' && <RolesView />}
      {tab === 'spaces' && <SpacesView />}
      {tab === 'volunteers' && <VolunteersView />}
      {tab === 'tickets' && <TicketsView />}

      <ActivityFeed />
    </div>
  )
}

function AppInner() {
  return (
    <div className="relative min-h-screen">
      <div className="bg-aurora" />
      <div className="particle-field">
        {Array.from({length: 12}).map((_,i) => <div key={i} className="particle" />)}
      </div>
      <CampProvider>
        <Dashboard />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(25, 15, 45, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(180, 77, 255, 0.3)',
              color: '#f0e6ff',
              fontSize: '13px',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            },
          }}
        />
      </CampProvider>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
