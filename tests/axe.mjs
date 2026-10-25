// axe-core on every example, 2 viewports × 2 themes. Zero violations is the bar.
import fs from 'node:fs'
import { withBrowser, url } from './lib/server.mjs'
import { registry } from '../examples/index.ts'

const axeSource = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const viewports = [{ name: 'desktop', width: 1280, height: 900 }, { name: 'mobile', width: 390, height: 800 }]
const themes = ['light', 'dark']
let pages = 0, violations = 0

await withBrowser(async (browser) => {
  for (const id of Object.keys(registry)) for (const vp of viewports) for (const theme of themes) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' }) // entrance animations would be scanned half-faded
    await page.goto(url({ only: id, theme }))
    await page.waitForSelector('main')
    await page.addScriptTag({ content: axeSource })
    const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }))
    pages++
    for (const v of result.violations) {
      violations++
      console.log(`  ✗ ${id} · ${vp.name} · ${theme} · ${v.id}: ${v.help}\n      ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('\n      ')}`)
    }
    await page.close()
  }
})
// Overlays are closed in their examples, so scan them again in their open state.
const opened = {
  popover: async (p) => { await p.getByRole('button', { name: 'Filtrar' }).click() },
  menu: async (p) => { await p.getByRole('button', { name: 'Acciones' }).click() },
  combobox: async (p) => { await p.getByRole('combobox').focus(); await p.keyboard.type('a') },
  modal: async (p) => { await p.getByRole('button', { name: 'Abrir inscripción' }).click() },
  drawer: async (p) => { await p.getByRole('button', { name: 'Filtros' }).click() },
  'confirm-dialog': async (p) => { await p.getByRole('button', { name: 'Eliminar relato' }).click() },
  tooltip: async (p) => { await p.keyboard.press('Tab') },
  'date-picker': async (p) => { await p.getByRole('button', { name: 'Abrir calendario' }).click() },
  toast: async (p) => { await p.getByRole('button', { name: 'Guardar cambios' }).click(); await p.getByRole('button', { name: 'Simular error' }).click() },
  'notification-center': async (p) => { await p.getByRole('button', { name: /^Notificaciones/ }).first().click() },
}
await withBrowser(async (browser) => {
  for (const [id, open] of Object.entries(opened)) for (const vp of viewports) for (const theme of themes) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
    await page.goto(url({ only: id, theme }))
    await page.waitForSelector('main')
    await open(page)
    await page.waitForTimeout(400)
    await page.addScriptTag({ content: axeSource })
    const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }))
    pages++
    for (const v of result.violations) {
      violations++
      console.log(`  ✗ ${id} (open) · ${vp.name} · ${theme} · ${v.id}: ${v.help}\n      ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('\n      ')}`)
    }
    await page.close()
  }
})
console.log(`\n  ${pages} pages checked (${Object.keys(registry).length} component(s) × ${viewports.length} viewports × ${themes.length} themes)`)
if (violations) { console.log(`✗ ${violations} axe violation(s)`); process.exit(1) }
console.log('✓ axe-core: 0 violations')
