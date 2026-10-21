/* Registry of documented components. Add an entry here when a component ships. */
import type { Example } from './types'
import { examples as button } from './button'

export interface ComponentEntry {
  /** Name as exported from the library. */
  name: string
  /** Source file in src/components. */
  file: string
  examples: Example[]
}

export const registry: Record<string, ComponentEntry> = {
  button: { name: 'Button', file: 'button.tsx', examples: button },
}
