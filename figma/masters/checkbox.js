const K = 'Components/checkbox/'
const comps = []
for (const [name, state] of [['State=Unchecked', 'off'], ['State=Checked', 'on'], ['State=Mixed', 'mixed'], ['State=Invalid', 'invalid'], ['State=Disabled', 'disabled']]) {
  const row = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', gap: K + 'gap', minHeight: 44, minHeightVar: K + 'min-height', children: [{ text: 'Acepto las bases', style: 'UI/Input', fill: K + 'label' }] }, host)
  const box = figma.createFrame(); box.name = 'Box'; box.resize(24, 24); box.layoutMode = 'NONE'
  box.setBoundVariable('width', H.V.get(K + 'size')); box.setBoundVariable('height', H.V.get(K + 'size'))
  for (const c of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) box.setBoundVariable(c, H.V.get(K + 'radius'))
  const on = state === 'on' || state === 'mixed'
  box.fills = [H.solid(on ? K + 'checked-bg' : K + 'bg')]
  box.strokes = [H.solid(state === 'invalid' ? K + 'invalid-border' : K + 'border')]
  box.strokeWeight = 2
  for (const s of ['strokeTopWeight', 'strokeBottomWeight', 'strokeLeftWeight', 'strokeRightWeight']) box.setBoundVariable(s, H.V.get(K + 'border-width'))
  if (on) {
    const m = figma.createVector(); m.name = 'Mark'
    m.vectorPaths = [{ windingRule: 'NONE', data: state === 'on' ? 'M 0 5 L 4 9 L 12 0' : 'M 0 0 L 10 0' }]
    m.fills = []; m.strokes = [H.solid(K + 'checked-fg')]; m.strokeWeight = 2; m.strokeCap = 'ROUND'; m.strokeJoin = 'ROUND'
    box.appendChild(m); m.x = state === 'on' ? 6 : 7; m.y = state === 'on' ? 8 : 11
  }
  row.insertChild(0, box)
  if (state === 'disabled') row.setBoundVariable('opacity', H.V.get(K + 'disabled-opacity'))
  comps.push(row)
}
return [H.variants(comps, 'Checkbox', host)]
