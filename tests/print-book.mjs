// Book template test (DDR-KF-005). Renders templates/print/book.html, a complete sample book with title page, colophon,
// two chapters, a poem and notes, using only tokens.css and print.css (no Tailwind), and checks the result as a printer would.
//   node tests/print-book.mjs            (KAFKA_BOOK_OUT=file.pdf keeps the PDF)
import fs from 'node:fs'
import path from 'node:path'
import { checkGeometry, MM_TO_PT, pageMm, renderPdf, reporter, root } from './lib/pdf.mjs'

const r = reporter('Book template')
const { check } = r
const TEMPLATE = path.join(root, 'templates/print/book.html')
if (!fs.existsSync(TEMPLATE)) { console.error('✗ Book template: templates/print/book.html does not exist'); process.exit(1) }
const RUNNING_HEAD = 'Plantilla de libro'
const BOOK_TITLE = 'Un libro de muestra'

const pdf = await renderPdf(TEMPLATE, {
  keepEnv: 'KAFKA_BOOK_OUT',
  inspect: () => ({
    external: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.getAttribute('href')),
    dropCap: getComputedStyle(document.querySelector('.kafka-drop-cap'), '::first-letter').initialLetter,
    chapters: document.querySelectorAll('.kafka-print__chapter').length,
    lang: document.documentElement.lang,
  }),
})
const { dom, pages, pageText, where, hasFolio, all, wordsOf } = pdf

// 0 · The template is standalone: it needs only the token and print stylesheets, and declares its language
check(dom.external.length === 2 && dom.external.every((h) => /(tokens|print)\.css$/.test(h)), `the template must link only tokens.css and print.css, got ${dom.external.join(', ')}`)
check(dom.lang === 'es', `the template must declare lang="es" (hyphenation depends on it), got "${dom.lang}"`)
check(dom.chapters === 2, `the sample has two chapters, found ${dom.chapters}`)
check(dom.dropCap === '3', `the first chapter opens with a three-line drop cap, got initial-letter: ${dom.dropCap}`)

// 1 · Geometry: every page is A5, fonts embedded, nothing outside the printable area
checkGeometry(r, pdf, pageMm('a5'))
check(pages >= 6 && pages <= 14, `the sample book should span 6–14 pages, got ${pages}`)

// 2 · No blank pages: a forced recto break may not leave an empty verso in the sample
for (let n = 1; n <= pages; n++) check(pageText(n).replace(/\s+/g, '').length > 3, `page ${n} is blank`)

// 3 · Front matter: title page and colophon carry neither running head nor folio
check(pageText(1).includes(BOOK_TITLE), `page 1 should be the title page with "${BOOK_TITLE}"`)
check(pageText(2).includes('Cervantes') && pageText(2).includes('Bécquer'), 'page 2 should be the colophon, crediting the public-domain fragments')
for (const n of [1, 2]) {
  check(!pageText(n).includes(RUNNING_HEAD), `front matter page ${n} must not carry the running head`)
  check(!hasFolio(n), `front matter page ${n} must not carry a folio`)
}

// 4 · Chapters open on a recto (odd page), with space above the title; the body pages carry head and folio
const ch1 = where('Capítulo primero'), ch2 = where('Capítulo segundo')
check(ch1 > 2 && ch1 % 2 === 1, `chapter 1 must open on a recto page after the colophon, opened on page ${ch1}`)
check(ch2 > ch1 && ch2 % 2 === 1, `chapter 2 must open on a recto page, opened on page ${ch2}`)
for (const [n, label] of [[ch1, 'Capítulo primero'], [ch2, 'Capítulo segundo']]) {
  const w = n && wordsOf(n).find((x) => x.t === label.split(' ')[0])
  check(w && w.y0 >= 50 * MM_TO_PT, `"${label}" should sit at least 50 mm from the top (opener space), at ${w ? (w.y0 / MM_TO_PT).toFixed(1) : '?'} mm`)
}
for (let n = 3; n <= pages; n++) {
  check(hasFolio(n), `page ${n} has no folio`)
  check(pageText(n).includes(RUNNING_HEAD), `page ${n} has no running head`)
}

// 5 · Notes close their chapter: chapter 1's notes come before chapter 2, chapter 2's after its last paragraph
const at = (s) => all.indexOf(s)
check(at('Finis uno') > -1 && at('escudo de cuero') > at('Finis uno') && at('escudo de cuero') < at('Capítulo segundo'), 'chapter 1 notes must follow its text and precede chapter 2')
check(at('Finis dos') > -1 && at('publicaron las Rimas') > at('Finis dos'), 'chapter 2 notes must follow its text')

// 6 · The poem stays on one page, whole
const versePages = ['Volverán las oscuras golondrinas', 'esas... no volverán', 'tu corazón de su profundo sueño'].map(where)
check(versePages.every((n) => n > 0 && n === versePages[0]), `the poem must sit whole on one page, found on pages ${versePages.join(' / ')}`)

r.finish(`${pages} A5 pages, chapters open on pages ${ch1} and ${ch2}, no blank pages, notes close each chapter`)
