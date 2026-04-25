import { useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'

export function useConfetti() {
  const lastFired = useRef(0)

  const fire = useCallback(() => {
    const now = Date.now()
    if (now - lastFired.current < 2000) return
    lastFired.current = now

    const defaults = { spread: 60, ticks: 80, gravity: 0.6, decay: 0.94, startVelocity: 25 }
    confetti({ ...defaults, particleCount: 40, origin: { y: 0.6 } })
    confetti({ ...defaults, particleCount: 20, origin: { x: 0.2, y: 0.7 }, angle: 60 })
    confetti({ ...defaults, particleCount: 20, origin: { x: 0.8, y: 0.7 }, angle: 120 })
  }, [])

  return { fire }
}
