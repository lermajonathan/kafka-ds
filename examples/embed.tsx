import { Embed } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Loaded frame',
    description: 'A titled, sandboxed frame with a link to open the content on its own.',
    render: () => (
      <div className="max-w-xl">
        <Embed src="/embed-demo.html" title="Contenido de ejemplo" caption="Presentación interactiva." ratio="4/3" />
      </div>
    ),
  },
  {
    id: 'deferred',
    title: 'Click to load',
    description: 'With `deferred`, nothing is requested from the provider until the reader asks for it.',
    render: () => (
      <div className="max-w-xl">
        <Embed src="/embed-demo.html" title="Presentación interactiva" caption="Se carga al pulsar el botón." ratio="16/9" deferred />
      </div>
    ),
  },
]
