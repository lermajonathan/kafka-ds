const C = 'Components/chip/'
const comps = []
for (const [name, bg, fg, stroke] of [['State=Default', 'bg', 'fg', true], ['State=Hover', 'bg-hover', 'fg', true], ['State=Selected', 'selected-bg', 'selected-fg', false]]) {
  comps.push(await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: C + 'padding-x', py: C + 'padding-y', radius: C + 'radius', minHeight: 44, minHeightVar: C + 'min-height', fill: C + bg, stroke: stroke ? C + 'border' : null, sw: 1, children: [{ text: 'Poesía', style: 'UI/Label', fill: C + fg }] }, host))
}
return [H.variants(comps, 'Chip', host)]
