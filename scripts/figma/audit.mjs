// QA audit of the Kafka Figma file. Read-only.
//   node scripts/figma/audit.mjs        prints the use_figma body that measures the file
//   judge(result)                       turns the measured numbers into { ok, failures }
import { pathToFileURL } from 'node:url'

const GLYPHS = '✓✎▦✔✕' // '×' alone also counts, but not inside "44 × 44"

export function auditCall() {
  return `const GLYPHS = ${JSON.stringify(GLYPHS)}
const SKIP = /^(Archive|Legacy)/
const names = figma.root.children.map((p) => p.name)
const out = { pages: names.length, dupPages: names.filter((n, i) => names.indexOf(n) !== i), empty: 0, unboundFills: 0, glyphs: 0, collapsed: 0, unstyled: 0, docPages: 0, patternPages: 0, pagesWithoutMaster: [], pagesWithoutSections: [] }
const SECTIONS = ['§01', '§02', '§04', '§05', '§06', '§07']
for (const p of figma.root.children) {
  await p.loadAsync()
  out.empty += p.findAll((n) => n.type === 'FRAME' && n.name === 'Frame' && n.children.length === 0 && Math.round(n.width) === 100 && Math.round(n.height) === 100).length
  if (SKIP.test(p.name)) continue
  for (const root of p.children.filter((c) => c.type === 'FRAME' && /^(Kafka|Pattern) · /.test(c.name))) {
    const pattern = root.name.startsWith('Pattern')
    const component = !pattern && root.children.some((c) => c.name.startsWith('§01'))
    if (pattern) out.patternPages++
    if (component) {
      out.docPages++
      if (!p.findAll((n) => n.type === 'COMPONENT' || n.type === 'COMPONENT_SET').length) out.pagesWithoutMaster.push(p.name)
      if (SECTIONS.some((s) => !root.children.some((c) => c.name.startsWith(s)))) out.pagesWithoutSections.push(p.name)
    }
    const texts = root.findAll((n) => n.type === 'TEXT')
    out.collapsed += texts.filter((t) => t.height < 8 || t.width < 6).length
    out.glyphs += texts.filter((t) => [...t.characters].some((ch) => GLYPHS.includes(ch)) || t.characters.trim() === '×').length
    out.unstyled += texts.filter((t) => !t.textStyleId && t.fontName !== figma.mixed && t.fontName.family !== 'Roboto Mono').length
    out.unboundFills += root.findAll((n) => 'fills' in n && n.fills !== figma.mixed && n.fills.length && n.fills[0].type === 'SOLID' && n.visible && !n.fills[0].boundVariables?.color).length
  }
}
const prim = (await figma.variables.getLocalVariablesAsync()).find((v) => v.name === 'opacity/45')
if (prim) { const col = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.id === prim.variableCollectionId); out.disabledOpacity = prim.valuesByMode[col.defaultModeId] }
return out`
}

export function judge(r) {
  const failures = []
  if (r.empty) failures.push(`${r.empty} empty 100×100 frame(s)`)
  if (r.dupPages?.length) failures.push('duplicate pages: ' + r.dupPages.join(', '))
  if (r.glyphs) failures.push(`${r.glyphs} text glyph(s) where an icon belongs`)
  if (r.unboundFills) failures.push(`${r.unboundFills} unbound fill(s) (colour not tied to a variable)`)
  if (r.collapsed) failures.push(`${r.collapsed} collapsed text(s)`)
  if (r.unstyled) failures.push(`${r.unstyled} text(s) without a text style`)
  if (r.pagesWithoutMaster?.length) failures.push('no master on: ' + r.pagesWithoutMaster.join(', '))
  if (r.pagesWithoutSections?.length) failures.push('no sections on: ' + r.pagesWithoutSections.join(', '))
  if (r.disabledOpacity !== undefined && r.disabledOpacity !== 45) failures.push(`opacity/45 is ${r.disabledOpacity}; Figma binds opacity as a percentage`)
  return { ok: failures.length === 0, failures }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) console.log(auditCall())
