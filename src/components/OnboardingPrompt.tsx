import { useTour } from './tour/TourProvider'
import { Button } from './ui/button'

export function OnboardingPrompt() {
  const { isPromptOpen, start, dismissTracked } = useTour()

  if (!isPromptOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="glass-card rounded-2xl p-8 max-w-sm w-full text-center border border-white/10">
        <div className="text-3xl mb-3">🔥</div>
        <h2 className="text-lg font-bold text-white mb-2">Welcome to The Playground</h2>
        <p className="text-[13px] text-white/60 leading-relaxed">
          Would you like a quick tour to learn the key features?
        </p>
        <div className="flex flex-col gap-2 mt-6">
          <Button onClick={start}>Yes, show me around</Button>
          <button onClick={dismissTracked} className="text-[13px] text-white/30 hover:text-white/60 transition-colors py-1.5">
            No thanks, do not show again
          </button>
        </div>
      </div>
    </div>
  )
}
