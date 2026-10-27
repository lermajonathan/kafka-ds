/**
 * Turns docs/*.md into the data the documentation site renders: component pages and fixed pages as HTML,
 * with every relative link rewritten to a site route (#/components/chip) or, for repo files, to GitHub.
 * No file is written here; scripts/site/build-data.mjs does that. tests/site-data.mjs keeps it honest.
 */
import fs from 'node:fs'
import path from 'node:path'
import { Marked } from 'marked'

const REPO = 'https://github.com/lermajonathan/kafka-ds'
const FIXED = { 'docs/getting-started.md': 'getting-started', 'docs/tokens.md': 'tokens' }

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")

/** Where a link written in `fromFile` (repo-relative) should go. */
export function resolveLink(href, fromFile) {
  if (/^(https?:|mailto:|#)/.test(href)) return href
  const [target] = href.split('#')
  const repoPath = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), target))
  let m
  if (FIXED[repoPath]) return '#/' + FIXED[repoPath]
  if (repoPath === 'docs/components/README.md') return '#/components'
  if ((m = repoPath.match(/^docs\/components\/([a-z0-9-]+)\.md$/))) return '#/components/' + m[1]
  const isFile = /\.[a-z0-9]+$/i.test(repoPath)
  return `${REPO}/${isFile ? 'blob' : 'tree'}/main/${repoPath.replace(/\/$/, '')}`
}

/** The design decisions (DDR-KF-*) and the roadmap live in the repository, not on the public site: links to them and mentions of them are dropped. */
const PRIVATE_LINK = /\]\([^)]*(?:decisions\/|roadmap\.md)[^)]*\)/
export function scrubPrivate(text) {
  return text
    .split('\n').filter((l) => !(/^\s*[-*]\s/.test(l) && PRIVATE_LINK.test(l))).join('\n') // a list item that only points there goes away
    .replace(/\[([^\]]*)\]\([^)]*(?:decisions\/|roadmap\.md)[^)]*\)/g, '$1')
    .replace(/;\s*see DDR-KF-\d+\./g, '.')
    .replace(/\s*\(DDR-KF-\d+\)/g, '')
    .replace(/\s*DDR-KF-\d+/g, '')
}

function markdown(file) {
  const marked = new Marked({ gfm: true })
  marked.use({
    renderer: {
      html: ({ text }) => escapeHtml(text), // documentation never carries raw html
      link({ href, title, tokens }) {
        const to = resolveLink(href, file)
        const external = /^https?:/.test(to)
        return `<a href="${escapeHtml(to)}"${title ? ` title="${escapeHtml(title)}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${this.parser.parseInline(tokens)}</a>`
      },
    },
  })
  return marked
}

/** Renders markdown and drops the generator comment. Tables and code scroll with the keyboard, and each table is a region named after the heading above it. */
function render(file, text) {
  const body = scrubPrivate(text.replace(/^<!--[\s\S]*?-->\s*/, ''))
  const html = markdown(file).parse(body).replace(/<pre>/g, '<pre tabindex="0">')
  let heading = ''
  const seen = new Map()
  return html.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>|<table>/g, (m, h) => {
    if (h !== undefined) { heading = stripTags(h).trim(); return m }
    const n = (seen.get(heading) ?? 0) + 1
    seen.set(heading, n)
    const label = `Tabla: ${heading}${n > 1 ? ` (${n})` : ''}`
    return `<div class="table-wrap" role="region" aria-label="${escapeHtml(label)}" tabindex="0"><table>`
  }).replace(/<\/table>/g, '</table></div>')
}

/** In a component page's "Examples" section, marks where each live example goes: just before the code that prints it. */
export function addLiveMarkers(html) {
  const start = html.indexOf('<h2>Examples</h2>')
  if (start < 0) return html
  const end = html.indexOf('<h2>', start + 5)
  const section = html.slice(start, end < 0 ? html.length : end)
  let n = 0
  const marked = section.replace(/(<h3>[\s\S]*?)(<pre\b)/g, (_, before, pre) => `${before}<!--live:${n++}-->${pre}`)
  return html.slice(0, start) + marked + (end < 0 ? '' : html.slice(end))
}

const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8')
const h1 = (html) => stripTags((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? [])[1] ?? '').trim()
const firstParagraph = (html) => stripTags((html.match(/<\/h1>\s*<p>([\s\S]*?)<\/p>/) ?? [])[1] ?? '').trim()

export function buildSiteData({ root }) {
  const pkg = JSON.parse(read(root, 'package.json'))

  const componentFiles = fs.readdirSync(path.join(root, 'docs/components')).filter((f) => f.endsWith('.md') && f !== 'README.md').sort()
  const components = componentFiles.map((f) => {
    const file = `docs/components/${f}`
    const html = addLiveMarkers(render(file, read(root, file)))
    const id = f.slice(0, -3)
    return { id, path: 'components/' + id, name: h1(html), summary: firstParagraph(html), html }
  })

  // Families come from the index: "## Actions" followed by a table of [`Name`](id.md) rows.
  const families = []
  for (const block of read(root, 'docs/components/README.md').split(/^## /m).slice(1)) {
    const name = block.split('\n')[0].trim()
    const ids = [...block.matchAll(/\]\(([a-z0-9-]+)\.md\)/g)].map((m) => m[1])
    if (ids.length) families.push({ name, ids })
  }

  const pages = Object.entries(FIXED).map(([file, route]) => {
    const html = render(file, read(root, file))
    return { path: route, title: h1(html), html }
  })

  const tokensDoc = read(root, 'docs/tokens.md')
  const tokens = Number((tokensDoc.match(/(\d[\d.,]*)\s+tokens/) ?? [])[1]?.replace(/[.,]/g, '') ?? 0)

  return { version: pkg.version, counts: { components: components.length, tokens }, components, families, pages, repo: REPO }
}
