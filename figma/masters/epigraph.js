const T = 'Components/epigraph/'
const c = await H.comp({ name: 'Epigraph', width: 520, pl: T + 'offset', gap: T + 'gap', align: 'MAX', children: [
  { text: 'Todo comienzo es una promesa que el final tendrá que cumplir.', style: 'Reading/Quote', fill: T + 'text', fillW: true, align: 'RIGHT' },
  { text: 'Texto de ejemplo', style: 'UI/Caption', fill: T + 'attribution', fillW: true, align: 'RIGHT' },
] }, host)
return [c]
