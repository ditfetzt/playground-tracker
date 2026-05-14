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
  console.log('[trackOnboardingDismissed] profileId:', profileId)
  const { data, error } = await supabase
    .from('profiles')
    .update({ onboarding_dismissed_at: new Date().toISOString() })
    .eq('id', profileId)
    .select()
  if (error) {
    console.error('[trackOnboardingDismissed] error:', error.message, error.details, error.hint)
  } else if (!data || data.length === 0) {
    console.warn('[trackOnboardingDismissed] no rows matched — profileId may be wrong or table inaccessible')
  } else {
    console.log('[trackOnboardingDismissed] success, updated:', data[0]?.name)
  }
}

export async function trackOnboardingCompleted(profileId: string) {
  console.log('[trackOnboardingCompleted] profileId:', profileId)
  const { data, error } = await supabase
    .from('profiles')
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq('id', profileId)
    .select()
  if (error) {
    console.error('[trackOnboardingCompleted] error:', error.message, error.details, error.hint)
  } else if (!data || data.length === 0) {
    console.warn('[trackOnboardingCompleted] no rows matched — profileId may be wrong or table inaccessible')
  } else {
    console.log('[trackOnboardingCompleted] success, updated:', data[0]?.name)
  }
}

export async function resetOnboardingForAll(profileId: string) {
  localStorage.removeItem(DISMISSED_KEY)
  const { data, error } = await supabase
    .from('profiles')
    .update({
      onboarding_dismissed_at: null,
      onboarding_completed_at: null,
    })
    .neq('id', profileId)
    .select()
  if (error) {
    console.error('[resetOnboardingForAll] error:', error.message, error.details, error.hint)
  } else {
    console.log('[resetOnboardingForAll] success, reset', data?.length ?? 0, 'profiles')
  }
}
