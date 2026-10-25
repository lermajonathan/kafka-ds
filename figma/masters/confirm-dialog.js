const C = 'Components/confirm-dialog/'
const M = 'Components/modal/'
const B = 'Components/button/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
const btn = (t, bg, fg, outline) => ({ frame: true, name: 'Action', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fill: outline ? null : bg, stroke: outline ? B + 'outline/border' : null, sw: 1, children: [{ text: t, style: 'UI/Button', fill: fg }] })
for (const [name, danger] of [['Tone=Default', false], ['Tone=Danger', true]]) {
  const c = await H.comp({ name, dir: 'VERTICAL', gap: M + 'gap', p: M + 'padding', radius: M + 'radius', width: 448, fill: M + 'bg', stroke: M + 'border', sw: 1, swvar: M + 'border-width', children: [
    { frame: true, name: 'Header', dir: 'HORIZONTAL', gap: C + 'gap', fillWidth: true, children: [
      { frame: true, name: 'Icon', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 24, height: 24, wvar: C + 'icon-size', hvar: C + 'icon-size', children: [{ icon: danger ? 'Warning' : 'Info', size: 24, fill: danger ? C + 'icon-danger' : C + 'icon' }] },
      { frame: true, name: 'Text', dir: 'VERTICAL', gap: 8, fillWidth: true, children: [
        { text: danger ? 'Eliminar relato' : 'Publicar relato', style: 'Reading/Heading MD', fill: M + 'fg', fillWidth: true },
        { text: danger ? 'Se borrarán el texto y sus comentarios. No se puede deshacer.' : 'El relato será visible para todos los lectores.', style: 'UI/Input', fill: M + 'description', fillWidth: true }] }] },
    { frame: true, name: 'Actions', dir: 'HORIZONTAL', gap: M + 'actions-gap', justify: 'MAX', fillWidth: true, children: [btn('Cancelar', null, B + 'outline/fg', true), danger ? btn('Eliminar relato', 'Components/alert/danger/bg', 'Components/alert/danger/fg', false) : btn('Publicar', B + 'primary/bg', B + 'primary/fg', false)] }] }, host)
  if (eff) await c.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'ConfirmDialog', host)]
