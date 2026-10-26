// Book template test (DDR-KF-005). Renders templates/print/book.html, a complete sample book with title page, colophon,
// two chapters, a poem and notes, using only tokens.css and print.css (no Tailwind), and checks the result as a printer would.
//   node tests/print-book.mjs            (KAFKA_BOOK_OUT=file.pdf keeps the PDF)
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const root = path.resolve(import.meta.dirname, '..')
const MM_TO_PT = 72 / 25.4
const SAFE_EDGE_MM = 5
const failures = []
const check = (ok, message) => { if (!ok) failures.push(message) }
const tool = (cmd, ...args) => execFileSync(cmd, args, { encoding: 'utf8' })
const primitives = JSON.parse(fs.readFileSync(path.join(root, 'tokens/primitives.json'), 'utf8'))
const a5 = { w: parseFloat(primitives.physical.page.a5.width.$value) * MM_TO_PT, h: parseFloat(primitives.physical.page.a5.height.$value) * MM_TO_PT }

const TEMPLATE = path.join(root, 'templates/print/book.html')
if (!fs.existsSync(TEMPLATE)) { console.error('✗ Book template: templates/print/book.html does not exist'); process.exit(1) }

const RUNNING_HEAD = 'Plantilla de libro'
const BOOK_TITLE = 'Un libro de muestra'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kafka-book-'))
process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }))
const pdfFile = path.join(tmp, 'book.pdf')

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(pathToFileURL(TEMPLATE).href)
await page.evaluate(() => document.fonts.ready)
await page.emulateMedia({ media: 'print' })
const dom = await page.evaluate(() => ({
  external: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.getAttribute('href')),
  dropCap: getComputedStyle(document.querySelector('.kafka-drop-cap'), '::first-letter').initialLetter,
  chapters: document.querySelectorAll('.kafka-print__chapter').length,
  lang: document.documentElement.lang,
}))
await page.pdf({ path: pdfFile, preferCSSPageSize: true, printBackground: true })
await browser.close()
if (process.env.KAFKA_BOOK_OUT) fs.copyFileSync(pdfFile, process.env.KAFKA_BOOK_OUT)

// 0 · The template is standalone: it needs only the token and print stylesheets, and declares its language
check(dom.external.length === 2 && dom.external.every((h) => /(tokens|print)\.css$/.test(h)), `the template must link only tokens.css and print.css, got ${dom.external.join(', ')}`)
check(dom.lang === 'es', `the template must declare lang="es" (hyphenation depends on it), got "${dom.lang}"`)
check(dom.chapters === 2, `the sample has two chapters, found ${dom.chapters}`)
check(dom.dropCap === '3', `the first chapter opens with a three-line drop cap, got initial-letter: ${dom.dropCap}`)

// 1 · Geometry: every page is A5, fonts embedded, nothing outside the printable area
const info = tool('pdfinfo', '-f', '1', '-l', '999', pdfFile)
const pages = Number(/^Pages:\s+(\d+)/m.exec(info)?.[1])
for (const m of info.matchAll(/^Page\s+(\d+)\s+size:\s+([\d.]+) x ([\d.]+) pts/gm)) {
  check(Math.abs(+m[2] - a5.w) <= 1 && Math.abs(+m[3] - a5.h) <= 1, `page ${m[1]} is not A5 (${m[2]} × ${m[3]} pt)`)
}
check(pages >= 6 && pages <= 14, `the sample book should span 6–14 pages, got ${pages}`)
for (const row of tool('pdffonts', pdfFile).split('\n').slice(2).filter((l) => l.trim())) {
  const cols = row.trim().split(/\s+/)
  check(cols[cols.length - 5] === 'yes', `font not embedded: ${row.trim()}`)
}
const pageText = (n) => tool('pdftotext', '-f', String(n), '-l', String(n), pdfFile, '-')
const bbox = tool('pdftotext', '-bbox', pdfFile, '-').split('<page ').slice(1)
const edge = SAFE_EDGE_MM * MM_TO_PT
bbox.forEach((pg, i) => {
  const [, w, h] = /width="([\d.]+)" height="([\d.]+)"/.exec(pg).map(Number)
  for (const m of pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</g)) {
    const [x0, y0, x1, y1] = m.slice(1, 5).map(Number)
    if (x0 < edge || y0 < edge || x1 > w - edge || y1 > h - edge) { check(false, `page ${i + 1}: "${m[5]}" is outside the printable area`); break }
  }
})

