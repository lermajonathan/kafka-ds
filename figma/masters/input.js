const I = 'Components/input/'
const comps = []
for (const [name, border, txt, ph] of [['State=Default', 'border', 'Nombre completo', true], ['State=Hover', 'border-hover', 'Nombre completo', true], ['State=Focus', 'border-focus', 'Camila Pérez', false], ['State=Invalid', 'invalid-border', 'camila@', false], ['State=Disabled', 'border', 'No editable', false]]) {
  const c = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width: 320, minHeight: 44, minHeightVar: I + 'min-height', fill: I + 'bg', stroke: I + border, sw: 1, swvar: I + 'border-width', children: [{ text: txt, style: 'UI/Input', fill: I + (ph ? 'placeholder' : 'fg') }] }, host)
  if (name === 'State=Disabled') c.setBoundVariable('opacity', H.V.get(I + 'disabled-opacity'))
  comps.push(c)
}
return [H.variants(comps, 'Input', host)]
