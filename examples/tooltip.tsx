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
  {
    id: 'placements',
    title: 'Placements',
    description: 'The arrow always points at the control it describes. The tooltip flips to the opposite side when there is no room.',
    render: () => (
      <div className="flex flex-wrap items-center justify-center gap-24 px-24 py-16">
        {(['top', 'bottom', 'left', 'right'] as const).map((placement) => {
          const label = { top: 'Arriba', bottom: 'Abajo', left: 'Izquierda', right: 'Derecha' }[placement]
          return (
            <Tooltip key={placement} placement={placement} content={`Aparece ${label.toLowerCase()}`}>
              <IconButton Icon={IconClose} label={label} variant="outline" />
            </Tooltip>
          )
        })}
      </div>
    ),
  },
]
