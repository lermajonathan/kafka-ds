import { ReadingTime } from '../src/components'
import type { Example } from './types'

export const examples: Example[] = [
  {
    id: 'from-text',
    title: 'From the text',
    description: 'Pass the text, or the word count if you already have it. The result is rounded up and never less than one minute.',
    render: () => (
      <div className="flex flex-wrap gap-6">
        <ReadingTime text="Un texto muy corto." />
        <ReadingTime words={1450} />
      </div>
    ),
  },
]
