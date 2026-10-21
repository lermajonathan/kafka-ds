import { Figure } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Image with caption and credit',
    description: 'The alt text says what the image shows; the caption says why it is here.',
    render: () => (
      <div className="max-w-xl">
        <Figure src="/portada.svg" alt="Una luna dorada sobre dos colinas oscuras" caption="La luz llega siempre tarde al fondo del cuadro." credit="Ilustración de ejemplo" />
      </div>
    ),
  },
  {
    id: 'ratios',
    title: 'Ratios',
    description: 'Crop to a ratio so a page does not jump while images load.',
    render: () => (
      <div className="grid max-w-xl grid-cols-2 gap-4">
        <Figure src="/portada.svg" alt="Una luna dorada sobre dos colinas oscuras" ratio="1/1" />
        <Figure src="/portada.svg" alt="Una luna dorada sobre dos colinas oscuras" ratio="3/4" />
      </div>
    ),
  },
]
