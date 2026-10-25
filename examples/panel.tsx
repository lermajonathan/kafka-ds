import { Button, IconClock, IconInfo, Panel } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Header, body and footer',
    description: 'The title is a heading (level 3 by default). Actions sit in the header; the footer holds the buttons that save or cancel.',
    render: () => (
      <Panel
        className="max-w-xl"
        title="Recordatorios"
        description="Cuándo te avisamos antes de cada sesión"
        Icon={IconClock}
        actions={<Button variant="outline">Editar</Button>}
        footer={<><Button variant="outline">Cancelar</Button><Button>Guardar</Button></>}
      >
        <p>Te escribimos un día antes y dos horas antes de cada sesión.</p>
      </Panel>
    ),
  },
  {
    id: 'collapsible',
    title: 'Collapsible',
    description: 'The chevron is a 44 px button with `aria-expanded`, named by the title.',
    render: () => (
      <Panel className="max-w-xl" title="Política de inscripción" iconTone="info" Icon={IconInfo} collapsible headingLevel={4}>
        <p>Puedes cancelar hasta 48 horas antes del primer encuentro.</p>
      </Panel>
    ),
  },
]
