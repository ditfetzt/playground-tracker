import { useState, type FormEvent } from 'react'
import { useCamp } from '../../context/CampContext'
import { useAuth } from '../../context/AuthContext'
import { Modal } from '../ui/Modal'
import { Plus, Trash2 } from 'lucide-react'

export function FinanceView() {
  const { data, addFinance, deleteFinance } = useCamp()
  const { isAdmin } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  const income = data.finances.filter(f => f.type === 'income').reduce((s, f) => s + Number(f.amount), 0)
  const expense = data.finances.filter(f => f.type === 'expense').reduce((s, f) => s + Number(f.amount), 0)
  const balance = income - expense
  const pct = income ? Math.min(expense / income * 100, 100) : 0

  const budgetClass = pct > 85 ? 'bg-glow-ember/20' : pct > 65 ? 'bg-glow-gold/80' : 'btn-primary'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">💰 Finance</h2>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg btn-primary text-white text-sm font-semibold hover:btn-primary-light transition-colors">
          <Plus size={15} /> Add Entry
        </button>
      </div>

      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-3 mb-4">
        <div className="bg-card glass-card rounded-lg p-4 shadow-glow-purple/10">
          <div className="text-xs text-text-secondary font-medium">Total Income</div>
          <div className="text-2xl font-bold text-glow-green mt-1">${income.toFixed(2)}</div>
        </div>
        <div className="bg-card glass-card rounded-lg p-4 shadow-glow-purple/10">
          <div className="text-xs text-text-secondary font-medium">Total Expenses</div>
          <div className="text-2xl font-bold text-glow-ember mt-1">${expense.toFixed(2)}</div>
        </div>
        <div className="bg-card glass-card rounded-lg p-4 shadow-glow-purple/10">
          <div className="text-xs text-text-secondary font-medium">Balance</div>
          <div className="text-2xl font-bold mt-1" style={{ color: balance < 0 ? 'var(--color-danger)' : '' }}>
            ${balance.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="h-3 bg-border-glow/30 rounded-full overflow-hidden mb-4">
        <div className={`h-full rounded-full transition-all duration-500 ${budgetClass}`} style={{ width: `${pct}%` }} />
      </div>

      {data.finances.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <div className="text-5xl mb-3">💰</div>
          <p className="text-sm">No entries yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-card glass-card rounded-lg shadow-glow-purple/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                <th className="text-left px-4 py-2.5 bg-surface/50">Date</th>
                <th className="text-left px-4 py-2.5 bg-surface/50">Type</th>
                <th className="text-left px-4 py-2.5 bg-surface/50">Category</th>
                <th className="text-left px-4 py-2.5 bg-surface/50">Description</th>
                <th className="text-left px-4 py-2.5 bg-surface/50">Person</th>
                <th className="text-right px-4 py-2.5 bg-surface/50">Amount</th>
                <th className="text-left px-4 py-2.5 bg-surface/50">Status</th>
                {isAdmin && <th className="px-2 py-2.5 bg-surface/50"></th>}
              </tr>
            </thead>
            <tbody>
              {data.finances.map(f => (
                <tr key={f.id} className="hover:bg-card-hover/50 transition-colors">
                  <td className="px-4 py-2 text-text-secondary">{f.date || '-'}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${f.type === 'income' ? 'btn-primary-pale text-glow-green' : 'bg-glow-ember/15 text-ember'}`}>
                      {f.type === 'income' ? '↓' : '↑'} {f.type}
                    </span>
                  </td>
                  <td className="px-4 py-2">{f.category}</td>
                  <td className="px-4 py-2">{f.description || '-'}</td>
                  <td className="px-4 py-2">{f.person || '-'}</td>
                  <td className={`px-4 py-2 text-right font-mono font-medium ${f.type === 'income' ? 'text-glow-green' : 'text-glow-ember'}`}>
                    {f.type === 'income' ? '+' : '-'}${Number(f.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs capitalize">{f.status}</span>
                  </td>
                  {isAdmin && (
                    <td className="px-2 py-2">
                      <button onClick={() => { if (confirm('Delete this entry?')) deleteFinance(f.id) }} className="p-1 rounded hover:bg-glow-ember/15 text-text-muted">
                        <Trash2 size={12} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FinanceModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={addFinance} />
    </div>
  )
}

function FinanceModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (data: any) => Promise<void> }) {
  const [form, setForm] = useState({ type: 'expense', category: 'materials', amount: '', description: '', person: '', status: 'pending' })
  const [saving, setSaving] = useState(false)

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ ...form, amount: parseFloat(form.amount) })
      onClose()
      setForm({ type: 'expense', category: 'materials', amount: '', description: '', person: '', status: 'pending' })
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="New Finance Entry">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Type</label>
            <select value={form.type} onChange={set('type')} className="w-full px-3 py-2 border border-border-glow rounded-lg bg-surface/50 text-sm outline-none focus:border-moss">
              <option value="income">Income</option><option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Category</label>
            <select value={form.category} onChange={set('category')} className="w-full px-3 py-2 border border-border-glow rounded-lg bg-surface/50 text-sm outline-none focus:border-moss">
              <option value="grant">Grant</option><option value="camp_fee">Camp fee</option>
              <option value="materials">Materials</option><option value="transport">Transport</option>
              <option value="food">Food</option><option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Amount ($)</label>
            <input value={form.amount} onChange={set('amount')} type="number" step="0.01" min="0" required className="w-full px-3 py-2 border border-border-glow rounded-lg bg-surface/50 text-sm outline-none focus:border-moss" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1">Person</label>
            <input value={form.person} onChange={set('person')} placeholder="Who?" className="w-full px-3 py-2 border border-border-glow rounded-lg bg-surface/50 text-sm outline-none focus:border-moss" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Description</label>
          <input value={form.description} onChange={set('description')} required placeholder="What for?" className="w-full px-3 py-2 border border-border-glow rounded-lg bg-surface/50 text-sm outline-none focus:border-moss" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Status</label>
          <select value={form.status} onChange={set('status')} className="w-full px-3 py-2 border border-border-glow rounded-lg bg-surface/50 text-sm outline-none focus:border-moss">
            <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="paid">Paid</option>
          </select>
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
