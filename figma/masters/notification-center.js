const N = 'Components/notification-center/'
const P = 'Components/popover/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
const item = (title, body, time, tone, unread) => ({ frame: true, name: 'Item', dir: 'HORIZONTAL', gap: N + 'gap', px: N + 'padding-x', py: N + 'padding-y', fillWidth: true, fill: unread ? N + 'unread-bg' : null, children: [
  { frame: true, name: 'Icon', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 32, height: 32, wvar: N + 'icon-box', hvar: N + 'icon-box', radius: 'Semantic/radius/pill', fill: N + 'icon/' + tone + '/bg', children: [{ text: tone === 'danger' ? '!' : '✓', style: 'UI/Label', fill: N + 'icon/' + tone + '/fg' }] },
  { frame: true, name: 'Text', dir: 'VERTICAL', gap: 4, fillWidth: true, children: [
    { text: (unread ? 'Sin leer · ' : '') + title, style: 'UI/Label', fill: N + 'title-fg', fillWidth: true },
    { text: body, style: 'UI/Caption', fill: N + 'body-fg', fillWidth: true },
    { text: time, style: 'UI/Caption', fill: N + 'time-fg' }] }] })
const rule = { frame: true, name: 'Rule', height: 1, fillWidth: true, fill: N + 'rule', children: [] }
const panel = (kids) => ({ frame: true, name: 'Panel', dir: 'VERTICAL', width: 360, wvar: N + 'width', radius: P + 'radius', fill: P + 'bg', stroke: P + 'border', sw: 1, swvar: P + 'border-width', clip: true, children: kids })
const header = { frame: true, name: 'Header', dir: 'HORIZONTAL', align: 'CENTER', px: N + 'padding-x', py: N + 'padding-y', fillWidth: true, children: [{ text: 'Notificaciones', style: 'UI/Label', fill: N + 'title-fg', fillWidth: true }, { text: 'Marcar todas', style: 'UI/Caption', fill: N + 'action' }] }
for (const [name, kids] of [
  ['State=Unread', [header, rule, item('Pago confirmado', 'Recibimos tu pago del taller de poesía.', 'Hace 5 min', 'success', true), rule, item('Cambio de horario', 'La sesión del sábado empieza a las 10 a. m.', 'Hace 2 h', 'brand', true), rule, item('Cupo casi lleno', 'Quedan 2 lugares en la masterclass.', 'Ayer', 'warning', false)]],
  ['State=Empty', [header, rule, { frame: true, name: 'Empty', dir: 'HORIZONTAL', justify: 'CENTER', p: 24, fillWidth: true, children: [{ text: 'No tienes notificaciones.', style: 'UI/Label', fill: N + 'empty-fg' }] }]]]) {
  const c = await H.comp({ name, dir: 'VERTICAL', children: [panel(kids)] }, host)
  if (eff) for (const n of c.findAll((x) => x.name === 'Panel')) await n.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'NotificationCenter', host)]
