// The home page: a long page that shows the system in the order a reader meets it.
// Every number comes from the system itself (counts from the docs, sizes from the tokens), nothing is typed twice.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import data, { exampleLoaders } from 'virtual:kafka-site'
import type { Example } from '../examples/types'
import { href } from './router'
import { familyName } from './names'

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })

function Section({ id, label, children, className = '' }: { id?: string; label: string; children: ReactNode; className?: string }) {
  return <section id={id} aria-labelledby={id ? id + '-title' : undefined} data-label={label} className={className}>{children}</section>
}

/** §01: the type specimen. The guides are measured from the font, not drawn by eye (see HERO_GUIDES in the tests). */
function Hero() {
  return (
    <Section id="hero" label="Presentación" className="l-hero">
      <div className="l-specimen">
        <p className="l-mono l-accent">Literata 7–72 pt · 200–900</p>
        <div className="l-aa" aria-hidden="true">
          <span className="l-aa-glyph">Aa</span>
          <span className="l-guide l-guide-cap"><i>altura de versal</i></span>
          <span className="l-guide l-guide-base"><i>línea base</i></span>
        </div>
        <p className="l-mono l-spread"><span>wght 500 · opsz auto</span><span>fuente variable</span></p>
      </div>
      <div className="l-hero-text">
        <h1 id="hero-title">La página, medida al milímetro.</h1>
        <p className="l-lead">Kafka es un sistema de diseño para literatura en pantalla y papel. Cada decisión de tipografía, medida y color está escrita, probada y a la vista.</p>
        <p className="l-actions">
          <a className="l-btn l-btn-solid" href={href('getting-started')}>Primeros pasos</a>
          <a className="l-btn l-btn-line" href={href('components')}>{data.counts.components} componentes</a>
        </p>
        <p className="l-chars" aria-label="Caracteres de la fuente">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br />abcdefghijklmnñopqrstuvwxyz<br />ÁÉÍÓÚÜ áéíóúü ¿¡«»—… 0123456789</p>
      </div>
    </Section>
  )
}

const SCALE: { token: string; px: number; sample: ReactNode; style: CSSProperties }[] = [
  { token: 'reading.dropcap', px: 64, sample: 'Érase', style: { fontSize: 'var(--kafka-typography-reading-dropcap-font-size)', fontWeight: 600, lineHeight: 1.1 } },
  { token: 'reading.title', px: 44, sample: 'Capítulo primero', style: { fontSize: 'var(--kafka-typography-reading-title-font-size)', fontWeight: 600, lineHeight: 1.15 } },
  { token: 'reading.heading-lg', px: 32, sample: 'Un lugar de la Mancha', style: { fontSize: 'var(--kafka-typography-reading-heading-lg-font-size)', fontWeight: 600, lineHeight: 1.2 } },
  { token: 'reading.heading-md', px: 24, sample: 'De cuyo nombre no quiero acordarme', style: { fontSize: 'var(--kafka-typography-reading-heading-md-font-size)', fontWeight: 600, lineHeight: 1.25 } },
  { token: 'reading.body', px: 18, sample: 'No ha mucho tiempo que vivía un hidalgo de los de lanza en astillero.', style: { fontSize: 'var(--kafka-typography-reading-body-font-size)', lineHeight: 'var(--kafka-line-height-reading)' } },
  { token: 'ui.label', px: 14, sample: 'Inscribirme al taller', style: { fontFamily: 'var(--kafka-font-family-ui)', fontSize: 'var(--kafka-typography-ui-label-font-size)', fontWeight: 600, lineHeight: 'var(--kafka-line-height-ui)' } },
]

/** §02: the type scale, each row set with its own token. */
function Scale() {
  return (
    <Section id="escala" label="Escala" className="l-split">
      <div className="l-side">
        <p className="l-mono l-accent">Escala</p>
        <h2 id="escala-title">Escala tipográfica</h2>
        <p>Nueve tamaños, de 12 a 64 px, y un cuerpo de lectura de 18 px con interlineado de 1,6. Cada fila está compuesta con su propio token.</p>
      </div>
      <ol className="l-scale">
        {SCALE.map((r) => (
          <li key={r.token}>
            <span className="l-mono l-scale-key">{r.token} · {r.px}</span>
            <span className="l-scale-sample" style={r.style}>{r.sample}</span>
          </li>
        ))}
      </ol>
    </Section>
  )
}

