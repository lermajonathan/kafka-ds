// WCAG 2.2 contrast check for every token pair Kafka promises, light and dark.
//   READING (7:1, AAA) for long-form text · TEXT (4.5:1) for UI text · UI (3:1) for non-text (1.4.11)
// Both modes are blocking. Pure Node: reads tokens/*.json, resolves aliases per mode.
import fs from 'node:fs'

const read = (f) => JSON.parse(fs.readFileSync(new URL(`../tokens/${f}.json`, import.meta.url), 'utf8'))
const tokens = new Map()
const walk = (node, path) => {
  if (node && typeof node === 'object' && '$value' in node) {
    tokens.set(path.join('.'), { value: node.$value, dark: node.$extensions?.['kafka.modes']?.dark })
    return
  }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...path, k])
}
for (const tier of ['primitives', 'semantic', 'components']) walk(read(tier), [])

const resolve = (path, mode, depth = 0) => {
  const t = tokens.get(path)
  if (!t) throw new Error(`Unknown token ${path}`)
  if (depth > 20) throw new Error(`Alias loop at ${path}`)
  const raw = mode === 'dark' && t.dark !== undefined ? t.dark : t.value
  const m = typeof raw === 'string' && raw.match(/^\{([^}]+)\}$/)
  return m ? resolve(m[1], mode, depth + 1) : raw
}
const parse = (c) => {
  const h = String(c).trim().replace('#', '')
  const f = h.length === 3 ? [...h].map((x) => x + x).join('') : h
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16))
}
const lum = ([r, g, b]) => {
  const ch = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)
}
export const ratio = (fgPath, bgPath, mode) => {
  const [a, b] = [lum(parse(resolve(fgPath, mode))), lum(parse(resolve(bgPath, mode)))].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}

const READING = 7, TEXT = 4.5, UI = 3
const pairs = []
for (const bg of ['page', 'surface']) {
  pairs.push(['color.reading.text', `color.bg.${bg}`, READING, `reading text on bg.${bg}`])
  pairs.push(['color.reading.text-secondary', `color.bg.${bg}`, READING, `secondary reading text on bg.${bg}`])
}
pairs.push(['color.reading.text', 'color.reading.bg', READING, 'reading text on reading bg'])
for (const bg of ['page', 'surface', 'sunken']) {
  for (const fg of ['default', 'soft', 'muted']) pairs.push([`color.fg.${fg}`, `color.bg.${bg}`, TEXT, `fg.${fg} on bg.${bg}`])
  pairs.push([`color.fg.brand`, `color.bg.${bg}`, TEXT, `brand text on bg.${bg}`], [`color.fg.link`, `color.bg.${bg}`, TEXT, `link on bg.${bg}`])
}
pairs.push(
  ['color.fg.inverse', 'color.bg.inverse', TEXT, 'inverse text on inverse bg'],
  ['color.border.focus', 'color.bg.page', UI, 'focus ring on page'],
  ['color.border.focus', 'color.bg.surface', UI, 'focus ring on surface'],
  ['article.text', 'article.bg', READING, 'article text on article bg'],
  // Oro como superficie y bordes de marca
  ['color.fg.on-brand', 'color.bg.brand', TEXT, 'text on gold surface'],
  ['color.border.brand', 'color.bg.page', UI, 'brand border on page'],
  ['color.border.brand', 'color.bg.surface', UI, 'brand border on surface'],
  ['color.border.strong', 'color.bg.page', UI, 'strong border on page'],
  ['color.border.strong', 'color.bg.surface', UI, 'strong border on surface'],
  // Componentes
  ['button.primary.fg', 'button.primary.bg', TEXT, 'primary button label'],
  ['button.primary.fg', 'button.primary.bg-hover', TEXT, 'primary button label (hover)'],
  ['button.soft.fg', 'button.soft.bg', TEXT, 'soft button label'],
  ['button.outline.border', 'color.bg.surface', UI, 'outline button border'],
  ['badge.neutral.fg', 'badge.neutral.bg', TEXT, 'neutral badge'],
  ['badge.brand.fg', 'badge.brand.bg', TEXT, 'brand badge'],
  ['chip.fg', 'chip.bg', TEXT, 'chip label'],
  ['chip.selected-fg', 'chip.selected-bg', TEXT, 'selected chip label'],
  ['news.kind-fg', 'news.kind-bg', TEXT, 'news kind tile'],
  ['news.border', 'news.bg', UI, 'news border'],
  // VIP: texto fijo sobre los tres puntos del degradado y la insignia
  ['vip.fg', 'color.gold.100', TEXT, 'VIP text on gradient start'],
  ['vip.fg', 'color.gold.300', TEXT, 'VIP text on gradient middle'],
  ['vip.fg', 'color.gold.500', TEXT, 'VIP text on gradient end'],
  ['vip.badge-fg', 'vip.badge-bg', TEXT, 'VIP badge'],
  // The brand gold itself is only a text colour on ink, never on paper
  ['color.gold.400', 'color.ink.900', READING, 'brand gold on ink (dark surfaces)'],
)

if (import.meta.url === `file://${process.argv[1]}`) {
  let failures = 0
  for (const mode of ['light', 'dark']) {
    // the brand-gold-on-ink pair is mode-independent; run it once
    const list = pairs.filter(([f]) => mode === 'light' || f !== 'color.gold.400')
    const fails = list.filter(([f, b, min]) => ratio(f, b, mode) + 1e-9 < min)
    failures += fails.length
    console.log(`\n${mode.toUpperCase()} · ${list.length - fails.length}/${list.length} pairs pass`)
    for (const [f, b, min, what] of fails) console.log(`  ✗ ${ratio(f, b, mode).toFixed(2)}:1 < ${min}:1  ${what}`)
  }
  process.exit(failures ? 1 : 0)
}
