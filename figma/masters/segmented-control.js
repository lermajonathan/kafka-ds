const S = 'Components/segmented-control/'
const comps = []
const labels = ['Día', 'Semana', 'Mes']
for (const size of ['Md', 'Sm']) for (let active = 0; active < 3; active++) {
  const h = size === 'Md' ? 44 : 32
  const hv = size === 'Md' ? S + 'item-min-height' : S + 'item-min-height-sm'
  const items = labels.map((l, i) => i === active
    ? { frame: true, name: 'Item', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: S + 'item-padding-x', radius: S + 'item-radius', minHeight: h, minHeightVar: hv, fill: S + 'active-bg', stroke: S + 'active-border', sw: 1, swvar: S + 'active-border-width', children: [{ text: l, style: 'UI/Label', fill: S + 'active-fg' }] }
    : { frame: true, name: 'Item', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: S + 'item-padding-x', radius: S + 'item-radius', minHeight: h, minHeightVar: hv, children: [{ text: l, style: 'UI/Label', fill: S + 'fg' }] })
  comps.push(await H.comp({ name: 'Size=' + size + ', Active=' + labels[active], dir: 'HORIZONTAL', gap: S + 'item-gap', p: S + 'track-padding', radius: S + 'track-radius', fill: S + 'track-bg', stroke: S + 'track-border', sw: 1, swvar: S + 'track-border-width', children: items }, host))
}
return [H.variants(comps, 'SegmentedControl', host)]
