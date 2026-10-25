const A = 'Components/alert/'
const comps = []
const icon = { info: 'i', success: '✓', warning: '!', danger: '!' }
const content = { info: ['Inscripciones abiertas', 'Quedan 8 cupos para el taller de poesía.'], success: ['Pago confirmado', 'Recibimos tu comprobante de Nequi.'], warning: ['Últimos cupos', 'El taller cierra el viernes.'], danger: ['No pudimos enviar tu inscripción', 'Revisa tu conexión e inténtalo de nuevo.'] }
for (const tone of ['info', 'success', 'warning', 'danger']) {
  const [t, b] = content[tone]
  comps.push(await H.comp({ name: 'Tone=' + tone[0].toUpperCase() + tone.slice(1), dir: 'HORIZONTAL', gap: A + 'gap', p: A + 'padding', radius: A + 'radius', width: 480, fill: A + tone + '/bg', stroke: A + tone + '/border', sw: 1, swvar: A + 'border-width', children: [
    { text: icon[tone], style: 'UI/Label', fill: A + tone + '/fg' },
    { frame: true, name: 'Text', dir: 'VERTICAL', gap: 4, fillWidth: true, children: [
      { text: t, style: 'UI/Label', fill: A + tone + '/fg', fillWidth: true },
      { text: b, style: 'UI/Input', fill: A + 'fg', fillWidth: true }] }] }, host))
}
return [H.variants(comps, 'Alert', host)]
