import { Progress } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'With a label and value',
    description: '`label` names the bar for assistive technology (required). `showValue` repeats the percentage as text.',
    render: () => <div className="max-w-md"><Progress label="Subiendo inscripciones.csv" value={64} showValue /></div>,
  },
  {
    id: 'value-text',
    title: 'Readable value',
    description: '`valueText` replaces the percentage in what screen readers hear: "Paso 2 de 5".',
    render: () => <div className="max-w-md"><Progress label="Inscripción" value={40} valueText="Paso 2 de 5" /></div>,
  },
  {
    id: 'tones',
    title: 'Tones',
    description: 'Tone changes the fill only; the text or the label says what it means.',
    render: () => (
      <div className="flex max-w-md flex-col gap-4">
        <Progress label="Cupos ocupados" value={30} />
        <Progress label="Pago confirmado" value={100} tone="success" />
        <Progress label="Cupos casi llenos" value={85} tone="warning" />
        <Progress label="Espacio agotado" value={100} tone="danger" />
      </div>
    ),
  },
]
