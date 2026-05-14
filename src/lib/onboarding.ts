import { supabase } from './supabase'

const DISMISSED_KEY = 'playground_onboarding_dismissed'

export function isOnboardingDismissed(): boolean {
  return localStorage.getItem(DISMISSED_KEY) === 'true'
}

export function dismissOnboarding() {
  localStorage.setItem(DISMISSED_KEY, 'true')
}

export function resetOnboarding() {
  localStorage.removeItem(DISMISSED_KEY)
}

export async function trackOnboardingDismissed(profileId: string) {
  localStorage.setItem(DISMISSED_KEY, 'true')
  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_dismissed_at: new Date().toISOString() })
    .eq('id', profileId)
  if (error) console.error('[trackOnboardingDismissed]', error)
}

export async function trackOnboardingCompleted(profileId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq('id', profileId)
  if (error) console.error('[trackOnboardingCompleted]', error)
}

export async function resetOnboardingForAll(profileId: string) {
  localStorage.removeItem(DISMISSED_KEY)
  const { error } = await supabase
    .from('profiles')
    .update({
      onboarding_dismissed_at: null,
      onboarding_completed_at: null,
    })
    .neq('id', profileId)
  if (error) console.error('[resetOnboardingForAll]', error)
}
