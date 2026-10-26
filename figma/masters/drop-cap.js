const T = 'Components/drop-cap/'
const c = await H.comp({ name: 'DropCap', width: 560, dir: 'HORIZONTAL', align: 'MIN', gap: T + 'padding-right', children: [
  { text: 'C', style: 'Reading/Dropcap', fill: T + 'fg' },
  { text: 'uando abrió la puerta, la casa ya había empezado a hablar. Eran ruidos pequeños, de tablas que se acomodan y de agua que baja por las paredes.', style: 'Reading/Body', fill: 'Semantic/color/reading/text', fillW: true },
] }, host)
return [c]
