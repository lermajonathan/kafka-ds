import { useState } from 'react'
import { Button, Field, Input, Modal } from '../src/components'
import type { Example } from './types'

function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir inscripción</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Inscripción al taller"
        description="Déjanos tus datos y te escribimos con los pasos de pago."
        actions={<><Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button><Button onClick={() => setOpen(false)}>Enviar</Button></>}
      >
        <Field label="Correo electrónico"><Input type="email" autoComplete="email" /></Field>
      </Modal>
    </>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Form in a dialog',
    description: 'The page behind is inert, Tab stays inside, Esc closes, and focus returns to the button that opened it.',
    render: () => <Demo />,
  },
]
