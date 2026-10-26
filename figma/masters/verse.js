const T = 'Components/verse/'
const stanza = (lines) => ({ frame: { name: 'Stanza', children: lines.map((l, i) => ({ frame: { name: 'Verse', pl: i === 1 ? T + 'hanging-indent' : undefined, children: [{ text: l, style: 'Reading/Body', fill: T + 'text', fillW: true }] }, fillW: true })) }, fillW: true })
const c = await H.comp({ name: 'Verse', width: 420, gap: T + 'stanza-gap', children: [
  stanza(['Nace el día sin pedir permiso,', 'y la casa lo recibe con las puertas abiertas de par en par']),
  stanza(['Alguien nombra el agua', 'y el agua se hace cierta.']),
  { text: 'Poema de ejemplo', style: 'UI/Label', fill: T + 'attribution', fillW: true },
] }, host)
return [c]
