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

function Many() {
  const [tags, setTags] = useState(['poesía', 'cuento', 'ensayo', 'crónica', 'teatro', 'novela', 'microrrelato'])
  return (
    <div className="max-w-md">
      <Field label="Todos tus géneros" hint="La caja crece por filas completas.">
        <TagInput value={tags} onChange={setTags} placeholder="Añadir" />
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
  {
    id: 'many',
    title: 'Many tags',
    description: 'Tags are small (32 px) and sit inside the field, so a few tags never make it taller. When they run out of room they wrap onto a new row and the text box wraps with them, never overflowing.',
    render: () => <Many />,
  },
]
