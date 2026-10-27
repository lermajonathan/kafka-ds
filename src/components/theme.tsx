/* Kafka · Theme: ThemeProvider, useTheme, ThemeToggle and themeInitScript.
   Dark mode is the `[data-theme="dark"]` block of the token CSS. This file only decides which value the
   attribute on <html> takes: the reader's choice, or the device setting when the choice is "system".
   The choice is remembered in localStorage and everything still works if storage is blocked. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { IconDesktop, IconMoon, IconSun } from '../icons'
import { useLabels } from './labels'
import { SegmentedControl } from './segmented-control'

export type ThemeMode = 'light' | 'dark' | 'system'
interface ThemeContextValue {
  mode: ThemeMode
  resolved: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
}

const DEFAULT_KEY = 'kafka-theme'
const ThemeContext = createContext<ThemeContextValue>({ mode: 'system', resolved: 'light', setMode: () => {} })

const systemDark = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches
const isMode = (v: unknown): v is ThemeMode => v === 'light' || v === 'dark' || v === 'system'

/** Inline this in `<head>`, before your CSS, so the first paint already has the right theme:
 *  `<script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />` */
export const themeInitScript = (storageKey: string = DEFAULT_KEY) =>
  `(function(){try{var m=localStorage.getItem(${JSON.stringify(storageKey)})||'system';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.setAttribute('data-theme',d?'dark':'light');e.style.colorScheme=d?'dark':'light'}catch(e){}})()`

export interface ThemeProviderProps {
  defaultMode?: ThemeMode
  /** Where the choice is remembered. `null` turns remembering off. */
  storageKey?: string | null
  children: ReactNode
}

/** Sets `data-theme` on `<html>` from the reader's choice. Put it once, near the root. */
export function ThemeProvider({ defaultMode = 'system', storageKey = DEFAULT_KEY, children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode)
  const [dark, setDark] = useState(false)

  // Read the stored choice after mount, so server and client markup match.
  useEffect(() => {
    if (storageKey === null) return
    try {
      const stored = localStorage.getItem(storageKey)
      if (isMode(stored)) setModeState(stored)
    } catch { /* storage blocked */ }
  }, [storageKey])

  useEffect(() => {
    const apply = () => {
      const isDark = mode === 'dark' || (mode === 'system' && systemDark())
      setDark(isDark)
      const root = document.documentElement
      root.setAttribute('data-theme', isDark ? 'dark' : 'light')
      root.style.colorScheme = isDark ? 'dark' : 'light'
    }
    apply()
    if (mode !== 'system') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [mode])

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next)
      if (storageKey === null) return
      try { localStorage.setItem(storageKey, next) } catch { /* storage blocked */ }
    },
    [storageKey],
  )

  const value = useMemo<ThemeContextValue>(() => ({ mode, resolved: dark ? 'dark' : 'light', setMode }), [mode, dark, setMode])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** The chosen mode, the theme actually applied, and a setter. */
export const useTheme = () => useContext(ThemeContext)

export interface ThemeToggleProps {
  size?: 'sm' | 'md'
  /** Only the sun, moon and screen icons; the names stay for screen readers and as tooltips. For a phone header. */
  iconOnly?: boolean
  className?: string
}

/** Light, dark or system as a radio group. Needs a `ThemeProvider` above it. */
export function ThemeToggle({ size = 'md', iconOnly = false, className }: ThemeToggleProps) {
  const labels = useLabels()
  const { mode, setMode } = useTheme()
  return (
    <SegmentedControl<ThemeMode>
      label={labels.theme}
      size={size}
      iconOnly={iconOnly}
      className={className}
      value={mode}
      onChange={setMode}
      options={[
        { value: 'light', label: labels.themeLight, Icon: IconSun },
        { value: 'dark', label: labels.themeDark, Icon: IconMoon },
        { value: 'system', label: labels.themeSystem, Icon: IconDesktop },
      ]}
    />
  )
}
