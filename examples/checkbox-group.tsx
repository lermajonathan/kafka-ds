import { useState } from 'react'
import { CheckboxGroup } from '../src/components'
import type { Example } from './types'

const TALLERES = [
  { value: 'poesia', label: 'Poesía', description: 'Jueves en la noche' },
  { value: 'narrativa', label: 'Narrativa' },
  { value: 'ensayo', label: 'Ensayo' },
  { value: 'cuento', label: 'Cuento corto', disabled: true, description: 'Sin cupos esta temporada' },
]

function Demo() {
  const [v, setV] = useState<string[]>(['poesia'])
  return (
    <div className="flex flex-col gap-3">
      <CheckboxGroup label="Talleres de interés" selectAll options={TALLERES} value={v} onChange={setV} />
      <p className="kafka-type-ui-caption">{v.length} seleccionados</p>
    </div>
  )
}

function WithError() {
  const [v, setV] = useState<string[]>([])
  return (
    <CheckboxGroup
      label="Días disponibles"
      required
      hint="Marca todos los que te sirvan."
      error={v.length === 0 ? 'Elige al menos un día.' : undefined}
      options={[{ value: 'lun', label: 'Lunes' }, { value: 'mie', label: 'Miércoles' }, { value: 'vie', label: 'Viernes' }]}
      value={v}
      onChange={setV}
    />
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'With select all',
    description: 'A `fieldset` named by its legend. "Seleccionar todos" shows the mixed state when only some are chosen, and it skips disabled options. The page owns the list of chosen values.',
    render: () => <Demo />,
  },
  {
    id: 'error',
    title: 'With hint and error',
    description: 'The hint and the message are read with the group. The message disappears as soon as one option is chosen.',
    render: () => <WithError />,
  },
]
