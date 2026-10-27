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
  for (const name of ['Inicio', 'Primeros pasos', 'Componentes', 'Tokens']) {
    const link = banner.getByRole('navigation', { name: /principal/i }).getByRole('link', { name, exact: true })
    check(await link.count() === 1, `home: header link "${name}"`)
    const geo = await link.evaluate((a) => { const i = a.querySelector('svg[aria-hidden="true"]'); const t = a.querySelector('span'); return i && t ? { icon: i.getBoundingClientRect().right, label: t.getBoundingClientRect().left } : null })
    check(geo !== null && geo.icon <= geo.label + 1, `header: "${name}" needs its icon to the left of the label`)
  }
  check(await banner.getByRole('navigation', { name: /principal/i }).getByRole('link', { name: 'Inicio', exact: true }).getAttribute('aria-current') === 'page', 'home: "Inicio" is the current page')
  check(await banner.getByRole('link', { name: /decisiones/i }).count() === 0, 'header: no link to the decisions')
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
  check(/1\.129/.test(main) && /\b7\s*:\s*1\b/.test(main) && /\b3\b\s+plantillas de impresión/.test(main), 'home: needs the numbers (70, 1.129, 3 print templates, 7:1)')
  check(!/DDR|decisiones|roadmap|hoja de ruta/i.test(await page.locator('body').innerText()), 'home: nothing about the decisions or the roadmap is public')
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

  // Header: the main navigation is centred on the page, on the home page and on a documentation page
  const centred = async () => page.evaluate(() => { const r = document.querySelector('.main-nav').getBoundingClientRect(); return Math.abs((r.left + r.right) / 2 - window.innerWidth / 2) })
  check(await centred() <= 24, `header: the navigation is ${await centred()}px off the centre on the home page`)
  // Brand: a gold mark with the K, and a version tag that shares the word's baseline
  const brand = await page.evaluate(() => {
    const a = document.querySelector('.brand'), mark = a.querySelector('.brand-mark'), word = a.querySelector('.brand-name'), tag = a.querySelector('.brand-version')
    if (!mark || !word || !tag) return null
    const base = (el) => { const p = document.createElement('span'); p.style.cssText = 'display:inline-block;width:0;height:0'; el.appendChild(p); const y = p.getBoundingClientRect().bottom; p.remove(); return y }
    return { bg: getComputedStyle(mark).backgroundColor, mark: mark.textContent.trim(), hidden: mark.getAttribute('aria-hidden'), off: Math.abs(base(word) - base(tag)) }
  })
  check(brand !== null && brand.mark === 'K' && brand.hidden === 'true', 'brand: needs a decorative K mark')
  check(brand !== null && /rgb\(2(0|1)\d, 1[67]\d, [3-6]\d\)/.test(brand.bg), `brand: the mark must be gold, it was ${brand?.bg}`)
  check(brand !== null && brand.off <= 1.5, `brand: the version tag is ${brand?.off.toFixed(1)}px off the baseline of "Kafka"`)

  // Outline controls answer to the pointer
  for (const sel of ['.l-btn-line', '.l-pill', '.foot-top', '.l-pages button:not([aria-current])']) {
    const el = page.locator(sel).first()
    await el.scrollIntoViewIfNeeded()
    await page.mouse.move(0, 0)
    const before = await el.evaluate((e) => { const c = getComputedStyle(e); return c.backgroundColor + c.color })
    await el.hover()
    await page.waitForTimeout(300) // colours ease in
    const after = await el.evaluate((e) => { const c = getComputedStyle(e); return c.backgroundColor + c.color })
    check(before !== after, `hover: ${sel} must change on hover`)
  }
  await page.mouse.move(0, 0)

  // Section labels carry words, not numbering symbols; the print templates only show what the system can do
  check(!/§/.test(await page.locator('main').innerText()), 'home: labels must not carry "§"')
  check(await page.locator('.l-templates a').count() === 0, 'print: the templates show capabilities, they are not links')
  check(await page.locator('.l-templates li').count() === 3, 'print: three templates')
  const gap = await page.evaluate(() => document.querySelector('.l-popular').getBoundingClientRect().top - document.querySelector('.catalog-search input').getBoundingClientRect().bottom)
  check(gap >= 16, `search: only ${gap}px between the field and the popular searches`)

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
  for (const name of [/decisiones/i, /hoja de ruta/i, /sangrado y marcas/i]) check(await footer.getByRole('link', { name }).count() === 0, `footer: no link ${name}`)
  // A link shows a focus ring only while it has focus: never a permanent box
  for (const r of ['', '/getting-started', '/components', '/components/chip', '/tokens', '/altazor']) {
    await go(r)
    await page.locator('body').click({ position: { x: 2, y: 2 } })
    const boxed = await page.$$eval('main a, footer a, header a', (as) => as.filter((a) => { const c = getComputedStyle(a); return c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0 }).map((a) => a.textContent.trim().slice(0, 30)))
    check(boxed.length === 0, `${r || '/'}: links with an outline without focus: ${boxed.slice(0, 3).join(', ')}`)
  }
  await go('/getting-started')
  check(await page.locator('main .p-doc a').first().evaluate((a) => getComputedStyle(a).textDecorationLine === 'underline'), 'links in the text stay underlined')
  await page.keyboard.press('Tab') // the last input was the keyboard, so a focus() shows the ring (:focus-visible)
  await page.locator('main .p-doc a').first().focus()
  await page.waitForTimeout(300) // the outline is read once it has settled
  const ring = await page.locator('main .p-doc a').first().evaluate((a) => { const c = getComputedStyle(a); return { w: c.outlineWidth, st: c.outlineStyle, focused: document.activeElement === a, vis: a.matches(':focus-visible'), href: a.getAttribute('href') } })
  check(parseFloat(ring.w) >= 2, `a link in the text must show its ring when it has keyboard focus (${JSON.stringify(ring)})`)
  // Every link that leaves for GitHub opens in a new tab
  for (const r of ['', '/getting-started', '/components', '/tokens', '/components/chip']) {
    await go(r)
    const bad = await page.$$eval('a[href^="http"]', (as) => as.filter((a) => a.target !== '_blank' || !/noopener/.test(a.rel) || !/noreferrer/.test(a.rel)).map((a) => a.href))
    check(bad.length === 0, `${r || '/'}: external links must open in a new tab (${bad.slice(0, 2).join(', ')})`)
  }
  await go('')

  // Altazor showcase: reachable from the footer, the home and the Tokens page; never a main-menu item; the switch changes the theme
  await go('')
  check(await page.getByRole('contentinfo').getByRole('link', { name: 'Tema Altazor' }).count() === 1, 'altazor: the footer links to the showcase')
  check(await page.locator('.main-nav').getByRole('link', { name: /altazor/i }).count() === 0, 'altazor: it is not an item of the main menu')
  check(await page.getByRole('link', { name: /cómo se viste con un tema/i }).count() === 1, 'altazor: the home links to the showcase')
  await go('/tokens')
  check(await page.locator('[data-next]').getByRole('link', { name: /ver el ejemplo/i }).count() === 1, 'altazor: the Tokens page ends with a link to the showcase')
  const jsErrors = []
  page.on('pageerror', (e) => jsErrors.push(String(e)))
  await go('/altazor')
  await page.waitForSelector('.az-stage[data-on]')
  check(await page.locator('.az-stage[data-on="altazor"][data-kafka-theme="altazor"]').count() === 1, 'altazor: the components start with the theme applied')
  const radius = () => page.getByRole('button', { name: 'Inscribirme' }).evaluate((b) => getComputedStyle(b).borderTopLeftRadius)
  const withTheme = await radius()
  await page.getByRole('radio', { name: 'Kafka' }).click()
  check(await page.locator('.az-stage[data-on="kafka"]:not([data-kafka-theme])').count() === 1, 'altazor: choosing Kafka removes the theme')
  await page.waitForTimeout(500)
  const without = await radius()
  check(withTheme !== without, `altazor: the button radius must change with the theme (${withTheme} vs ${without})`)
  check(await page.locator('.az-patterns [data-kafka-theme="altazor"], .az-patterns[data-kafka-theme="altazor"]').count() >= 1, 'altazor: the patterns are always shown with the theme')
  check(await page.locator('table tbody tr').count() >= 3, 'altazor: the "qué cambia" table lists the overridden tokens')
  check(jsErrors.length === 0, `altazor: script errors ${jsErrors.join(' | ')}`)
  await go('')

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

  // Inner pages speak the home's language: wide page, breadcrumb, search in the head, index of the page on the side, no sidebar
  await go('/getting-started')
  check(await page.locator('aside').count() === 0, 'inner page: no documentation sidebar, the page is wide like the home')
  check(await page.locator('main').getByRole('combobox', { name: /buscar/i }).count() === 1, 'inner page: the search sits in the page head')
  check(await page.locator('main').getByRole('navigation', { name: 'Ruta' }).getByRole('link', { name: 'Inicio' }).count() === 1, 'inner page: breadcrumb back to the home')
  check((await page.locator('main h1').innerText()).trim() === 'Primeros pasos', 'inner page: h1')
  const toc = page.locator('main').getByRole('navigation', { name: 'En esta página' })
  check(await toc.getByRole('button').count() >= 2, 'inner page: an index of the page with at least two entries')
  check(await page.locator('main h2[id]').count() >= 2, 'inner page: every section heading has an id')
  const second = toc.getByRole('button').nth(1)
  const target = await page.evaluate(() => document.querySelectorAll('main h2[id]')[1].id)
  await second.click()
  check(await page.evaluate((id) => { const r = document.getElementById(id).getBoundingClientRect(); return r.top >= 0 && r.top < 300 }, target), 'inner page: choosing an entry of the index brings its section to the top')
  check((await toc.locator('[aria-current="true"]').count()) === 1, 'inner page: the index marks the current section')
  check(await page.locator('main [data-next]').getByRole('link', { name: /ir al catálogo/i }).count() === 1, 'getting started: closes with a band that leads to the catalog')
  check(await page.getByRole('contentinfo').count() === 1, 'inner page: the footer is on every page')
  check(await centred() <= 24, `header: the navigation is ${await centred()}px off the centre on a documentation page`)
  const leftOf = async (sel) => page.locator(sel).first().evaluate((el) => Math.round(el.getBoundingClientRect().left))
  const innerLeft = await leftOf('main h1')
  await go('')
  const homeLeft = await leftOf('.landing .l-catalog')
  check(Math.abs(innerLeft - homeLeft) <= 1, `alignment: inner pages start at ${innerLeft}px, the home panel at ${homeLeft}px`)
  for (const r of ['/components', '/tokens']) {
    await go(r)
    check(await page.locator('aside').count() === 0, `${r}: no sidebar`)
    check(await page.locator('main').getByRole('navigation', { name: 'Ruta' }).count() === 1, `${r}: breadcrumb`)
    check(Math.abs(await leftOf('main h1') - homeLeft) <= 1, `${r}: the title must start where the home content starts`)
  }
  for (const r of ['/decisions', '/decisions/DDR-KF-015', '/roadmap']) {
    await go(r)
    check(/no se encontr/i.test(await page.locator('main h1').innerText()), `${r}: must not exist in the public site`)
  }
  await go('/components')
  check(await page.locator('main [data-page-head]').count() === 1, 'components: same page head as the other inner pages')

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
  await go('/components')
  await search.fill('DDR')
  check(await page.getByRole('option').count() === 0, 'search: nothing about the decisions can be found')
  await search.fill('navegacion')
  check(await page.getByRole('option', { name: /Tabs/ }).count() >= 1, 'search: it finds by family and ignores accents ("navegacion" → Tabs · Navegación)')
  await search.fill('zzzz')
  check(await page.getByText(/sin resultados/i).count() > 0, 'search: needs an empty state')
  await page.keyboard.press('Escape')

  // Components index: families and every component
  await go('/components')
  check((await page.locator('main h2').count()) >= 8, 'components: needs one heading per family')
  check((await page.locator('main a[href^="#/components/"]').count()) >= 70, 'components: needs a link to each of the 70 components')

  // A component page is the drill-down inside the catalog panel: search, families and the detail of the component
  await go('/components/chip')
  const panel = page.locator('.l-catalog')
  check(await page.locator('aside').count() === 0, 'component: wide page, no sidebar')
  check(await panel.getByRole('combobox', { name: /buscar componente/i }).count() === 1, 'component: the catalog search stays on top of the detail')
  check(await panel.locator('.l-popular a').count() === 4, 'component: popular components stay as links under the search, spaced from it')
  check((await panel.locator('[data-detail] h1').innerText()).trim() === 'Chip', 'component: the detail has the component as h1')
  check((await page.title()) === 'Chip · Kafka', `chip: title was "${await page.title()}"`)
  check(/@kafka-ds\/react/.test(await panel.locator('[data-detail] [data-import]').innerText()), 'component: shows the import line apart from the doc')
  check(await panel.locator('[data-detail] > nav[aria-label="Ruta"] [aria-current="page"]').innerText() === 'Chip', 'component: breadcrumb ends at the component')
  check(await panel.getByRole('link', { name: /volver a los resultados/i }).getAttribute('href') === '#/components', 'component: a way back to the results')
  check(await panel.getByRole('navigation', { name: 'Familias' }).locator('[aria-current="true"]').count() === 1, 'component: the family of the component is marked in the rail')
  check(await panel.getByRole('navigation', { name: 'Familias' }).getByRole('link', { name: 'Chip', exact: true }).getAttribute('aria-current') === 'page', 'component: the rail lists the siblings and marks the current component')
  const seminarios = page.locator('[data-live-example] button', { hasText: 'Seminarios' })
  check(await seminarios.count() === 1, 'chip: the live example must render')
  await seminarios.click()
  check((await seminarios.getAttribute('aria-pressed')) === 'true', 'chip: the live example must respond to a click')
  check(await page.locator('main table').count() > 0, 'chip: the props table must be there')
  check(await page.locator('main pre code').count() > 0, 'chip: code samples must be there')
  const tabs = panel.getByRole('navigation', { name: 'Secciones' })
  check(await tabs.getByRole('button').count() >= 3, 'component: section tabs')
  const propsId = await page.evaluate(() => [...document.querySelectorAll('[data-detail] h2')].find((h) => /^(Props|Propiedades)/.test(h.textContent.trim()))?.id)
  await tabs.getByRole('button', { name: 'Propiedades' }).click()
  check(await page.evaluate((id) => { const r = document.getElementById(id).getBoundingClientRect(); return r.top >= 0 && r.top < 300 }, propsId), 'component: a tab brings its section to the top')
  check(await panel.getByRole('navigation', { name: 'Anterior y siguiente' }).getByRole('link').count() >= 1, 'component: previous and next inside the family')
  // The family rail opens another family and lists its components
  const rail = panel.getByRole('navigation', { name: 'Familias' })
  const closed = await rail.locator('button[aria-expanded="false"]').first().elementHandle()
  await closed.click()
  check(await closed.getAttribute('aria-expanded') === 'true', 'component: a family in the rail expands')
  const next = panel.getByRole('navigation', { name: 'Anterior y siguiente' }).getByRole('link').last()
  const nextRoute = (await next.getAttribute('href')).slice(2)
  await next.click()
  await page.waitForFunction((r) => document.body.dataset.route === r, nextRoute)
  check(await page.evaluate(() => document.activeElement?.id === 'contenido'), 'after navigating, focus must move to the content')
  // Searching from the detail goes to another component
  await panel.getByRole('combobox', { name: /buscar componente/i }).fill('tabs')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => document.body.dataset.route === 'components/tabs')
  await rail.getByRole('link', { name: /todos/i }).click()
  await page.waitForFunction(() => document.body.dataset.route === 'components')

  // A route that does not exist
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

  // Footer: the author's name leads to the UX portfolio
  await go('')
  const author = page.getByRole('contentinfo').getByRole('link', { name: 'Jonathan Lerma' })
  check(await author.count() === 1, 'footer: "Jonathan Lerma" must be a link')
  if (await author.count() === 1) {
    check((await author.getAttribute('href')) === 'https://ux.jonathanlerma.com', `footer: the author link goes to the UX site, it went to ${await author.getAttribute('href')}`)
    check((await author.getAttribute('target')) === '_blank' && /noopener/.test((await author.getAttribute('rel')) ?? ''), 'footer: the author link opens in a new tab with noopener')
  }

  // Header on a phone: icon-only theme switch and a hamburger that opens a side panel
  await page.setViewportSize({ width: 390, height: 800 })
  await go('')
  const phoneBanner = page.getByRole('banner')
  const burger = phoneBanner.getByRole('button', { name: /abrir menú/i })
  check(await burger.count() === 1, 'phone header: needs one "Abrir menú" button')
  check(await phoneBanner.getByRole('navigation', { name: /principal/i }).count() === 0, 'phone header: the four links must not sit in the header')
  const headerBox = await phoneBanner.boundingBox()
  check(headerBox !== null && headerBox.height <= 80, `phone header: must be one row, it is ${headerBox?.height}px tall`)
  const radios = phoneBanner.getByRole('radio')
  check(await radios.count() === 3, 'phone header: the theme switch keeps its three options')
  for (let i = 0; i < await radios.count(); i++) {
    const r = radios.nth(i)
    const box = await r.boundingBox()
    check(box !== null && box.width <= 56 && box.width >= 44 && box.height >= 44, `phone header: theme option ${i} must be an icon-only 44 px target, it is ${box?.width}×${box?.height}`)
    check(((await r.getAttribute('aria-label')) ?? '').length > 0 || (await r.evaluate((e) => e.textContent.trim().length)) > 0, `phone header: theme option ${i} keeps an accessible name`)
    check(await r.evaluate((e) => e.getBoundingClientRect().width < 56 && e.querySelector('svg') !== null), `phone header: theme option ${i} shows an icon`)
  }
  check(await burger.getAttribute('aria-expanded') === 'false', 'phone header: the menu button starts collapsed')
  await burger.click()
  const menuPanel = page.getByRole('dialog', { name: /menú/i })
  await menuPanel.waitFor({ state: 'visible' })
  check(await burger.getAttribute('aria-expanded') === 'true', 'phone header: the menu button reports it is open')
  const panelLinks = menuPanel.getByRole('navigation', { name: /principal/i }).getByRole('link')
  check(await panelLinks.count() === 4, `phone menu: four links in the panel, found ${await panelLinks.count()}`)
  const pbox = await menuPanel.boundingBox()
  check(pbox !== null && pbox.height >= 700 && pbox.width < 390 && pbox.width >= 240, `phone menu: a side panel that does not cover the whole screen (${pbox?.width}×${pbox?.height})`)
  check(await menuPanel.getByRole('link', { name: 'Inicio', exact: true }).getAttribute('aria-current') === 'page', 'phone menu: marks the current page')
  await page.keyboard.press('Escape')
  await menuPanel.waitFor({ state: 'hidden' })
  check(await burger.evaluate((e) => e === document.activeElement), 'phone menu: Esc closes it and returns focus to the menu button')
  await burger.click()
  await menuPanel.getByRole('link', { name: 'Tokens', exact: true }).click()
  await page.waitForFunction(() => document.body.dataset.route === 'tokens')
  check(await menuPanel.isHidden(), 'phone menu: choosing a link closes the panel')
  await page.setViewportSize({ width: 1280, height: 900 })
  await go('')
  check(await page.getByRole('banner').getByRole('button', { name: /abrir menú/i }).count() === 0, 'desktop header: no hamburger')
  const labelled = await page.getByRole('banner').getByRole('radio').first().evaluate((e) => e.textContent.trim().length)
  check(labelled > 0, 'desktop header: the theme switch keeps its text labels')
  await page.setViewportSize({ width: 1024, height: 800 })
  await go('')
  const tabletBox = await page.getByRole('banner').boundingBox()
  check(tabletBox !== null && tabletBox.height <= 80, `tablet header: one row at 1024 px, it is ${tabletBox?.height}px tall`)
  check(await page.getByRole('banner').getByRole('navigation', { name: /principal/i }).getByRole('link').count() === 4, 'tablet header: keeps the four links')
  await page.setViewportSize({ width: 1280, height: 900 })

  // Motion: depth at rest, a response under the pointer, and none of it with reduced motion
  await go('')
  const shadowOf = (sel) => page.locator(sel).first().evaluate((e) => getComputedStyle(e).boxShadow)
  for (const sel of ['.l-cards article', '.l-catalog', '.l-print']) {
    await page.locator(sel).first().scrollIntoViewIfNeeded()
    check((await shadowOf(sel)) !== 'none', `elevation: ${sel} needs a resting shadow`)
  }
  await go('/components')
  check((await shadowOf('.cards li')) !== 'none', 'elevation: the family cards on the components page need a resting shadow')
  const motionCtx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' })
  const mp = await motionCtx.newPage()
  await mp.goto(BASE); await mp.waitForSelector('main h1')
  const swatch = mp.locator('.l-swatches li').nth(2)
  await swatch.scrollIntoViewIfNeeded()
  await mp.mouse.move(0, 0)
  const rest = await swatch.boundingBox()
  await swatch.hover(); await mp.waitForTimeout(500)
  const grown = await swatch.boundingBox()
  check(rest !== null && grown !== null && grown.width > rest.width + 4, `motion: a swatch must grow under the pointer (${rest?.width} → ${grown?.width})`)
  const sibling = await mp.locator('.l-swatches li').nth(0).boundingBox()
  check(sibling !== null && sibling.width < rest.width, 'motion: the neighbours give way as the hovered swatch grows')
  const total = await mp.locator('.l-swatches').evaluate((e) => e.scrollWidth - e.clientWidth)
  check(total <= 1, 'motion: the swatches never overflow their band while one grows')
  const card = mp.locator('.l-cards article').first()
  await card.scrollIntoViewIfNeeded()
  await mp.mouse.move(0, 0); await mp.waitForTimeout(400)
  const cardRest = await card.boundingBox(); const shadowRest = await card.evaluate((e) => getComputedStyle(e).boxShadow)
  await card.hover(); await mp.waitForTimeout(500)
  const cardUp = await card.boundingBox(); const shadowUp = await card.evaluate((e) => getComputedStyle(e).boxShadow)
  check(cardRest !== null && cardUp !== null && cardUp.y < cardRest.y - 1, 'motion: a catalog card lifts under the pointer')
  check(shadowRest !== shadowUp, 'motion: a catalog card deepens its shadow under the pointer')
  await motionCtx.close()
  // reducedMotion is "reduce" in the main page: nothing moves or grows
  await go('')
  const sw2 = page.locator('.l-swatches li').nth(2)
  await sw2.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0)
  const r0 = await sw2.boundingBox(); await sw2.hover(); await page.waitForTimeout(500); const r1 = await sw2.boundingBox()
  check(r0 !== null && r1 !== null && Math.abs(r1.width - r0.width) < 1.5, 'reduced motion: the swatches stay still')
  const c2 = page.locator('.l-cards article').first(); await c2.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0); await page.waitForTimeout(200)
  const c0 = await c2.boundingBox(); await c2.hover(); await page.waitForTimeout(500); const c1 = await c2.boundingBox()
  check(c0 !== null && c1 !== null && Math.abs(c1.y - c0.y) < 1, 'reduced motion: the cards do not move')
  await page.mouse.move(0, 0)

  // axe + mobile overflow, light and dark
  const audited = ['', '/getting-started', '/components', '/components/chip', '/components/button', '/tokens', '/altazor', '/nope']
  for (const size of [{ width: 1280, height: 900 }, { width: 390, height: 800 }]) for (const theme of ['light', 'dark']) {
    await page.setViewportSize(size)
    for (const route of audited) {
      await page.evaluate((t) => localStorage.setItem('kafka-site-theme', t), theme)
      await go(route)
      await page.waitForTimeout(300) // colours settle after a theme change; axe must not read them mid-transition
      await page.addScriptTag({ content: axeSource })
      const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }))
      for (const v of result.violations) check(false, `axe · ${route || '/'} · ${size.width} · ${theme} · ${v.id}: ${v.help} (${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(', ')})`)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      check(overflow <= 0, `overflow · ${route || '/'} · ${size.width}: page is ${overflow}px wider than the screen`)
    }
  }
  check(foreign.length === 0, `requests outside the site: ${[...new Set(foreign)].slice(0, 3).join(', ')}`)
} finally { await browser.close(); server?.kill() }

if (failures.length) { if (process.env.GITHUB_ACTIONS) for (const f of failures.slice(0, 10)) console.log(`::error title=site-browser::${f.replace(/\n/g, ' ')}`); console.log(failures.slice(0, 40).map((f) => `  ✗ ${f}`).join('\n') + (failures.length > 40 ? `\n  … and ${failures.length - 40} more` : '')); process.exit(1) }
console.log('✓ Docs site: routes, live examples, focus, theme, axe (2 sizes × 2 themes) and no foreign requests')
