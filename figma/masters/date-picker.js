const D = 'Components/date-picker/'
const I = 'Components/input/'
const comps = []
for (const [name, border, txt, ph] of [['State=Empty', 'border', 'dd/mm/aaaa', true], ['State=Typed', 'border-focus', '25/10/2026', false], ['State=Invalid', 'invalid-border', '31/02/2026', false]]) {
  comps.push(await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', gap: D + 'gap', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width: 320, minHeight: 44, minHeightVar: I + 'min-height', fill: I + 'bg', stroke: I + border, sw: 1, swvar: I + 'border-width', children: [
    { text: txt, style: 'UI/Input', fill: I + (ph ? 'placeholder' : 'fg'), fillWidth: true },
    { frame: true, name: 'Calendar button', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, height: 44, wvar: D + 'icon-size', children: [{ text: '▦', style: 'UI/Label', fill: I + 'icon' }] }] }, host))
}
return [H.variants(comps, 'DatePicker', host)]
