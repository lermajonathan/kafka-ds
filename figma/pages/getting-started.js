// Getting started · direction A "Pliego": an editorial index. Numbered sections in a left column, content on the right, rules between.
const cols = await figma.variables.getLocalVariableCollectionsAsync()
const sem = cols.find((c) => c.name === 'Semantic')
const vars = (await figma.variables.getLocalVariablesAsync()).filter((v) => v.variableCollectionId === sem.id)
const find = (n) => { const v = vars.find((x) => x.name === n); if (!v) throw new Error('missing variable ' + n); return v }
const paint = (n) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', find(n))
const styles = await figma.getLocalTextStylesAsync()
const S = async (name) => { const s = styles.find((x) => x.name === name); if (!s) throw new Error('missing text style ' + name); await figma.loadFontAsync(s.fontName); return s }
const T = async (txt, st, fill, o = {}) => { const t = figma.createText(); t.textStyleId = (await S(st)).id; t.characters = txt; t.fills = [paint(fill)]; if (o.w) { t.textAutoResize = 'HEIGHT'; t.resize(o.w, t.height) } return t }
const AL = (dir, o = {}) => { const f = figma.createAutoLayout(dir); f.name = o.name || 'Frame'; f.fills = o.fill ? [paint(o.fill)] : []; f.itemSpacing = o.gap || 0; if (o.px !== undefined) f.paddingLeft = f.paddingRight = o.px; if (o.py !== undefined) f.paddingTop = f.paddingBottom = o.py; if (o.p !== undefined) f.paddingLeft = f.paddingRight = f.paddingTop = f.paddingBottom = o.p; if (o.align) f.counterAxisAlignItems = o.align; if (o.justify) f.primaryAxisAlignItems = o.justify; if (o.wrap) f.layoutWrap = 'WRAP'; return f }
const fillW = (n) => { n.layoutSizingHorizontal = 'FILL'; return n }
const radius = (n, name) => { for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) n.setBoundVariable(k, find(name)) }
const hline = () => { const r = AL('HORIZONTAL', { name: 'Rule', fill: 'color/border/default' }); return r }
const link = async (txt, url) => { const t = await T(txt, 'Reading/Body', 'color/fg/link'); t.setRangeHyperlink(0, txt.length, { type: 'URL', value: url }); t.textDecoration = 'UNDERLINE'; return t }

const page = figma.root.children.find((p) => p.name === 'Getting started')
await figma.setCurrentPageAsync(page)
const old = page.children.find((c) => c.name === 'Kafka · Getting started')
const pos = old ? { x: old.x, y: old.y } : { x: 0, y: 0 }
if (old) old.remove()

const root = AL('VERTICAL', { name: 'Kafka · Getting started', fill: 'color/bg/page', px: 96, py: 72, gap: 0 })
page.appendChild(root); root.layoutSizingHorizontal = 'FIXED'; root.resize(1440, 100); root.layoutSizingVertical = 'HUG'; root.x = pos.x; root.y = pos.y

// running head
const head = AL('HORIZONTAL', { name: 'Running head', justify: 'SPACE_BETWEEN', align: 'CENTER' }); root.appendChild(head); fillW(head)
head.appendChild(await T('KAFKA · GETTING STARTED', 'UI/Overline', 'color/fg/soft'))
head.appendChild(await T('Folio ' + DATA.version, 'UI/Label', 'color/fg/muted'))

// title block
const title = AL('VERTICAL', { name: 'Title', gap: 20 }); root.appendChild(title); fillW(title); title.paddingTop = 72; title.paddingBottom = 64
title.appendChild(await T('Cómo está organizado este archivo', 'Reading/Title', 'color/fg/default'))
const gold = AL('HORIZONTAL', { name: 'Gold rule', fill: 'color/bg/brand' }); title.appendChild(gold); gold.layoutSizingHorizontal = 'FIXED'; gold.layoutSizingVertical = 'FIXED'; gold.resize(96, 4)
title.appendChild(await T('Las variables, los estilos y los íconos se generan desde el repositorio y no se editan a mano. Cada componente tiene su propia página con anatomía, cuándo usarlo, propiedades, accesibilidad y tokens.', 'Reading/Lead', 'color/fg/soft', { w: 760 }))

// one section = a rule, then number + title on the left and the content on the right
const section = async (num, name, intro) => {
  const wrap = AL('VERTICAL', { name: 'Section ' + num, gap: 0 }); root.appendChild(wrap); fillW(wrap)
  const r = hline(); wrap.appendChild(r); fillW(r); r.layoutSizingVertical = 'FIXED'; r.resize(r.width, 1)
  const row = AL('HORIZONTAL', { name: 'Row', gap: 64, align: 'MIN', py: 48 }); wrap.appendChild(row); fillW(row)
  const l = AL('VERTICAL', { name: 'Heading', gap: 10 }); row.appendChild(l); l.layoutSizingHorizontal = 'FIXED'; l.resize(280, 10); l.layoutSizingVertical = 'HUG'
  l.appendChild(await T(num, 'Reading/Heading LG', 'color/fg/brand'))
  l.appendChild(await T(name, 'Reading/Heading MD', 'color/fg/default', { w: 280 }))
  const c = AL('VERTICAL', { name: 'Content', gap: 24 }); row.appendChild(c); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL'
  if (intro) c.appendChild(await T(intro, 'Reading/Body', 'color/fg/soft', { w: 640 }))
  return c
}

