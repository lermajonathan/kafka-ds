// Body of an AsyncFunction(figma, DATA, MASTER). Stored once in the Figma file (shared plugin data kafka.ds/kit) and evaluated per page.
// DATA = one entry of scripts/figma/docs.mjs. MASTER = { code?: string } with the per-component specimen builder (AsyncFunction(figma, H, host) → nodes[]).
const cols = await figma.variables.getLocalVariableCollectionsAsync()
const cn = Object.fromEntries(cols.map((c) => [c.id, c.name]))
const vars = await figma.variables.getLocalVariablesAsync()
const V = new Map(vars.map((v) => [cn[v.variableCollectionId] + '/' + v.name, v]))
const SC = cols.find((c) => c.name === 'Semantic')
const MODE = { Light: SC.modes.find((m) => m.name === 'Light').modeId, Dark: SC.modes.find((m) => m.name === 'Dark').modeId }
const ts = new Map((await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]))
await Promise.all([['Literata', 'Regular'], ['Literata', 'Bold'], ['Literata', 'Italic'], ['Inter', 'Regular'], ['Inter', 'Medium'], ['Inter', 'Semi Bold'], ['Inter', 'Bold']].map(([family, style]) => figma.loadFontAsync({ family, style })))
let MONO = null
try { await figma.loadFontAsync({ family: 'Roboto Mono', style: 'Regular' }); MONO = { family: 'Roboto Mono', style: 'Regular' } } catch (e) { MONO = null }
const solid = (ref) => { const v = V.get(ref); if (!v) throw new Error('missing variable ' + ref); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v) }
const bindFill = (n, ref) => { n.fills = [solid(ref)] }
const bindStroke = (n, ref, w = 1) => { n.strokes = [solid(ref)]; n.strokeWeight = w }
const R4 = ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']
function fr(name, o = {}) {
  const f = figma.createAutoLayout(o.dir || 'VERTICAL')
  f.name = name; f.itemSpacing = o.gap || 0
  f.paddingLeft = f.paddingRight = o.px ?? o.pad ?? 0; f.paddingTop = f.paddingBottom = o.py ?? o.pad ?? 0
  f.fills = []; f.clipsContent = false
  if (o.wrap) { f.layoutWrap = 'WRAP'; f.counterAxisSpacing = o.cgap ?? o.gap ?? 0 }
  if (o.align) f.counterAxisAlignItems = o.align
  if (o.fill) bindFill(f, o.fill)
  if (o.stroke) bindStroke(f, o.stroke, o.sw || 1)
  if (o.radius) for (const k of R4) f.setBoundVariable(k, V.get(o.radius))
  return f
}
async function tx(chars, style, fillRef, o = {}) {
  const t = figma.createText(); const s = ts.get(style)
  t.fontName = s.fontName; await t.setTextStyleIdAsync(s.id); t.characters = String(chars)
  if (fillRef) bindFill(t, fillRef)
  return t
}
async function code(chars, fillRef) {
  const t = figma.createText()
  if (MONO) { t.fontName = MONO; t.fontSize = 13; t.lineHeight = { unit: 'PIXELS', value: 20 } } else { const s = ts.get('UI/Caption'); t.fontName = s.fontName; await t.setTextStyleIdAsync(s.id) }
  t.characters = String(chars); bindFill(t, fillRef || FG)
  return t
}
const FG = 'Semantic/color/fg/default', SOFT = 'Semantic/color/fg/soft', MUTED = 'Semantic/color/fg/muted', BRAND = 'Semantic/color/fg/brand'
const place = (p, c, h = 'FILL') => { p.appendChild(c); if (h && 'layoutSizingHorizontal' in c) c.layoutSizingHorizontal = h; return c }
const wrap = (p, t, w) => { p.appendChild(t); t.textAutoResize = 'HEIGHT'; if (w) { t.layoutSizingHorizontal = 'FIXED'; t.resize(w, t.height) } else t.layoutSizingHorizontal = 'FILL'; return t }
const H = { figma, V, ts, MODE, SC, solid, bindFill, bindStroke, fr, tx, code, place, wrap, FG, SOFT, MUTED, BRAND, MONO }

