import { Field, Textarea } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Multi-line',
    description: 'Resizable vertically. Use it for answers longer than a sentence.',
    render: () => (
      <div className="max-w-md">
        <Field label="Cuéntanos por qué quieres participar" hint="Una o dos frases bastan.">
          <Textarea />
        </Field>
      </div>
    ),
  },
]
