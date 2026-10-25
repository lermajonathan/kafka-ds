const C = 'Components/calendar/'
const cell = (txt, kind) => {
  const sel = kind === 'sel', today = kind === 'today', dis = kind === 'dis', mid = kind === 'mid'
  return { frame: true, name: dis ? 'Disabled' : 'Day', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, height: 44, wvar: C + 'cell-size', hvar: C + 'cell-size', radius: C + 'cell-radius',
    fill: sel ? C + 'selected-bg' : mid ? C + 'range-bg' : null,
    stroke: today ? C + 'today-border' : null, sw: 2, swvar: C + 'today-border-width',
    children: txt ? [{ text: txt, style: 'UI/Label', fill: sel ? C + 'selected-fg' : C + 'fg' }] : [] }
}
const grid = (kindOf) => {
  const rows = []
  for (let r = 0; r < 5; r++) {
    const cells = []
    for (let c = 0; c < 7; c++) { const idx = r * 7 + c; const n = idx - 3 + 1; cells.push(n >= 1 && n <= 31 ? cell(String(n), kindOf(n)) : cell('', 'x')) }
    rows.push({ frame: true, name: 'Week', dir: 'HORIZONTAL', gap: C + 'gap', children: cells })
  }
  return rows
}
const header = [
  { frame: true, name: 'Header', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', fillWidth: true, children: [{ text: 'octubre de 2026', style: 'Reading/Heading SM', fill: C + 'fg' }] },
  { frame: true, name: 'Weekdays', dir: 'HORIZONTAL', gap: C + 'gap', children: ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((w) => ({ frame: true, name: 'Wd', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, wvar: C + 'cell-size', children: [{ text: w, style: 'UI/Caption', fill: C + 'weekday' }] })) }]
const comps = []
for (const [name, kindOf] of [
  ['State=Selected', (n) => (n === 21 ? 'sel' : n === 25 ? 'today' : 'n')],
  ['State=With limits', (n) => (n < 5 || n > 28 ? 'dis' : n === 21 ? 'sel' : n === 25 ? 'today' : 'n')]]) {
  const c = await H.comp({ name, dir: 'VERTICAL', gap: C + 'gap', p: C + 'padding', radius: C + 'radius', fill: C + 'bg', stroke: C + 'border', sw: 1, swvar: C + 'border-width', children: [...header, ...grid(kindOf)] }, host)
  c.findAll((n) => n.name === 'Disabled').forEach((n) => n.setBoundVariable('opacity', H.V.get(C + 'disabled-opacity')))
  comps.push(c)
}
return [H.variants(comps, 'Calendar', host)]
