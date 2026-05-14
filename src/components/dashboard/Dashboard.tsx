import { useState, useEffect, useRef, type FormEvent } from 'react'
import confetti from 'canvas-confetti'
import { useAuth } from '../../context/AuthContext'
import { useCamp } from '../../context/CampContext'
import { canEditRole, canEditItem } from '../../lib/permissions'
import { ART_GRANT, CAMP_FEE_PER_PERSON, STATUS_CYCLE, getMemberColor, HIDDEN_ROLE_NAMES } from '../../lib/constants'
import { uniqueBy } from '../../lib/utils'
import type { InventoryItem, ItemStatus } from '../../lib/types'
import type { NewItemState } from './AddItemForm'
import { Button } from '../ui/button'
import { LogOut, Settings, HelpCircle } from 'lucide-react'
import { MyRolesPanel } from './MyRolesPanel'
import { CampOverview } from './CampOverview'
import { TabBar } from './TabBar'
import { CampSettings } from './CampSettings'
import { TourProvider, useTour } from '../tour'
import { TourOverlay } from '../tour/TourOverlay'
import { OnboardingPrompt } from '../OnboardingPrompt'

const STATUS_SOUNDS = [
  'https://www.myinstants.com/media/sounds/nice-one.mp3',
  'https://www.myinstants.com/media/sounds/well-done-random-game.mp3',
  'https://www.myinstants.com/media/sounds/kids-saying-yay-sound-effect_3.mp3',
  'https://www.myinstants.com/media/sounds/dry-fart.mp3',
  'https://www.myinstants.com/media/sounds/succes.mp3',
  'https://www.myinstants.com/media/sounds/yooooooooooooooooooooooooo_4_objp8XX.mp3',
  'https://www.myinstants.com/media/sounds/get-comfy.mp3',
]

function playRandomSound() {
  try {
    const url = STATUS_SOUNDS[Math.floor(Math.random() * STATUS_SOUNDS.length)]
    new Audio(url).play()
  } catch { /* silently ignore playback errors */ }
}

