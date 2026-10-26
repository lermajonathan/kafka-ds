const { V, tx, bindFill } = H
const cv = (n) => V.get('Components/pull-quote/' + n)
const comps = []
for (const withAttr of [true, false]) {
  const c = figma.createComponent(); c.name = 'Attribution=' + (withAttr ? 'Yes' : 'No')
  c.layoutMode = 'VERTICAL'; c.counterAxisSizingMode = 'FIXED'; c.resize(520, 100); c.primaryAxisSizingMode = 'AUTO'
  c.fills = []; c.clipsContent = false
  c.setBoundVariable('itemSpacing', cv('gap'))
  for (const k of ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']) c.setBoundVariable(k, cv('padding'))
  c.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', cv('rule'))]
  c.strokeTopWeight = 0; c.strokeRightWeight = 0; c.strokeBottomWeight = 0
  c.setBoundVariable('strokeLeftWeight', cv('rule-width'))
  const q = await tx('Escribir es decidir qué no se dice.', 'Reading/Quote', null)
  bindFill(q, 'Components/pull-quote/text'); c.appendChild(q); q.textAutoResize = 'HEIGHT'; q.layoutSizingHorizontal = 'FILL'
  if (withAttr) { const a = await tx('— Cuaderno de clase, 2026', 'UI/Label', null); bindFill(a, 'Components/pull-quote/attribution'); c.appendChild(a); a.textAutoResize = 'HEIGHT'; a.layoutSizingHorizontal = 'FILL' }
  host.appendChild(c); comps.push(c)
}
return [H.variants(comps, 'PullQuote', host)]
