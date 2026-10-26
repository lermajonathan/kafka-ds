const L = 'Components/link/'
const comps = []
for (const state of ['Default', 'Hover', 'Visited']) for (const external of [false, true]) {
  const fg = state === 'Hover' ? L + 'fg-hover' : state === 'Visited' ? L + 'fg-visited' : L + 'fg'
  comps.push(await H.comp({ name: 'State=' + state + ', External=' + (external ? 'Yes' : 'No'), dir: 'HORIZONTAL', align: 'CENTER', gap: L + 'icon-gap',
    children: [{ text: 'bases del concurso', style: 'UI/Input', fill: fg, underline: true }, ...(external ? [{ icon: 'External', size: 16, fill: fg }] : [])] }, host))
}
return [H.variants(comps, 'Link', host)]
