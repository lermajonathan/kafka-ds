const S = 'Components/select/'
const I = 'Components/input/'
const comps = []
for (const [name, border] of [['State=Default', 'border'], ['State=Focus', 'border-focus'], ['State=Invalid', 'invalid-border']]) {
  const c = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width: 320, minHeight: 44, minHeightVar: I + 'min-height', fill: I + 'bg', stroke: I + border, sw: 1, swvar: I + 'border-width', children: [{ text: 'Elige una opción', style: 'UI/Input', fill: I + 'placeholder', fillWidth: true }] }, host)
  const v = figma.createVector(); v.name = 'Chevron'
  v.vectorPaths = [{ windingRule: 'NONE', data: 'M 0 0 L 6 6 L 12 0' }]
  v.fills = []; v.strokes = [H.solid(S + 'icon')]; v.strokeWeight = 2; v.strokeCap = 'ROUND'; v.strokeJoin = 'ROUND'
  c.appendChild(v)
  comps.push(c)
}
return [H.variants(comps, 'Select', host)]
