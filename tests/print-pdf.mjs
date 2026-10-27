// Print output test (DDR-KF-005). Renders a sample book chapter with src/styles/print.css through Playwright's PDF
// engine and checks what a printer would care about: page size, page count, embedded fonts and text that is not
// cut off. Needs poppler-utils (pdfinfo, pdffonts, pdftotext).
//   node tests/print-pdf.mjs            (KAFKA_PRINT_OUT=file.pdf keeps the sample PDF)
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { chromium } from 'playwright'
import { tsImport } from 'tsx/esm/api'
import { checkReadingFont } from './lib/pdf.mjs'

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

// ── Sample content: a chapter long enough for several A5 pages, built with the real components ───────────────
// The compiled stylesheet (Tailwind utilities included) is loaded before print.css, as an app would; needs `pnpm build`.
const { KafkaProvider, labelsEs, DropCap, Footnote, Footnotes, FootnoteItem, Verse } = await tsImport('../src/components/index.ts', import.meta.url)
const compiledDir = path.join(root, 'dist/playground/assets')
const compiledCss = fs.existsSync(compiledDir) ? fs.readdirSync(compiledDir).find((f) => f.endsWith('.css')) : undefined
if (!compiledCss) { console.error('✗ Print output: dist/playground/assets/*.css not found. Run `pnpm build` first.'); process.exit(1) }
const sentence = 'La tinta se seca despacio sobre el papel y la página guarda la voz de quien escribe, aunque nadie la lea todavía.'
const chunk = (n) => Array.from({ length: 5 }, (_, i) => `${sentence} (${n}.${i + 1})`).join(' ')
const paragraph = (n) => `<p>${chunk(n)}</p>`
const render = (el) => renderToStaticMarkup(h(KafkaProvider, { labels: labelsEs }, el))
const LAST_MARKER = 'FINALDELCAPITULO'
const RUNNING_HEAD = 'Muestra de libro'
const VERSE = ['Dentro de la sal', 'una casa pequeña guarda la luz', 'y la sombra de quien se fue.', '', 'Nadie vuelve del todo,', 'pero el nombre queda escrito en la pared.'].join('\n')
const NOTE_TEXT = ['Primera nota de la muestra.', 'Segunda nota de la muestra.']
const body = [
  '<h1>Capítulo primero</h1>',
  render(h(DropCap, { id: 'dropcap' }, chunk(1))),
  paragraph(2),
  // paragraph with two note calls: it must stay on the baseline grid
  `<p id="noted">${chunk(3)}${render(h(Footnote, { n: 1 }))} ${chunk(4)}${render(h(Footnote, { n: 2 }))}</p>`,
  paragraph(5),
  render(h(Verse, { text: VERSE, attribution: 'Altares de sal', id: 'verse' })),
  ...Array.from({ length: 18 }, (_, i) => paragraph(i + 6)),
  `<p>${LAST_MARKER}</p>`,
  render(h(Footnotes, null, NOTE_TEXT.map((t, i) => h(FootnoteItem, { n: i + 1, key: i }, t)))),
].join('\n')
const html = (cssHrefs) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Muestra de libro</title>
${cssHrefs.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n')}
<style>:root { --kafka-running-head: "${RUNNING_HEAD}"; }</style>
</head><body class="kafka-print kafka-print--book">
${body}
</body></html>`

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kafka-print-'))
process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }))
const href = (rel) => pathToFileURL(path.join(root, rel)).href
const htmlFile = path.join(tmp, 'book.html')
fs.writeFileSync(htmlFile, html([href('src/styles/tokens.css'), href('src/styles/fonts.css'), pathToFileURL(path.join(compiledDir, compiledCss)).href, href('src/styles/print.css')]))
if (process.env.KAFKA_PRINT_HTML) fs.copyFileSync(htmlFile, process.env.KAFKA_PRINT_HTML) // the sample page, for debugging in a browser

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(pathToFileURL(htmlFile).href)
await page.evaluate(() => document.fonts.ready)
await page.emulateMedia({ media: 'print' })
const bodyStyle = await page.evaluate(() => { const s = getComputedStyle(document.querySelector('p#noted')); return { widows: s.widows, orphans: s.orphans } })
const measured = await page.evaluate(() => {
  const px = (v) => parseFloat(v)
  const noted = document.querySelector('#noted'), cap = document.querySelector('#dropcap'), verse = document.querySelector('#verse')
  const lh = px(getComputedStyle(noted).lineHeight)
  const stanzas = [...verse.querySelectorAll('p')]
  return {
    lineHeightPt: lh * 0.75,
    notedLines: noted.getBoundingClientRect().height / lh,
    dropCap: { initialLetter: getComputedStyle(cap, '::first-letter').initialLetter, float: getComputedStyle(cap, '::first-letter').float },
    verse: { align: getComputedStyle(stanzas[0]).textAlign, indent: getComputedStyle(stanzas[1]).textIndent, breakInside: getComputedStyle(stanzas[0]).breakInside },
    backLinkDisplay: getComputedStyle(document.querySelector('.kafka-footnote-item a')).display,
    pageBackground: [getComputedStyle(document.documentElement).backgroundColor, getComputedStyle(document.body).backgroundColor],
    callDisplay: getComputedStyle(document.querySelector('sup a')).display,
  }
})
// A reader on the dark theme who prints still gets dark ink on white paper.
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'))
const darkInk = await page.evaluate(() => ['p#noted', '.kafka-verse > div', '[role=doc-endnotes] ol'].map((q) => getComputedStyle(document.querySelector(q)).color))
const lum = (c) => { const [r, g, b] = c.match(/[\d.]+/g).map(Number); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
check(darkInk.every((c) => lum(c) < 100), `print ink must stay dark in the dark theme, got ${darkInk.join(' | ')}`)
const pdfFile = path.join(tmp, 'book.pdf')
await page.pdf({ path: pdfFile, preferCSSPageSize: true, printBackground: true })
await browser.close()
if (process.env.KAFKA_PRINT_OUT) fs.copyFileSync(pdfFile, process.env.KAFKA_PRINT_OUT) // inspect the sample by eye

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

checkReadingFont(check, fontRows)

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

// 5 · Typesetting: widows/orphans from the tokens, a folio on every page, the running head from page 2 on
check(bodyStyle.widows === '2' && bodyStyle.orphans === '2', `paragraphs need widows 2 / orphans 2, got ${bodyStyle.widows} / ${bodyStyle.orphans}`)
for (let n = 1; n <= pages; n++) {
  const pageText = tool('pdftotext', '-f', String(n), '-l', String(n), pdfFile, '-')
  check(new RegExp(`^\\s*${n}\\s*$`, 'm').test(pageText), `page ${n} has no folio "${n}"`)
  check(n === 1 || pageText.includes(RUNNING_HEAD), `page ${n} has no running head "${RUNNING_HEAD}"`)
}
// Book margins (tokens): inner 20 mm, outer 15 mm. Body text may not come closer to the trim edge than the outer margin.
const outer = mm(primitives.physical.margin['15']) * MM_TO_PT
for (const pg of bbox.split('<page ').slice(1)) {
  const [, w, h] = /width="([\d.]+)" height="([\d.]+)"/.exec(pg).map(Number)
  const words = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</g)]
    .map((m) => ({ x0: +m[1], y0: +m[2], x1: +m[3], y1: +m[4], t: m[5] }))
    .filter((x) => x.y0 > 0.1 * h && x.y1 < 0.9 * h) // body block, excluding head and folio
  const left = Math.min(...words.map((x) => x.x0)), right = Math.max(...words.map((x) => x.x1))
  check(Math.min(left, w - right) >= outer - 1, `body text closer than 15 mm to the edge (left ${(left / MM_TO_PT).toFixed(1)} mm, right ${((w - right) / MM_TO_PT).toFixed(1)} mm)`)
}

// 6 · Footnotes, drop cap and verse (corte 3). Notes go at the end of the chapter (DDR-KF-013: Chromium has no float: footnote).
check(Math.abs(measured.lineHeightPt - 14) < 0.01, `body leading should be 14 pt, got ${measured.lineHeightPt} pt`)
check(Math.abs(measured.notedLines - Math.round(measured.notedLines)) < 0.01, `paragraph with note calls leaves the baseline grid (${measured.notedLines} lines): the call must not stretch its line`)
check(measured.pageBackground.every((c) => c === 'rgba(0, 0, 0, 0)'), `paper is the page: no screen background may print (${measured.pageBackground.join(' | ')})`)
check(measured.backLinkDisplay === 'none', 'the "back to text" link is useless on paper and must be hidden')
check(measured.callDisplay !== 'inline-flex', 'the note call must be plain inline text on paper, not an inline-flex touch target')
check(text.includes(NOTE_TEXT[0]) && text.includes(NOTE_TEXT[1]), 'the notes are missing from the PDF')
check(text.indexOf(NOTE_TEXT[0]) > text.indexOf(LAST_MARKER), 'the notes must come after the end of the chapter text')
check(measured.dropCap.initialLetter === '3' || measured.dropCap.float === 'left', `the drop cap needs initial-letter: 3 (or a float), got ${JSON.stringify(measured.dropCap)}`)
check(measured.verse.align === 'left' && measured.verse.indent === '0px' && measured.verse.breakInside === 'avoid', `verse must be ragged-right, unindented and kept whole: ${JSON.stringify(measured.verse)}`)

// Line geometry from the PDF: group words into lines by their baseline-ish position.
const wordsOf = (pg) => [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</g)]
  .map((m) => ({ x0: +m[1], y0: +m[2], x1: +m[3], y1: +m[4], t: m[5] }))
const linesOf = (words) => {
  const out = []
  for (const w of [...words].sort((a, b) => a.y1 - b.y1 || a.x0 - b.x0)) {
    const last = out[out.length - 1]
    if (last && Math.abs(last.y1 - w.y1) < 2.5) last.words.push(w); else out.push({ y1: w.y1, words: [w] })
  }
  return out.map((l) => ({ ...l, x0: Math.min(...l.words.map((w) => w.x0)), text: l.words.map((w) => w.t).join(' ') }))
}
// Poppler boxes each word with the font's own ascent and descent, so the tall drop cap (and the title) would merge with
// a neighbouring line. Measure the body lines only: words of ordinary height.
const firstWords = wordsOf(bbox.split('<page ')[1])
const heights = firstWords.map((w) => w.y1 - w.y0).sort((a, b) => a - b)
const ordinary = heights[Math.floor(heights.length / 2)] * 1.6
const firstPage = linesOf(firstWords.filter((w) => w.y1 - w.y0 <= ordinary))
// Drop cap: first body line has a tall initial; the next two lines are indented past it; the fourth is flush again.
const bodyLines = firstPage // the title and the cap were left out above
const flushX = bodyLines[3].x0
check(bodyLines[1].x0 > flushX + 8 && bodyLines[2].x0 > flushX + 8 && Math.abs(bodyLines[3].x0 - bodyLines[4].x0) < 1,
  `lines 2–3 of the first paragraph should wrap around the drop cap and line 4 be flush (x: ${bodyLines.slice(0, 5).map((l) => l.x0.toFixed(1)).join(' / ')})`)
// Verse: its lines keep the 14 pt leading and a stanza break is exactly one extra line.
const verseAt = (pg) => linesOf(wordsOf(pg)).filter((l) => l.text.includes('Dentro de la sal') || l.text.includes('una casa pequeña') || l.text.includes('y la sombra') || l.text.includes('Nadie vuelve') || l.text.includes('pero el nombre'))
const versePage = bbox.split('<page ').slice(1).map(verseAt).find((l) => l.length === 5)
check(Boolean(versePage), 'the poem is split across pages or missing: all five verses must sit on one page')
if (versePage) {
  const pitches = versePage.slice(1).map((l, i) => +(l.y1 - versePage[i].y1).toFixed(1))
  const near = (v, t) => Math.abs(v - t) <= 1 // the PDF box heights wobble with glyph shapes; exact leading is asserted from CSS above
  check(near(pitches[0], 14) && near(pitches[1], 14) && near(pitches[2], 28) && near(pitches[3], 14), `verse leading should be 14 / 14 / 28 / 14 pt, got ${pitches.join(' / ')}`)
}

if (failures.length) {
  console.error(`✗ Print output: ${failures.length} problem(s)`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log(`✓ Print output: ${pages} A5 pages, ${fontRows.length} embedded font(s), no cut text`)
