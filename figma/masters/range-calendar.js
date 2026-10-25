const C = 'Components/calendar/'
const cell = (txt, kind) => {
  const end = kind === 'end', mid = kind === 'mid'
  return { frame: true, name: 'Day', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, height: 44, wvar: C + 'cell-size', hvar: C + 'cell-size', radius: C + 'cell-radius',
    fill: end ? C + 'selected-bg' : mid ? C + 'range-bg' : null,
    children: txt ? [{ text: txt, style: 'UI/Label', fill: end ? C + 'selected-fg' : mid ? C + 'range-fg' : C + 'fg' }] : [] }
}
const grid = (kindOf) => {
  const rows = []
  for (let r = 0; r < 5; r++) {
    const cells = []
    for (let c = 0; c < 7; c++) { const n = r * 7 + c - 3 + 1; cells.push(n >= 1 && n <= 31 ? cell(String(n), kindOf(n)) : cell('', 'x')) }
    rows.push({ frame: true, name: 'Week', dir: 'HORIZONTAL', gap: C + 'gap', children: cells })
  }
  return rows
}
const header = [
  { frame: true, name: 'Header', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', fillWidth: true, children: [{ text: 'octubre de 2026', style: 'Reading/Heading SM', fill: C + 'fg' }] },
  { frame: true, name: 'Weekdays', dir: 'HORIZONTAL', gap: C + 'gap', children: ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((w) => ({ frame: true, name: 'Wd', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, wvar: C + 'cell-size', children: [{ text: w, style: 'UI/Caption', fill: C + 'weekday' }] })) }]
const comps = []
for (const [name, kindOf, status] of [
  ['State=First day', (n) => (n === 13 ? 'end' : 'n'), 'Inicio: 13 de octubre, elige el último día'],
  ['State=Range', (n) => (n === 13 || n === 20 ? 'end' : n > 13 && n < 20 ? 'mid' : 'n'), 'Del 13 al 20 de octubre']]) {
  comps.push(await H.comp({ name, dir: 'VERTICAL', gap: C + 'gap', p: C + 'padding', radius: C + 'radius', fill: C + 'bg', stroke: C + 'border', sw: 1, swvar: C + 'border-width', children: [...header, ...grid(kindOf), { text: status, style: 'UI/Caption', fill: C + 'weekday' }] }, host))
}
return [H.variants(comps, 'RangeCalendar', host)]
