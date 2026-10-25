const T = 'Components/toast/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
const icon = { info: 'i', success: '✓', warning: '!', danger: '!' }
const content = { info: ['Nueva versión', 'Recarga para verla.', null], success: ['Cambios guardados', 'Tu inscripción quedó al día.', 'Deshacer'], warning: ['Sesión por vencer', 'Guarda tu trabajo.', null], danger: ['No se pudo enviar', 'Revisa tu conexión.', 'Reintentar'] }
for (const tone of ['info', 'success', 'warning', 'danger']) {
  const [t, b, a] = content[tone]
  const kids = [
    { text: icon[tone], style: 'UI/Label', fill: T + tone + '/fg' },
    { frame: true, name: 'Text', dir: 'VERTICAL', gap: 4, fillWidth: true, children: [
      { text: t, style: 'UI/Label', fill: T + tone + '/fg', fillWidth: true },
      { text: b, style: 'UI/Caption', fill: T + 'fg', fillWidth: true }] }]
  if (a) kids.push({ text: a, style: 'UI/Label', fill: T + 'action' })
  kids.push({ text: '×', style: 'UI/Label', fill: T + 'fg' })
  const c = await H.comp({ name: 'Tone=' + tone[0].toUpperCase() + tone.slice(1), dir: 'HORIZONTAL', align: 'CENTER', gap: T + 'gap', p: T + 'padding', radius: T + 'radius', width: 360, wvar: T + 'width', fill: T + tone + '/bg', stroke: T + tone + '/border', sw: 1, swvar: T + 'border-width', children: kids }, host)
  if (eff) await c.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'Toast', host)]
