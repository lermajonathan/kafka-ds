const S = 'Components/slider/'
const comps = []
for (const [name, pct, disabled] of [['State=Low', 0.2, false], ['State=Mid', 0.5, false], ['State=Disabled', 0.5, true]]) {
  const row = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', gap: 16, width: 320, minHeight: 44, minHeightVar: S + 'min-height', children: [{ text: '4 sesiones', style: 'UI/Label', fill: S + 'value' }] }, host)
  const W = 200
  const wrap = figma.createFrame(); wrap.name = 'Track'; wrap.layoutMode = 'NONE'; wrap.fills = []; wrap.resize(W, 24)
  const rail = figma.createRectangle(); rail.name = 'Rail'; rail.resize(W, 8); rail.y = 8
  rail.setBoundVariable('height', H.V.get(S + 'rail-height'))
  for (const c of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) rail.setBoundVariable(c, H.V.get(S + 'radius'))
  rail.fills = [H.solid(S + 'rail')]
  const fill = figma.createRectangle(); fill.name = 'Fill'; fill.resize(Math.round(W * pct), 8); fill.y = 8
  fill.setBoundVariable('height', H.V.get(S + 'rail-height'))
  for (const c of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) fill.setBoundVariable(c, H.V.get(S + 'radius'))
  fill.fills = [H.solid(S + 'fill')]
  const th = figma.createEllipse(); th.name = 'Thumb'; th.resize(24, 24); th.x = Math.round(W * pct) - 12
  th.setBoundVariable('width', H.V.get(S + 'thumb-size')); th.setBoundVariable('height', H.V.get(S + 'thumb-size'))
  th.fills = [H.solid(S + 'thumb')]; th.strokes = [H.solid(S + 'thumb-ring')]; th.strokeWeight = 2
  th.setBoundVariable('strokeWeight', H.V.get(S + 'thumb-ring-width'))
  wrap.appendChild(rail); wrap.appendChild(fill); wrap.appendChild(th)
  row.insertChild(0, wrap)
  if (disabled) row.setBoundVariable('opacity', H.V.get(S + 'disabled-opacity'))
  comps.push(row)
}
return [H.variants(comps, 'Slider', host)]
