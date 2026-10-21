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
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
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
console.log(`\n  ${pages} pages checked (${Object.keys(registry).length} component(s) × ${viewports.length} viewports × ${themes.length} themes)`)
if (violations) { console.log(`✗ ${violations} axe violation(s)`); process.exit(1) }
console.log('✓ axe-core: 0 violations')
