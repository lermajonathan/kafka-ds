import { Divider } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Horizontal',
    description: 'A real `<hr>`: screen readers announce a separator.',
    render: () => (
      <div className="max-w-xl">
        <p>Primer bloque</p>
        <Divider className="my-4" />
        <p>Segundo bloque</p>
      </div>
    ),
  },
  {
    id: 'labelled',
    title: 'With a label',
    description: 'The text is read as normal content; the two rules are hidden from assistive technology.',
    render: () => <div className="max-w-xl"><Divider label="o continúa con" /></div>,
  },
  {
    id: 'vertical',
    title: 'Vertical and decorative',
    description: '`decorative` removes the separator role when the line only adds ornament.',
    render: () => (
      <div className="flex h-8 items-center gap-4">
        <span>Taller</span>
        <Divider orientation="vertical" />
        <span>Poesía</span>
        <Divider orientation="vertical" decorative />
        <span>Jueves</span>
      </div>
    ),
  },
]
