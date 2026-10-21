import { Field, Slider } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'default',
    title: 'Range with value',
    description: 'The value is shown as text next to the slider and exposed as `aria-valuetext`.',
    render: () => (
      <div className="max-w-sm">
        <Field label="Sesiones por temporada">
          <Slider min={1} max={10} defaultValue={4} formatValue={(v) => `${v} sesiones`} />
        </Field>
      </div>
    ),
  },
]
