// Cover · direction A "Pliego": a book's title page. Paper, a very large Literata title, a gold rule, a public-domain verse and a colophon.
const cols = await figma.variables.getLocalVariableCollectionsAsync()
const sem = cols.find((c) => c.name === 'Semantic')
const vars = (await figma.variables.getLocalVariablesAsync()).filter((v) => v.variableCollectionId === sem.id)
const paint = (n) => { const v = vars.find((x) => x.name === n); if (!v) throw new Error('missing variable ' + n); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v) }
const styles = await figma.getLocalTextStylesAsync()
async function style(name, def) {
  let s = styles.find((x) => x.name === name)
  if (!s && def) { await figma.loadFontAsync(def.font); s = figma.createTextStyle(); s.name = name; s.fontName = def.font; s.fontSize = def.size; if (def.ls !== undefined) s.letterSpacing = { unit: 'PERCENT', value: def.ls }; if (def.lh) s.lineHeight = { unit: 'PERCENT', value: def.lh }; styles.push(s) }
  if (!s) throw new Error('missing text style ' + name)
  await figma.loadFontAsync(s.fontName); return s
}
const T = async (txt, st, fill, o = {}) => { const t = figma.createText(); t.textStyleId = (await style(st)).id; t.characters = txt; t.fills = [paint(fill)]; if (o.w) { t.textAutoResize = 'HEIGHT'; t.resize(o.w, t.height) } return t }
const AL = (dir, o = {}) => { const f = figma.createAutoLayout(dir); f.name = o.name || 'Frame'; f.fills = o.fill ? [paint(o.fill)] : []; f.itemSpacing = o.gap || 0; if (o.px !== undefined) f.paddingLeft = f.paddingRight = o.px; if (o.py !== undefined) f.paddingTop = f.paddingBottom = o.py; if (o.align) f.counterAxisAlignItems = o.align; if (o.justify) f.primaryAxisAlignItems = o.justify; return f }

await style('Doc/Cover Title', { font: { family: 'Literata', style: 'Bold' }, size: 236, ls: -1.5, lh: 90 })
await style('Doc/Cover Lead', { font: { family: 'Literata', style: 'Regular' }, size: 26, lh: 140 })
await style('Doc/Cover Verse', { font: { family: 'Literata', style: 'Italic' }, size: 26, lh: 150 })

const page = figma.root.children.find((p) => p.name === 'Cover')
await figma.setCurrentPageAsync(page)
const old = page.children.find((c) => c.name === 'Kafka · Cover')
const pos = old ? { x: old.x, y: old.y } : { x: 0, y: 0 }
if (old) old.remove()

const root = AL('VERTICAL', { name: 'Kafka · Cover', fill: 'color/bg/page', px: 96, py: 72, justify: 'SPACE_BETWEEN' })
page.appendChild(root); root.layoutSizingHorizontal = 'FIXED'; root.layoutSizingVertical = 'FIXED'; root.resize(1440, 900); root.x = pos.x; root.y = pos.y

const top = AL('HORIZONTAL', { name: 'Running head', justify: 'SPACE_BETWEEN', align: 'CENTER' }); root.appendChild(top); top.layoutSizingHorizontal = 'FILL'
top.appendChild(await T('DESIGN SYSTEM · ARTES LITERARIAS EN PANTALLA', 'UI/Overline', 'color/fg/soft'))
top.appendChild(await T('Folio ' + DATA.version, 'UI/Label', 'color/fg/muted'))

const mid = AL('HORIZONTAL', { name: 'Pliego · Title page', gap: 96, align: 'MAX' }); root.appendChild(mid); mid.layoutSizingHorizontal = 'FILL'
const left = AL('VERTICAL', { name: 'Title', gap: 28 }); mid.appendChild(left)
left.appendChild(await T('Kafka', 'Doc/Cover Title', 'color/fg/default'))
const gold = AL('HORIZONTAL', { name: 'Gold rule', fill: 'color/bg/brand' }); left.appendChild(gold); gold.layoutSizingHorizontal = 'FIXED'; gold.layoutSizingVertical = 'FIXED'; gold.resize(120, 4)
left.appendChild(await T('Un sistema de diseño para leer, escribir y publicar literatura en pantalla: tipografía de lectura primero, interfaz accesible después.', 'Doc/Cover Lead', 'color/fg/default', { w: 640 }))
const right = AL('VERTICAL', { name: 'Epigraph', gap: 16 }); mid.appendChild(right); right.layoutGrow = 1
right.appendChild(await T('Volverán las oscuras golondrinas\nen tu balcón sus nidos a colgar,\ny otra vez con el ala a sus cristales\njugando llamarán.', 'Doc/Cover Verse', 'color/fg/soft'))
right.appendChild(await T('— Gustavo Adolfo Bécquer, Rima LIII (1871)', 'UI/Label', 'color/fg/muted'))

const foot = AL('VERTICAL', { name: 'Colophon', gap: 28 }); root.appendChild(foot); foot.layoutSizingHorizontal = 'FILL'
const rule = AL('HORIZONTAL', { name: 'Rule', fill: 'color/border/default' }); foot.appendChild(rule); rule.layoutSizingHorizontal = 'FILL'; rule.layoutSizingVertical = 'FIXED'; rule.resize(rule.width, 1)
const row = AL('HORIZONTAL', { name: 'Data', justify: 'SPACE_BETWEEN', align: 'MAX' }); foot.appendChild(row); row.layoutSizingHorizontal = 'FILL'
const stats = AL('HORIZONTAL', { name: 'Stats', gap: 56 }); row.appendChild(stats)
for (const [k, v] of [['VERSIÓN', DATA.version], ['COMPONENTES', String(DATA.components)], ['TOKENS', String(DATA.tokens).replace(/\B(?=(\d{3})+(?!\d))/g, '.')], ['MODOS', 'Claro · Oscuro'], ['DOCUMENTACIÓN', 'English']]) {
  const c = AL('VERTICAL', { gap: 6 }); stats.appendChild(c); c.appendChild(await T(k, 'UI/Overline', 'color/fg/muted')); c.appendChild(await T(v, 'Reading/Heading SM', 'color/fg/default'))
}
const sw = AL('HORIZONTAL', { name: 'Papel · Tinta · Oro', gap: 20, align: 'MAX' }); row.appendChild(sw)
for (const [label, fill] of [['Papel', 'color/bg/page'], ['Tinta', 'color/bg/inverse'], ['Oro', 'color/bg/brand']]) {
  const c = AL('VERTICAL', { gap: 8, align: 'CENTER' }); sw.appendChild(c)
  const dot = figma.createEllipse(); dot.name = label; dot.resize(44, 44); dot.fills = [paint(fill)]; dot.strokes = [paint('color/border/strong')]; dot.strokeWeight = 1; c.appendChild(dot)
  c.appendChild(await T(label, 'UI/Caption', 'color/fg/muted'))
}
return { id: root.id, w: root.width, h: root.height }
