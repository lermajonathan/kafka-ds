const M = 'Components/menu/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
const item = (t, kind) => ({ frame: true, name: kind === 'dis' ? 'Item Disabled' : 'Item', dir: 'HORIZONTAL', align: 'CENTER', gap: M + 'item-gap', px: M + 'item-padding-x', radius: M + 'item-radius', minHeight: 44, minHeightVar: M + 'item-min-height', fillWidth: true,
  fill: kind === 'hov' ? M + 'item-hover-bg' : kind === 'act' ? M + 'item-active-bg' : null,
  children: [{ text: t, style: 'UI/Input', fill: kind === 'danger' ? M + 'danger-fg' : M + 'item-fg', fillWidth: true }] })
const sep = { frame: true, name: 'Separator', height: 1, fillWidth: true, fill: M + 'separator', children: [] }
const variants = [
  ['State=Default', [item('Ver detalle', 'n'), item('Marcar como pagada', 'n'), item('Reenviar correo', 'dis'), sep, item('Cancelar inscripción', 'danger')]],
  ['State=Hover', [item('Ver detalle', 'n'), item('Marcar como pagada', 'hov'), item('Reenviar correo', 'dis'), sep, item('Cancelar inscripción', 'danger')]],
  ['State=Pressed', [item('Ver detalle', 'act'), item('Marcar como pagada', 'n'), item('Reenviar correo', 'dis'), sep, item('Cancelar inscripción', 'danger')]]]
for (const [name, kids] of variants) {
  const c = await H.comp({ name, dir: 'VERTICAL', p: M + 'padding', radius: M + 'radius', width: 260, minWidth: 224, minWidthVar: M + 'min-width', fill: M + 'bg', stroke: M + 'border', sw: 1, swvar: M + 'border-width', children: kids }, host)
  c.findAll((n) => n.name === 'Item Disabled').forEach((n) => n.setBoundVariable('opacity', H.V.get(M + 'disabled-opacity')))
  if (eff) await c.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'Menu', host)]
