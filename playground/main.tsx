// Renders every registered example. `?theme=dark|light` forces a theme (the tests use it);
// `?only=button` renders one component.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles/kafka.css'
import { KafkaProvider, labelsEs } from '../src/components'
import { registry } from '../examples'

const params = new URLSearchParams(location.search)
const theme = params.get('theme')
if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme
const only = params.get('only')

function App() {
  const entries = Object.entries(registry).filter(([id]) => !only || id === only)
  return (
    <KafkaProvider labels={labelsEs}>
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="kafka-type-reading-heading-lg mb-8">Kafka · Playground</h1>
        {entries.map(([id, entry]) => (
          <section key={id} id={id} aria-labelledby={`${id}-title`} className="mb-12">
            <h2 id={`${id}-title`} className="kafka-type-reading-heading-md mb-6">{entry.name}</h2>
            {entry.examples.map((ex) => (
              <article key={ex.id} data-example={`${id}/${ex.id}`} className="mb-8">
                <h3 className="kafka-type-ui-label mb-3 text-ink-muted">{ex.title}</h3>
                {ex.render()}
              </article>
            ))}
          </section>
        ))}
      </main>
    </KafkaProvider>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
