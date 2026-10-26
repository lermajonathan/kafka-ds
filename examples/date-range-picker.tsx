import { useState } from 'react'
import { DateRangePicker, Field, type DateRange } from '../src/components'
import type { Example } from './types'

const PRESETS = [
  { label: 'Noviembre', range: { start: '2026-11-01', end: '2026-11-30' } },
  { label: 'Temporada de diciembre', range: { start: '2026-12-01', end: '2026-12-20' } },
]

function Demo({ initial = { start: null, end: null } as DateRange, narrow = false }) {
  const [range, setRange] = useState<DateRange>(initial)
  return (
    <div className={narrow ? 'max-w-60' : 'max-w-md'}>
      <Field label="Fechas del taller" hint="Elige el primer y el último día.">
        <DateRangePicker value={range} onValueChange={setRange} defaultMonth="2026-11-01" presets={PRESETS} />
      </Field>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Range with presets',
    description: 'A button that shows the chosen range and opens the calendar in a popover. The popover closes when the second day is chosen; Escape closes it and returns focus to the button. `onValueChange` is only called with a complete range or with an empty one, never half-picked. Presets are shortcuts to common ranges.',
    render: () => <Demo />,
  },
  {
    id: 'filled',
    title: 'With a value',
    description: 'The accessible name carries the label and the value: "Fechas del taller: Del 10 de nov de 2026 al 20 de nov de 2026".',
    render: () => <Demo initial={{ start: '2026-11-10', end: '2026-11-20' }} />,
  },
  {
    id: 'long',
    title: 'Long value in a narrow field',
    description: 'The value stays on one line and is cut with an ellipsis, so the field never grows taller. When it is cut, a tooltip shows the whole text on hover and on keyboard focus.',
    render: () => <Demo initial={{ start: '2026-11-10', end: '2026-11-20' }} narrow />,
  },
]
