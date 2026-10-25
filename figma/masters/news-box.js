const N = 'Components/news/'
const comps = []
const eff = (await figma.getLocalEffectStylesAsync()).find((s) => /^Shadow\/lg$/.test(s.name))
const dot = (active) => ({ frame: true, name: 'Dot', width: 12, height: 12, wvar: N + 'dot-size', hvar: N + 'dot-size', radius: 'Semantic/radius/pill', fill: active ? N + 'dot-active' : N + 'dot-bg', children: [] })
const item = (kind, title, meta) => [
  { frame: true, name: 'Kind', dir: 'HORIZONTAL', align: 'CENTER', gap: N + 'meta-gap', fillWidth: true, children: [
    { frame: true, name: 'Badge', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 32, height: 32, wvar: N + 'kind-size', hvar: N + 'kind-size', radius: 'Semantic/radius/pill', fill: N + 'kind-bg', children: [{ text: '★', style: 'UI/Label', fill: N + 'kind-fg' }] },
    { text: kind, style: 'UI/Label', fill: N + 'soft-fg', fillWidth: true },
    { text: '×', style: 'UI/Label', fill: N + 'soft-fg' }] },
  { text: title, style: 'Reading/Heading SM', fill: N + 'fg', fillWidth: true },
  { text: meta, style: 'UI/Caption', fill: N + 'soft-fg', fillWidth: true }]
for (const [name, kids, dots] of [
  ['Items=Several', item('Evento', 'Lectura abierta de poesía', '14 de noviembre · Biblioteca central'), true],
  ['Items=One', item('Aviso', 'Cambio de horario del taller de narrativa', 'Desde el 3 de noviembre'), false]]) {
  const body = [...kids]
  if (dots) body.push({ frame: true, name: 'Dots', dir: 'HORIZONTAL', gap: N + 'meta-gap', align: 'CENTER', children: [dot(true), dot(false), dot(false)] })
  const c = await H.comp({ name, dir: 'VERTICAL', gap: N + 'gap', p: N + 'padding', radius: N + 'radius', width: 360, wvar: N + 'width', fill: N + 'bg', stroke: N + 'border', sw: 1, swvar: N + 'border-width', children: body }, host)
  if (eff) await c.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'NewsBox', host)]
