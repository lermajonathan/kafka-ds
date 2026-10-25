const P = 'Components/progress/'
const comps = []
const W = 360
for (const [tone, pct, label] of [['Brand', 64, 'Subiendo inscripciones.csv'], ['Success', 100, 'Pago confirmado'], ['Warning', 85, 'Cupos casi llenos'], ['Danger', 100, 'Espacio agotado']]) {
  const c = await H.comp({ name: 'Tone=' + tone, dir: 'VERTICAL', gap: P + 'gap', width: W, children: [
    { frame: true, name: 'Header', dir: 'HORIZONTAL', align: 'CENTER', fillWidth: true, children: [
      { text: label, style: 'UI/Label', fill: P + 'label-fg', fillWidth: true },
      { text: pct + '%', style: 'UI/Caption', fill: P + 'value-fg' }] }] }, host)
  const track = figma.createFrame(); track.name = 'Track'; track.layoutMode = 'NONE'; track.resize(W, 8)
  track.setBoundVariable('height', H.V.get(P + 'height'))
  for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) track.setBoundVariable(k, H.V.get(P + 'radius'))
  track.fills = [H.solid(P + 'track')]; track.clipsContent = true
  const fill = figma.createRectangle(); fill.name = 'Fill'; fill.resize(Math.round(W * pct / 100), 8)
  fill.setBoundVariable('height', H.V.get(P + 'height'))
  fill.fills = [H.solid(P + 'fill/' + tone.toLowerCase())]
  track.appendChild(fill)
  c.appendChild(track); track.layoutSizingHorizontal = 'FILL'
  comps.push(c)
}
return [H.variants(comps, 'Progress', host)]
