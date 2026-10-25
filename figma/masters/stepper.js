const S = 'Components/stepper/'
const comps = []
const steps = [['Datos', 'Quién eres'], ['Programa', 'Qué quieres tomar'], ['Pago', 'Tarjeta o PSE'], ['Confirmación', '']]
const marker = (i, cur) => {
  const done = i < cur, now = i === cur
  return { frame: true, name: 'Marker', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 32, height: 32, wvar: S + 'marker-size', hvar: S + 'marker-size', radius: 'Semantic/radius/pill',
    fill: now ? S + 'current-bg' : done ? S + 'done-bg' : S + 'marker-bg', stroke: done ? S + 'done-border' : S + 'marker-border', sw: 2, swvar: S + 'marker-border-width',
    children: [{ text: done ? '✓' : String(i + 1), style: 'UI/Label', fill: now ? S + 'current-fg' : done ? S + 'done-fg' : S + 'marker-fg' }] }
}
for (let cur = 0; cur < 4; cur++) {
  const cols = steps.map(([l, d], i) => {
    const kids = [{ frame: true, name: 'Row', dir: 'HORIZONTAL', align: 'CENTER', fillWidth: true, children: [marker(i, cur), ...(i < 3 ? [{ frame: true, name: 'Line', height: 2, hvar: S + 'line-width', fillWidth: true, fill: i < cur ? S + 'line-done' : S + 'line', children: [] }] : [])] },
      { text: l, style: 'UI/Label', fill: i <= cur ? S + 'label' : S + 'label-muted' }]
    if (d) kids.push({ text: d, style: 'UI/Caption', fill: S + 'label-muted' })
    return { frame: true, name: 'Step', dir: 'VERTICAL', gap: S + 'gap', width: i < 3 ? 150 : 100, children: kids }
  })
  comps.push(await H.comp({ name: 'Current=' + (cur + 1), dir: 'HORIZONTAL', children: cols }, host))
}
return [H.variants(comps, 'Stepper', host)]
