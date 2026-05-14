import { useId, type ChangeEvent } from 'react'
import { cn } from '../../lib/utils'

interface CheckboxProps {
  id?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function Checkbox({ id, checked, onCheckedChange, className }: CheckboxProps) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className={cn('flex items-center shrink-0', className)}>
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onCheckedChange(e.target.checked)}
        className="w-4 h-4 rounded border border-white/20 bg-white/5 text-primary cursor-pointer
          focus:ring-1 focus:ring-primary/50 focus:ring-offset-0
          checked:bg-primary checked:border-primary"
      />
    </div>
  )
}
