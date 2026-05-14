import { useTour } from './TourProvider'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { useState } from 'react'
import { dismissOnboarding, resetOnboarding } from '../../lib/onboarding'

interface TourTooltipProps {
  style: React.CSSProperties
}

export function TourTooltip({ style }: TourTooltipProps) {
  const { steps, currentStep, next, prev, dismiss, dismissTracked, complete, isDismissed, restart, isAdmin } = useTour()
  const [dontShow, setDontShow] = useState(isDismissed)
  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  const handleSkip = () => {
    if (dontShow) {
      dismissTracked()
    } else {
      dismiss()
    }
  }

  const handleNext = () => {
    if (dontShow) {
      dismissOnboarding()
    }
    next()
  }

  const handleDone = () => {
    if (dontShow) {
      dismissOnboarding()
    }
    complete()
  }

  const handleReset = () => {
    resetOnboarding()
    restart()
  }

  return (
    <div
      className="fixed z-[100] max-w-[calc(100vw-2rem)] w-72 glass-card p-4 rounded-xl border border-white/10 shadow-2xl"
      style={style}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-bold uppercase tracking-widest text-white/40">
          {currentStep + 1} / {steps.length}
        </span>
      </div>

      <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
      <p className="text-[13px] text-white/60 leading-relaxed">{step.content}</p>

      <div className="flex items-center justify-between gap-2 mt-4">
        <div className="flex gap-1.5">
          {!isFirst && (
            <Button variant="ghost" size="sm" onClick={prev}>
              Back
            </Button>
          )}
          {isLast ? (
            <Button size="sm" onClick={handleDone}>
              Done
            </Button>
          ) : (
            <Button size="sm" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
        <button
          onClick={handleSkip}
          className="text-[12px] text-white/30 hover:text-white/60 transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
        <Checkbox
          id="tour-dont-show"
          checked={dontShow}
          onCheckedChange={(v) => setDontShow(v === true)}
        />
        <label htmlFor="tour-dont-show" className="text-[12px] text-white/40 cursor-pointer select-none flex-1">
          Do not show again on login
        </label>
      </div>

      {isLast && isAdmin && (
        <button
          onClick={handleReset}
          className="w-full mt-2 text-[12px] text-white/25 hover:text-white/50 transition-colors py-1"
        >
          Reset onboarding for all accounts
        </button>
      )}
    </div>
  )
}
