export type Theme = 'neon' | 'blush' | 'ember'

const KEY = 'playground_theme'
const DEFAULT: Theme = 'neon'

const THEMES: Theme[] = ['neon', 'blush', 'ember']

export function getTheme(): Theme {
  const stored = localStorage.getItem(KEY)
  return (stored && THEMES.includes(stored as Theme) ? stored : DEFAULT) as Theme
}

export function setTheme(theme: Theme) {
  localStorage.setItem(KEY, theme)
  document.documentElement.dataset.theme = theme
}

export function toggleTheme(): Theme {
  const current = getTheme()
  const idx = THEMES.indexOf(current)
  const next = THEMES[(idx + 1) % THEMES.length]
  setTheme(next)
  return next
}

export function initTheme() {
  const theme = getTheme()
  document.documentElement.dataset.theme = theme
}
