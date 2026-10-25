// Documentation kit for `use_figma` calls: variable lookup, bound fills/strokes, auto-layout frames and styled text.
// Paste this block at the top of every documentation call (Foundations, Icons, Decisions, component pages).
const cols = await figma.variables.getLocalVariableCollectionsAsync()
const cn = Object.fromEntries(cols.map((c) => [c.id, c.name]))
const vars = await figma.variables.getLocalVariablesAsync()
const V = new Map(vars.map((v) => [cn[v.variableCollectionId] + '/' + v.name, v]))
const SC = cols.find((c) => c.name === 'Semantic')
const ts = new Map((await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]))
await Promise.all([['Literata', 'Regular'], ['Literata', 'Bold'], ['Literata', 'Italic'], ['Inter', 'Regular'], ['Inter', 'Medium'], ['Inter', 'Semi Bold'], ['Inter', 'Bold']].map(([family, style]) => figma.loadFontAsync({ family, style })))
const solid = (ref) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V.get(ref))
const bindFill = (n, ref) => { n.fills = [solid(ref)] }
const bindStroke = (n, ref, w = 1) => { n.strokes = [solid(ref)]; n.strokeWeight = w }
const hexOf = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
function fr(name, o = {}) {
  const f = figma.createAutoLayout(o.dir || 'VERTICAL') // hugs by default; createFrame + layoutMode stays at 100 x 100
  f.name = name; f.itemSpacing = o.gap || 0
  f.paddingLeft = f.paddingRight = o.px ?? o.pad ?? 0; f.paddingTop = f.paddingBottom = o.py ?? o.pad ?? 0
  f.fills = []; f.clipsContent = false
  if (o.wrap) f.layoutWrap = 'WRAP'
  if (o.align) f.counterAxisAlignItems = o.align
  if (o.fill) bindFill(f, o.fill)
  if (o.stroke) bindStroke(f, o.stroke, o.sw || 1)
  if (o.radius) f.setBoundVariable('topLeftRadius', V.get(o.radius)), f.setBoundVariable('topRightRadius', V.get(o.radius)), f.setBoundVariable('bottomLeftRadius', V.get(o.radius)), f.setBoundVariable('bottomRightRadius', V.get(o.radius))
  return f
}
async function tx(chars, style, fillRef, o = {}) {
  const t = figma.createText(); const s = ts.get(style)
  t.fontName = s.fontName; await t.setTextStyleIdAsync(s.id); t.characters = chars
  if (fillRef) bindFill(t, fillRef)
  if (o.name) t.name = o.name
  return t
}
const add = (p, c, fill) => { p.appendChild(c); if (fill) c.layoutSizingHorizontal = 'FILL'; return c }
