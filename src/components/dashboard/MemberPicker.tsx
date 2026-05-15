import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Profile } from '../../lib/types'
import { getMemberColor } from '../../lib/constants'
import { Input } from '../ui/input'
import { X, ChevronDown } from 'lucide-react'

interface MemberPickerProps {
  mode: 'single' | 'multi'
  members: Profile[]
  selected: string[]
  onChange: (selected: string[]) => void
  exclude?: string[]
  placeholder?: string
}

export function MemberPicker({ mode, members, selected, onChange, exclude = [], placeholder = 'Select...' }: MemberPickerProps) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const available = members.filter(m =>
    !selected.includes(m.name) &&
    !exclude.includes(m.name) &&
    m.name.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (ref.current && !ref.current.contains(target) && !dropdownRef.current?.contains(target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = () => {
    if (!open && ref.current) {
      setTriggerRect(ref.current.getBoundingClientRect())
    }
    setOpen(!open)
    setFilter('')
  }

  const select = (name: string) => {
    if (mode === 'single') {
      onChange([name])
      setOpen(false)
      setFilter('')
    } else {
      onChange([...selected, name])
      setFilter('')
    }
  }

  const remove = (name: string) => {
    onChange(selected.filter(s => s !== name))
  }

  return (
    <div ref={ref} className="relative">
      {mode === 'single' ? (
        <button
          type="button"
          onClick={toggle}
          className="w-full flex items-center gap-2 px-3 py-2 rounded border border-input bg-background text-foreground text-sm hover:border-ring transition-colors"
        >
          {selected[0] ? (
            <>
              <span
                className="inline-flex items-center justify-center rounded-full font-bold text-[8px] shrink-0"
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: getMemberColor(selected[0]) + '20',
                  color: getMemberColor(selected[0]),
                }}
              >
                {selected[0].slice(0, 2)}
              </span>
              <span className="flex-1 text-left">{selected[0]}</span>
            </>
          ) : (
            <span className="flex-1 text-left text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown size={14} className={`text-muted-foreground transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <div className="border border-input rounded bg-background">
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1 p-2">
              {selected.map(name => (
                <span key={name} className="flex items-center gap-0.5 text-[13px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <span
                    className="inline-flex items-center justify-center rounded-full font-bold text-[6px] shrink-0"
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: getMemberColor(name) + '20',
                      color: getMemberColor(name),
                    }}
                  >
                    {name.slice(0, 2)}
                  </span>
                  {name}
                  <button type="button" onClick={() => remove(name)} className="ml-0.5 hover:text-destructive">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={toggle}
            className="w-full flex items-center gap-1 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>+</span> {selected.length > 0 ? 'Add support' : placeholder}
          </button>
        </div>
      )}

      {open && triggerRect && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[200] bg-popover border border-border rounded-lg shadow-xl max-h-48 overflow-y-auto"
          style={{
            top: triggerRect.bottom + 4,
            left: triggerRect.left,
            width: triggerRect.width,
          }}
        >
          <div className="sticky top-0 p-2 border-b border-border bg-popover">
            <Input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Search..."
              autoFocus
              className="text-xs"
            />
          </div>
          {available.length === 0 ? (
            <p className="text-xs text-muted-foreground p-3 text-center">No members found</p>
          ) : (
            available.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => select(m.name)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-secondary/50 transition-colors text-left"
              >
                <span
                  className="inline-flex items-center justify-center rounded-full font-bold text-[7px] shrink-0"
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: getMemberColor(m.name) + '20',
                    color: getMemberColor(m.name),
                  }}
                >
                  {m.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
                <span className="text-foreground">{m.name}</span>
              </button>
            ))
          )}
        </div>,
        document.body,
      )}
    </div>
  )
}
