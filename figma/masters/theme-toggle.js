const S = 'Components/segmented-control/'
const comps = []
const labels = ['Claro', 'Oscuro', 'Sistema']
for (let active = 0; active < 3; active++) {
  const items = labels.map((l, i) => i === active
    ? { frame: true, name: 'Item', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', gap: S + 'item-gap', px: S + 'item-padding-x', radius: S + 'item-radius', minHeight: 44, minHeightVar: S + 'item-min-height', fill: S + 'active-bg', stroke: S + 'active-border', sw: 1, swvar: S + 'active-border-width', children: [{ text: l, style: 'UI/Label', fill: S + 'active-fg' }] }
    : { frame: true, name: 'Item', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', gap: S + 'item-gap', px: S + 'item-padding-x', radius: S + 'item-radius', minHeight: 44, minHeightVar: S + 'item-min-height', children: [{ text: l, style: 'UI/Label', fill: S + 'fg' }] })
  comps.push(await H.comp({ name: 'Mode=' + labels[active], dir: 'HORIZONTAL', gap: S + 'item-gap', p: S + 'track-padding', radius: S + 'track-radius', fill: S + 'track-bg', stroke: S + 'track-border', sw: 1, swvar: S + 'track-border-width', children: items }, host))
}
return [H.variants(comps, 'ThemeToggle', host)]
