import { Avatar, AvatarGroup } from '../src/components'
import type { Example } from './types'

const people = [{ name: 'Camila Pérez' }, { name: 'Luis Ortega' }, { name: 'Marta Ríos' }, { name: 'Iván Soto' }, { name: 'Elena Cruz' }]

// Sample portraits drawn inline (no network, no real people): a tinted background, a head and shoulders.
const portrait = (hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="hsl(${hue} 45% 78%)"/><circle cx="48" cy="38" r="17" fill="hsl(${hue} 35% 38%)"/><path d="M12 96c2-22 18-34 36-34s34 12 36 34z" fill="hsl(${hue} 35% 38%)"/></svg>`,
  )}`
const camila = { name: 'Camila Pérez', src: portrait(28) }
const luis = { name: 'Luis Ortega', src: portrait(210) }
const marta = { name: 'Marta Ríos', src: portrait(330) }
const ivan = { name: 'Iván Soto', src: portrait(150) }
const photos = [camila, luis, marta, ivan]

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
    id: 'photos',
    title: 'Photos',
    description: 'With `src` the photo fills the circle; the name is its alt text. If the photo fails, the initials show instead. Use portraits with the person\'s permission.',
    render: () => (
      <div className="flex items-center gap-4">
        <Avatar name={camila.name} src={camila.src} size="sm" />
        <Avatar name={luis.name} src={luis.src} />
        <Avatar name={marta.name} src={marta.src} size="lg" />
        <Avatar name={ivan.name} src={ivan.src} status="online" />
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
    render: () => <AvatarGroup people={[...photos, ...people.slice(4)]} max={3} />,
  },
]
