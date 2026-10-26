import { useState } from 'react'
import { Button, NotificationCenter, type NotificationItem } from '../src/components'
import type { Example } from './types'

const initial: NotificationItem[] = [
  { id: 'n1', title: 'Pago confirmado', body: 'Recibimos tu comprobante de Nequi.', time: 'Hace 5 min', read: false, tone: 'success' },
  { id: 'n2', title: 'Cambió el horario del taller', body: 'Empieza a las 6:30 p. m.', time: 'Ayer', read: false },
  { id: 'n3', title: 'Cupos limitados', body: 'Quedan 3 cupos en poesía.', time: 'Hace 2 días', read: true, tone: 'warning' },
]

function Demo() {
  const [items, setItems] = useState(initial)
  return (
    <NotificationCenter
      items={items}
      onRead={(id) => setItems((all) => all.map((n) => (n.id === id ? { ...n, read: true } : n)))}
      onReadAll={() => setItems((all) => all.map((n) => ({ ...n, read: true })))}
      onDismiss={(id) => setItems((all) => all.filter((n) => n.id !== id))}
      footer={<Button variant="outline" block>Ver todas</Button>}
    />
  )
}

export const examples: Example[] = [
  {
    id: 'default',
    title: 'With unread items',
    description: 'The bell\'s name includes the count. The page owns the list, what "read" means and what dismissing does.',
    render: () => <Demo />,
  },
  {
    id: 'empty',
    title: 'Nothing yet',
    description: 'With no items the panel says so, in words, instead of opening empty.',
    render: () => <NotificationCenter items={[]} onRead={() => {}} />,
  },
]
