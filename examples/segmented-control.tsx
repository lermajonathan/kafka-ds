import { useState } from 'react'
import { IconCalendar, IconFile, SegmentedControl } from '../src/components'
import type { Example } from './types'

function Demo({ size }: { size?: 'sm' | 'md' }) {
  const [v, setV] = useState('mes')
  return (
    <div className="flex flex-col gap-3">
      <SegmentedControl label="Vista del calendario" size={size} value={v} onChange={setV} options={[{ value: 'dia', label: 'Día' }, { value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes' }]} />
      <p className="kafka-type-ui-caption">Vista: {v}</p>
    </div>
  )
}

function WithIcons() {
  const [v, setV] = useState('lista')
  return <SegmentedControl label="Formato" value={v} onChange={setV} options={[{ value: 'lista', label: 'Lista', Icon: IconFile }, { value: 'calendario', label: 'Calendario', Icon: IconCalendar }]} />
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Default',
    description: 'One option is always selected. Arrow keys move and select, Home and End jump to the ends, and the strip is a single Tab stop. Use it for views of the same content; for navigation between pages use Tabs.',
    render: () => <Demo />,
  },
  {
    id: 'small',
    title: 'Small',
    description: '`size="sm"` is 32 px high, for dense toolbars. Keep `md` (44 px) as the default for anything a thumb has to hit.',
    render: () => <Demo size="sm" />,
  },
  {
    id: 'icons',
    title: 'With icons',
    description: 'The icon never replaces the text: every option keeps its visible label.',
    render: () => <WithIcons />,
  },
]
