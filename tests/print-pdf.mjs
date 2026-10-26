// Print output test (DDR-KF-005). Renders a sample book chapter with src/styles/print.css through Playwright's PDF
// engine and checks what a printer would care about: page size, page count, embedded fonts and text that is not
// cut off. Needs poppler-utils (pdfinfo, pdffonts, pdftotext).
//   node tests/print-pdf.mjs
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const root = path.resolve(import.meta.dirname, '..')
const MM_TO_PT = 72 / 25.4
const SAFE_EDGE_MM = 5 // nothing may sit closer than this to the trim edge (unprintable zone)
const PAGE_TOLERANCE_PT = 1

const primitives = JSON.parse(fs.readFileSync(path.join(root, 'tokens/primitives.json'), 'utf8'))
const mm = (token) => parseFloat(token.$value)
const a5 = { w: mm(primitives.physical.page.a5.width), h: mm(primitives.physical.page.a5.height) }

const failures = []
const check = (ok, message) => { if (!ok) failures.push(message) }
const tool = (cmd, ...args) => execFileSync(cmd, args, { encoding: 'utf8' })

// ── Sample content: a chapter long enough for several A5 pages, with the elements print must handle ──────────
const sentence = 'La tinta se seca despacio sobre el papel y la página guarda la voz de quien escribe, aunque nadie la lea todavía.'
const paragraph = (n) => `<p>${Array.from({ length: 5 }, (_, i) => `${sentence} (${n}.${i + 1})`).join(' ')}</p>`
const LAST_MARKER = 'FINALDELCAPITULO'
const html = (cssHrefs) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Muestra de libro</title>
${cssHrefs.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n')}
</head><body class="kafka-print kafka-print--book">
<h1>Capítulo primero</h1>
${Array.from({ length: 24 }, (_, i) => paragraph(i + 1)).join('\n')}
<p>${LAST_MARKER}</p>
</body></html>`

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kafka-print-'))
process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }))
const href = (rel) => pathToFileURL(path.join(root, rel)).href
const htmlFile = path.join(tmp, 'book.html')
fs.writeFileSync(htmlFile, html([href('src/styles/tokens.css'), href('src/styles/print.css')]))

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(pathToFileURL(htmlFile).href)
await page.evaluate(() => document.fonts.ready)
const pdfFile = path.join(tmp, 'book.pdf')
await page.pdf({ path: pdfFile, preferCSSPageSize: true, printBackground: true })
await browser.close()

// 1 · Page size: every page is A5 (taken from the physical.page.a5 tokens, the single source of truth)
const info = tool('pdfinfo', '-f', '1', '-l', '999', pdfFile)
const pages = Number(/^Pages:\s+(\d+)/m.exec(info)?.[1])
const sizes = [...info.matchAll(/^Page\s+(\d+)\s+size:\s+([\d.]+) x ([\d.]+) pts/gm)].map((m) => ({ n: +m[1], w: +m[2], h: +m[3] }))
const expected = { w: a5.w * MM_TO_PT, h: a5.h * MM_TO_PT }
check(sizes.length === pages && pages > 0, `pdfinfo reported ${sizes.length} page sizes for ${pages} pages`)
for (const s of sizes) {
  check(Math.abs(s.w - expected.w) <= PAGE_TOLERANCE_PT && Math.abs(s.h - expected.h) <= PAGE_TOLERANCE_PT,
    `page ${s.n} is ${s.w} × ${s.h} pt, expected A5 ${expected.w.toFixed(1)} × ${expected.h.toFixed(1)} pt`)
}

// 2 · Page count: the sample chapter paginates (a single page would mean the text is clipped, not flowed)
check(pages >= 3 && pages <= 14, `sample chapter should span 3–14 A5 pages, got ${pages}`)

// 3 · Fonts: every font is embedded
const fontRows = tool('pdffonts', pdfFile).split('\n').slice(2).filter((l) => l.trim())
check(fontRows.length > 0, 'the PDF lists no fonts')
for (const row of fontRows) {
  const cols = row.trim().split(/\s+/)
  const emb = cols[cols.length - 5] // columns end: emb sub uni object ID (two for ID)
  check(emb === 'yes', `font not embedded: ${row.trim()}`)
}

// 4 · No cut text: the last word survives, and no word sits outside the printable area
const text = tool('pdftotext', '-layout', pdfFile, '-')
check(text.includes(LAST_MARKER), 'the last paragraph is missing from the PDF (text was cut off)')
const bbox = tool('pdftotext', '-bbox', pdfFile, '-')
const edge = SAFE_EDGE_MM * MM_TO_PT
for (const pg of bbox.split('<page ').slice(1)) {
  const [, w, h] = /width="([\d.]+)" height="([\d.]+)"/.exec(pg).map(Number)
  const n = bbox.split('<page ').slice(1).indexOf(pg) + 1
  for (const m of pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</g)) {
    const [xMin, yMin, xMax, yMax] = m.slice(1, 5).map(Number)
    if (xMin < edge || yMin < edge || xMax > w - edge || yMax > h - edge) {
      check(false, `page ${n}: "${m[5]}" is outside the printable area (${SAFE_EDGE_MM} mm from the edge)`)
      break
    }
  }
}

if (failures.length) {
  console.error(`✗ Print output: ${failures.length} problem(s)`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log(`✓ Print output: ${pages} A5 pages, ${fontRows.length} embedded font(s), no cut text`)
