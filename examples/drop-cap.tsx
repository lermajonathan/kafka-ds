import { DropCap } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'First paragraph',
    description: 'One per text, at its start. Quotes and dashes before the first letter are taken into the initial by the browser.',
    render: () => (
      <div className="max-w-xl">
        <DropCap>
          Cuando abrió la puerta, la casa ya había empezado a hablar. Eran ruidos pequeños, de tablas que se acomodan y de agua que baja por las paredes, y ella los escuchó con la atención de quien aprende un idioma.
        </DropCap>
      </div>
    ),
  },
]
