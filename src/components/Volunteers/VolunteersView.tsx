import { useState, type FormEvent } from 'react'
import { useCamp } from '../../context/CampContext'
import { Modal } from '../ui/Modal'
import { ProgressRing } from '../ui/ProgressRing'
import { Plus } from 'lucide-react'

export function VolunteersView() {
  const { data, addVolunteerHours } = useCamp()
  const [modalOpen, setModalOpen] = useState(false)

  const target = 12

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">⏱️ Volunteer Hours</h2>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-moss text-white text-sm font-semibold hover:bg-moss-light transition-colors">
          <Plus size={15} /> Log Hours
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2.5">
        {data.profiles.map(p => {
          const hours = data.volunteerHours.filter(v => v.profile_id === p.id).reduce((s, v) => s + Number(v.hours), 0)
          const pct = Math.min(hours / target * 100, 100)
          const color = pct >= 100 ? 'var(--color-moss)' : pct >= 60 ? 'var(--color-gold)' : 'var(--color-danger)'
          return (
            <div key={p.id} className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3">
              <span className="text-2xl">{p.emoji || '🙋'}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{p.name}</div>
                <div className="text-xs text-ink-secondary">{hours.toFixed(1)}h / {target}h</div>
              </div>
              <ProgressRing pct={pct} size={44} color={color} />
            </div>
          )
        })}
      </div>

      <VolModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={addVolunteerHours} profiles={data.profiles} />
    </div>
  )
}

function VolModal({ open, onClose, onSave, profiles }: { open: boolean; onClose: () => void; onSave: (d: any) => Promise<void>; profiles: any[] }) {
  const [form, setForm] = useState({ profile_id: profiles[0]?.id || '', hours: '', type: 'pre_camp', task: '' })
  const [saving, setSaving] = useState(false)
  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ ...form, hours: parseFloat(form.hours) })
      onClose()
      setForm({ profile_id: profiles[0]?.id || '', hours: '', type: 'pre_camp', task: '' })
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="Log Volunteer Hours">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Person</label>
            <select value={form.profile_id} onChange={set('profile_id')} className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss">
              {profiles.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Hours</label>
            <input value={form.hours} onChange={set('hours')} type="number" step="0.5" min="0.5" required className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Type</label>
            <select value={form.type} onChange={set('type')} className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss">
              <option value="pre_camp">Pre-camp prep</option><option value="on_site">On-site</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-secondary block mb-1">Task</label>
            <input value={form.task} onChange={set('task')} placeholder="What did they do?" className="w-full px-3 py-2 border border-wood rounded-lg bg-surface text-sm outline-none focus:border-moss" />
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-surface text-ink-secondary text-sm font-semibold hover:bg-wood">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-moss text-white text-sm font-semibold hover:bg-moss-light disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