/** §03: the reading measure, drawn at exactly the token's width. */
function Measure() {
  return (
    <Section id="medida" label="Medida" className="l-split">
      <div className="l-side">
        <p className="l-mono l-accent">Medida</p>
        <h2 id="medida-title">66 caracteres por línea</h2>
        <p>La medida de lectura cómoda. Prose la respeta; los componentes de texto también.</p>
      </div>
      <div className="l-measure">
        <div className="l-bracket" aria-hidden="true"><span>66 car.</span></div>
        <p>Era el año 1871 y la poesía todavía se leía en voz alta, de pie, junto a una ventana. Bécquer escribía versos breves que cabían en una sola mirada, y esa brevedad era una forma de respeto por quien leía. Una línea más larga hace que el ojo se pierda al volver; una más corta lo cansa con tantos saltos.</p>
      </div>
    </Section>
  )
}

const SWATCHES = [
  ['ink-950', 'ink.950', 'dim'], ['ink-900', 'ink.900', 'dim'], ['ink-800', 'ink.800', 'dim'], ['ink-600', 'ink.600', 'soft'],
  ['ink-400', 'ink.400', 'dark'], ['gold-400', 'gold.400', 'dark'], ['paper-200', 'paper.200', 'dark'], ['paper-50', 'paper.50', 'dark'],
] as const

const LEVELS = [
  ['01', 'Primitivos', 'Los valores crudos: la paleta de papel, tinta y oro, y la escala tipográfica.'],
  ['02', 'Semánticos', 'Lo que significan: texto de lectura, superficie, énfasis. Cambian entre claro y oscuro.'],
  ['03', 'De componente', 'Lo que usa cada pieza: botón, cita, campo. Siempre apoyados en un semántico.'],
] as const

/** The ink band: dark in both themes, because ink is what the palette is about. */
function Tokens() {
  return (
    <Section id="tokens-band" label="Tokens" className="l-ink">
      <div className="l-ink-head">
        <div>
          <p className="l-mono l-accent">{fmt(data.counts.tokens)} tokens · tres niveles</p>
          <h2 id="tokens-band-title">Papel, tinta y oro</h2>
        </div>
        <p>El oro vivo es superficie, o texto sobre tinta; sobre papel, los textos dorados usan el tono más oscuro. Cada par de colores se prueba en claro y en oscuro.</p>
      </div>
      <ul className="l-swatches" aria-label="Paleta">
        {SWATCHES.map(([token, name, tone]) => <li key={token} data-tone={tone} style={{ background: `var(--kafka-color-${token})` }}>{name}</li>)}
      </ul>
      <ol className="l-levels">
        {LEVELS.map(([n, title, text]) => <li key={n}><span className="l-mono l-accent">NIVEL {n}</span><h3>{title}</h3><p>{text}</p></li>)}
      </ol>
    </Section>
  )
}

/** The same text on a screen and on an A5 page, with crop marks. Decorative: the copy beside it says the same thing. */
function PaperScreen() {
  return (
    <Section id="dos-paginas" label="Pantalla y papel" className="l-two">
      <div className="l-two-text">
        <p className="l-mono l-muted">Design system · Pantalla y papel</p>
        <h2 id="dos-paginas-title">Un texto. Dos páginas.</h2>
        <span className="l-rule" aria-hidden="true" />
        <p className="l-lead">La misma tipografía, la misma rejilla y los mismos tokens sirven para la pantalla del lector y para el libro que se imprime.</p>
        <p className="l-actions">
          <a className="l-btn l-btn-solid" href={href('getting-started')}>Empezar</a>
          <button type="button" className="l-btn l-btn-line" onClick={() => scrollToId('impresion')}>Ver el módulo de impresión</button>
        </p>
      </div>
      <div className="l-pair" aria-hidden="true">
        <div className="l-screen">
          <div className="l-screen-bar"><i /><i /><i /><span>lectura / capítulo-1</span></div>
          <div className="l-screen-body">
            <p className="l-mono l-muted">CAPÍTULO PRIMERO · 12 MIN</p>
            <h3>Que trata de la condición del famoso hidalgo</h3>
            <p><span className="l-dropcap">E</span>n un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.</p>
          </div>
        </div>
        <div className="l-a5">
          <i className="l-crop l-crop-tl" /><i className="l-crop l-crop-tr" /><i className="l-crop l-crop-bl" /><i className="l-crop l-crop-br" />
          <div className="l-a5-page">
            <p className="l-a5-head"><span>DON QUIJOTE DE LA MANCHA</span><span>CAPÍTULO I</span></p>
            <h3>Que trata de la condición del famoso hidalgo</h3>
            <p><span className="l-dropcap">E</span>n un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lentejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.</p>
            <p className="l-a5-folio">3</p>
          </div>
        </div>
        <p className="l-mono l-caption"><i />los mismos tokens · Literata 18 px en pantalla, 10,5 pt en A5</p>
      </div>
    </Section>
  )
}

