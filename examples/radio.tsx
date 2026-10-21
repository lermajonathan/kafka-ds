import { RadioGroup } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'group',
    title: 'Group',
    description: 'A `fieldset` with a `legend`. Arrow keys move and select; Tab leaves the group.',
    render: () => (
      <RadioGroup
        label="¿Cómo quieres tomar el taller?"
        hint="Puedes cambiarlo hasta una semana antes."
        defaultValue="virtual"
        options={[
          { value: 'virtual', label: 'Virtual', description: 'Por videollamada, con grabación.' },
          { value: 'presencial', label: 'Presencial' },
          { value: 'mixto', label: 'Mixto', disabled: true },
        ]}
      />
    ),
  },
  {
    id: 'error',
    title: 'With error',
    description: 'The message is read when the group gets focus, and marked with an icon as well as colour.',
    render: () => (
      <RadioGroup label="Plan" required error="Elige un plan para continuar." options={[{ value: 'a', label: 'Taller' }, { value: 'b', label: 'Membresía' }]} />
    ),
  },
]
