const T = 'Components/author/'
const avatar = { frame: { name: 'Avatar', dir: 'HORIZONTAL', width: 48, height: 48, wvar: T + 'avatar-size', hvar: T + 'avatar-size', align: 'CENTER', justify: 'CENTER', fill: T + 'avatar-bg', radius: T + 'avatar-radius', children: [{ text: 'GR', style: 'UI/Label', fill: T + 'avatar-fg' }] } }
const byline = { frame: { name: 'Byline', children: [{ text: 'Gabriel Rodríguez', style: 'UI/Label', fill: T + 'name', fillW: true }, { text: 'Director de Altazor', style: 'UI/Caption', fill: T + 'role', fillW: true }] }, fillW: true }
const a = await H.comp({ name: 'Bio=No', width: 360, dir: 'HORIZONTAL', align: 'CENTER', gap: T + 'gap', children: [avatar, byline] }, host)
const b = await H.comp({ name: 'Bio=Yes', width: 360, gap: T + 'gap', children: [
  { frame: { name: 'Header', dir: 'HORIZONTAL', align: 'CENTER', gap: T + 'gap', children: [avatar, byline] }, fillW: true },
  { text: 'Escritor y tallerista. Dirige Altazor, un espacio de escritura creativa.', style: 'UI/Caption', fill: T + 'bio', fillW: true } ] }, host)
return [H.variants([a, b], 'Author', host)]