const TEMPLATES = [
  ['book', 'Libro', 'A5 · portadilla, créditos y capítulos que abren en página impar'],
  ['magazine', 'Revista', 'A4 · piezas que abren página y prosa a dos columnas'],
  ['sheet', 'Ficha', 'A4 · una sola página, sin cabeza ni folio, con el contacto al pie'],
] as const

const lines = (n: number, last?: string) => Array.from({ length: n }, (_, i) => <i key={i} style={i === n - 1 && last ? { width: last } : undefined} />)

/** A drawn page for each template: what it is made of, not a screenshot of it. */
function Sheet({ kind }: { kind: (typeof TEMPLATES)[number][0] }) {
  return (
    <span className={'l-sheet l-sheet-' + kind} aria-hidden="true">
      <b>
        {kind === 'book' && <><i className="t" />{lines(4, '70%')}<span className="gap" />{lines(3, '55%')}</>}
        {kind === 'magazine' && <><i className="t" /><span className="cols"><u>{lines(6, '60%')}</u><u>{lines(5, '80%')}</u></span><span className="quote" /></>}
        {kind === 'sheet' && <><i className="t" /><i className="g" /><span className="rows">{[0, 1, 2, 3].map((k) => <em key={k}><i /><i /></em>)}</span><span className="box" /></>}
      </b>
    </span>
  )
}

