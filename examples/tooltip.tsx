import { IconButton, IconClose, Tooltip } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'On an icon button',
    description: 'Shown on keyboard focus or after hovering; Esc hides it. The icon button already has a name: the tooltip adds a short description.',
    render: () => (
      <div className="flex h-24 items-end">
        <Tooltip content="Cierra el panel y descarta los cambios">
          <IconButton Icon={IconClose} label="Cerrar" variant="outline" />
        </Tooltip>
      </div>
    ),
  },
]
