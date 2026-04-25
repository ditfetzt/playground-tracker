import { useState, type FormEvent } from 'react'
import { useCamp } from '../../context/CampContext'
import { Modal } from '../ui/Modal'
import { Plus } from 'lucide-react'

export function TicketsView() {
  const { data, addTicket } = useCamp()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">🎫 Tickets</h2>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg btn-primary text-white text-sm font-semibold hover:btn-primary-light transition-colors">
          <Plus size={15} /> Add
        </button>
      </div>

      {data.tickets.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <div className="text-5xl mb-3">🎫</div>
          <p className="text-sm">No tickets tracked yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2.5">
          {data.tickets.map(t => {
            const p = data.profiles.find(pp => pp.id === t.profile_id)
            return (
              <div key={t.id} className="bg-card glass-card rounded-lg p-4 shadow-glow-purple/10 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{p?.name || 'Unknown'} {p?.emoji || ''}</div>
                  <div className="text-xs text-text-secondary">Source: {t.source}{t.notes ? ` — ${t.notes}` : ''}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                  t.status === 'confirmed' ? 'btn-primary-pale text-glow-green' :
                  t.status === 'issued' ? 'bg-border-glow/30 text-text-secondary' :
                  'glow-badge text-text-secondary'
                }`}>
                  {t.status}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <TicketModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={addTicket} profiles={data.profiles} />
    </div>
  )
}

function TicketModal({ open, onClose, onSave, profiles }: { open: boolean; onClose: () => void; onSave: (d: any) => Promise<void>; profiles: any[] }) {
  const [form, setForm] = useState({ profile_id: profiles[0]?.id || '', source: 'grant', status: 'pending', notes: '' })
  const [saving, setSaving] = useState(false)
  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
      onClose()
      setForm({ profile_id: profiles[0]?.id || '', source: 'grant', status: 'pending', notes: '' })
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Ticket">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Person</label>
            <select value={form.profile_id} onChange={set('profile_id')} className="w-full px-3 py-2 border border-border-glow rounded-lg bg-surface/50 text-sm outline-none focus:border-moss">
              {profiles.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Source</label>
            <select value={form.source} onChange={set('source')} className="w-full px-3 py-2 border border-border-glow rounded-lg bg-surface/50 text-sm outline-none focus:border-moss">
              <option value="grant">Grant</option><option value="directed">Directed</option>
              <option value="volunteer">Volunteer</option><option value="general">General</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Status</label>
            <select value={form.status} onChange={set('status')} className="w-full px-3 py-2 border border-border-glow rounded-lg bg-surface/50 text-sm outline-none focus:border-moss">
              <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="issued">Issued</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Notes</label>
            <input value={form.notes} onChange={set('notes')} placeholder="Optional" className="w-full px-3 py-2 border border-border-glow rounded-lg bg-surface/50 text-sm outline-none focus:border-moss" />
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-surface/50 text-text-secondary text-sm font-semibold hover:bg-border-glow/30">Cancel</button>
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg btn-primary text-white text-sm font-semibold hover:btn-primary-light disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
