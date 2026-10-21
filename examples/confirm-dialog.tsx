import { useState } from 'react'
import { Button, ConfirmDialog } from '../src/components'
import type { Example } from './types'

function Demo() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="outline" onClick={() => { setDone(false); setOpen(true) }}>Eliminar relato</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        tone="danger"
        title="¿Eliminar el relato?"
        description="Se borrarán el texto y sus comentarios. No se puede deshacer."
        confirmLabel="Eliminar relato"
        onConfirm={() => setDone(true)}
      />
      {done && <p role="status">Relato eliminado.</p>}
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'danger',
    title: 'Destructive action',
    description: 'In the `danger` tone, focus starts on Cancel and a click outside does not close the dialog.',
    render: () => <Demo />,
  },
]
