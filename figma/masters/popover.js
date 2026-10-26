const P = 'Components/popover/'
const I = 'Components/input/'
const B = 'Components/button/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
const trigger = { frame: true, name: 'Trigger', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', gap: B + 'gap', px: B + 'padding-x', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', stroke: B + 'outline/border', sw: 1, children: [{ text: 'Filtrar', style: 'UI/Button', fill: B + 'outline/fg' }] }
const panel = { frame: true, name: 'Panel', dir: 'VERTICAL', gap: 16, p: P + 'padding', radius: P + 'radius', width: 288, fill: P + 'bg', stroke: P + 'border', sw: 1, swvar: P + 'border-width', children: [
  { frame: true, name: 'Field', dir: 'VERTICAL', gap: 8, fillWidth: true, children: [
    { text: 'Buscar', style: 'UI/Label', fill: P + 'fg' },
    { frame: true, name: 'Input', dir: 'HORIZONTAL', align: 'CENTER', px: I + 'padding-x', radius: I + 'radius', minHeight: 44, minHeightVar: I + 'min-height', fillWidth: true, fill: I + 'bg', stroke: I + 'border', sw: 1, swvar: I + 'border-width', children: [{ text: 'Título del programa', style: 'UI/Input', fill: I + 'placeholder' }] }] },
  { frame: true, name: 'Apply', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fillWidth: true, fill: B + 'primary/bg', children: [{ text: 'Aplicar', style: 'UI/Button', fill: B + 'primary/fg' }] }] }
for (const [name, kids] of [['State=Closed', [trigger]], ['State=Open', [trigger, panel]]]) {
  const c = await H.comp({ name, dir: 'VERTICAL', gap: P + 'offset', children: kids }, host)
  if (eff) for (const n of c.findAll((x) => x.name === 'Panel')) await n.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'Popover', host)]