{ const AF0 = Object.getPrototypeOf(async function () {}).constructor; await new AF0('H', figma.root.getSharedPluginData('kafka.ds', 'dsl'))(H) }
// ---- masters only: rebuild the specimens of an existing page ----
if (DATA.mastersOnly) {
  const pg = figma.root.children.find((p) => p.name === (DATA.pageName || DATA.name))
  await pg.loadAsync(); await figma.setCurrentPageAsync(pg)
  const hosts = pg.findAll((n) => n.type === 'FRAME' && n.name === 'Specimens')
  for (const h of hosts) for (const c of [...h.children]) c.remove()
  const AFm = Object.getPrototypeOf(async function () {}).constructor
  const made = await new AFm('figma', 'H', 'host', MASTER.code)(figma, H, hosts[0])
  hosts[0].itemSpacing = hosts[0].counterAxisSpacing = 40
  hosts[1].itemSpacing = hosts[1].counterAxisSpacing = 40; hosts[1].paddingLeft = hosts[1].paddingRight = hosts[1].paddingTop = hosts[1].paddingBottom = 40
  for (const n of made || []) for (const m of n.type === 'COMPONENT_SET' ? n.children : [n]) hosts[1].appendChild(m.createInstance())
  const texts = pg.findAll((n) => n.type === 'TEXT')
  return { page: pg.id, texts: texts.length, collapsed: texts.filter((t) => t.height < 8 || t.width < 6).length, masters: (made || []).map((m) => m.id), hosts: hosts.length }
}

// ---- page ----
const pageName = DATA.pageName || DATA.name
let page = figma.root.children.find((p) => p.name === pageName)
if (!page) { page = figma.createPage(); page.name = pageName }
const CANVAS = { r: 0x63 / 255, g: 0x58 / 255, b: 0x41 / 255 } // #635841, the canvas behind every page of the file
page.backgrounds = [{ type: 'SOLID', color: CANVAS }]
await figma.setCurrentPageAsync(page)
for (const c of [...page.children]) c.remove()
const root = figma.createAutoLayout('VERTICAL')
root.name = (DATA.pattern ? 'Pattern · ' : 'Kafka · ') + DATA.name; root.itemSpacing = 64
root.paddingLeft = root.paddingRight = 80; root.paddingTop = 80; root.paddingBottom = 120
root.counterAxisSizingMode = 'FIXED'; root.resize(1440, 100); root.primaryAxisSizingMode = 'AUTO'
bindFill(root, 'Semantic/color/bg/page'); root.setExplicitVariableModeForCollection(SC, MODE.Light)
page.appendChild(root)

async function section(num, title, hint) {
  const s = fr('§' + num + ' ' + title, { gap: 20 }); place(root, s)
  const h = fr('Heading', { gap: 4 }); place(s, h)
  h.appendChild(await tx(num + ' · ' + title.toUpperCase(), 'UI/Overline', BRAND))
  if (hint) wrap(h, await tx(hint, 'UI/Caption', MUTED))
  return s
}
async function bulletList(parent, items, label) {
  const col = fr(label, { gap: 8 }); place(parent, col)
  for (const it of items) {
    const row = fr('Item', { dir: 'HORIZONTAL', gap: 12 }); place(col, row)
    row.appendChild(await tx('—', 'UI/Input', MUTED))
    wrap(row, await tx(it, 'UI/Input', FG))
  }
  return col
}
async function table(parent, widths, headers, rows, name, cell) {
  const t = fr(name, { gap: 0 }); place(parent, t)
  const mk = async (cells, head) => {
    const r = fr(head ? 'Header' : 'Row', { dir: 'HORIZONTAL', gap: 24, py: 12, stroke: 'Semantic/color/border/default' })
    r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; r.strokeBottomWeight = 1
    place(t, r)
    for (let i = 0; i < cells.length; i++) {
      const w = widths[i]
      const c = fr('Cell', { dir: 'HORIZONTAL', gap: 8, align: 'CENTER' })
      r.appendChild(c)
      if (w) { c.layoutSizingHorizontal = 'FIXED'; c.resize(w, c.height) } else c.layoutSizingHorizontal = 'FILL'
      c.counterAxisSizingMode = 'AUTO'; if (!cells[i]) c.resize(c.width, 20)
      const val = cells[i]
      if (head) { if (val) wrap(c, await tx(val, 'UI/Label', MUTED)) }
      else if (cell) await cell(c, i, val, cells)
      else if (val !== '') wrap(c, await tx(val, 'UI/Input', i === 0 ? FG : SOFT))
    }
  }
  await mk(headers, true)
  for (const r of rows) await mk(r, false)
  return t
}

