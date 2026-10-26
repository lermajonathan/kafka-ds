const T = 'Components/toc/'
const item = (label, current, level2) => ({ frame: { name: current ? 'Item · current' : 'Item', dir: 'HORIZONTAL', align: 'CENTER', pl: level2 ? 40 : T + 'padding-x', pr: T + 'padding-x', minHeightVar: T + 'min-height', minHeight: 44, stroke: current ? T + 'current-rule' : T + 'rule', sw: { l: T + 'rule-width' }, children: [{ text: label, style: current ? 'UI/Button' : 'UI/Label', fill: current ? T + 'current' : T + 'link', fillW: true }] }, fillW: true })
const c = await H.comp({ name: 'TableOfContents', width: 280, gap: 4, children: [
  { text: 'EN ESTA PÁGINA', style: 'UI/Overline', fill: T + 'title', fillW: true },
  item('Introducción', false), item('El método', true), item('Ejercicios', false, true), item('Cierre', false) ] }, host)
return [c]
