const T = 'Components/reading-settings/'
const opt = (label, sel) => ({ frame: { name: sel ? 'Option · selected' : 'Option', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: T + 'option-padding-x', minHeightVar: T + 'option-min-height', minHeight: 44, radius: T + 'option-radius', fill: sel ? T + 'option-selected-bg' : T + 'option-bg', stroke: T + 'option-border', sw: T + 'border-width', children: [{ text: label, style: 'UI/Label', fill: sel ? T + 'option-selected-fg' : T + 'option-fg' }] } })
const group = (legend, opts) => ({ frame: { name: legend, gap: T + 'group-gap', children: [{ text: legend, style: 'UI/Overline', fill: T + 'legend' }, { frame: { name: 'Options', dir: 'HORIZONTAL', gap: T + 'group-gap', children: opts } }] } })
const c = await H.comp({ name: 'ReadingSettings', width: 420, pad: T + 'padding', gap: T + 'gap', fill: T + 'bg', stroke: T + 'border', sw: T + 'border-width', radius: T + 'radius', children: [
  group('TAMAÑO DEL TEXTO', [opt('A−', false), opt('100%', true), opt('A+', false)]),
  group('ANCHO DE LÍNEA', [opt('Estrecho', false), opt('Normal', true), opt('Ancho', false)]),
  group('TIPO DE LETRA', [opt('Serif', true), opt('Sans', false)]),
  group('TEMA', [opt('Claro', true), opt('Oscuro', false), opt('Sistema', false)]),
] }, host)
return [c]
