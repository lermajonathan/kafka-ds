const T = 'Components/tooltip/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
const tip = (t) => ({ frame: true, name: 'Tip', dir: 'HORIZONTAL', align: 'CENTER', px: T + 'padding-x', py: T + 'padding-y', radius: T + 'radius', maxWidth: 224, maxWidthVar: T + 'max-width', fill: T + 'bg', children: [{ text: t, style: 'UI/Caption', fill: T + 'fg' }] })
const btn = { frame: true, name: 'Icon button', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, height: 44, radius: 'Components/icon-button/radius', stroke: 'Components/button/outline/border', sw: 1, children: [{ text: '×', style: 'UI/Label', fill: 'Components/button/outline/fg' }] }
for (const [name, txt] of [['Text=Short', 'Cerrar sin guardar'], ['Text=Long', 'Cierra el panel y descarta los cambios que no hayas guardado']]) {
  const c = await H.comp({ name, dir: 'VERTICAL', align: 'CENTER', gap: T + 'offset', children: [tip(txt), btn] }, host)
  if (eff) for (const n of c.findAll((x) => x.name === 'Tip')) await n.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'Tooltip', host)]
