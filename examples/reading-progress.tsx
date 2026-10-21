import { ReadingProgress } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'values',
    title: 'Controlled value',
    description: 'Pass `value` (0 to 100) when you track progress yourself. `position="static"` keeps the bar in the flow.',
    render: () => (
      <div className="flex max-w-md flex-col gap-4">
        <ReadingProgress value={0} position="static" label="Progreso 0" />
        <ReadingProgress value={40} position="static" label="Progreso 40" />
        <ReadingProgress value={100} position="static" label="Progreso 100" />
      </div>
    ),
  },
  {
    id: 'follows-scroll',
    title: 'Follows the scroll',
    description: 'Without `value`, the bar fixes itself to the top of the viewport and follows the page (or `targetRef`, the element being read).',
    render: () => <ReadingProgress label="Progreso de la página" />,
  },
]
