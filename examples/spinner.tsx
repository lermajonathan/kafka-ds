import { Spinner } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Sizes',
    description: 'It announces "Cargando" by default. Under reduced motion it turns slowly instead of stopping, so it still reads as "in progress".',
    render: () => (
      <div className="flex items-center gap-6">
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" />
      </div>
    ),
  },
  {
    id: 'label',
    title: 'Specific label',
    description: 'Say what is happening when "Cargando" is too vague.',
    render: () => <Spinner label="Guardando tu inscripción…" />,
  },
]
