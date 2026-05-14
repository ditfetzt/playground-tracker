export interface TourStep {
  id: string
  title: string
  content: string
  targetId: string | null
  adminOnly?: boolean
  requiredRole?: string
  requireItems?: boolean
  tab?: 'my' | 'camp'
  expandFirstRole?: boolean
  skipIfMissing?: boolean
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to the Playground!',
    content: 'This is your camp\'s command centre — the place where roles, gear, budget, and readiness come together in real time. Over the next minute, you\'ll learn exactly where to find what you need and how to jump right in. You\'ve got this.',
    targetId: null,
  },
  {
    id: 'header',
    title: 'That\'s You',
    content: 'Your initials and name sit up here. Whenever you want it to have changed, tell one of the Admins. The logout button is tucked here too — though we doubt you\'ll want to leave the Playground. :P',
    targetId: 'header',
  },
  {
    id: 'members-btn',
    title: 'Camp Settings',
    content: 'This is your mission control for the crew. Here you can add new members, see invite codes, check who has logged in, and track who has completed the welcome tour. Every person here is part of making this camp happen.',
    targetId: 'members-btn',
    adminOnly: true,
  },
  {
    id: 'my-roles',
    title: 'Your Roles, Your Mission',
    content: 'This is where your assigned roles live. Every role card is a little mission you own — expand it to see what gear is needed, what\'s already sourced, and where you can make an impact right now.',
    targetId: 'my-roles-panel',
    tab: 'my',
  },
  {
    id: 'status-badge',
    title: 'Tap to Make It Happen',
    content: 'This is the heartbeat of the tracker. Finalize an item? Tap its badge to mark it from "Needed" to "Got it". Everyone sees the progress update in real time. Go ahead and try it.',
    targetId: 'status-badge',
    tab: 'my',
    expandFirstRole: true,
  },
  {
    id: 'add-item',
    title: 'Spot a Gap? Fill It.',
    content: 'Use the + Add Item button inside any role card when you think of something the camp still needs. Choose whether you\'re buying it or source it somehow, set a cost, drop a location where the item is right now and optionally some notes.',
    targetId: 'add-item-btn',
    tab: 'my',
    expandFirstRole: true,
  },
  {
    id: 'role-edit',
    title: 'Shape the Team',
    content: 'Every role needs a lead and support crew. Click the pencil icon to reassign who\'s driving what. Changes ripple through the whole tracker instantly — the right people, in the right places.',
    targetId: 'role-edit-btn',
    tab: 'my',
    expandFirstRole: false,
    adminOnly: true,
  },
  {
    id: 'camp-tab',
    title: 'The Big Picture',
    content: 'Switch over to the Camp panel. This is where you see the whole camp\'s heartbeat — are we on track? Do we have enough gear? Who\'s paid? Let\'s take a look together.',
    targetId: 'camp-panel',
    tab: 'camp',
  },
  {
    id: 'progress-ring',
    title: 'The Readiness Ring',
    content: 'This circle is the camp\'s pulse. It combines every item acquired and every camp fee paid into a single percentage. Every time something is marked done, this number climbs. Aim for that glorious 100%.',
    targetId: 'progress-ring',
    tab: 'camp',
  },
  {
    id: 'camp-fees',
    title: 'Camp Fees at a Glance',
    content: 'Here you\'ll see who has contributed and where to send your e-transfer. Every paid fee pushes the readiness up and keeps the camp humming.',
    targetId: 'camp-fees',
    tab: 'camp',
    skipIfMissing: true,
  },
  {
    id: 'fee-toggle',
    title: 'Track Contributions',
    content: 'Tap any member\'s name to toggle their fee from unpaid to paid. It updates the readiness score immediately. Keeping this current means everyone knows where we stand.',
    targetId: 'fee-toggle',
    tab: 'camp',
    adminOnly: true,
    requiredRole: 'Inventory & Finance',
    skipIfMissing: true,
  },
  {
    id: 'needs-buying',
    title: 'What Still Needs Buying',
    content: 'Items marked Needed with a Buy tag show up here with their cost. This is your camp\'s shopping list — scan it, pick something up, and watch it disappear from this list when you mark it Acquired.',
    targetId: 'needs-buying',
    tab: 'camp',
    skipIfMissing: true,
  },
  {
    id: 'needs-sourcing',
    title: 'What Still Needs Finding',
    content: 'These are the items the camp needs to borrow or track down. A quick scan before the event ensures nothing slips through the cracks. Know someone with a spare? Speak up — you might be the hero.',
    targetId: 'needs-sourcing',
    tab: 'camp',
    skipIfMissing: true,
  },
  {
    id: 'done',
    title: 'You\'re Ready',
    content: 'The ? icon in the top bar always brings this tour back. Now go check your roles, mark something acquired, add an item — every tap moves the camp closer to ready. Let\'s make Otherworld unforgettable.',
    targetId: null,
  },
]

export function getFilteredSteps(isAdmin: boolean, roleNames: string[]): TourStep[] {
  return TOUR_STEPS.filter(
    (s) =>
      (!s.adminOnly || isAdmin) &&
      (!s.requiredRole || roleNames.includes(s.requiredRole)),
  )
}
