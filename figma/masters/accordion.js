const A = 'Components/accordion/'
const comps = []
const item = (title, open, hover) => ({ frame: true, name: 'Item', dir: 'VERTICAL', fillWidth: true, children: [
  { frame: true, name: 'Trigger', dir: 'HORIZONTAL', align: 'CENTER', px: A + 'trigger-padding-x', py: A + 'trigger-padding-y', minHeight: 44, minHeightVar: A + 'trigger-min-height', fillWidth: true, fill: hover ? A + 'trigger-hover-bg' : null, children: [
    { text: title, style: 'UI/Input', fill: A + 'trigger-fg', fillWidth: true },
    { text: open ? '−' : '+', style: 'UI/Label', fill: A + 'icon' }] },
  ...(open ? [{ frame: true, name: 'Panel', dir: 'VERTICAL', p: A + 'panel-padding', fillWidth: true, children: [{ text: 'Recibes un certificado digital al terminar el taller.', style: 'Reading/Body', fill: A + 'panel-fg', fillWidth: true }] }] : [])] })
for (const [name, states] of [['Open=None', [0, 0, 0]], ['Open=One', [0, 1, 0]], ['Open=Two', [1, 1, 0]], ['Open=Hover', [0, 2, 0]]]) {
  const items = ['¿Hay certificado?', '¿Cómo se paga?', '¿Puedo cancelar?'].map((t, i) => item(t, states[i] === 1, name === 'Open=Hover' && i === 0))
  comps.push(await H.comp({ name, dir: 'VERTICAL', width: 480, radius: A + 'radius', clip: true, stroke: A + 'border', sw: 1, swvar: A + 'border-width', children: items }, host))
}
return [H.variants(comps, 'Accordion', host)]
