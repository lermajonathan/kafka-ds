import { useEffect, useMemo, useRef, useState } from 'react'
import { KafkaProvider, NavMenu, Prose, ThemeProvider, ThemeToggle, labelsEs, type NavMenuItem } from '../src/components'
import { registry } from '../examples'
import data from 'virtual:kafka-site'
import { href, navigate, useRoute } from './router'
import { LiveExample } from './live'

const THEME_KEY = 'kafka-site-theme'
const SITE = 'Kafka'
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

/** Family names come from the English documentation index; the site's own navigation speaks Spanish. */
const FAMILY_ES: Record<string, string> = { Actions: 'Acciones', 'Data display': 'Datos', Forms: 'Formularios', Navigation: 'Navegación', Overlays: 'Capas', Reading: 'Lectura', Feedback: 'Retroalimentación', Layout: 'Estructura' }
const familyName = (name: string) => FAMILY_ES[name] ?? name

const byId = new Map(data.components.map((c) => [c.id, c]))
const decisionById = new Map(data.decisions.map((d) => [d.id, d]))

const nav: NavMenuItem[] = [
  { key: '', label: 'Inicio', href: href('') },
  { key: 'getting-started', label: 'Primeros pasos', href: href('getting-started') },
  { key: 'components', label: 'Todos los componentes', href: href('components') },
  ...data.families.map((f) => ({
    key: 'family-' + f.name,
    label: familyName(f.name),
    children: f.ids.map((id) => ({ key: 'components/' + id, label: byId.get(id)!.name, href: href('components/' + id) })),
  })),
  {
    key: 'decisions',
    label: 'Decisiones',
    href: href('decisions'),
    children: data.decisions.map((d) => ({ key: d.path, label: `${d.id.replace('DDR-KF-', '')} · ${d.title}`, href: href(d.path) })),
  },
  { key: 'tokens', label: 'Tokens', href: href('tokens') },
]

/** Generated documentation as a reading column. The html comes from our own markdown at build time. */
function Html({ html }: { html: string }) {
  return <Prose as="div" fullWidth className="doc" dangerouslySetInnerHTML={{ __html: html }} />
}

/** A component page: the generated documentation with each example running above its code. */
function ComponentPage({ id }: { id: string }) {
  const c = byId.get(id)!
  const examples = registry[id]?.examples ?? []
  const parts = c.html.split(/<!--live:(\d+)-->/)
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Html key={i} html={part} />
        const ex = examples[Number(part)]
        return ex ? <LiveExample key={i} title={ex.title}>{ex.render()}</LiveExample> : null
      })}
    </>
  )
}

function Home() {
  return (
    <div className="home">
      <p className="home-kicker">Design system · Artes literarias en pantalla</p>
      <h1 className="home-title">Kafka</h1>
      <span className="home-rule" aria-hidden="true" />
      <p className="home-lead">Un sistema de diseño para leer, escribir y publicar literatura en pantalla: tipografía de lectura primero, interfaz accesible después.</p>
      <ul className="home-stats" aria-label="Contenido del sistema">
        <li><strong>{data.counts.components}</strong> componentes</li>
        <li><strong>{fmt(data.counts.tokens)}</strong> tokens</li>
        <li><strong>{data.counts.decisions}</strong> decisiones</li>
        <li>Claro y oscuro</li>
      </ul>
      <ul className="home-links">
        <li><a href={href('getting-started')}>Primeros pasos</a><span>Pruébalo, usa los tokens y monta tu primera página.</span></li>
        <li><a href={href('components')}>Componentes</a><span>Cuándo usar cada uno, ejemplos vivos, propiedades y accesibilidad.</span></li>
        <li><a href={href('decisions')}>Decisiones de diseño</a><span>Por qué Kafka es como es, una decisión por página.</span></li>
        <li><a href={href('tokens')}>Tokens</a><span>La referencia completa de los tres niveles.</span></li>
      </ul>
      <p className="home-note">Versión {data.version} · pre-1.0: aún no está en npm. El código es de <a href={data.repo} rel="noopener noreferrer">código abierto (MIT)</a>.</p>
    </div>
  )
}

