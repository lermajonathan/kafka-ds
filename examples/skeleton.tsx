import { Skeleton } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Text lines',
    description: 'One announcement ("Cargando") for the whole group; the shapes are hidden from assistive technology.',
    render: () => <div className="max-w-md"><Skeleton lines={3} /></div>,
  },
  {
    id: 'card',
    title: 'Shapes',
    description: 'Compose circle, block and line to mirror the layout that is loading.',
    render: () => (
      <div className="flex max-w-md items-start gap-4">
        <Skeleton shape="circle" />
        <div className="flex-1"><Skeleton lines={2} /></div>
      </div>
    ),
  },
]
