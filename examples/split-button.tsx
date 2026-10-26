import { useState } from 'react'
import { IconCalendar, SplitButton } from '../src/components'
import type { Example } from './types'

function Demo({ variant }: { variant?: 'primary' | 'soft' | 'outline' }) {
  const [last, setLast] = useState('ninguna')
  return (
    <div className="flex flex-col gap-3">
      <SplitButton
        label="Inscribirme"
        variant={variant}
        onClick={() => setLast('inscribirme')}
        items={[
          { label: 'Inscribirme con un amigo', onSelect: () => setLast('amigo') },
          { label: 'Añadir al calendario', Icon: IconCalendar, onSelect: () => setLast('calendario') },
          { label: 'Guardar para después', onSelect: () => setLast('guardar') },
        ]}
      />
      <p className="kafka-type-ui-caption">Última acción: {last}</p>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Primary action and alternatives',
    description: 'The main part runs the usual action; the arrow opens a menu of related ones. Both parts are 44 px tall. Use it when one action is clearly the common one; otherwise use a Menu.',
    render: () => <Demo />,
  },
  {
    id: 'outline',
    title: 'Outline',
    description: 'Takes the same variants as a Button.',
    render: () => <Demo variant="outline" />,
  },
]
