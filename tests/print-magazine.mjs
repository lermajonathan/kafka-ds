// Magazine template test (DDR-KF-005). Renders templates/print/magazine.html, a sample anthology on A4 with a cover, a story and
// an essay in two columns and a poem, using only tokens.css and print.css.
//   node tests/print-magazine.mjs        (KAFKA_MAGAZINE_OUT=file.pdf keeps the PDF)
import fs from 'node:fs'
import path from 'node:path'
import { checkGeometry, checkReadingFont, MM_TO_PT, mm, pageMm, renderPdf, reporter, root } from './lib/pdf.mjs'

const r = reporter('Magazine template')
const { check } = r
const TEMPLATE = path.join(root, 'templates/print/magazine.html')
if (!fs.existsSync(TEMPLATE)) { console.error('✗ Magazine template: templates/print/magazine.html does not exist'); process.exit(1) }
const RUNNING_HEAD = 'Revista Kafka'
const COVER_TITLE = 'Antología de muestra'
const PIECES = ['La casa del faro y otros relatos', 'Sonatina', 'Del papel a la pantalla']

const pdf = await renderPdf(TEMPLATE, {
  keepEnv: 'KAFKA_MAGAZINE_OUT',
  inspect: () => {
    const cs = (q) => getComputedStyle(document.querySelector(q))
    return {
      external: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.getAttribute('href')),
      lang: document.documentElement.lang,
      pieces: document.querySelectorAll('.kafka-print__piece').length,
      columns: [...document.querySelectorAll('.kafka-print__piece-body')].map((e) => getComputedStyle(e).columnCount),
      headerSpan: cs('.kafka-print__piece-head').columnSpan,
      pullQuote: { span: cs('.kafka-pull-quote').columnSpan, breakInside: cs('.kafka-pull-quote').breakInside },
      dropCap: getComputedStyle(document.querySelector('.kafka-drop-cap'), '::first-letter').initialLetter,
    }
  },
})
const { dom, pages, pageText, where, hasFolio, all, wordsOf } = pdf

// 0 · Standalone, Spanish, three pieces, two columns for the prose pieces
check(dom.external.length === 3 && dom.external.every((h) => /(tokens|fonts|print)\.css$/.test(h)) && dom.external.some((h) => /fonts\.css$/.test(h)), `the template must link only tokens.css, fonts.css and print.css, got ${dom.external.join(', ')}`)
check(dom.lang === 'es', `the template must declare lang="es", got "${dom.lang}"`)
check(dom.pieces === 3, `the sample has three pieces, found ${dom.pieces}`)
check(dom.columns[0] === '2' && dom.columns[2] === '2', `the story and the essay run in two columns, got ${dom.columns.join(' / ')}`)
check(dom.columns[1] === 'auto', `the poem stays in one column, got ${dom.columns[1]}`)
check(dom.headerSpan === 'all', `a piece's title block must span both columns, got column-span: ${dom.headerSpan}`)
check(dom.pullQuote.span === 'all' || dom.pullQuote.breakInside === 'avoid', `the pull quote must span the columns or stay whole, got ${JSON.stringify(dom.pullQuote)}`)
check(dom.dropCap === '3', `the story opens with a three-line drop cap, got initial-letter: ${dom.dropCap}`)

// 1 · Geometry: A4, fonts embedded, inside the printable area, no blank pages
checkGeometry(r, pdf, pageMm('a4'))
checkReadingFont(check, pdf.fonts().map((f) => f.row))
check(pages >= 5 && pages <= 12, `the sample anthology should span 5–12 pages, got ${pages}`)
for (let n = 1; n <= pages; n++) check(pageText(n).replace(/\s+/g, '').length > 3, `page ${n} is blank`)

// 2 · Cover: no head, no folio
check(pageText(1).includes(COVER_TITLE), `page 1 should be the cover with "${COVER_TITLE}"`)
check(!pageText(1).includes(RUNNING_HEAD) && !hasFolio(1), 'the cover carries neither running head nor folio')

// 3 · Every piece opens a fresh page, with its title at the top
const starts = PIECES.map((t) => where(t))
check(starts.every((n, i) => n > 1 && (i === 0 || n > starts[i - 1])), `each piece must start on its own, later page, found on pages ${starts.join(' / ')}`)
for (const [i, title] of PIECES.entries()) {
  const first = title.split(' ')[0]
  const w = starts[i] && wordsOf(starts[i]).find((x) => x.t === first)
  check(w && w.y0 <= 60 * MM_TO_PT, `"${title}" should open at the top of its page, at ${w ? mm(w.y0).toFixed(1) : '?'} mm`)
}

// 4 · Body pages carry head and folio
for (let n = 2; n <= pages; n++) {
  check(hasFolio(n), `page ${n} has no folio`)
  check(pageText(n).includes(RUNNING_HEAD), `page ${n} has no running head`)
}

// 5 · Two columns, for real: on the story's first page, lines start at two different horizontal positions
const body = wordsOf(starts[0]).filter((w) => mm(w.y0) > 80 && mm(w.y1) < 270)
const leftCol = body.filter((w) => mm(w.x0) < 40).length
const rightCol = body.filter((w) => mm(w.x0) > 100 && mm(w.x0) < 125).length
check(leftCol >= 15 && rightCol >= 15, `the story should flow in two columns (words starting in the left column: ${leftCol}, in the right: ${rightCol})`)
const titleWords = wordsOf(starts[0]).filter((w) => mm(w.y0) < 60 && mm(w.y0) > 15)
check(titleWords.length > 0 && mm(Math.max(...titleWords.map((w) => w.x1)) - Math.min(...titleWords.map((w) => w.x0))) > 100, 'the story title should be wider than one column')

// 6 · The poem sits whole on one page; the pull quote appears once; the essay's notes close it
const versePages = ['La princesa está triste', 'que ha perdido la risa', 'se desmaya una flor'].map(where)
check(versePages.every((n) => n > 0 && n === versePages[0]), `the poem must sit whole on one page, found on pages ${versePages.join(' / ')}`)
check(where('esas... no volverán') === 0 && where('Poesía... eres tú') > 0, 'the pull quote (Rima XXI) must be in the essay')
check((all.match(/Poesía\.\.\. eres tú/g) ?? []).length === 1, 'the pull quote must appear exactly once')
check(all.indexOf('Finis') > -1 && all.indexOf('Fuente de la nota') > all.indexOf('Finis'), "the essay's notes must follow its text")

r.finish(`${pages} A4 pages, pieces open on pages ${starts.join(', ')}, two columns, no blank pages`)
