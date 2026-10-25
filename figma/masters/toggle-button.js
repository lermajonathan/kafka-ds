const B = 'Components/button/'
const comps = []
for (const pressed of [false, true]) {
  const fg = pressed ? B + 'primary/fg' : B + 'outline/fg'
  comps.push(await H.comp({ name: 'Pressed=' + (pressed ? 'Yes' : 'No'), dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', py: B + 'padding-y', gap: B + 'gap', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height',
    fill: pressed ? B + 'primary/bg' : null, stroke: pressed ? null : B + 'outline/border', sw: 1, children: [{ icon: 'Bell', size: 20, fill: fg }, { text: 'Seguir taller', style: 'UI/Button', fill: fg }] }, host))
}
return [H.variants(comps, 'ToggleButton', host)]
