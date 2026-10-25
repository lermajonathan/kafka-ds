const P = 'Components/panel/'
const B = 'Components/button/'
const comps = []
const styles = await figma.getLocalEffectStylesAsync()
const eff = styles.find((s) => /^Shadow\/md$/.test(s.name))
const rule = { frame: true, name: 'Rule', height: 1, fillWidth: true, fill: P + 'rule', children: [] }
const btn = (t, primary) => ({ frame: true, name: 'Button', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fill: primary ? B + 'primary/bg' : null, stroke: primary ? null : B + 'outline/border', sw: 1, children: [{ text: t, style: 'UI/Button', fill: primary ? B + 'primary/fg' : B + 'outline/fg' }] })
const header = (title, desc, tone, actions, toggle) => ({ frame: true, name: 'Header', dir: 'HORIZONTAL', align: 'CENTER', gap: P + 'header-gap', px: P + 'header-padding-x', py: P + 'header-padding-y', fillWidth: true, children: [
  { frame: true, name: 'Icon', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 32, height: 32, wvar: P + 'icon-box', hvar: P + 'icon-box', radius: P + 'icon-radius', fill: P + 'icon/' + tone + '/bg', children: [{ text: '◷', style: 'UI/Label', fill: P + 'icon/' + tone + '/fg' }] },
  { frame: true, name: 'Titles', dir: 'VERTICAL', fillWidth: true, children: [
    { text: title, style: 'UI/Label', fill: P + 'title-fg', fillWidth: true },
    ...(desc ? [{ text: desc, style: 'UI/Caption', fill: P + 'description-fg', fillWidth: true }] : [])] },
  ...(actions ? [btn('Editar', false)] : []),
  ...(toggle ? [{ frame: true, name: 'Toggle', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, height: 44, children: [{ text: toggle, style: 'UI/Label', fill: P + 'toggle-fg' }] }] : [])] })
const body = (t) => ({ frame: true, name: 'Body', dir: 'VERTICAL', p: P + 'body-padding', fillWidth: true, children: [{ text: t, style: 'Reading/Body', fill: 'Semantic/color/fg/default', fillWidth: true }] })
const footer = { frame: true, name: 'Footer', dir: 'HORIZONTAL', gap: P + 'footer-gap', justify: 'MAX', px: P + 'footer-padding-x', py: P + 'footer-padding-y', fillWidth: true, children: [btn('Cancelar', false), btn('Guardar', true)] }
for (const [name, kids] of [
  ['State=Full', [header('Recordatorios', 'Cuándo te avisamos antes de cada sesión', 'brand', true, null), rule, body('Te escribimos un día antes y dos horas antes de cada sesión.'), rule, footer]],
  ['State=Collapsible open', [header('Política de inscripción', null, 'info', false, '▴'), rule, body('Puedes cancelar hasta 48 horas antes del primer encuentro.')]],
  ['State=Collapsible closed', [header('Política de inscripción', null, 'info', false, '▾')]]]) {
  const c = await H.comp({ name, dir: 'VERTICAL', width: 520, radius: P + 'radius', clip: true, fill: P + 'bg', stroke: P + 'border', sw: 1, swvar: P + 'border-width', children: kids }, host)
  if (eff) await c.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'Panel', host)]
