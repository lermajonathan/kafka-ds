const C = 'Components/count-badge/'
const comps = []
for (const [name, txt] of [['Count=Single', '3'], ['Count=Double', '9+']]) {
  comps.push(await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: C + 'padding-x', radius: C + 'radius', minHeight: 20, minHeightVar: C + 'min-size', minWidth: 20, minWidthVar: C + 'min-size', fill: C + 'bg', children: [{ text: txt, style: 'UI/Caption', fill: C + 'fg' }] }, host))
}
return [H.variants(comps, 'CountBadge', host)]
