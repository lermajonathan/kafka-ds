import { Calendar } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Month grid',
    description: 'Arrow keys move by day and week, Page Up and Down by month. Days outside `min` and `max` are disabled.',
    render: () => <Calendar defaultValue="2026-10-21" min="2026-10-05" max="2026-12-20" />,
  },
]
