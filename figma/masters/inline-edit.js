const E = 'Components/inline-edit/'
const I = 'Components/input/'
const comps = []
for (const [name, mode] of [['State=Default', 'd'], ['State=Hover', 'h'], ['State=Empty', 'e'], ['State=Editing', 'f']]) {
  if (mode === 'f') {
    comps.push(await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width: 320, minHeight: 44, minHeightVar: E + 'min-height', fill: I + 'bg', stroke: I + 'border-focus', sw: 1, swvar: I + 'border-width', children: [{ text: 'La casa del lago', style: 'UI/Input', fill: I + 'fg' }] }, host))
    continue
  }
  comps.push(await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', gap: E + 'gap', px: E + 'padding-x', radius: E + 'radius', minHeight: 44, minHeightVar: E + 'min-height', fill: mode === 'h' ? E + 'hover-bg' : null, children: [
    { text: mode === 'e' ? 'Haz clic para editar' : 'La casa del lago', style: 'UI/Input', fill: mode === 'e' ? E + 'icon' : E + 'fg' },
    { text: '✎', style: 'UI/Label', fill: E + 'icon' }] }, host))
}
return [H.variants(comps, 'InlineEdit', host)]