// 01 families
{ const c = await section('01', 'Familias de componentes', DATA.components + ' componentes en ' + DATA.families.length + ' familias. Cada página lleva el nombre del componente y vive bajo su separador.')
  const grid = AL('HORIZONTAL', { name: 'Families', gap: 16, wrap: true }); c.appendChild(grid); fillW(grid)
  for (const f of DATA.families) {
    const card = AL('VERTICAL', { name: f.name, fill: 'color/bg/surface', p: 20, gap: 4 }); grid.appendChild(card); radius(card, 'radius/card')
    card.strokes = [paint('color/border/default')]; card.strokeWeight = 1; card.layoutSizingHorizontal = 'FIXED'; card.resize(214, 10); card.layoutSizingVertical = 'HUG'; card.minHeight = 144
    card.appendChild(await T(String(f.count), 'Reading/Heading LG', 'color/fg/brand'))
    card.appendChild(await T(f.name, 'UI/Label', 'color/fg/default'))
    card.appendChild(await T(f.note, 'UI/Caption', 'color/fg/soft', { w: 174 }))
  } }
// 02 tokens
{ const c = await section('02', 'Tokens en tres niveles', 'Primitives (ocultas) → Semantic (Claro / Oscuro) → Components. Un componente nunca usa un valor directo: siempre un alias a un token semántico.')
  const row = AL('HORIZONTAL', { name: 'Levels', gap: 16 }); c.appendChild(row); fillW(row)
  for (const [n, d] of [['Primitives', 'Valores crudos: colores, escala de espacio, tamaños. Ocultas para que nadie las use por error.'], ['Semantic', 'Significado: fondo, texto, borde, estado. Tiene modos Light y Dark.'], ['Components', 'Alias por componente: Components/button/primary/bg. Es lo que usan las páginas.']]) {
    const card = AL('VERTICAL', { name: n, fill: 'color/bg/sunken', p: 20, gap: 8 }); row.appendChild(card); radius(card, 'radius/card'); card.layoutGrow = 1; card.layoutSizingHorizontal = 'FILL'; card.layoutSizingVertical = 'FILL'
    card.appendChild(await T(n, 'UI/Label', 'color/fg/default')); const dt = await T(d, 'UI/Caption', 'color/fg/soft'); card.appendChild(dt); dt.textAutoResize = 'HEIGHT'; dt.layoutSizingHorizontal = 'FILL'
  } }
// 03 how to use
{ const c = await section('03', 'Cómo usar el archivo')
  for (const [i, t] of [['1', 'Elige el modo. Cambia Claro / Oscuro en el panel de variables de la página o del marco.'], ['2', 'Abre la página del componente. Arriba está el resumen; abajo, los ejemplos en ambos modos con las variantes.'], ['3', 'Consulta las propiedades y los tokens antes de tocar un valor. Si falta uno, se propone en el repo, no aquí.'], ['4', 'Para íconos, usa la página Icons: cada ícono tiene 5 pesos (Regular, Bold, Light, Fill, Duotone).']]) {
    const r = AL('HORIZONTAL', { gap: 16, align: 'MIN' }); c.appendChild(r)
    const n = await T(i, 'Reading/Heading SM', 'color/fg/brand'); r.appendChild(n)
    r.appendChild(await T(t, 'Reading/Body', 'color/fg/default', { w: 620 }))
  } }
// 04 conventions
{ const c = await section('04', 'Convenciones')
  for (const t of ['Objetivos táctiles de 44 px como mínimo.', 'Contraste: texto 4.5:1, lectura 7:1, controles 3:1.', 'El estado nunca depende solo del color: siempre hay un ícono, un borde o un texto.', 'Documentación en inglés; ejemplos de contenido en español.']) c.appendChild(await T(t, 'Reading/Body', 'color/fg/default', { w: 640 })) }
// 05 links
{ const c = await section('05', 'Enlaces')
  c.appendChild(await link('Repositorio · github.com/lermajonathan/kafka-ds', DATA.repo))
  c.appendChild(await link('Íconos · phosphoricons.com', DATA.phosphor)) }

// colophon
const foot = AL('HORIZONTAL', { name: 'Colophon', justify: 'SPACE_BETWEEN', py: 40 }); root.appendChild(foot); fillW(foot)
const fr = hline(); root.insertChild(root.children.length - 1, fr); fillW(fr); fr.layoutSizingVertical = 'FIXED'; fr.resize(fr.width, 1)
foot.appendChild(await T('Kafka · Papel, tinta y oro', 'UI/Label', 'color/fg/muted'))
foot.appendChild(await T(DATA.components + ' componentes · ' + String(DATA.tokens).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' tokens', 'UI/Label', 'color/fg/muted'))
return { id: root.id, h: Math.round(root.height) }
