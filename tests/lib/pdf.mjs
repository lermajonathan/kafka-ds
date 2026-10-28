// Shared helpers for the print output tests: render an HTML file to PDF with Playwright and read the PDF with poppler.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

export const root = path.resolve(import.meta.dirname, '../..')
export const MM_TO_PT = 72 / 25.4
export const mm = (pt) => pt / MM_TO_PT
const tool = (cmd, ...args) => execFileSync(cmd, args, { encoding: 'utf8' })

/** Millimetres of a physical page token, e.g. pageMm('a5') → { w: 148, h: 210 }. */
export const pageMm = (name) => {
  const p = JSON.parse(fs.readFileSync(path.join(root, 'tokens/primitives.json'), 'utf8')).physical.page[name]
  return { w: parseFloat(p.width.$value), h: parseFloat(p.height.$value) }
}

/** Collects failures instead of stopping at the first one; `finish` prints the verdict and sets the exit code. */
export const reporter = (title) => {
  const failures = []
  return {
    check: (ok, message) => { if (!ok) failures.push(message) },
    finish: (okLine) => {
      if (failures.length) {
        console.error(`✗ ${title}: ${failures.length} problem(s)`)
        for (const f of failures) console.error(`  - ${f}`)
        process.exit(1)
      }
      console.log(`✓ ${title}: ${okLine}`)
    },
  }
}

/**
 * Opens `file` in print media, runs `inspect` in the page, writes the PDF and returns the PDF reader.
 * `keepEnv` names an environment variable that, when set, receives a copy of the PDF.
 */
export async function renderPdf(file, { inspect = () => ({}), keepEnv } = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kafka-pdf-'))
  process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }))
  const pdfFile = path.join(tmp, 'out.pdf')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(pathToFileURL(file).href)
  await page.evaluate(() => document.fonts.ready)
  await page.emulateMedia({ media: 'print' })
  const dom = await page.evaluate(inspect)
  await page.pdf({ path: pdfFile, preferCSSPageSize: true, printBackground: true })
  await browser.close()
  if (keepEnv && process.env[keepEnv]) fs.copyFileSync(pdfFile, process.env[keepEnv])
  return { dom, ...readPdf(pdfFile) }
}

export function readPdf(pdfFile) {
  const info = tool('pdfinfo', '-f', '1', '-l', '999', pdfFile)
  const pages = Number(/^Pages:\s+(\d+)/m.exec(info)?.[1])
  const sizes = [...info.matchAll(/^Page\s+(\d+)\s+size:\s+([\d.]+) x ([\d.]+) pts/gm)].map((m) => ({ n: +m[1], w: +m[2], h: +m[3] }))
  const bbox = tool('pdftotext', '-bbox', pdfFile, '-').split('<page ').slice(1)
  const wordsOf = (n) => [...bbox[n - 1].matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</g)]
    .map((m) => ({ x0: +m[1], y0: +m[2], x1: +m[3], y1: +m[4], t: m[5] }))
  const textCache = new Map()
  const pageText = (n) => { if (!textCache.has(n)) textCache.set(n, tool('pdftotext', '-f', String(n), '-l', String(n), pdfFile, '-')); return textCache.get(n) }
  return {
    pdfFile, pages, sizes, wordsOf, pageText,
    all: tool('pdftotext', pdfFile, '-'),
    pageSize: (n) => { const w = bbox[n - 1].match(/width="([\d.]+)" height="([\d.]+)"/); return { w: +w[1], h: +w[2] } },
    fonts: () => tool('pdffonts', pdfFile).split('\n').slice(2).filter((l) => l.trim()).map((row) => ({ row: row.trim(), embedded: row.trim().split(/\s+/).at(-5) === 'yes' })),
    where: (needle) => { for (let n = 1; n <= pages; n++) if (pageText(n).includes(needle)) return n; return 0 },
    hasFolio: (n) => new RegExp(`^\\s*${n}\\s*$`, 'm').test(pageText(n)),
  }
}

