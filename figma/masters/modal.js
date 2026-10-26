const M = 'Components/modal/'
const B = 'Components/button/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
const btn = (t, primary) => ({ frame: true, name: 'Action', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fill: primary ? B + 'primary/bg' : null, stroke: primary ? null : B + 'outline/border', sw: 1, children: [{ text: t, style: 'UI/Button', fill: primary ? B + 'primary/fg' : B + 'outline/fg' }] })
const dialog = (w) => ({ frame: true, name: 'Dialog', dir: 'VERTICAL', gap: M + 'gap', p: M + 'padding', radius: M + 'radius', width: w, fill: M + 'bg', stroke: M + 'border', sw: 1, swvar: M + 'border-width', children: [
  { text: 'Inscribirme al taller', style: 'Reading/Heading MD', fill: M + 'fg', fillWidth: true },
  { text: 'Revisa tus datos antes de confirmar.', style: 'UI/Input', fill: M + 'description', fillWidth: true },
  { frame: true, name: 'Actions', dir: 'HORIZONTAL', gap: M + 'actions-gap', justify: 'MAX', fillWidth: true, children: [btn('Cancelar', false), btn('Confirmar', true)] }] })
for (const [name, w] of [['Size=Sm', 384], ['Size=Md', 512], ['Size=Lg', 672]]) {
  const c = await H.comp({ name, dir: 'VERTICAL', children: [dialog(w)] }, host)
  if (eff) for (const n of c.findAll((x) => x.name === 'Dialog')) await n.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'Modal', host)]
