import { motion } from 'framer-motion'
import { useCamp } from '../../context/CampContext'

const LABELS = ['Dehydrated', 'Parched', 'Damp', 'Moist', 'Soaked']

export function MoistureGauge() {
  const { data } = useCamp()
  const total = data.items.length
  const done = data.items.filter(i => i.status === 'on_site' || i.status === 'acquired').length
  const pct = total ? Math.round(done / total * 100) : 0
  const label = LABELS[Math.min(Math.floor(pct / 20), 4)]

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-ink-secondary whitespace-nowrap">Moisture</span>
      <div className="w-32 h-2.5 bg-wood rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--color-danger), var(--color-gold), var(--color-moss))' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <motion.span
        className="text-sm font-semibold whitespace-nowrap min-w-[5rem]"
        key={label}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
      >
        {label} ({pct}%)
      </motion.span>
    </div>
  )
}
