import { useState } from 'react'
import { DatePicker, Field } from '../src/components'
import type { Example } from './types'

function Demo() {
  const [date, setDate] = useState<string | null>('2026-11-14')
  return (
    <div className="max-w-xs">
      <Field label="Fecha de inicio" hint="Escribe día/mes/año o abre el calendario.">
        <DatePicker value={date} onValueChange={setDate} min="2026-10-01" />
      </Field>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Typed or picked',
    description: 'Both ways write the same value (`YYYY-MM-DD`). The calendar opens in a popover and returns focus to its button.',
    render: () => <Demo />,
  },
]
