import { useState } from 'react'
import { defaultReadingPreferences, Prose, ReadingSettings, readingStyle, type ReadingPreferences } from '../src/components'
import type { Example } from './types'

function Demo() {
  const [prefs, setPrefs] = useState<ReadingPreferences>(defaultReadingPreferences)
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr]">
      <ReadingSettings value={prefs} onChange={setPrefs} showTheme={false} />
      <Prose style={readingStyle(prefs)} data-testid="sample" aria-label="Texto de muestra" role="region">
        <p>La luz de la tarde entraba por la ventana y se quedaba en la mesa, como si también ella esperara el comienzo de la clase.</p>
      </Prose>
    </div>
  )
}

export const examples: Example[] = [
  {
    id: 'controlled',
    title: 'Controlled panel',
    description: 'The panel reports a `ReadingPreferences` object; `readingStyle(prefs)` turns it into the CSS variables that `Prose` reads. Save the object in your own storage if you want it to persist.',
    render: () => <Demo />,
  },
]