function DashboardContent() {
  const { profile, logout } = useAuth()
  const { data, addItem, updateItem, deleteItem, updateRole, toggleFeePaid, addProfile, deleteProfile, loading } = useCamp()
  const tour = useTour()

  const isAdmin = profile?.is_admin === true

  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [addingForRole, setAddingForRole] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('camp')
  const [showSettings, setShowSettings] = useState(false)
  const rolesPanelRef = useRef<HTMLDivElement>(null)
  const campPanelRef = useRef<HTMLDivElement>(null)

  const [newItem, setNewItem] = useState<NewItemState>({
    name: '', location: '', sourcing: 'buy', value: '', notes: '',
  })

  const allItems = uniqueBy(data.items, i => i.id)
  const visibleItems = allItems.filter(i => i.assigned_role)
  const activeProfiles = uniqueBy(data.profiles, p => p.id).filter(p => p.active)
  const visibleRoles = uniqueBy(data.roles, r => r.name).filter(r => !HIDDEN_ROLE_NAMES.includes(r.name))

  const myRoleNames = profile?.role_names || []
  const myRoles = isAdmin ? visibleRoles : visibleRoles.filter(r => myRoleNames.includes(r.name))

  const registerCallbacks = tour.setCallbacks
  useEffect(() => {
    registerCallbacks({
      switchTab: (tab: string) => setActiveTab(tab),
      expandRole: (roleName: string | null) => {
        if (roleName === '' && myRoles.length > 0) {
          setExpandedRole(myRoles[0].name)
        } else {
          setExpandedRole(roleName)
        }
      },
      reset: () => {
        setExpandedRole(null)
        setAddingForRole(null)
      },
    })
  }, [registerCallbacks, myRoles])

  useEffect(() => {
    if (!tour.isActive) return
    const step = tour.steps[tour.currentStep]
    if (!step) return

    if (step.id === 'status-badge') {
      const firstRole = myRoles[0]
      if (firstRole) {
        const roleItems = allItems.filter(i => i.assigned_role === firstRole.name)
        if (roleItems.length === 0) {
          tour.setDemo(tour.demoItem || {
            id: '__tour_demo__',
            name: 'Example Item',
            category: 'other',
            qty_needed: 1,
            qty_acquired: 0,
            sourcing: 'buy',
            source_name: null,
            cost_estimate: 25,
            actual_cost: null,
            storage_location: null,
            brought_by: null,
            assigned_role: '',
            space_id: null,
            status: 'needed',
            notes: null,
            created_by_invite: null,
            created_at: new Date().toISOString(),
          }, firstRole.name)
        }
      }
    } else if (tour.demoItem) {
      tour.setDemo(null, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.isActive, tour.currentStep, allItems, myRoles])

  const cycleStatus = async (item: InventoryItem) => {
    if (item.id === '__tour_demo__') {
      tour.setDemo({ ...item, status: item.status === 'needed' ? 'acquired' : 'needed' }, item.assigned_role)
      return
    }
    if (!canEditItem(profile, item)) return
    const idx = STATUS_CYCLE.indexOf(item.status as ItemStatus)
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
    await updateItem(item.id, { status: next })
    if (next === 'acquired') {
      playRandomSound()
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } })
    }
  }

  const handleAdd = async (e: FormEvent, roleName: string) => {
    e.preventDefault()
    if (!newItem.name.trim()) return
    if (!canEditRole(profile, roleName)) return
    await addItem({
      name: newItem.name.trim(),
      assigned_role: roleName,
      status: 'needed',
      category: 'other',
      qty_needed: 1,
      sourcing: newItem.sourcing,
      actual_cost: newItem.value ? parseFloat(newItem.value) : null,
      storage_location: newItem.location.trim() || null,
      notes: newItem.notes.trim() || null,
    })
    setNewItem({ name: '', location: '', sourcing: 'buy', value: '', notes: '' })
    setAddingForRole(null)
  }

  const cancelAdd = () => {
    setAddingForRole(null)
    setNewItem({ name: '', location: '', sourcing: 'buy', value: '', notes: '' })
  }

  const memberCount = activeProfiles.length
  const campFeeTotal = memberCount * CAMP_FEE_PER_PERSON
  const TotalBudget = ART_GRANT + campFeeTotal
  const budgetUsed = visibleItems.reduce((sum, item) => {
    if (item.sourcing === 'buy') {
      return sum + (item.actual_cost || item.cost_estimate || 0)
    }
    return sum
  }, 0)

  const readyCount = visibleItems.filter(i => i.status === 'acquired').length
  const paidCount = activeProfiles.filter(p => p.fee_paid).length

  const combinedReady = readyCount + paidCount
  const combinedTotal = visibleItems.length + activeProfiles.length
  const progressPct = combinedTotal ? Math.round((combinedReady / combinedTotal) * 100) : 0

  const tabs = [
    { id: 'my', label: isAdmin ? 'Roles' : 'My', icon: '🛠' },
    { id: 'camp', label: 'Camp', icon: '🔥' },
  ]

  if (loading) {
    return (
      <>
        <div className="max-w-[90rem] mx-auto p-4 pb-20">
          <div className="grid lg:grid-cols-[440px_1.2fr] gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="h-4 bg-secondary rounded w-1/2 mb-3" />
                <div className="h-3 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-3 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
        <TourOverlay />
        <OnboardingPrompt />
      </>
    )
  }

  if (showSettings) {
    return (
      <>
        <CampSettings
          members={activeProfiles}
          onAdd={addProfile}
          onDelete={deleteProfile}
          onBack={() => setShowSettings(false)}
          currentProfileId={profile?.id ?? null}
        />
        <TourOverlay />
        <OnboardingPrompt />
      </>
    )
  }

  const Header = (
    <div className="flex items-center justify-between mb-4" data-tour-target="header">
      <div>
        <h1 className="text-lg font-bold rainbow-text">The Playground</h1>
        <p className="text-[13px] font-bold tracking-widest text-muted-foreground">OTHERWORLD 2026 — MOIST.</p>
      </div>
      <div className="flex items-center gap-2">
        {profile && (
          <div className="flex items-center gap-2 text-sm">
            {isAdmin && (
              <span data-tour-target="members-btn">
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} title="Camp Settings">
                  <Settings size={16} />
                </Button>
              </span>
            )}
            <span
              className="inline-flex items-center justify-center rounded-full font-bold text-[13px] shrink-0"
              style={{
                width: 32,
                height: 32,
                backgroundColor: getMemberColor(profile.name) + '20',
                color: getMemberColor(profile.name),
                border: `2px solid ${getMemberColor(profile.name)}40`,
              }}
            >
              {profile.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
            </span>
            <span className="text-muted-foreground hidden sm:inline">{profile.name}</span>
            <Button variant="ghost" size="icon" onClick={() => tour.openPrompt()} title="Help">
              <HelpCircle size={14} />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} title="Log out">
              <LogOut size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  const myRolesPanel = (
    <MyRolesPanel
      roles={myRoles}
      items={allItems}
      expandedRole={expandedRole}
      onToggleRole={setExpandedRole}
      canEditRole={(name) => canEditRole(profile, name)}
      canEditItem={(item) => canEditItem(profile, item)}
      onCycleStatus={cycleStatus}
      onDelete={deleteItem}
      addingForRole={addingForRole}
      onStartAdd={setAddingForRole}
      onCancelAdd={cancelAdd}
      onAddItem={handleAdd}
      newItem={newItem}
      setNewItem={setNewItem}
      emptyMessage={isAdmin ? undefined : 'You aren\'t assigned to any roles yet.'}
      isAdmin={isAdmin}
      onUpdateRole={updateRole}
      onUpdateItem={updateItem}
      activeMembers={activeProfiles}
      demoItem={tour.demoItem}
      demoRoleName={tour.demoRoleName}
    />
  )

  const campPanel = (
    <CampOverview
      readyCount={readyCount}
      totalCount={visibleItems.length}
      progressPct={progressPct}
      budgetUsed={budgetUsed}
      budgetTotal={TotalBudget}
      paidCount={paidCount}
      roles={visibleRoles}
      items={visibleItems}
      profiles={activeProfiles}
      isAdmin={isAdmin}
      onToggleFeePaid={toggleFeePaid}
      tourStepId={tour.isActive ? tour.steps[tour.currentStep]?.id : undefined}
    />
  )

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 max-sm:p-3 pb-20">
        {Header}

        <div className="hidden lg:grid lg:grid-cols-[440px_1.2fr] gap-4">
          <div ref={rolesPanelRef} className="overflow-y-auto hide-scrollbar max-h-[calc(100vh-160px)]">
            <div className="mb-3" data-tour-target="my-roles-panel">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground">
                🛠 {isAdmin ? 'Roles' : 'My Roles'}
              </h3>
              <div className="h-px mt-1.5 bg-gradient-to-r from-[#b44dff] to-transparent" />
            </div>
            {myRolesPanel}
          </div>
          <div ref={campPanelRef} className="overflow-y-auto hide-scrollbar max-h-[calc(100vh-160px)]">
            <div className="mb-3" data-tour-target="camp-panel">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground">
                🔥 Camp
              </h3>
              <div className="h-px mt-1.5 bg-gradient-to-r from-[#ff6b35] via-[#ffd700] to-transparent" />
            </div>
            {campPanel}
          </div>
        </div>

        <div className="lg:hidden">
          <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          <div className={activeTab === 'my' ? '' : 'hidden'}>
            <div className="mb-2" data-tour-target="my-roles-panel">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground">
                🛠 {isAdmin ? 'Roles' : 'My Roles'}
              </h3>
            </div>
            <div>{myRolesPanel}</div>
          </div>
          <div className={activeTab === 'camp' ? '' : 'hidden'}>
            <div className="mb-2" data-tour-target="camp-panel">
              <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground">
                🔥 Camp
              </h3>
            </div>
            <div>{campPanel}</div>
          </div>
        </div>
      </div>

      <TourOverlay />
      <OnboardingPrompt />
    </>
  )
}

export function Dashboard() {
  const { profile, isAdmin } = useAuth()

  return (
    <TourProvider
      isAdmin={isAdmin}
      profileId={profile?.id ?? null}
      bypassOnboarding={profile?.bypass_onboarding ?? false}
    >
      <DashboardContent />
    </TourProvider>
  )
}
