// The docs site in a real browser: routes, live examples, focus, theme, axe, mobile width and no foreign requests.
// Builds nothing: run `pnpm run build:site` first (the test:site script does).
import fs from 'node:fs'
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = Number(process.env.KAFKA_SITE_PORT ?? 4174)
const ORIGIN = `http://localhost:${PORT}`
const BASE = `${ORIGIN}/kafka-ds/`
const axeSource = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }

const up = async () => { try { return (await fetch(BASE)).ok } catch { return false } }
let server
if (!(await up())) {
  server = spawn('pnpm', ['exec', 'vite', 'preview', '--config', 'vite.site.config.ts', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
  for (let i = 0; i < 50 && !(await up()); i++) await new Promise((r) => setTimeout(r, 200))
  if (!(await up())) { server?.kill(); throw new Error('Could not start the site preview. Run `pnpm run build:site` first.') }
}
const browser = await chromium.launch()
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  const errors = [], foreign = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()) }) // failed loads are reported by the response listener
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().endsWith('/kafka-ds/no-existe.jpg')) errors.push(`${r.status()} ${r.url()}`) })
  page.on('request', (r) => { if (!r.url().startsWith(ORIGIN) && !r.url().startsWith('data:')) foreign.push(r.url()) })
  const go = async (hash) => { await page.goto(BASE + (hash ? '#' + hash : '')); await page.waitForSelector('main h1') }

  // Home
  await go('')
  check((await page.locator('main h1').innerText()).trim() === 'La página, medida al milímetro.', `home: h1 was "${await page.locator('main h1').innerText()}"`)
  check(/70\s+componentes/i.test(await page.locator('main').innerText()), 'home: must say how many components there are')
  check(await page.getByRole('link', { name: /primeros pasos/i }).count() > 0, 'home: needs a link to getting started')
  check((await page.title()) === 'Kafka · Sistema de diseño', `home: title was "${await page.title()}"`)

  // Home: header, sections in order, dark band, print module, numbers, catalog and footer
  await go('')
  const banner = page.getByRole('banner')
  check(await banner.getByRole('navigation', { name: /principal/i }).getByRole('link').count() === 4, 'home: the header needs a "Principal" navigation with 4 links')
  for (const name of ['Primeros pasos', 'Componentes', 'Decisiones', 'Tokens']) check(await banner.getByRole('navigation', { name: /principal/i }).getByRole('link', { name }).count() === 1, `home: header link "${name}"`)
  check(await banner.getByRole('radiogroup', { name: /tema/i }).count() === 1, 'home: the theme switch must be in the header')
  check(await page.locator('aside').count() === 0, 'home: a landing page has no documentation sidebar')
  check(await banner.getByRole('combobox').count() === 0, 'home: the catalog has the search; the header does not repeat it')
  const order = ['Escala tipográfica', '66 caracteres por línea', 'Papel, tinta y oro', 'Un texto. Dos páginas.', 'Tres plantillas listas para el PDF', 'Busca entre 70 componentes hechos para leer.']
  const h2s = (await page.locator('main h2').allInnerTexts()).map((t) => t.trim())
  const at = order.map((t) => h2s.indexOf(t))
  check(at.every((i) => i >= 0), `home: missing sections ${JSON.stringify(order.filter((t, i) => at[i] < 0))}`)
  check(at.every((v, i) => i === 0 || v > at[i - 1]), `home: sections out of order ${JSON.stringify(at)}`)
  check(await page.getByRole('button', { name: /ver el módulo de impresión/i }).count() === 1, 'home: needs the "Ver el módulo de impresión" button')
  const main = await page.locator('main').innerText()
  check(/1\.129/.test(main) && /\b19\b/.test(main) && /\b7\s*:\s*1\b/.test(main), 'home: needs the numbers (70, 1.129, 19, 7:1)')
  check(/10,5\s*pt/.test(main) && /3\s*mm/.test(main), 'home: the print module must state its real measures (10,5 pt, sangrado de 3 mm)')

  // The specimen's baseline guide sits on the real baseline of the font, not where it looked right once
  const guide = await page.evaluate(() => {
    const box = document.querySelector('.l-aa'), glyph = box.querySelector('.l-aa-glyph'), probe = document.createElement('span')
    probe.style.cssText = 'display:inline-block;width:0;height:0'
    glyph.appendChild(probe)
    const top = box.getBoundingClientRect().top
    const out = { base: probe.getBoundingClientRect().bottom - top, line: box.querySelector('.l-guide-base').getBoundingClientRect().top - top }
    probe.remove()
    return out
  })
  check(Math.abs(guide.base - guide.line) <= 3, `home: the baseline guide is ${(guide.line - guide.base).toFixed(1)}px off the font's baseline`)

  // The "Papel, tinta y oro" band is ink in both themes
  for (const theme of ['light', 'dark']) {
    await page.evaluate((t) => { localStorage.setItem('kafka-site-theme', t) }, theme)
    await page.reload(); await page.waitForSelector('main h1')
    const lum = await page.getByRole('region', { name: /papel, tinta y oro/i }).evaluate((el) => { const [r, g, b] = getComputedStyle(el).backgroundColor.match(/\d+/g).map(Number); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 })
    check(lum < 0.1, `home: the "Papel, tinta y oro" band must stay ink in ${theme} mode (luminance ${lum.toFixed(2)})`)
  }
  await page.evaluate(() => localStorage.setItem('kafka-site-theme', 'light'))

  // Footer
  const footer = page.getByRole('contentinfo')
  check(await footer.count() === 1, 'footer: needs one contentinfo landmark')
  for (const name of ['Sistema', 'Impresión', 'Proyecto']) check(await footer.getByRole('navigation', { name }).count() === 1, `footer: needs the "${name}" navigation`)
  check(await footer.getByRole('link', { name: 'GitHub' }).getAttribute('href').then((h) => /github\.com/.test(h ?? '')), 'footer: the GitHub link must go to the repository')
  check(await footer.getByRole('button', { name: /volver arriba/i }).count() === 1, 'footer: needs "Volver arriba"')

  // Catalog: search, families, cards, pagination
  const cat = page.getByRole('searchbox', { name: /buscar componente/i })
  const status = page.getByRole('status').filter({ hasText: /Mostrando/ })
  check(await cat.count() === 1, 'catalog: needs one search field named "Buscar componente"')
  check(/Mostrando 1–12 de 70/.test(await status.innerText()), `catalog: initial status was "${await status.innerText()}"`)
  check(await page.locator('[data-catalog] article').count() === 12, 'catalog: 12 cards per page')
  await page.getByRole('button', { name: /^Lectura/ }).click()
  check((await page.getByRole('button', { name: /^Lectura/ }).getAttribute('aria-pressed')) === 'true', 'catalog: the chosen family must be pressed')
  check(/Mostrando 1–12 de 14/.test(await status.innerText()), `catalog: Lectura must show 14, status was "${await status.innerText()}"`)
  await cat.fill('pullquote')
  check(/Mostrando 1–1 de 1/.test(await status.innerText()), `catalog: searching "pullquote" must find one, status was "${await status.innerText()}"`)
  check((await page.locator('[data-catalog] article a').first().getAttribute('href')) === '#/components/pull-quote', 'catalog: the card must link to its page')
  await cat.fill('zzzz')
  check(await page.getByText(/sin resultados/i).count() > 0, 'catalog: needs an empty state')
  await cat.fill('')
  await page.getByRole('button', { name: /^Todos/ }).click()
  await page.getByRole('navigation', { name: /paginación/i }).getByRole('button', { name: '2' }).click()
  check(/Mostrando 13–24 de 70/.test(await status.innerText()), `catalog: page 2 status was "${await status.innerText()}"`)
  check(/(^|\s)2$/.test((await page.getByRole('navigation', { name: /paginación/i }).locator('[aria-current="page"]').innerText()).trim()), 'catalog: pagination must mark the current page')
  // Thumbnails are the real components, shown inert
  await page.locator('[data-thumb]').first().waitFor()
  await page.waitForFunction(() => [...document.querySelectorAll('[data-thumb]')].every((t) => t.childElementCount > 0), null, { timeout: 10000 }).catch(() => {})
  check(await page.locator('[data-thumb]:empty').count() === 0, 'catalog: every card needs its miniature')
  check(await page.locator('[data-thumb][aria-hidden="true"][inert]').count() === await page.locator('[data-thumb]').count(), 'catalog: miniatures must be hidden from assistive technology and inert')
  // "/" reaches the catalog search on the home page
  await page.locator('main h1').click()
  await page.keyboard.press('/')
  check(await page.evaluate(() => document.activeElement?.getAttribute('type') === 'search'), 'home: "/" must focus the catalog search')

  // Documentation pages keep their sidebar and the header search
  await go('/getting-started')
  check(await page.locator('aside').count() === 1, 'docs page: keeps the sidebar')
  check(await page.getByRole('banner').getByRole('combobox', { name: /buscar/i }).count() === 1, 'docs page: the header keeps the search')
  check(await page.getByRole('contentinfo').count() === 1, 'docs page: the footer is on every page')

  await go(''); await page.reload(); await page.waitForSelector('main h1')
  // Skip link comes first and lands on the content
  await page.keyboard.press('Tab')
  check((await page.evaluate(() => document.activeElement?.textContent ?? '')).match(/saltar al contenido/i) !== null, 'first Tab must reach the skip link')
  await page.keyboard.press('Enter')
  check(await page.evaluate(() => document.activeElement?.id === 'contenido'), 'the skip link must move focus to #contenido')

  // Literata is served by the site itself, not a fallback and not a CDN
  const loaded = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => f.family.replace(/"/g, '') === 'Literata' && f.status === 'loaded').map((f) => f.style) })
  check(loaded.includes('normal'), `Literata (normal) must be loaded from the site, loaded: ${JSON.stringify(loaded)}`)
  await go('/getting-started')
  check((await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('italic 16px Literata') })), 'Literata italic must be available')

  // Search: type, choose with the keyboard, land on the page; "/" focuses the field from anywhere
  await go('/components')
  const search = page.getByRole('combobox', { name: /buscar/i })
  check(await search.count() === 1, 'search: the header needs one combobox named "Buscar"')
  await page.locator('main h1').click()
  await page.keyboard.press('/')
  check(await page.evaluate(() => document.activeElement?.getAttribute('role') === 'combobox'), 'search: "/" must focus the search field')
  await page.keyboard.type('chip')
  check(await page.getByRole('option', { name: /^Chip/ }).count() >= 1, 'search: "chip" must offer the Chip component')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => document.body.dataset.route === 'components/chip')
  check((await search.inputValue()) === '', 'search: the field must clear after choosing')
  await search.fill('015')
  await page.getByRole('option', { name: /DDR-KF-015/ }).click()
  await page.waitForFunction(() => document.body.dataset.route === 'decisions/DDR-KF-015')
  await search.fill('navegacion')
  check(await page.getByRole('option', { name: /Tabs/ }).count() >= 1, 'search: it finds by family and ignores accents ("navegacion" → Tabs · Navegación)')
  await search.fill('zzzz')
  check(await page.getByText(/sin resultados/i).count() > 0, 'search: needs an empty state')
  await page.keyboard.press('Escape')

  // Components index: families and every component
  await go('/components')
  check((await page.locator('main h2').count()) >= 8, 'components: needs one heading per family')
  check((await page.locator('main a[href^="#/components/"]').count()) >= 70, 'components: needs a link to each of the 70 components')

  // A component page with a live example
  await go('/components/chip')
  check((await page.locator('main h1').innerText()).trim() === 'Chip', 'chip: h1')
  check((await page.title()) === 'Chip · Kafka', `chip: title was "${await page.title()}"`)
  const seminarios = page.locator('[data-live-example] button', { hasText: 'Seminarios' })
  check(await seminarios.count() === 1, 'chip: the live example must render')
  await seminarios.click()
  check((await seminarios.getAttribute('aria-pressed')) === 'true', 'chip: the live example must respond to a click')
  check(await page.locator('main table').count() > 0, 'chip: the props table must be there')
  check(await page.locator('main pre code').count() > 0, 'chip: code samples must be there')

  // Navigating moves focus to the new page and keeps the sidebar current
  await page.getByRole('navigation', { name: /documentación/i }).getByRole('link', { name: 'Primeros pasos' }).click()
  await page.waitForFunction(() => document.querySelector('main h1')?.textContent?.includes('Primeros pasos'))
  check(await page.evaluate(() => document.activeElement?.id === 'contenido'), 'after navigating, focus must move to the content')
  check(await page.getByRole('navigation', { name: /documentación/i }).locator('[aria-current="page"]').count() === 1, 'the sidebar must mark the current page')

  // A decision, and a route that does not exist
  await go('/decisions/DDR-KF-015')
  check(/etiquetas peque/i.test(await page.locator('main h1').innerText()), 'DDR-KF-015: h1')
  await go('/nope')
  check(/no se encontr/i.test(await page.locator('main h1').innerText()), 'unknown route: needs a not-found page')
  check(await page.locator('main').getByRole('link', { name: /inicio/i }).count() > 0, 'not found: needs a way home')

  // Theme: choose dark, survive a reload
  await go('')
  await page.getByRole('radio', { name: /oscuro/i }).check({ force: true })
  check((await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark', 'theme: choosing dark must set data-theme')
  await page.reload(); await page.waitForSelector('main h1')
  check((await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark', 'theme: the choice must survive a reload')

  // Every component page opens, titled, with at least one live example and no errors
  const ids = await (async () => { await go('/components'); return page.$$eval('main a[href^="#/components/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href').slice(2)))]) })()
  check(ids.length >= 70, `expected 70+ component routes, found ${ids.length}`)
  for (const route of ids) {
    await page.evaluate((r) => { location.hash = '#/' + r }, route)
    await page.waitForFunction((r) => document.body.dataset.route === r, route)
    await page.waitForSelector('main h1', { timeout: 10000 }).catch(() => {}) // content is fetched when the page opens
    await page.waitForSelector('[data-live-example]', { timeout: 10000 }).catch(() => {})
    const live = await page.locator('[data-live-example]').count()
    check(live > 0, `${route}: needs at least one live example`)
    check((await page.locator('main h1').innerText()).trim().length > 0, `${route}: needs an h1`)
  }
  check(errors.length === 0, `console/page errors: ${[...new Set(errors)].slice(0, 3).join(' | ')}`)

  // axe + mobile overflow, light and dark
  const audited = ['', '/getting-started', '/components', '/components/chip', '/components/button', '/decisions', '/decisions/DDR-KF-015', '/tokens', '/nope']
  for (const size of [{ width: 1280, height: 900 }, { width: 390, height: 800 }]) for (const theme of ['light', 'dark']) {
    await page.setViewportSize(size)
    for (const route of audited) {
      await page.evaluate((t) => localStorage.setItem('kafka-site-theme', t), theme)
      await go(route)
      await page.addScriptTag({ content: axeSource })
      const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }))
      for (const v of result.violations) check(false, `axe · ${route || '/'} · ${size.width} · ${theme} · ${v.id}: ${v.help} (${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(', ')})`)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      check(overflow <= 0, `overflow · ${route || '/'} · ${size.width}: page is ${overflow}px wider than the screen`)
    }
  }
  check(foreign.length === 0, `requests outside the site: ${[...new Set(foreign)].slice(0, 3).join(', ')}`)
} finally { await browser.close(); server?.kill() }

if (failures.length) { console.log(failures.slice(0, 40).map((f) => `  ✗ ${f}`).join('\n') + (failures.length > 40 ? `\n  … and ${failures.length - 40} more` : '')); process.exit(1) }
console.log('✓ Docs site: routes, live examples, focus, theme, axe (2 sizes × 2 themes) and no foreign requests')