function Print() {
  return (
    <Section id="impresion" label="Impresión" className="l-print">
      <div className="l-print-text">
        <p className="l-mono l-accent">Módulo de impresión</p>
        <h2 id="impresion-title">Tres plantillas listas para el PDF</h2>
        <p>Tamaños A5 y A4, sangrado de 3 mm, márgenes de página izquierda y derecha y una rejilla de líneas base. Las notas van al final de cada capítulo.</p>
        <p><a href={href('decisions/DDR-KF-005')}>Cómo se decidió (DDR-KF-005)</a></p>
      </div>
      <ul className="l-templates">
        {TEMPLATES.map(([id, name, text]) => (
          <li key={id} className="l-template">
            <Sheet kind={id} />
            <h3 className="l-template-name">{name}</h3>
            <p className="l-template-text">{text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Numbers() {
  const items: [string, string][] = [
    [String(data.counts.components), 'componentes con ejemplos en vivo'],
    [fmt(data.counts.tokens), 'tokens en tres niveles, claro y oscuro'],
    [String(data.counts.decisions), 'decisiones de diseño documentadas'],
    ['7:1', 'contraste del texto de lectura'],
  ]
  return (
    <Section id="numeros" label="Cifras" className="l-numbers">
      <h2 id="numeros-title" className="l-visually-hidden">El sistema en cifras</h2>
      <dl>
        {items.map(([n, label]) => <div key={label}><dt>{n}</dt><dd>{label}</dd></div>)}
      </dl>
    </Section>
  )
}

const PER_PAGE = 12

/** A miniature of the component's first example: the real thing, inert, shrunk to fit its frame when it is too big. */
function Thumb({ id }: { id: string }) {
  const frame = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [examples, setExamples] = useState<Example[] | null>(null)
  const [near, setNear] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = frame.current
    if (!el || near) return
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect() } }, { rootMargin: '200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  useEffect(() => {
    if (!near) return
    let live = true
    exampleLoaders[id]?.().then((list) => live && setExamples(list), () => {})
    return () => { live = false }
  }, [near, id])

  useLayoutEffect(() => {
    const box = frame.current, node = inner.current
    if (!box || !node || !examples) return
    const fit = () => {
      // Shrink what does not fit, but never below a size that can still be read; the frame crops the rest.
      const k = Math.max(0.55, Math.min(1, (box.clientWidth - 24) / node.offsetWidth, (box.clientHeight - 24) / node.offsetHeight))
      node.style.setProperty('--k', k.toFixed(3))
    }
    fit()
    document.fonts?.ready.then(fit)
  }, [examples])

  return (
    <div ref={frame} data-thumb aria-hidden="true" inert className="l-thumb">
      <div ref={inner} className="l-thumb-inner">{examples?.[0]?.render()}</div>
    </div>
  )
}

function Catalog() {
  const [family, setFamily] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const familyOf = useMemo(() => new Map(data.families.flatMap((f) => f.ids.map((id) => [id, f.name] as const))), [])
  const list = useMemo(() => {
    const q = fold(query.trim())
    return data.components.filter((c) => (family === null || familyOf.get(c.id) === family) && (q === '' || fold(`${c.name} ${c.summary} ${familyName(familyOf.get(c.id) ?? '')}`).includes(q)))
  }, [family, query, familyOf])
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE))
  const current = Math.min(page, pages)
  const shown = list.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const from = list.length === 0 ? 0 : (current - 1) * PER_PAGE + 1
  const popular = ['pull-quote', 'footnote', 'prose', 'combobox'].map((id) => data.components.find((c) => c.id === id)).filter((c) => c !== undefined)

  return (
    <div className="l-catalog">
      <Section id="busqueda" label="Buscador" className="l-search">
        <p className="l-mono l-accent">Catálogo general</p>
        <h2 id="busqueda-title">Busca entre {data.counts.components} componentes hechos para leer.</h2>
        <form role="search" className="catalog-search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="catalog-q">Buscar componente</label>
          <input id="catalog-q" type="search" value={query} autoComplete="off" placeholder="Prueba con «quote» o «tabs»" onChange={(e) => { setQuery(e.target.value); setPage(1) }} />
        </form>
        <p className="l-popular"><span>Más buscados:</span>{popular.map((c) => <button key={c.id} type="button" className="l-pill" onClick={() => { setQuery(c.name); setFamily(null); setPage(1) }}>{c.name}</button>)}</p>
      </Section>
      <div className="l-results" id="catalogo">
        <nav aria-label="Familias" className="l-families">
          <p className="l-mono l-muted">FAMILIA</p>
          <ul>
            {[[null, 'Todos', data.counts.components] as const, ...data.families.map((f) => [f.name, familyName(f.name), f.ids.length] as const)].map(([name, label, count]) => (
              <li key={label}><button type="button" aria-pressed={family === name} onClick={() => { setFamily(name); setPage(1) }}><span>{label}</span><span>{count}</span></button></li>
            ))}
          </ul>
        </nav>
        <div className="l-grid-wrap">
          <div className="l-grid-head">
            <h3>{family === null ? 'Todos los componentes' : familyName(family)}</h3>
            <p role="status" className="l-mono">{list.length === 0 ? 'Sin resultados' : `Mostrando ${from}–${from + shown.length - 1} de ${list.length} · Orden alfabético`}</p>
          </div>
          {list.length === 0 ? <p className="l-empty">Sin resultados para «{query}». Prueba con otra palabra o elige otra familia.</p> : (
            <ul className="l-cards" data-catalog>
              {shown.map((c) => (
                <li key={c.id}>
                  <article>
                    <Thumb id={c.id} />
                    <div className="l-card-body">
                      <p className="l-mono l-muted">{familyName(familyOf.get(c.id) ?? '')}</p>
                      <h4><a href={href(c.path)}>{c.name}</a></h4>
                      <p>{c.summary}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
          {pages > 1 && (
            <nav aria-label="Paginación" className="l-pages">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" aria-current={n === current ? 'page' : undefined} onClick={() => setPage(n)}><span className="l-visually-hidden">Página </span>{n}</button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}

export function Landing() {
  return (
    <div className="landing">
      <Hero />
      <Scale />
      <Measure />
      <Tokens />
      <PaperScreen />
      <Print />
      <Numbers />
      <Catalog />
    </div>
  )
}
