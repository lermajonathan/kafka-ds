const B = 'Components/combobox/'
const I = 'Components/input/'
const comps = []
const opt = (txt, kind) => ({ frame: true, name: 'Option', dir: 'HORIZONTAL', align: 'CENTER', px: B + 'option-padding-x', radius: B + 'option-radius', minHeight: 44, minHeightVar: B + 'option-min-height', fillWidth: true,
  fill: kind === 'active' ? B + 'option-active-bg' : kind === 'sel' ? B + 'option-selected-bg' : null,
  children: [{ text: txt, style: 'UI/Input', fill: B + 'option-fg', fillWidth: true }, ...(kind === 'sel' ? [{ text: '✓', style: 'UI/Label', fill: B + 'icon' }] : [])] })
const field = (txt, ph) => ({ frame: true, name: 'Field', dir: 'HORIZONTAL', align: 'CENTER', px: I + 'padding-x', py: I + 'padding-y', radius: I + 'radius', width: 320, minHeight: 44, minHeightVar: I + 'min-height', fill: I + 'bg', stroke: I + (ph ? 'border' : 'border-focus'), sw: 1, swvar: I + 'border-width', children: [{ text: txt, style: 'UI/Input', fill: I + (ph ? 'placeholder' : 'fg'), fillWidth: true }] })
const list = (items) => ({ frame: true, name: 'List', dir: 'VERTICAL', p: B + 'list-padding', radius: B + 'list-radius', width: 320, fill: B + 'list-bg', stroke: B + 'list-border', sw: 1, swvar: B + 'list-border-width', children: items })
for (const [name, kids] of [
  ['State=Closed', [field('Escribe para buscar', true)]],
  ['State=Open', [field('co', false), list([opt('Colombia', 'active'), opt('Costa Rica', 'n'), opt('Comoras', 'n')])]],
  ['State=Selected', [field('Colombia', false), list([opt('Colombia', 'sel'), opt('Costa Rica', 'n')])]],
  ['State=Empty', [field('zz', false), list([{ frame: true, name: 'Empty', dir: 'HORIZONTAL', align: 'CENTER', px: B + 'option-padding-x', minHeight: 44, minHeightVar: B + 'option-min-height', children: [{ text: 'Sin resultados', style: 'UI/Input', fill: B + 'empty' }] }])]]]) {
  const c = await H.comp({ name, dir: 'VERTICAL', gap: B + 'offset', children: kids }, host)
  const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /floating/i.test(s.name))
  if (eff) c.findAll((n) => n.name === 'List').forEach((n) => n.setEffectStyleIdAsync(eff.id))
  comps.push(c)
}
return [H.variants(comps, 'Combobox', host)]
