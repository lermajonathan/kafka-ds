import { useState } from 'react'
import { InlineEdit } from '../src/components'
import type { Example } from './types'

function Demo() {
  const [title, setTitle] = useState('Relato sin título')
  const [note, setNote] = useState('')
  return (
    <div className="flex max-w-md flex-col gap-3">
      <InlineEdit label="Título del relato" value={title} onChange={setTitle} />
      <InlineEdit label="Nota" value={note} onChange={setNote} />
      <p className="kafka-type-ui-caption">Título: {title}</p>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Edit in place',
    description: 'A button that becomes a field. Enter or leaving the field saves; Escape cancels and returns to the button. The pencil is always visible, so touch users can see that it edits. An empty value shows the hint "Haz clic para editar". For several fields at once use a form.',
    render: () => <Demo />,
  },
]
