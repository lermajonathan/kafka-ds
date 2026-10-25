const S = 'Components/switch/'
const comps = []
for (const [name, state] of [['State=Off', 'off'], ['State=On', 'on'], ['State=Disabled', 'disabled']]) {
  const on = state === 'on'
  const row = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', gap: S + 'gap', minHeight: 44, minHeightVar: S + 'min-height', children: [{ text: 'Recordatorios por correo', style: 'UI/Input', fill: S + 'label' }] }, host)
  const track = figma.createFrame(); track.name = 'Track'; track.layoutMode = 'NONE'; track.resize(48, 32)
  track.setBoundVariable('width', H.V.get(S + 'track-width')); track.setBoundVariable('height', H.V.get(S + 'track-height'))
  for (const c of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) track.setBoundVariable(c, H.V.get('Semantic/radius/pill'))
  track.fills = [H.solid(S + (on ? 'track-on-bg' : 'track-bg'))]
  track.strokes = [H.solid(S + 'track-border')]; track.strokeWeight = 2
  for (const s of ['strokeTopWeight', 'strokeBottomWeight', 'strokeLeftWeight', 'strokeRightWeight']) track.setBoundVariable(s, H.V.get(S + 'track-border-width'))
  const th = figma.createEllipse(); th.name = 'Thumb'; th.resize(24, 24)
  th.setBoundVariable('width', H.V.get(S + 'thumb-size')); th.setBoundVariable('height', H.V.get(S + 'thumb-size'))
  th.fills = [H.solid(S + (on ? 'thumb-on' : 'thumb'))]
  track.appendChild(th); th.x = on ? 48 - 24 - 4 : 4; th.y = 4
  row.insertChild(0, track)
  if (state === 'disabled') row.setBoundVariable('opacity', H.V.get(S + 'disabled-opacity'))
  comps.push(row)
}
return [H.variants(comps, 'Switch', host)]