/** Shared checks: every page has the expected size, fonts are embedded, nothing sits within `edgeMm` of the trim edge. */
export function checkGeometry({ check }, pdf, expectedMm, edgeMm = 5) {
  const want = { w: expectedMm.w * MM_TO_PT, h: expectedMm.h * MM_TO_PT }
  check(pdf.sizes.length === pdf.pages && pdf.pages > 0, `pdfinfo reported ${pdf.sizes.length} page sizes for ${pdf.pages} pages`)
  for (const s of pdf.sizes) check(Math.abs(s.w - want.w) <= 1 && Math.abs(s.h - want.h) <= 1, `page ${s.n} is ${s.w} × ${s.h} pt, expected ${expectedMm.w} × ${expectedMm.h} mm`)
  const fonts = pdf.fonts()
  check(fonts.length > 0, 'the PDF lists no fonts')
  for (const f of fonts) check(f.embedded, `font not embedded: ${f.row}`)
  const edge = edgeMm * MM_TO_PT
  for (let n = 1; n <= pdf.pages; n++) {
    const { w, h } = pdf.pageSize(n)
    const bad = pdf.wordsOf(n).find((x) => x.x0 < edge || x.y0 < edge || x.x1 > w - edge || x.y1 > h - edge)
    if (bad) check(false, `page ${n}: "${bad.t}" is outside the printable area (${edgeMm} mm from the edge)`)
  }
}

/**
 * Reading text is set in Literata, embedded in the PDF (DDR-KF-001). A serif fallback in the file means the font was not
 * available to the printer's browser: the document would look different on every machine.
 * `rows` are the lines of `pdffonts`.
 */
export const checkReadingFont = (check, rows) => {
  check(rows.some((r) => /Literata/i.test(r)), 'the PDF must embed Literata: the reading text needs the self-hosted font, not a fallback')
  const fallback = rows.filter((r) => /LiberationSerif|DejaVuSerif|Georgia|Times|FreeSerif|NimbusRoman/i.test(r))
  // Only serif replacements count: the UI text uses the system font (system-ui), which is Inter on one machine and DejaVu Sans on a CI runner.
  check(fallback.length === 0, `a serif fallback replaced Literata: ${fallback.map((r) => r.split(/\s+/)[0]).join(', ')}`)
}

/** Groups the words of a page into lines by their bottom edge. */
export const linesOf = (words) => {
  const out = []
  for (const w of [...words].sort((a, b) => a.y1 - b.y1 || a.x0 - b.x0)) {
    const last = out[out.length - 1]
    if (last && Math.abs(last.y1 - w.y1) < 2.5) last.words.push(w); else out.push({ y1: w.y1, words: [w] })
  }
  return out.map((l) => ({ ...l, x0: Math.min(...l.words.map((w) => w.x0)), text: l.words.map((w) => w.t).join(' ') }))
}

// Every character a print template shows must be one Literata ships (its @font-face unicode-range). A character outside it
// is drawn by whatever font the machine has — DejaVu on a CI runner, something else on a Mac — so the PDF changes with the machine.
export function checkTemplateGlyphs(check, htmlFiles) {
  const css = fs.readFileSync(path.join(root, 'src/styles/fonts.css'), 'utf8')
  const ranges = [...css.matchAll(/unicode-range:\s*([^;]+);/g)].flatMap((m) => [...m[1].matchAll(/U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?/g)].map((r) => [parseInt(r[1], 16), parseInt(r[2] ?? r[1], 16)]))
  const covered = (cp) => ranges.some(([a, b]) => cp >= a && cp <= b)
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '') // visible text only
    const missing = [...new Set([...html].filter((c) => c.codePointAt(0) > 0x7f && !covered(c.codePointAt(0))))]
    check(missing.length === 0, `${path.relative(root, file)} shows characters Literata does not ship: ${missing.map((c) => `${c} (U+${c.codePointAt(0).toString(16).toUpperCase()})`).join(', ')}`)
  }
}
