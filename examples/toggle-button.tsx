import { useState } from 'react'
import { IconBell, IconCheck, ToggleButton } from '../src/components'
import type { Example } from './types'

function Demo() {
  const [on, setOn] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <ToggleButton label="Seguir taller" Icon={IconBell} PressedIcon={IconCheck} pressed={on} onPressedChange={setOn} />
      <p className="kafka-type-ui-caption">{on ? 'Siguiendo' : 'Sin seguir'}</p>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Follow',
    description: 'A button that stays pressed. The label never changes, because the state is announced by `aria-pressed`: "Seguir taller, pulsado". Do not write "Seguir" / "Dejar de seguir" as the label.',
    render: () => <Demo />,
  },
  {
    id: 'disabled',
    title: 'Disabled',
    description: 'Takes any Button prop.',
    render: () => <ToggleButton label="Seguir taller" Icon={IconBell} defaultPressed disabled />,
  },
]
