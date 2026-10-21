import { useState } from 'react'
import { Field, TagInput } from '../src/components'
import type { Example } from './types'

function Demo() {
  const [tags, setTags] = useState(['poesía', 'cuento'])
  return (
    <div className="max-w-md">
      <Field label="Géneros que escribes" hint="Escribe y pulsa Intro o coma.">
        <TagInput value={tags} onChange={setTags} placeholder="Añade un género" />
      </Field>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Free-form tags',
    description: 'Each tag has its own remove button, and additions and removals are announced.',
    render: () => <Demo />,
  },
]
