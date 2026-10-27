// Showcase of the Altazor theme: how Kafka is applied to a real site. Loaded on demand (its CSS comes with it).
// No real Altazor content here: the copy is invented or public domain (Cervantes, Bécquer), the imagery is drawn in SVG.
import { useState } from 'react'
import { Badge, Button, Chip, Field, IconCalendar, IconClock, IconPen, IconPlay, IconPeople, Input, NewsBox, ProgramCard, SegmentedControl, type NewsItem } from '../src/components'
import tokens from '../src/tokens'
import theme from '../tokens/themes/altazor.json'
import '../src/styles/themes/altazor.css'
import '../src/styles/themes/altazor-patterns.css'
import './altazor.css'
import { InnerPage } from './inner'
import { NextBand } from './inner'
import { href } from './router'

/** The hero picture: ink with gold arcs and lines, like a page of a notebook. Drawn here so the page needs no photograph. */
const HERO = 'url("data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice"><rect width="1200" height="600" fill="#26231f"/>' +
  '<g fill="none" stroke="#d4af37" stroke-opacity=".55" stroke-width="2"><circle cx="880" cy="300" r="120"/><circle cx="880" cy="300" r="190"/><circle cx="880" cy="300" r="270"/><circle cx="880" cy="300" r="360"/></g>' +
  '<g stroke="#fbf8f1" stroke-opacity=".35" stroke-width="2"><path d="M640 120h420M640 160h360M640 200h400M640 240h300M640 360h380M640 400h420M640 440h320"/></g></svg>',
) + '")'

const NEWS: NewsItem[] = [
  { id: 'n1', kind: 'evento', title: 'Lectura abierta de fin de año', href: '#/altazor', meta: [{ Icon: IconCalendar, text: 'Viernes 20 de noviembre' }, { Icon: IconClock, text: '6:00 p. m.' }] },
  { id: 'n2', kind: 'convocatoria', title: 'Abierta la convocatoria de la antología', href: '#/altazor', meta: [{ Icon: IconCalendar, text: 'Hasta el 30 de noviembre' }] },
]
const QUICK = [
  ['Inscripciones', 'Abiertas todo el año, con cupos por taller.'],
  ['Educación', 'Cursos y laboratorios para leer y escribir mejor.'],
  ['Biblioteca', 'Lecturas y grabaciones, para volver cuando quieras.'],
] as const
// Public domain: Cervantes (Quijote, II, 58) and Bécquer (Rimas, XXI and LIII).
const QUOTES = [
  ['La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.', 'Miguel de Cervantes', 'Don Quijote de la Mancha, II, 58'],
  ['¿Qué es poesía?, dices mientras clavas en mi pupila tu pupila azul.', 'Gustavo Adolfo Bécquer', 'Rima XXI'],
  ['Volverán las oscuras golondrinas en tu balcón sus nidos a colgar.', 'Gustavo Adolfo Bécquer', 'Rima LIII'],
] as const

const SECTIONS = [
  { id: 'como-se-aplica', text: 'Cómo se aplica' },
  { id: 'componentes', text: 'Los mismos componentes' },
  { id: 'patrones', text: 'Patrones del tema' },
  { id: 'que-cambia', text: 'Qué cambia' },
]

/** Reads a dotted path from the typed tokens ("color.paper.100"). */
const lookup = (path: string): string => {
  let node: unknown = tokens
  for (const part of path.split('.')) node = (node as Record<string, unknown> | undefined)?.[part]
  return typeof node === 'string' ? node : String(node ?? '')
}
const resolve = (value: string) => { const m = value.match(/^\{(.+)\}$/); return m ? lookup(m[1]!) : value }

interface Row { token: string; kafka: string; altazor: string; note: string }
function changes(): Row[] {
  const rows: Row[] = []
  const walk = (node: Record<string, unknown>, path: string[]) => {
    if ('$value' in node) {
      const key = path.join('.')
      if (key.startsWith('altazor.')) return
      rows.push({ token: key, kafka: lookup(key), altazor: resolve(String(node.$value)), note: String((node as { $description?: string }).$description ?? '') })
      return
    }
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v as Record<string, unknown>, [...path, k])
  }
  walk(theme as unknown as Record<string, unknown>, [])
  return rows
}

function Components({ on }: { on: boolean }) {
  const [news, setNews] = useState(NEWS)
  return (
    <div className="az-stage" {...(on ? { 'data-kafka-theme': 'altazor' } : {})} data-on={on ? 'altazor' : 'kafka'}>
      <div className="az-grid">
        <ProgramCard title="Taller de narrativa" subtitle="Con cupos limitados" cover={{ Icon: IconPen, tone: 'amber' }} badges={<Badge tone="warning">Últimos cupos</Badge>} price="$200.000" description="Construimos una historia desde el primer párrafo hasta la revisión final." meta={[{ Icon: IconCalendar, text: 'Desde el 3 de noviembre' }, { Icon: IconPeople, text: 'Grupo de 12 personas' }]} action={<Button block>Inscribirme</Button>} />
        <ProgramCard highlight="vip" title="Membresía anual" subtitle="Todo el año" cover={{ Icon: IconPlay, tone: 'gold' }} price="$1.800.000" description="Acceso a todos los talleres y a la biblioteca de grabaciones." action={<Button variant="vip" block>Hacerme miembro</Button>} />
        <div className="az-side">
          <NewsBox items={news} onDismiss={(id) => setNews((all) => all.filter((n) => n.id !== id))} viewAllHref="#/altazor" label="Novedades de ejemplo" />
          <Field label="Tu correo"><Input placeholder="nombre@correo.com" /></Field>
          <p className="az-chips"><Chip>Narrativa</Chip><Chip>Poesía</Chip><Chip>Ensayo</Chip></p>
          <div className="az-actions"><Button>Enviar</Button><Button variant="soft">Más tarde</Button></div>
        </div>
      </div>
    </div>
  )
}