// 2 · No blank pages: a forced recto break may not leave an empty verso in the sample
for (let n = 1; n <= pages; n++) check(pageText(n).replace(/\s+/g, '').length > 3, `page ${n} is blank`)

// 3 · Front matter: title page and colophon carry neither running head nor folio
const folio = (n, text) => new RegExp(`^\\s*${n}\\s*$`, 'm').test(text)
const p1 = pageText(1), p2 = pageText(2)
check(p1.includes(BOOK_TITLE), `page 1 should be the title page with "${BOOK_TITLE}"`)
check(p2.includes('Cervantes') && p2.includes('Bécquer'), 'page 2 should be the colophon, crediting the public-domain fragments')
for (const [n, t] of [[1, p1], [2, p2]]) {
  check(!t.includes(RUNNING_HEAD), `front matter page ${n} must not carry the running head`)
  check(!folio(n, t), `front matter page ${n} must not carry a folio`)
}

// 4 · Chapters open on a recto (odd page), with space above the title; the body pages carry head and folio
const where = (needle) => { for (let n = 1; n <= pages; n++) if (pageText(n).includes(needle)) return n; return 0 }
const ch1 = where('Capítulo primero'), ch2 = where('Capítulo segundo')
check(ch1 > 2 && ch1 % 2 === 1, `chapter 1 must open on a recto page after the colophon, opened on page ${ch1}`)
check(ch2 > ch1 && ch2 % 2 === 1, `chapter 2 must open on a recto page, opened on page ${ch2}`)
for (const [n, label] of [[ch1, 'Capítulo primero'], [ch2, 'Capítulo segundo']]) {
  const w = [...bbox[n - 1].matchAll(/<word xMin="[\d.]+" yMin="([\d.]+)"[^>]*>([^<]*)</g)].find((m) => m[2] === label.split(' ')[0])
  check(w && +w[1] >= 50 * MM_TO_PT, `"${label}" should sit at least 50 mm from the top (opener space), at ${w ? (+w[1] / MM_TO_PT).toFixed(1) : '?'} mm`)
}
for (let n = 3; n <= pages; n++) {
  const t = pageText(n)
  check(folio(n, t), `page ${n} has no folio`)
  check(t.includes(RUNNING_HEAD), `page ${n} has no running head`)
}

// 5 · Notes close their chapter: chapter 1's notes come before chapter 2, chapter 2's after its last paragraph
const all = tool('pdftotext', pdfFile, '-')
const at = (s) => all.indexOf(s)
check(at('Finis uno') > -1 && at('escudo de cuero') > at('Finis uno') && at('escudo de cuero') < at('Capítulo segundo'), 'chapter 1 notes must follow its text and precede chapter 2')
check(at('Finis dos') > -1 && at('publicaron las Rimas') > at('Finis dos'), 'chapter 2 notes must follow its text')

// 6 · The poem stays on one page, whole
const verseVerses = ['Volverán las oscuras golondrinas', 'esas... no volverán', 'tu corazón de su profundo sueño']
const versePages = verseVerses.map(where)
check(versePages.every((n) => n > 0 && n === versePages[0]), `the poem must sit whole on one page, found on pages ${versePages.join(' / ')}`)

if (failures.length) {
  console.error(`✗ Book template: ${failures.length} problem(s)`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log(`✓ Book template: ${pages} A5 pages, chapters open on pages ${ch1} and ${ch2}, no blank pages, notes close each chapter`)
