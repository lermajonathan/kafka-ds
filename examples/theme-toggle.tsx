import { ThemeProvider, ThemeToggle, useTheme, type ThemeMode } from '../src/components'
import type { Example } from './types'

function Readout() {
  const { mode, resolved } = useTheme()
  return <p className="kafka-type-ui-caption">Elegido: {mode} · aplicado: {resolved}</p>
}

// The playground forces a theme; start from it so the page keeps its look until the reader chooses.
const initial = (): ThemeMode => (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Light, dark or system',
    description: 'The provider sets `data-theme` on `<html>` and remembers the choice in `localStorage` (it still works if storage is blocked). With "Sistema" it follows the device and reacts when the device changes. Put `ThemeProvider` once, near the root, and inline `themeInitScript()` in `<head>` so the first paint already has the right theme.',
    render: () => (
      <ThemeProvider defaultMode={initial()} storageKey="kafka-docs-theme">
        <div className="flex flex-col gap-3">
          <ThemeToggle />
          <Readout />
        </div>
      </ThemeProvider>
    ),
  },
]
