import { CountBadge } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Counts',
    description: 'Above `max` it shows "9+". At zero it renders nothing, unless `showZero` is set.',
    render: () => (
      <div className="flex items-center gap-4">
        <CountBadge count={3} />
        <CountBadge count={12} />
        <CountBadge count={0} />
        <CountBadge count={0} showZero />
      </div>
    ),
  },
  {
    id: 'labelled',
    title: 'With a spoken label',
    description: 'When the number stands alone, `label` says what it counts.',
    render: () => <CountBadge count={5} label="5 mensajes sin leer" />,
  },
]
