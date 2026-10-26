import { useState } from 'react'
import { Button, ToastStack, type ToastItem } from '../src/components'
import type { Example } from './types'

/** The page owns the list: Toast is controlled, so the page decides what stays and what goes. One stack per page. */
function Demo() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const dismiss = (id: string) => setToasts((all) => all.filter((t) => t.id !== id))
  const add = (item: Omit<ToastItem, 'id'>) => setToasts((all) => [...all, { id: `t${Date.now()}${Math.random().toString(36).slice(2, 6)}`, ...item }])
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => add({ tone: 'success', title: 'Cambios guardados', description: 'Actualizamos tu inscripción.', action: { label: 'Deshacer', onClick: () => {} } })}>Guardar cambios</Button>
        <Button variant="outline" onClick={() => add({ tone: 'info', title: 'Borrador guardado', duration: 6000 })}>Guardar borrador</Button>
        <Button variant="outline" onClick={() => add({ tone: 'danger', title: 'No pudimos guardar', description: 'Revisa tu conexión e inténtalo de nuevo.', duration: 500 })}>Simular error</Button>
      </div>
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Manual, automatic and error',
    description: 'By default a toast stays until the reader closes it, and one follow-up action such as Undo also closes it. Set `duration` (milliseconds) for low-stakes feedback: the timer pauses while the pointer is over the toast or focus is inside it. A danger toast ignores `duration` and is announced as an alert.',
    render: () => <Demo />,
  },
]
