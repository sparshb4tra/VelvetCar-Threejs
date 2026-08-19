import { useSyncExternalStore } from 'react'

export type VelvetTheme = 'light' | 'dark' | 'auto'

export type ResolvedTheme = 'light' | 'dark'

export interface Palette {
  body: string
  glass: string
  tire: string
  trim: string
  monogramTint: string
  taillight: string
}

const DARK_CAR: Palette = {
  body: '#26282d',
  glass: '#4b5058',
  tire: '#0f1013',
  trim: '#141518',
  monogramTint: '#ffe290',
  taillight: '#b3342e'
}

const LIGHT_CAR: Palette = {
  body: '#e5e6ea',
  glass: '#1b1d22',
  tire: '#141519',
  trim: '#232529',
  monogramTint: '#252525',
  taillight: '#b3342e'
}

export function paletteFor(theme: ResolvedTheme): Palette {
  return theme === 'light' ? DARK_CAR : LIGHT_CAR
}

export function resolveTheme(theme: VelvetTheme, prefersDark: boolean): ResolvedTheme {
  if (theme === 'auto') return prefersDark ? 'dark' : 'light'
  return theme
}

export function usePrefersDark(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false
  )
}