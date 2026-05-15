/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'
import type { InventoryItem } from '../../lib/types'
import { isOnboardingDismissed, trackOnboardingDismissed, trackOnboardingCompleted } from '../../lib/onboarding'
import { getFilteredSteps, type TourStep } from './tour-steps'

export interface TourCallbacks {
  switchTab: (tab: string) => void
  expandRole: (roleName: string | null) => void
  reset: () => void
}

interface TourState {
  isPromptOpen: boolean
  isActive: boolean
  isDismissed: boolean
  currentStep: number
  steps: TourStep[]
  demoItem: InventoryItem | null
  demoRoleName: string | null
  isAdmin: boolean
  openPrompt: () => void
  start: () => void
  dismiss: () => void
  dismissTracked: () => Promise<void>
  complete: () => Promise<void>
  next: () => void
  prev: () => void
  restart: () => void
  setDemo: (item: InventoryItem | null, roleName: string | null) => void
  setCallbacks: (cb: TourCallbacks) => void
}

const TourContext = createContext<TourState | null>(null)

export function useTour() {
  const ctx = useContext(TourContext)
  if (!ctx) throw new Error('useTour must be inside TourProvider')
  return ctx
}

export function TourProvider({
  isAdmin,
  profileId,
  bypassOnboarding,
  roleNames,
  onTracked,
  children,
}: {
  isAdmin: boolean
  profileId: string | null
  bypassOnboarding: boolean
  roleNames: string[]
  onTracked?: () => void
  children: ReactNode
}) {
  const callbacksRef = useRef<TourCallbacks | null>(null)
  const steps = getFilteredSteps(isAdmin, roleNames)
  const [isPromptOpen, setIsPromptOpen] = useState(!bypassOnboarding && !isOnboardingDismissed())
  const [isActive, setIsActive] = useState(false)
  const [isDismissed, setIsDismissed] = useState(isOnboardingDismissed())
  const [currentStep, setCurrentStep] = useState(0)
  const [demoItem, setDemoItemState] = useState<InventoryItem | null>(null)
  const [demoRoleName, setDemoRoleName] = useState<string | null>(null)

  const setCallbacks = useCallback((cb: TourCallbacks) => {
    callbacksRef.current = cb
  }, [])

  const openPrompt = useCallback(() => {
    setIsPromptOpen(true)
  }, [])

  const start = useCallback(() => {
    setIsPromptOpen(false)
    setIsActive(true)
    setCurrentStep(0)
  }, [])

  const dismiss = useCallback(() => {
    setIsPromptOpen(false)
    setIsActive(false)
    setIsDismissed(true)
    setDemoItemState(null)
    setDemoRoleName(null)
    callbacksRef.current?.expandRole(null)
  }, [])

  const dismissTracked = useCallback(async () => {
    console.log('[TourProvider] dismissTracked, profileId:', profileId)
    await trackOnboardingDismissed(profileId || '')
    console.log('[TourProvider] calling onTracked refresh')
    onTracked?.()
    dismiss()
  }, [profileId, dismiss, onTracked])

  const complete = useCallback(async () => {
    console.log('[TourProvider] complete, profileId:', profileId)
    await trackOnboardingCompleted(profileId || '')
    console.log('[TourProvider] calling onTracked refresh')
    onTracked?.()
    dismiss()
  }, [profileId, dismiss, onTracked])

  const jump = useCallback(
    (index: number, direction: 1 | -1) => {
      let target = index
      while (target >= 0 && target < steps.length) {
        const step = steps[target]
        if (!step.skipIfMissing) break
        if (step.targetId && document.querySelector(`[data-tour-target="${step.targetId}"]`)) break
        target += direction
      }

      if (target < 0 || target >= steps.length) {
        setIsActive(false)
        setDemoItemState(null)
        setDemoRoleName(null)
        callbacksRef.current?.expandRole(null)
        return
      }

      const prevIndex = target
      const step = steps[prevIndex]
      setCurrentStep(prevIndex)

      const cbs = callbacksRef.current
      if (cbs) {
        if (step.expandFirstRole && prevIndex !== currentStep) {
          cbs.reset()
          setTimeout(() => {
            callbacksRef.current?.expandRole('')
            if (step.tab) callbacksRef.current?.switchTab(step.tab)
          }, 150)
        } else if (step.tab) {
          cbs.switchTab(step.tab)
        }
      }
    },
    [steps, currentStep],
  )

  const next = useCallback(() => {
    if (currentStep === steps.length - 1) {
      complete()
      return
    }
    jump(currentStep + 1, 1)
  }, [jump, currentStep, steps.length, complete])

  const prev = useCallback(() => jump(currentStep - 1, -1), [jump, currentStep])

  const restart = useCallback(() => {
    setCurrentStep(0)
    setIsActive(true)
    setDemoItemState(null)
    setDemoRoleName(null)
    callbacksRef.current?.expandRole(null)
    callbacksRef.current?.switchTab('my')
  }, [])

  const setDemo = useCallback((item: InventoryItem | null, roleName: string | null) => {
    if (item && roleName) {
      setDemoItemState({ ...item, assigned_role: roleName })
    } else {
      setDemoItemState(null)
    }
    setDemoRoleName(roleName)
  }, [])

  return (
    <TourContext.Provider
      value={{
        isPromptOpen,
        isActive,
        isDismissed,
        currentStep,
        steps,
        demoItem,
        demoRoleName,
        isAdmin,
        openPrompt,
        start,
        dismiss,
        dismissTracked,
        complete,
        next,
        prev,
        restart,
        setDemo,
        setCallbacks,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}
