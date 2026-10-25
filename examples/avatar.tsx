import { Avatar, AvatarGroup } from '../src/components'
import type { Example } from './types'

const people = [{ name: 'Camila Pérez' }, { name: 'Luis Ortega' }, { name: 'Marta Ríos' }, { name: 'Iván Soto' }, { name: 'Elena Cruz' }]

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Initials and sizes',
    description: '`name` is required: it is the accessible name and the source of the initials.',
    render: () => (
      <div className="flex items-center gap-4">
        <Avatar name="Camila Pérez" size="sm" />
        <Avatar name="Camila Pérez" />
        <Avatar name="Camila Pérez" size="lg" />
        <Avatar name="Altazor Taller" square />
      </div>
    ),
  },
  {
    id: 'fallback',
    title: 'Image that fails to load',
    description: 'A broken `src` shows the initials instead of a broken image.',
    render: () => <Avatar name="Luis Ortega" src="/no-existe.jpg" />,
  },
  {
    id: 'status',
    title: 'Presence status',
    description: 'The dot is announced with its own text, so colour is never the only cue. Use `decorative` when the name is already visible beside it.',
    render: () => (
      <div className="flex items-center gap-4">
        <Avatar name="Camila Pérez" status="online" />
        <Avatar name="Luis Ortega" status="away" />
        <Avatar name="Marta Ríos" status="busy" />
        <div className="flex items-center gap-2"><Avatar name="Iván Soto" status="offline" decorative /><span>Iván Soto</span></div>
      </div>
    ),
  },
  {
    id: 'group',
    title: 'Group',
    description: 'Overlapping avatars with a +N chip for the rest.',
    render: () => <AvatarGroup people={people} max={3} />,
  },
]
