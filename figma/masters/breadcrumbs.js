const B = 'Components/breadcrumbs/'
const comps = []
const crumb = (t, kind) => ({ frame: true, name: 'Crumb', dir: 'HORIZONTAL', align: 'CENTER', minHeight: 44, minHeightVar: B + 'min-height', children: [{ text: t, style: 'UI/Label', fill: kind === 'cur' ? B + 'current' : kind === 'hov' ? B + 'fg-hover' : B + 'fg' }] })
const sep = { text: '/', style: 'UI/Label', fill: B + 'separator' }
for (const [name, list] of [
  ['Depth=2', [['Inicio', 'n'], ['Educación', 'cur']]],
  ['Depth=3', [['Inicio', 'n'], ['Educación', 'n'], ['La arquitectura del texto', 'cur']]],
  ['Depth=3 Hover', [['Inicio', 'hov'], ['Educación', 'n'], ['La arquitectura del texto', 'cur']]]]) {
  const kids = []
  list.forEach(([t, k], i) => { if (i) kids.push(sep); kids.push(crumb(t, k)) })
  comps.push(await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', gap: B + 'gap', children: kids }, host))
}
return [H.variants(comps, 'Breadcrumbs', host)]