// ---- pattern page: header, overview, live composition (light + dark), rules, components, accessibility ----
if (DATA.pattern) {
  const head = fr('Header', { gap: 16 }); place(root, head)
  head.appendChild(await tx(('KAFKA DS · PATTERN · ' + DATA.category).toUpperCase(), 'UI/Overline', BRAND))
  head.appendChild(await tx(DATA.name, 'Reading/Title', FG))
  { const t = await tx(DATA.summary, 'Reading/Lead', SOFT); head.appendChild(t); t.textAutoResize = 'HEIGHT'; t.layoutSizingHorizontal = 'FIXED'; t.resize(820, t.height) }
  { const s = await section('01', 'Overview', 'When this pattern applies.'); await bulletList(s, DATA.whenTo, 'When to use') }
  {
    const s = await section('02', 'Composition', 'Real instances of the component masters, in light and dark.')
    const AFp = Object.getPrototypeOf(async function () {}).constructor
    for (const mode of ['Light', 'Dark']) {
      const stage = fr('Stage · ' + mode, { gap: 24, pad: 32, fill: 'Semantic/color/bg/page', stroke: 'Semantic/color/border/default', radius: 'Semantic/radius/card' }); place(s, stage)
      stage.setExplicitVariableModeForCollection(SC, MODE[mode])
      stage.appendChild(await tx(mode, 'UI/Overline', MUTED))
      const host = fr('Composition', { gap: 32 }); place(stage, host)
      await new AFp('figma', 'H', 'host', MASTER.code)(figma, H, host)
    }
  }
  {
    const s = await section('03', 'Rules', 'What to do and what to avoid.')
    const two = fr('Columns', { dir: 'HORIZONTAL', gap: 48 }); place(s, two)
    for (const [label, items] of [['Do', DATA.dos], ["Don't", DATA.donts]]) {
      const col = fr(label, { gap: 12 }); two.appendChild(col); col.layoutSizingHorizontal = 'FILL'
      col.appendChild(await tx(label, 'UI/Label', FG)); await bulletList(col, items, 'List')
    }
  }
  { const s = await section('04', 'Components', 'What the pattern is made of.'); await table(s, [220, 0], ['Component', 'Role'], DATA.uses.map((x) => [x.name, x.role]), 'Components') }
  { const s = await section('05', 'Accessibility', 'Semantics, focus and announcements.'); await bulletList(s, DATA.accessibility, 'Accessibility') }
  if (DATA.related.length) {
    const s = await section('06', 'Related'); const row = fr('Related', { dir: 'HORIZONTAL', gap: 12, wrap: true }); place(s, row)
    for (const r of DATA.related) { const chip = fr('Chip · ' + r, { py: 8, px: 16, stroke: 'Semantic/color/border/strong', radius: 'Semantic/radius/pill' }); row.appendChild(chip); chip.appendChild(await tx(r, 'UI/Label', FG)) }
  }
  const texts = root.findAll((n) => n.type === 'TEXT')
  return { page: page.id, root: root.id, h: Math.round(root.height), texts: texts.length, collapsed: texts.filter((t) => t.height < 8 || t.width < 6).length, unbound: root.findAll((n) => 'fills' in n && n.fills !== figma.mixed && n.fills.length && n.fills[0].type === 'SOLID' && n.visible && !n.fills[0].boundVariables?.color).length }
}

// ---- 1 · header ----
const head = fr('Header', { gap: 16 }); place(root, head)
head.appendChild(await tx(('KAFKA DS · ' + DATA.category).toUpperCase(), 'UI/Overline', BRAND))
head.appendChild(await tx(DATA.name, 'Reading/Title', FG))
{ const t = await tx(DATA.summary, 'Reading/Lead', SOFT); head.appendChild(t); t.textAutoResize = 'HEIGHT'; t.layoutSizingHorizontal = 'FIXED'; t.resize(820, t.height) }
{ const chip = fr('Import', { py: 10, px: 16, fill: 'Semantic/color/bg/sunken', radius: 'Semantic/radius/control' }); head.appendChild(chip); chip.appendChild(await code(DATA.import)) }

// ---- 2 · overview ----
{
  const s = await section('01', 'Overview', 'Cuándo usarlo y cuándo no.')
  const two = fr('Columns', { dir: 'HORIZONTAL', gap: 48 }); place(s, two)
  for (const [label, items] of [['When to use it', DATA.whenTo], ['When not to', DATA.whenNot]]) {
    if (!items.length) continue
    const col = fr(label, { gap: 12 }); two.appendChild(col); col.layoutSizingHorizontal = 'FILL'
    col.appendChild(await tx(label, 'UI/Label', FG))
    await bulletList(col, items, 'List')
  }
}

// ---- 3 · examples ----
{
  const s = await section('02', 'Examples', 'Los mismos ejemplos que corren en el playground.')
  for (const ex of DATA.examples) {
    const card = fr('Example · ' + ex.title, { gap: 12, pad: 24, fill: 'Semantic/color/bg/surface', stroke: 'Semantic/color/border/default', radius: 'Semantic/radius/card' }); place(s, card)
    card.appendChild(await tx(ex.title, 'Reading/Heading SM', FG))
    if (ex.text) wrap(card, await tx(ex.text, 'UI/Input', SOFT))
    const blk = fr('Code', { pad: 16, fill: 'Semantic/color/bg/sunken', radius: 'Semantic/radius/control' }); place(card, blk)
    wrap(blk, await code(ex.code))
  }
}

