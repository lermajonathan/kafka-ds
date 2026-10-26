const C = 'Components/radio-card/'
const R = 'Components/radio/'
const comps = []
for (const [name, bg, border, on, disabled] of [['State=Unselected', 'bg', 'border', false, false], ['State=Hover', 'hover-bg', 'border', false, false], ['State=Selected', 'bg', 'checked-border', true, false], ['State=Disabled', 'bg', 'border', false, true]]) {
  const c = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', gap: C + 'gap', p: C + 'padding', radius: C + 'radius', width: 360, minHeight: 44, minHeightVar: C + 'min-height', fill: C + bg, stroke: C + border, sw: 2, swvar: C + 'border-width', children: [
    { frame: true, name: 'Icon', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 32, height: 32, wvar: C + 'icon-size', hvar: C + 'icon-size', radius: C + 'icon-radius', fill: C + 'icon-bg', children: [{ icon: 'Pen', size: 20, fill: C + 'icon-fg' }] },
    { frame: true, name: 'Text', dir: 'VERTICAL', fillWidth: true, children: [
      { text: 'Taller', style: 'UI/Label', fill: C + 'label-fg' },
      { text: 'Diez sesiones en grupo.', style: 'UI/Caption', fill: C + 'description-fg' }] },
    { frame: true, name: 'Dot', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 24, height: 24, wvar: R + 'size', hvar: R + 'size', radius: R + 'radius', fill: R + 'bg', stroke: R + 'border', sw: 2, swvar: R + 'border-width', children: on ? [{ frame: true, name: 'Fill', width: 8, height: 8, wvar: R + 'dot', hvar: R + 'dot', radius: R + 'radius', fill: R + 'checked-bg', children: [] }] : [] }] }, host)
  if (disabled) c.setBoundVariable('opacity', H.V.get(C + 'disabled-opacity'))
  comps.push(c)
}
return [H.variants(comps, 'RadioCardGroup', host)]
