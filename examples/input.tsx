import { Field, IconCheck, Input } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Text field',
    description: 'At least 44 px tall, 16 px text, and a 3:1 border so the field is visible without relying on a fill.',
    render: () => (
      <div className="flex max-w-sm flex-col gap-6">
        <Field label="Nombre completo"><Input autoComplete="name" /></Field>
        <Field label="Ciudad"><Input Icon={IconCheck} defaultValue="Bogotá" /></Field>
        <Field label="Código"><Input disabled defaultValue="No editable" /></Field>
      </div>
    ),
  },
]
