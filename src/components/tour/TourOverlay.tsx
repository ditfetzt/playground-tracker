import { useEffect, useMemo, useState, useRef } from 'react'
import { useTour } from './TourProvider'
import { TourTooltip } from './TourTooltip'

const PADDING = 8
const TRANSITION = 'all 300ms ease-out'
const TOOLTIP_EST_HEIGHT = 220

function isVisible(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el)
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
}

function rectIsValid(r: DOMRect): boolean {
  return r.width > 0 && r.height > 0
}

function findVisibleTarget(targetId: string): HTMLElement | null {
  const els = document.querySelectorAll(`[data-tour-target="${targetId}"]`)
  for (const el of els) {
    if (isVisible(el as HTMLElement)) {
      const rect = (el as HTMLElement).getBoundingClientRect()
      if (rectIsValid(rect)) return el as HTMLElement
    }
  }
  return null
}

export function TourOverlay() {
  const { isActive, steps, currentStep, next, prev } = useTour()
  const step = steps[currentStep]
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const scrolledRef = useRef(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!isActive) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, next, prev])

  useEffect(() => {
    if (!isActive || !step) return
    scrolledRef.current = false

    const tick = () => {
      const targetId = step.targetId
      if (!targetId) {
        setTargetRect(null)
        return
      }
      const el = findVisibleTarget(targetId)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rectIsValid(rect)) {
          setTargetRect(rect)

          if (!scrolledRef.current && (rect.bottom < 0 || rect.top > window.innerHeight)) {
            scrolledRef.current = true
            el.scrollIntoView({ behavior: 'instant', block: 'nearest' })
          }

          rafRef.current = requestAnimationFrame(tick)
          return
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isActive, step])

  const tooltipStyle = useMemo((): React.CSSProperties => {
    const gap = 12
    const tooltipW = 288

    if (!targetRect || !step?.targetId) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }

    const vw = window.innerWidth
    const vh = window.innerHeight

    const left = Math.round(
      Math.max(PADDING, Math.min(targetRect.left + targetRect.width / 2 - tooltipW / 2, vw - tooltipW - PADDING)),
    )

    const belowTop = targetRect.bottom + gap + PADDING
    const aboveBottom = targetRect.top - gap - PADDING

    if (belowTop + TOOLTIP_EST_HEIGHT <= vh - PADDING) {
      return { top: Math.round(belowTop), left }
    }

    if (aboveBottom - TOOLTIP_EST_HEIGHT >= PADDING) {
      return { top: Math.round(Math.max(PADDING, aboveBottom - TOOLTIP_EST_HEIGHT)), left }
    }

    const mid = Math.round(Math.max(PADDING, (vh - TOOLTIP_EST_HEIGHT) / 2))
    return { top: mid, left }
  }, [targetRect, step])

  if (!isActive) return null

  const r = targetRect
    ? {
        x: Math.max(targetRect.x - PADDING, 0),
        y: Math.max(targetRect.y - PADDING, 0),
        width: targetRect.width + PADDING * 2,
        height: targetRect.height + PADDING * 2,
      }
    : null

  const dim = 'rgba(8, 6, 20, 0.72)'

  return (
    <>
      <div className="fixed inset-0 z-[90]" style={{ pointerEvents: 'none' }}>
        {r ? (
          <>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: r.y,
              background: dim, pointerEvents: 'auto', transition: TRANSITION,
            }} />
            <div style={{
              position: 'absolute', top: r.y + r.height, left: 0, right: 0,
              bottom: 0, background: dim, pointerEvents: 'auto', transition: TRANSITION,
            }} />
            <div style={{
              position: 'absolute', top: r.y, left: 0, width: r.x,
              height: r.height, background: dim, pointerEvents: 'auto', transition: TRANSITION,
            }} />
            <div style={{
              position: 'absolute', top: r.y, left: r.x + r.width,
              right: 0, height: r.height, background: dim, pointerEvents: 'auto', transition: TRANSITION,
            }} />
          </>
        ) : (
          <div style={{
            position: 'absolute', inset: 0, background: dim, pointerEvents: 'auto', transition: TRANSITION,
          }} />
        )}
      </div>

      {r && (
        <div style={{
          position: 'fixed',
          zIndex: 91,
          top: r.y,
          left: r.x,
          width: r.width,
          height: r.height,
          borderRadius: 10,
          boxShadow: '0 0 0 2px rgba(180, 77, 255, 0.5)',
          pointerEvents: 'none',
          transition: TRANSITION,
        }} />
      )}

      <TourTooltip style={tooltipStyle} />
    </>
  )
}
