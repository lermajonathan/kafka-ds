// The frame around every page: header with the main navigation and the theme switch, and the ink footer.
import data from 'virtual:kafka-site'
import { House, RocketLaunch, SquaresFour, Palette } from '@phosphor-icons/react'
import { ThemeToggle } from '../src/components'
import { href } from './router'

const MAIN_NAV: { label: string; route: string; Icon: typeof House; match: (r: string) => boolean }[] = [
  { label: 'Inicio', route: '', Icon: House, match: (r) => r === '' },
  { label: 'Primeros pasos', route: 'getting-started', Icon: RocketLaunch, match: (r) => r === 'getting-started' },
  { label: 'Componentes', route: 'components', Icon: SquaresFour, match: (r) => r === 'components' || r.startsWith('components/') },
  { label: 'Tokens', route: 'tokens', Icon: Palette, match: (r) => r === 'tokens' },
]

export function Header({ route }: { route: string }) {
  return (
    <header className="top">
      <a className="brand" href={href('')}>
        <span className="brand-mark" aria-hidden="true">K</span>
        <span className="brand-text"><span className="brand-name">Kafka</span><span className="brand-version">v{data.version}</span></span>
      </a>
      <nav className="main-nav" aria-label="Principal">
        {MAIN_NAV.map((n) => <a key={n.route} href={href(n.route)} aria-current={n.match(route) ? 'page' : undefined}><n.Icon aria-hidden="true" size={20} weight={n.match(route) ? 'fill' : 'regular'} /><span>{n.label}</span></a>)}
      </nav>
      <div className="top-tools">
        <ThemeToggle size="sm" />
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
        <p>Diseñado y construido por <strong>Jonathan Lerma</strong></p>
        <button type="button" className="foot-top" onClick={onTop}>Volver arriba <span aria-hidden="true">↑</span></button>
      </div>
    </footer>
  )
}