// ---- 4 · usage (content) ----
if (DATA.content.length) {
  const s = await section('03', 'Usage', 'Guía de contenido.')
  await bulletList(s, DATA.content, 'Content')
}

// ---- 5 · API ----
{
  const s = await section('04', 'API', 'Generada desde el código TypeScript del componente.')
  if (DATA.props.length) {
    await table(s, [200, 360, 160, 0], ['Prop', 'Type', 'Default', 'Description'], DATA.props.map((p) => [p.name + (p.required ? ' *' : ''), p.type, p.default || '—', p.description]), 'Props')
    wrap(s, await tx('* obligatoria', 'UI/Caption', MUTED))
  } else wrap(s, await tx('Sin props propias: acepta los atributos HTML del elemento.', 'UI/Input', SOFT))
}

// ---- 6 · accessibility ----
{
  const s = await section('05', 'Accessibility', 'Semántica, contraste y teclado.')
  await bulletList(s, DATA.accessibility, 'Accessibility')
}

// ---- 7 · masters ----
const masters = []
{
  const s = await section('06', 'Masters', 'Componentes reales de Figma, enlazados a las variables de la capa Components.')
  if (MASTER && MASTER.code) {
    const AF = Object.getPrototypeOf(async function () {}).constructor
    for (const mode of ['Light', 'Dark']) {
      const stage = fr('Stage · ' + mode, { gap: 24, pad: 32, fill: 'Semantic/color/bg/page', stroke: 'Semantic/color/border/default', radius: 'Semantic/radius/card' }); place(s, stage)
      stage.setExplicitVariableModeForCollection(SC, MODE[mode])
      stage.appendChild(await tx(mode, 'UI/Overline', MUTED))
      // the light component set keeps 40 px of room for shadows; the dark host keeps the same, so both columns line up
      const host = fr('Specimens', { dir: 'HORIZONTAL', gap: 40, pad: mode === 'Dark' ? 40 : 0, wrap: true, align: 'MIN' }); place(stage, host)
      if (mode === 'Light') {
        const made = await new AF('figma', 'H', 'host', MASTER.code)(figma, H, host)
        for (const n of made || []) masters.push(n)
      } else {
        // dark mirrors light one for one: every variant of every set, not just the default
        for (const n of masters) for (const m of n.type === 'COMPONENT_SET' ? n.children : [n]) host.appendChild(m.createInstance())
      }
    }
  } else {
    wrap(s, await tx('Master pendiente: este componente todavía no tiene su especimen en Figma.', 'UI/Input', MUTED))
  }
}

// ---- 8 · tokens ----
{
  const s = await section('07', 'Tokens', DATA.tokensFrom ? 'Reutiliza los tokens de «' + DATA.tokensFrom + '».' : 'Tokens de componente; todos apuntan a semánticos.')
  if (DATA.tokens.length) {
    await table(s, [28, 260, 360, 0], ['', 'Token', 'CSS variable', 'Value'], DATA.tokens.map((t) => ['', t.name, '--kafka-' + t.name.replace(/[./]/g, '-'), t.value]), 'Tokens', async (c, i, val, cells) => {
      if (i === 0) {
        const fv = V.get('Components/' + cells[1].replace('.', '/'))
        c.layoutSizingHorizontal = 'FIXED'
        if (fv && fv.resolvedType === 'COLOR') { const sw = figma.createRectangle(); sw.name = 'Swatch'; sw.resize(20, 20); sw.cornerRadius = 4; sw.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', fv)]; bindStroke(sw, 'Semantic/color/border/default'); c.appendChild(sw) }
      } else wrap(c, await tx(val, 'UI/Input', i === 1 ? FG : SOFT))
    })
  } else wrap(s, await tx('Sin tokens propios.', 'UI/Input', MUTED))
}

// ---- 9 · related ----
if (DATA.related.length) {
  const s = await section('08', 'Related')
  const row = fr('Related', { dir: 'HORIZONTAL', gap: 12, wrap: true }); place(s, row)
  for (const r of DATA.related) { const chip = fr('Chip · ' + r, { py: 8, px: 16, stroke: 'Semantic/color/border/strong', radius: 'Semantic/radius/pill' }); row.appendChild(chip); chip.appendChild(await tx(r, 'UI/Label', FG)) }
}

// ---- audit ----
const texts = root.findAll((n) => n.type === 'TEXT')
const collapsed = texts.filter((t) => t.height < 8 || t.width < 6).length
const unbound = root.findAll((n) => 'fills' in n && n.fills !== figma.mixed && n.fills.length && n.fills[0].type === 'SOLID' && n.visible && !n.fills[0].boundVariables?.color).length
return { page: page.id, root: root.id, h: Math.round(root.height), texts: texts.length, collapsed, unbound, masters: masters.map((m) => m.id) }
