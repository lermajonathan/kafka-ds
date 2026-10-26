// Sheet template test (DDR-KF-005). Renders templates/print/sheet.html, the one-page program of a workshop on A4,
// using only tokens.css and print.css, and checks that it is exactly one page and laid out as a printer would expect.
//   node tests/print-sheet.mjs           (KAFKA_SHEET_OUT=file.pdf keeps the PDF)
import fs from 'node:fs'
import path from 'node:path'
import { checkGeometry, linesOf, mm, pageMm, renderPdf, reporter, root } from './lib/pdf.mjs'

const r = reporter('Sheet template')
const { check } = r
const TEMPLATE = path.join(root, 'templates/print/sheet.html')
if (!fs.existsSync(TEMPLATE)) { console.error('✗ Sheet template: templates/print/sheet.html does not exist'); process.exit(1) }
const SESSIONS = 6

const pdf = await renderPdf(TEMPLATE, {
  keepEnv: 'KAFKA_SHEET_OUT',
  inspect: () => ({
    external: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.getAttribute('href')),
    lang: document.documentElement.lang,
    rows: document.querySelectorAll('.kafka-print__schedule tbody tr').length,
  }),
})
const { dom, pages, pageText, wordsOf, all } = pdf

check(dom.external.length === 2 && dom.external.every((h) => /(tokens|print)\.css$/.test(h)), `the template must link only tokens.css and print.css, got ${dom.external.join(', ')}`)
check(dom.lang === 'es', `the template must declare lang="es", got "${dom.lang}"`)
check(dom.rows === SESSIONS, `the schedule has ${SESSIONS} sessions, found ${dom.rows}`)

// A sheet is exactly one A4 page, with no running head or folio
checkGeometry(r, pdf, pageMm('a4'))
check(pages === 1, `a sheet must fit on one page, got ${pages}`)
check(!/^\s*1\s*$/m.test(pageText(1)), 'a one-page sheet carries no folio')

// Layout: title at the top, schedule in order and aligned, footer anchored to the bottom margin
const words = wordsOf(1)
const title = words.find((w) => w.t === 'Taller')
check(title && mm(title.y0) <= 45, `the title should open the page, at ${title ? mm(title.y0).toFixed(1) : '?'} mm`)
const lines = linesOf(words)
const sessionLines = Array.from({ length: SESSIONS }, (_, i) => lines.find((l) => l.words[0].t === 'Sesión' && l.words[1]?.t === String(i + 1)))
check(sessionLines.every(Boolean), 'every session must be a line of its own, starting "Sesión n"')
if (sessionLines.every(Boolean)) {
  check(sessionLines.every((l, i) => i === 0 || l.y1 > sessionLines[i - 1].y1), 'the sessions must be listed in order')
  const dateX = sessionLines.map((l) => l.words[2].x0)
  check(Math.max(...dateX) - Math.min(...dateX) < 1, `the date column must align (x varies by ${(Math.max(...dateX) - Math.min(...dateX)).toFixed(1)} pt)`)
  const gaps = sessionLines.slice(1).map((l, i) => +(l.y1 - sessionLines[i].y1).toFixed(1))
  check(Math.max(...gaps) - Math.min(...gaps) < 1, `session rows must be evenly spaced, got ${gaps.join(' / ')} pt`)
}
const footer = words.find((w) => w.t === 'Información')
check(footer && mm(footer.y1) >= 255, `the contact block should sit at the foot of the page, at ${footer ? mm(footer.y1).toFixed(1) : '?'} mm`)
check(all.includes('Qué incluye') && all.includes('Inversión'), 'the sheet lists what is included and the price line')

r.finish(`one A4 page, ${SESSIONS} sessions aligned, contact block at the foot`)
