const C = 'Components/count-badge/'
const comps = []
// Neutral and danger (red, for notifications) tones across one, two and overflow digits
for (const [tone, bg, fg] of [['Neutral', 'bg', 'fg'], ['Danger', 'danger-bg', 'danger-fg']]) {
  for (const [count, txt] of [['Single', '3'], ['Double', '24'], ['Overflow', '99+']]) {
    comps.push(await H.comp({ name: 'Tone=' + tone + ', Count=' + count, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: C + 'padding-x', radius: C + 'radius', minHeight: 20, minHeightVar: C + 'min-size', minWidth: 20, minWidthVar: C + 'min-size', fill: C + bg, children: [{ text: txt, style: 'UI/Caption', fill: C + fg }] }, host))
  }
}
return [H.variants(comps, 'CountBadge', host)]
