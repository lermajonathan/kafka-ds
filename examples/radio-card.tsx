import { useState } from 'react'
import { IconCalendar, IconPeople, IconPen, RadioCardGroup } from '../src/components'
import type { Example } from './types'

const PLANES = [
  { value: 'taller', label: 'Taller suelto', description: 'Diez sesiones, un solo taller.', Icon: IconPen },
  { value: 'temporada', label: 'Temporada', description: 'Tres talleres a elegir durante el trimestre.', Icon: IconCalendar, badge: 'Más elegido' },
  { value: 'club', label: 'Club de lectura', description: 'Encuentros mensuales, sin tarea.', Icon: IconPeople, disabled: true },
]

function Demo() {
  const [v, setV] = useState('temporada')
  return (
    <div className="flex max-w-md flex-col gap-3">
      <RadioCardGroup label="Elige tu plan" hint="Puedes cambiarlo antes de pagar." options={PLANES} value={v} onChange={setV} />
      <p className="kafka-type-ui-caption">Plan: {v}</p>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Plans',
    description: 'Native radios shown as cards: arrow keys move and select, Tab leaves the group. The selected card has a stronger border and a filled dot, so colour is not the only signal. Use it when each option needs a title, a description or an icon; for plain options use RadioGroup.',
    render: () => <Demo />,
  },
  {
    id: 'error',
    title: 'With error',
    description: 'The message is read when the group gets focus, and marked with an icon as well as colour.',
    render: () => (
      <div className="max-w-md">
        <RadioCardGroup label="Modalidad" required error="Elige una modalidad para continuar." options={[{ value: 'v', label: 'Virtual' }, { value: 'p', label: 'Presencial' }]} />
      </div>
    ),
  },
]
