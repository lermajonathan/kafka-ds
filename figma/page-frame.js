// The editorial frame of every documentation page (the one Getting started was built with): a running head on top,
// a gold rule under the title and a colophon at the foot. Skips Cover (its own composition) and Getting started (framed by construction).
// Idempotent: it removes what it added before. DATA = { pages: [page names], version, components, tokens }
const SKIP = new Set(['Cover', 'Getting started'])
const cols = await figma.variables.getLocalVariableCollectionsAsync()
const sem = cols.find((c) => c.name === 'Semantic')
const vars = (await figma.variables.getLocalVariablesAsync()).filter((v) => v.variableCollectionId === sem.id)
const paint = (n) => { const v = vars.find((x) => x.name === n); if (!v) throw new Error('missing variable ' + n); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v) }
const styles = await figma.getLocalTextStylesAsync()
const S = (name) => styles.find((x) => x.name === name)
for (const n of ['UI/Overline', 'UI/Label']) await figma.loadFontAsync(S(n).fontName)
const T = (txt, st, fill) => { const t = figma.createText(); t.textStyleId = S(st).id; t.characters = txt; t.fills = [paint(fill)]; return t }
const AL = (dir, o = {}) => { const f = figma.createAutoLayout(dir); f.name = o.name; f.fills = o.fill ? [paint(o.fill)] : []; f.itemSpacing = o.gap || 0; if (o.justify) f.primaryAxisAlignItems = o.justify; if (o.align) f.counterAxisAlignItems = o.align; return f }
const thousands = String(DATA.tokens).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const done = [], skipped = []
for (const name of DATA.pages) {
  if (SKIP.has(name)) { skipped.push(name + ' (skipped)'); continue }
  const page = figma.root.children.find((p) => p.name === name)
  if (!page) { skipped.push(name + ' (no page)'); continue }
  await page.loadAsync()
  const root = page.children.find((c) => c.type === 'FRAME' && /^(Kafka|Pattern) · /.test(c.name))
  const header = root && root.children.find((c) => c.name === 'Header')
  const title = header && header.children[1]
  if (!root || !header || !title || title.type !== 'TEXT') { skipped.push(name + ' (no header)'); continue }
  for (const old of root.findAll((n) => ['Running head', 'Gold rule', 'Colophon'].includes(n.name))) old.remove()

  const head = AL('HORIZONTAL', { name: 'Running head', justify: 'SPACE_BETWEEN', align: 'CENTER' })
  root.insertChild(0, head); head.layoutSizingHorizontal = 'FILL'
  head.appendChild(T('KAFKA · ' + title.characters.toUpperCase(), 'UI/Overline', 'color/fg/soft'))
  head.appendChild(T('Folio ' + DATA.version, 'UI/Label', 'color/fg/muted'))

  const gold = AL('HORIZONTAL', { name: 'Gold rule', fill: 'color/bg/brand' })
  header.insertChild(header.children.indexOf(title) + 1, gold); gold.layoutSizingHorizontal = 'FIXED'; gold.layoutSizingVertical = 'FIXED'; gold.resize(96, 4)

  const foot = AL('VERTICAL', { name: 'Colophon', gap: 24 })
  root.appendChild(foot); foot.layoutSizingHorizontal = 'FILL'
  const rule = AL('HORIZONTAL', { name: 'Rule', fill: 'color/border/default' })
  foot.appendChild(rule); rule.layoutSizingHorizontal = 'FILL'; rule.layoutSizingVertical = 'FIXED'; rule.resize(rule.width, 1)
  const row = AL('HORIZONTAL', { name: 'Data', justify: 'SPACE_BETWEEN' })
  foot.appendChild(row); row.layoutSizingHorizontal = 'FILL'
  row.appendChild(T('Kafka · Papel, tinta y oro', 'UI/Label', 'color/fg/muted'))
  row.appendChild(T(DATA.components + ' componentes · ' + thousands + ' tokens', 'UI/Label', 'color/fg/muted'))
  done.push(name)
}
return { done: done.length, skipped }
