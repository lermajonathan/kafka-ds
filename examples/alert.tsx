import { useState } from 'react'
import { Alert, Button } from '../src/components'
import type { Example } from './types'

function Dismissible() {
  const [open, setOpen] = useState(true)
  return open ? (
    <Alert tone="info" title="Cambió el horario" onDismiss={() => setOpen(false)} action={<Button variant="outline">Ver horario</Button>}>
      El taller del jueves empieza a las 6:30 p. m.
    </Alert>
  ) : (
    <Button variant="outline" onClick={() => setOpen(true)}>Mostrar el aviso otra vez</Button>
  )
}

export const examples: Example[] = [
  {
    id: 'tones',
    title: 'Tones',
    description: 'Every tone carries an icon and a border, so none depends on colour. Use `urgent` only when the reader must hear it now.',
    render: () => (
      <div className="flex max-w-xl flex-col gap-4">
        <Alert tone="info" title="Inscripciones abiertas">Quedan 8 cupos para el taller de poesía.</Alert>
        <Alert tone="success" title="Pago confirmado">Recibimos tu comprobante de Nequi.</Alert>
        <Alert tone="warning" title="Últimos cupos">El taller cierra el viernes.</Alert>
        <Alert tone="danger" urgent title="No pudimos enviar tu inscripción">Revisa tu conexión e inténtalo de nuevo.</Alert>
      </div>
    ),
  },
  {
    id: 'dismissible',
    title: 'Dismissible, with an action',
    description: 'The close button is 44 px. The page decides where focus goes after it closes.',
    render: () => <div className="max-w-xl"><Dismissible /></div>,
  },
]