function ComponentsIndex() {
  return (
    <div>
      <h1 className="page-title">Componentes</h1>
      <p className="page-lead">{data.counts.components} componentes, una página cada uno. La documentación de cada componente está en inglés.</p>
      {data.families.map((f) => (
        <section key={f.name} aria-labelledby={'fam-' + f.name} className="family">
          <h2 id={'fam-' + f.name}>{familyName(f.name)}</h2>
          <ul className="cards">
            {f.ids.map((id) => {
              const c = byId.get(id)!
              return <li key={id}><a href={href(c.path)}>{c.name}</a><span>{c.summary}</span></li>
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

function DecisionsIndex() {
  return (
    <div>
      <h1 className="page-title">Decisiones de diseño</h1>
      <p className="page-lead">Cada decisión importante queda escrita: contexto, decisión y alternativas descartadas.</p>
      <ol className="decisions">
        {data.decisions.map((d) => (
          <li key={d.id}>
            <span className="decision-id">{d.id}</span>
            <a href={href(d.path)}>{d.title}</a>
            <span className="decision-status">{d.status}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function NotFound() {
  return (
    <div>
      <h1 className="page-title">No se encontró la página</h1>
      <p className="page-lead">Esta dirección no existe en la documentación.</p>
      <p><a href={href('')}>Volver al inicio</a></p>
    </div>
  )
}

interface Resolved { title: string; node: React.ReactNode; wide?: boolean }
function resolve(route: string): Resolved {
  if (route === '') return { title: `${SITE} · Sistema de diseño`, node: <Home /> }
  if (route === 'components') return { title: `Componentes · ${SITE}`, node: <ComponentsIndex /> }
  if (route === 'decisions') return { title: `Decisiones · ${SITE}`, node: <DecisionsIndex /> }
  let m: RegExpMatchArray | null
  if ((m = route.match(/^components\/([a-z0-9-]+)$/)) && byId.has(m[1]!)) return { title: `${byId.get(m[1]!)!.name} · ${SITE}`, node: <ComponentPage id={m[1]!} /> }
  if ((m = route.match(/^decisions\/(DDR-KF-\d+)$/)) && decisionById.has(m[1]!)) {
    const d = decisionById.get(m[1]!)!
    return { title: `${d.id} · ${SITE}`, node: <Html html={d.html} /> }
  }
  const page = data.pages.find((p) => p.path === route)
  if (page) return { title: `${page.title} · ${SITE}`, node: <Html html={page.html} /> }
  return { title: `No encontrada · ${SITE}`, node: <NotFound /> }
}

export function App() {
  const route = useRoute()
  const page = useMemo(() => resolve(route), [route])
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    document.title = page.title
    document.body.dataset.route = route
    setMenu(false)
    if (first.current) { first.current = false; return } // keep the browser's own focus on first load
    main.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [route, page.title])

  return (
    <KafkaProvider labels={labelsEs}>
      <ThemeProvider storageKey={THEME_KEY}>
        <a className="skip" href="#contenido" onClick={(e) => { e.preventDefault(); main.current?.focus() }}>Saltar al contenido</a>
        <header className="top">
          <a className="brand" href={href('')}>Kafka</a>
          <button type="button" className="menu-button" aria-expanded={menu} aria-controls="documentacion" onClick={() => setMenu((v) => !v)}>Menú</button>
          <ThemeToggle size="sm" />
        </header>
        <div className="shell">
          <aside id="documentacion" className="side" data-open={menu}>
            <NavMenu items={nav} value={route} label="Documentación" onNavigate={(key) => navigate(key)} />
          </aside>
          <main id="contenido" ref={main} tabIndex={-1} className="content">{page.node}</main>
        </div>
      </ThemeProvider>
    </KafkaProvider>
  )
}
