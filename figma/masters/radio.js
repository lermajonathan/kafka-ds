const R = 'Components/radio/'
const comps = []
for (const [name, state] of [['State=Unselected', 'off'], ['State=Selected', 'on'], ['State=Invalid', 'invalid'], ['State=Disabled', 'disabled']]) {
  const row = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', gap: R + 'gap', minHeight: 44, minHeightVar: R + 'min-height', children: [{ text: 'Virtual', style: 'UI/Input', fill: R + 'label' }] }, host)
  const c = figma.createEllipse(); c.name = 'Circle'; c.resize(24, 24)
  c.setBoundVariable('width', H.V.get(R + 'size')); c.setBoundVariable('height', H.V.get(R + 'size'))
  c.fills = [H.solid(R + 'bg')]
  c.strokes = [H.solid(state === 'invalid' ? R + 'invalid-border' : R + 'border')]
  c.strokeWeight = 2; c.setBoundVariable('strokeWeight', H.V.get(R + 'border-width'))
  row.insertChild(0, c)
  if (state === 'on') {
    const d = figma.createEllipse(); d.name = 'Dot'; d.resize(8, 8)
    d.setBoundVariable('width', H.V.get(R + 'dot')); d.setBoundVariable('height', H.V.get(R + 'dot'))
    d.fills = [H.solid(R + 'checked-bg')]
    row.appendChild(d); d.layoutPositioning = 'ABSOLUTE'; d.x = 8; d.y = 18
  }
  if (state === 'disabled') row.setBoundVariable('opacity', H.V.get(R + 'disabled-opacity'))
  comps.push(row)
}
return [H.variants(comps, 'Radio', host)]