function Patterns() {
  return (
    <div className="az-stage az-patterns" data-kafka-theme="altazor">
      <section className="kafka-altazor-hero" style={{ ['--kafka-altazor-hero-image' as string]: HERO }} aria-labelledby="az-hero-title">
        <div className="kafka-altazor-deco" aria-hidden="true">
          <span className="kafka-altazor-deco__item" data-shape="dot" data-tone="purple" style={{ ['--x' as string]: '52%', ['--y' as string]: '34%', ['--size' as string]: '14px' }} />
          <span className="kafka-altazor-deco__item" data-shape="bar" data-tone="red" style={{ ['--x' as string]: '58%', ['--y' as string]: '10%', ['--size' as string]: '56px', ['--delay' as string]: '-2s' }} />
          <span className="kafka-altazor-deco__item" data-shape="diamond" data-tone="gold" style={{ ['--x' as string]: '92%', ['--y' as string]: '58%', ['--size' as string]: '20px', ['--delay' as string]: '-4s' }} />
          <span className="kafka-altazor-deco__item" data-shape="dot" data-tone="gold" style={{ ['--x' as string]: '40%', ['--y' as string]: '78%', ['--size' as string]: '10px', ['--delay' as string]: '-1s' }} />
        </div>
        <div className="kafka-altazor-hero__inner">
          <div className="kafka-altazor-hero__text">
            <h3 id="az-hero-title">Escribir es una forma de habitar el mundo</h3>
            <p className="kafka-altazor-hero__lede">Talleres de escritura creativa para leer despacio y escribir con ganas.</p>
          </div>
        </div>
      </section>
      <div className="kafka-altazor-quick">
        <ul>{QUICK.map(([t, d]) => <li key={t}><a href="#/altazor"><h4>{t}</h4><p>{d}</p></a></li>)}</ul>
      </div>
      <section className="kafka-altazor-quotes" aria-label="Citas">
        <ul>{QUOTES.map(([q, who, work]) => <li key={q}><blockquote>{q}</blockquote><cite>{who}</cite><small>{work}</small></li>)}</ul>
      </section>
    </div>
  )
}

export default function AltazorPage() {
  const [view, setView] = useState<'kafka' | 'altazor'>('altazor')
  const rows = changes()
  return (
    <InnerPage crumbs={[{ label: 'Inicio', route: '' }, { label: 'Tema Altazor' }]} eyebrow="Ejemplo de aplicación" title="Kafka con el tema Altazor" headings={SECTIONS}
      lead="Así se ve Kafka cuando se aplica a un sitio real: la misma librería, con un tema pequeño encima. El contenido de esta página es inventado o de dominio público."
      next={<NextBand label="Siguiente" title="Mira todos los tokens del sistema" to="tokens" action="Ir a los tokens" />}>
      <div className="p-doc"><div className="doc">
      <section aria-labelledby="como-se-aplica" >
        <h2 id="como-se-aplica">Cómo se aplica</h2>
        <p>Un tema es un archivo de datos que sobrescribe unos pocos tokens semánticos; se compila a CSS y vive dentro de un atributo. Nada cambia fuera de ese elemento, ni la paleta ni la tipografía.</p>
        <pre tabIndex={0}><code>{`@import '@kafka-ds/tokens/tokens.css';\n@import '@kafka-ds/theme-altazor';\n@import '@kafka-ds/theme-altazor/patterns.css';\n\n<div data-kafka-theme="altazor"> … </div>`}</code></pre>
      </section>
      <section aria-labelledby="componentes" >
        <h2 id="componentes">Los mismos componentes</h2>
        <p>Ninguno de estos componentes sabe que existe el tema: cambian solo por los tokens. Compara los radios de los botones y los campos, y el fondo de los controles.</p>
        <div className="az-switch"><SegmentedControl label="Tema" value={view} onChange={setView} options={[{ value: 'kafka', label: 'Kafka' }, { value: 'altazor', label: 'Altazor' }]} /></div>
        <Components on={view === 'altazor'} />
      </section>
      <section aria-labelledby="patrones" >
        <h2 id="patrones">Patrones del tema</h2>
        <p>Lo que solo existe en el tema: una portada con velo oscuro cuyo contraste se mide sobre píxeles, tarjetas de acceso rápido que se montan sobre ella, formas flotantes que se detienen si pides menos movimiento y una banda de citas.</p>
        <Patterns />
      </section>
      <section aria-labelledby="que-cambia" >
        <h2 id="que-cambia">Qué cambia</h2>
        <p>Solo estos tokens se sobrescriben. Todo lo demás, incluido cada par de colores, sigue siendo el de Kafka y se prueba también con el tema aplicado.</p>
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Tokens que cambia el tema">
          <table>
            <thead><tr><th scope="col">Token</th><th scope="col">Kafka</th><th scope="col">Altazor</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.token}><th scope="row"><code>{r.token}</code></th><td>{r.kafka}</td><td>{r.altazor}</td></tr>)}</tbody>
          </table>
        </div>
        <p>Además añade tokens propios (<code>--kafka-altazor-*</code>) para el velo de la portada, la banda de citas y las formas flotantes. <a href={href('tokens')}>Ver los tokens de Kafka</a>.</p>
      </section>
      </div></div>
    </InnerPage>
  )
}
