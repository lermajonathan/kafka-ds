import { useState } from 'react'
import { RangeCalendar, type DateRange } from '../src/components'
import type { Example } from './types'

function Demo({ min, max }: { min?: string; max?: string }) {
  const [range, setRange] = useState<DateRange>({ start: null, end: null })
  return <RangeCalendar value={range} onValueChange={setRange} defaultMonth="2026-11-01" min={min} max={max} />
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Pick a range',
    description: 'Choose the first day, then the last. A third choice starts a new range, and choosing an earlier second day swaps the two. The line under the grid says what to do next and is announced; the first and last days are named in words for screen readers. Same keys as Calendar.',
    render: () => <Demo />,
  },
  {
    id: 'limits',
    title: 'With limits',
    description: '`min` and `max` disable the days outside them, as in Calendar.',
    render: () => <Demo min="2026-11-05" max="2026-11-25" />,
  },
]
