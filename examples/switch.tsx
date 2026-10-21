import { Switch } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Settings',
    description: 'For settings that apply immediately. The role is `switch`, so the state is announced as "on" or "off".',
    render: () => (
      <div className="flex max-w-sm flex-col">
        <Switch label="Recordatorios por correo" description="Un día antes de cada clase." defaultChecked />
        <Switch label="Boletín mensual" />
        <Switch label="No disponible" disabled />
      </div>
    ),
  },
]
