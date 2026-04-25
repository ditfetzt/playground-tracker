import { motion } from 'framer-motion'
import { useCamp } from '../../context/CampContext'
import { Package, DollarSign, Timer } from 'lucide-react'

export function StatsBar() {
  const { data } = useCamp()
  const total = data.items.length
  const done = data.items.filter(i => i.status === 'on_site' || i.status === 'acquired').length
  const income = data.finances.filter(f => f.type === 'income').reduce((s, f) => s + Number(f.amount), 0)
  const expense = data.finances.filter(f => f.type === 'expense').reduce((s, f) => s + Number(f.amount), 0)
  const hours = data.volunteerHours.reduce((s, v) => s + Number(v.hours), 0)

  const stats = [
    { icon: Package, label: 'Items acquired', value: `${done}/${total}`, color: 'text-glow-green' },
    { icon: DollarSign, label: 'Remaining budget', value: `$${Math.max(0, income - expense).toFixed(0)}`, color: 'text-text' },
    { icon: Timer, label: 'Volunteer hours', value: `${hours.toFixed(1)}h`, color: 'text-text' },
  ]

  return (
    <div className="grid grid-cols-3 max-md:grid-cols-1 gap-2.5 mb-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="bg-card glass-card rounded-lg px-4 py-2.5 shadow-glow-purple/10 flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <stat.icon size={22} className="text-text-muted shrink-0" />
          <div>
            <div className="text-xl font-bold leading-tight tabular-nums stat-glow">{stat.value}</div>
            <div className="text-xs text-text-secondary">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
