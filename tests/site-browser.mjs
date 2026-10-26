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
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('request', (r) => { if (!r.url().startsWith(ORIGIN) && !r.url().startsWith('data:')) foreign.push(r.url()) })
  const go = async (hash) => { await page.goto(BASE + (hash ? '#' + hash : '')); await page.waitForSelector('main h1') }

  // Home
  await go('')
  check((await page.locator('main h1').innerText()).trim() === 'Kafka', 'home: h1 must be "Kafka"')
  check(/70\s+componentes/i.test(await page.locator('main').innerText()), 'home: must say how many components there are')
  check(await page.getByRole('link', { name: /primeros pasos/i }).count() > 0, 'home: needs a link to getting started')
  check((await page.title()) === 'Kafka · Sistema de diseño', `home: title was "${await page.title()}"`)

  // Skip link comes first and lands on the content
  await page.keyboard.press('Tab')
  check((await page.evaluate(() => document.activeElement?.textContent ?? '')).match(/saltar al contenido/i) !== null, 'first Tab must reach the skip link')
  await page.keyboard.press('Enter')
  check(await page.evaluate(() => document.activeElement?.id === 'contenido'), 'the skip link must move focus to #contenido')

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
