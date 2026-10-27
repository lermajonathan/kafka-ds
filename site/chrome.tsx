// The frame around every page: header with the main navigation and the theme switch, and the ink footer.
import { lazy, Suspense, useEffect, useState } from 'react'
import data from 'virtual:kafka-site'
import { House, List, RocketLaunch, SquaresFour, Palette } from '@phosphor-icons/react'
import { IconButton, ThemeToggle } from '../src/components'
import { href } from './router'

const MenuPanel = lazy(() => import('./menu-panel'))

/** The author's UX portfolio: the footer signature leads there. */
const UX_SITE = 'https://ux.jonathanlerma.com'

/** Follows a media query. Starts from the real answer, so the first paint already has the right header. */
function useMedia(query: string) {
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setOn(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return on
}

const MAIN_NAV: { label: string; route: string; Icon: typeof House; match: (r: string) => boolean }[] = [
  { label: 'Inicio', route: '', Icon: House, match: (r) => r === '' },
  { label: 'Primeros pasos', route: 'getting-started', Icon: RocketLaunch, match: (r) => r === 'getting-started' },
  { label: 'Componentes', route: 'components', Icon: SquaresFour, match: (r) => r === 'components' || r.startsWith('components/') },
  { label: 'Tokens', route: 'tokens', Icon: Palette, match: (r) => r === 'tokens' },
]

export function Header({ route }: { route: string }) {
  const compact = useMedia('(max-width: 999px)') // a phone or a small tablet: the links move into a side panel
  const icons = useMedia('(max-width: 1199px)') // not enough room for the theme switch with its words
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [route])
  useEffect(() => { if (!compact) setOpen(false) }, [compact])
  const links = (onPick?: () => void) => MAIN_NAV.map((n) => <a key={n.route} href={href(n.route)} onClick={onPick} aria-current={n.match(route) ? 'page' : undefined}><n.Icon aria-hidden="true" size={20} weight={n.match(route) ? 'fill' : 'regular'} /><span>{n.label}</span></a>)
  return (
    <header className="top">
      <a className="brand" href={href('')}>
        <span className="brand-mark" aria-hidden="true">K</span>
        <span className="brand-text"><span className="brand-name">Kafka</span><span className="brand-version">v{data.version}</span></span>
      </a>
      {!compact && <nav className="main-nav" aria-label="Principal">{links()}</nav>}
      <div className="top-tools">
        <ThemeToggle size={icons ? 'md' : 'sm'} iconOnly={icons} />
        {compact && (
          <>
            <IconButton Icon={List} label="Abrir menú" variant="soft" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} />
            <Suspense fallback={null}><MenuPanel open={open} onOpenChange={setOpen} version={data.version}>{links(() => setOpen(false))}</MenuPanel></Suspense>
          </>
        )}
      </div>
    </header>
  )
}

const blob = (path: string) => `${data.repo}/blob/main/${path}`

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  { title: 'Sistema', links: [
    { label: 'Primeros pasos', href: href('getting-started') },
    { label: 'Componentes', href: href('components') },
    { label: 'Tokens', href: href('tokens') },
    { label: 'Tema Altazor', href: href('altazor') },
  ] },
  { title: 'Impresión', links: [
    { label: 'Libro · A5', href: blob('templates/print/book.html'), external: true },
    { label: 'Revista · A4', href: blob('templates/print/magazine.html'), external: true },
    { label: 'Ficha · A4', href: blob('templates/print/sheet.html'), external: true },
  ] },
  { title: 'Proyecto', links: [
    { label: 'GitHub', href: data.repo, external: true },
    { label: 'Registro de cambios', href: blob('CHANGELOG.md'), external: true },
    { label: 'Licencia', href: blob('LICENSE'), external: true },
  ] },
]

export function Footer({ onTop }: { onTop: () => void }) {
  return (
    <footer className="site-footer">
      <div className="foot-gold" aria-hidden="true" />
      <div className="foot-main">
        <div className="foot-brand">
          <p className="foot-wordmark">Kafka</p>
          <p className="foot-tagline">Papel, tinta y oro</p>
          <p className="foot-lead">Un sistema de diseño para literatura en pantalla y papel: la misma tipografía, rejilla y tokens, del lector al libro impreso.</p>
          <a className="l-btn l-btn-gold" href={href('getting-started')}>Empezar</a>
        </div>
        <div className="foot-cols">
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2>{c.title}</h2>
              <ul>{c.links.map((l) => <li key={l.label}><a href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.label}</a></li>)}</ul>
            </nav>
          ))}
        </div>
      </div>
      <ul className="foot-stats" aria-label="El sistema en cifras">
        <li><strong>{data.counts.components}</strong> componentes</li>
        <li><strong>{String(data.counts.tokens).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</strong> tokens</li>
        <li><strong>WCAG 2.2</strong> AA</li>
        <li><strong>A5 · A4</strong> impresión</li>
      </ul>
      <div className="foot-base">
        <p>Versión {data.version} · pre-1.0 · Composición en Literata (OFL) · Iconos Phosphor (MIT)</p>
        <p>Diseñado y construido por <strong><a className="foot-author" href={UX_SITE} target="_blank" rel="noopener noreferrer">Jonathan Lerma</a></strong></p>
        <button type="button" className="foot-top" onClick={onTop}>Volver arriba <span aria-hidden="true">↑</span></button>
      </div>
    </footer>
  )
}
