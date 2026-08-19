import { useSyncExternalStore } from 'react'

/** UI theme prop. 'auto' follows `prefers-color-scheme`. */
export type VelvetTheme = 'light' | 'dark' | 'auto'

/** Resolved (non-auto) theme. */
export type ResolvedTheme = 'light' | 'dark'

/** Per-theme material palette. */
export interface Palette {
  body: string
  glass: string
  tire: string
  trim: string
  monogram: string
  taillight: string
}

// light UI  -> dark car
const DARK_CAR: Palette = {
  body: '#26282d',
  glass: '#4b5058',
  tire: '#0f1013',
  trim: '#141518',
  monogram: '#e6c65a',
  taillight: '#b3342e'
}

// dark UI -> light car
const LIGHT_CAR: Palette = {
  body: '#e5e6ea',
  glass: '#1b1d22',
  tire: '#141519',
  trim: '#232529',
  monogram: '#b8891c',
  taillight: '#b3342e'
}

const PALETTES: Record<ResolvedTheme, Palette> = {
  light: DARK_CAR,
  dark: LIGHT_CAR
}

export function paletteFor(theme: ResolvedTheme): Palette {
  return PALETTES[theme]
}

export function resolveTheme(theme: VelvetTheme, prefersDark: boolean): ResolvedTheme {
  if (theme === 'auto') return prefersDark ? 'dark' : 'light'
  return theme
}

/* ------------------------------------------------------------------ */
/*  React hook — reactive `prefers-color-scheme: dark` (SSR-safe).  */
/* ------------------------------------------------------------------ */

function _mf_listener(cb: () => void): () => void {
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  mql.addEventListener('change', cb)
  return () => mql.removeEventListener('change', cb)
}

function _mf_snap(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function usePrefersDark(): boolean {
  return useSyncExternalStore(_mf_listener, _mf_snap, () => false)
}