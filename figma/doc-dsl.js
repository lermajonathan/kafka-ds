// Body of an AsyncFunction(H). Adds a declarative component builder to the kit helpers (stored in shared plugin data kafka.ds/dsl).
// def = { name, dir, width, pad|px|py|pt|pb|pl|pr, gap, fill, stroke, sw|{l,t,r,b}, radius, align, justify, children: [...] }
// every spacing/colour/radius value is a variable name (string) or a number; children: {text,style,fill,fillW,w,mono} | {frame:def,fillW} | {rect:true,w,h,fill,radius,fillW} | {icon,weight,size,fill}
const { figma, V, tx, code } = H
const bindNum = (n, field, ref) => {
  if (typeof ref === 'number') { n[field] = ref; return }
  const v = V.get(ref); if (!v) throw new Error('missing variable ' + ref); n.setBoundVariable(field, v)
}
const paintOf = (ref) => { const v = V.get(ref); if (!v) throw new Error('missing variable ' + ref); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v) }
let ICONS = null
async function iconSet(name) {
  if (!ICONS) { const pg = figma.root.children.find((p) => p.name === 'Icons'); await pg.loadAsync(); ICONS = new Map(pg.findAllWithCriteria({ types: ['COMPONENT_SET'] }).map((s) => [s.name.slice(5), s])) }
  const s = ICONS.get(name); if (!s) throw new Error('missing icon ' + name); return s
}
function frame(def, asComponent) {
  const n = asComponent ? figma.createComponent() : figma.createAutoLayout(def.dir || 'VERTICAL')
  if (asComponent) n.layoutMode = def.dir || 'VERTICAL'
  n.name = def.name || 'Frame'; n.fills = []; n.clipsContent = false
  n.primaryAxisSizingMode = 'AUTO'; n.counterAxisSizingMode = 'AUTO'
  if (def.align) n.counterAxisAlignItems = def.align
  if (def.justify) n.primaryAxisAlignItems = def.justify
  if (def.wrap) { n.layoutWrap = 'WRAP' }
  const P = { paddingLeft: def.pl ?? def.px ?? def.pad, paddingRight: def.pr ?? def.px ?? def.pad, paddingTop: def.pt ?? def.py ?? def.pad, paddingBottom: def.pb ?? def.py ?? def.pad }
  for (const [k, v] of Object.entries(P)) if (v !== undefined) bindNum(n, k, v)
  if (def.gap !== undefined) bindNum(n, 'itemSpacing', def.gap)
  if (def.fill) n.fills = [paintOf(def.fill)]
  if (def.stroke) {
    n.strokes = [paintOf(def.stroke)]
    if (def.sw && typeof def.sw === 'object') {
      const m = { l: 'strokeLeftWeight', t: 'strokeTopWeight', r: 'strokeRightWeight', b: 'strokeBottomWeight' }
      for (const [s, f] of Object.entries(m)) { if (def.sw[s] === undefined) n[f] = 0; else bindNum(n, f, def.sw[s]) }
    } else if (def.sw) { for (const f of ['strokeLeftWeight', 'strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight']) bindNum(n, f, def.sw) }
    else n.strokeWeight = 1
  }
  if (def.radius) for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) bindNum(n, k, def.radius)
  if (def.width) { n.layoutSizingHorizontal = 'FIXED'; n.resize(def.width, n.height) }
  if (def.minHeight) n.minHeight = def.minHeight
  if (def.height) { n.layoutSizingVertical = 'FIXED'; n.resize(n.width, def.height) }
  if (def.wvar) n.setBoundVariable('width', V.get(def.wvar))
  if (def.hvar) n.setBoundVariable('height', V.get(def.hvar))
  if (def.minHeightVar) n.setBoundVariable('minHeight', V.get(def.minHeightVar))
  return n
}
async function fill(parent, children) {
  for (const c of children || []) {
    let node
    if (c.text !== undefined) {
      node = await tx(c.text, c.style || 'UI/Input', c.fill || null)
      parent.appendChild(node); node.textAutoResize = 'HEIGHT'
      if (c.w) { node.layoutSizingHorizontal = 'FIXED'; node.resize(c.w, node.height) } else if (c.fillW) node.layoutSizingHorizontal = 'FILL'; else node.textAutoResize = 'WIDTH_AND_HEIGHT'
      if (c.align) node.textAlignHorizontal = c.align
    } else if (c.frame) {
      node = frame(c.frame, false); parent.appendChild(node); await fill(node, c.frame.children)
      if (c.fillW) node.layoutSizingHorizontal = 'FILL'
      if (c.frame.width) { node.layoutSizingHorizontal = 'FIXED'; node.resize(c.frame.width, node.height) }
    } else if (c.rect) {
      node = figma.createRectangle(); node.name = c.name || 'Rect'; node.resize(c.w || 24, c.h || 24)
      node.fills = c.fill ? [paintOf(c.fill)] : []
      if (c.radius) for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) bindNum(node, k, c.radius)
      if (c.stroke) { node.strokes = [paintOf(c.stroke)]; node.strokeWeight = c.sw || 1 }
      parent.appendChild(node); if (c.fillW) node.layoutSizingHorizontal = 'FILL'
    } else if (c.icon) {
      const s = await iconSet(c.icon); const variant = s.children.find((v) => v.name === 'Weight=' + (c.weight || 'Regular')) || s.defaultVariant
      node = variant.createInstance(); node.resize(c.size || 24, c.size || 24); parent.appendChild(node)
      if (c.fill) for (const v of node.findAll((x) => 'fills' in x && x.type !== 'FRAME' && x.type !== 'INSTANCE')) { const op = v.opacity; v.fills = [paintOf(c.fill)]; v.opacity = op }
    }
  }
}
H.comp = async (def, host) => { const n = frame(def, true); host.appendChild(n); await fill(n, def.children); return n }
H.mk = async (def, host) => { const n = frame(def, false); host.appendChild(n); await fill(n, def.children); return n }
H.variants = (comps, name, host) => {
  const set = figma.combineAsVariants(comps, host); set.name = name
  set.layoutMode = 'HORIZONTAL'; set.itemSpacing = 24; set.layoutWrap = 'WRAP'; set.counterAxisSpacing = 24
  set.primaryAxisSizingMode = 'FIXED'; set.counterAxisSizingMode = 'AUTO'; set.resize(1100, set.height)
  set.fills = []; set.strokes = []; set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 0
  host.appendChild(set); return set
}
