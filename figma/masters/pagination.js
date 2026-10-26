const P = 'Components/pagination/'
const comps = []
const GLYPH = { '‹': 'ChevronLeft', '›': 'ChevronRight', '…': 'More' }
const item = (t, kind) => ({ frame: true, name: kind === 'dis' ? 'Item Disabled' : 'Item', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 44, height: 44, wvar: P + 'item-size', hvar: P + 'item-size', radius: P + 'radius', fill: kind === 'cur' ? P + 'current-bg' : kind === 'hov' ? P + 'hover-bg' : null, children: [GLYPH[t] ? { icon: GLYPH[t], size: 16, fill: kind === 'ell' ? P + 'ellipsis' : P + 'fg' } : { text: t, style: 'UI/Label', fill: kind === 'cur' ? P + 'current-fg' : P + 'fg' }] })
for (const [name, list] of [
  ['Page=First', [['‹', 'dis'], ['1', 'cur'], ['2', 'n'], ['3', 'n'], ['…', 'ell'], ['6', 'n'], ['›', 'n']]],
  ['Page=Middle', [['‹', 'n'], ['1', 'n'], ['…', 'ell'], ['3', 'n'], ['4', 'cur'], ['5', 'n'], ['…', 'ell'], ['9', 'n'], ['›', 'n']]],
  ['Page=Hover', [['‹', 'n'], ['1', 'n'], ['2', 'hov'], ['3', 'cur'], ['4', 'n'], ['…', 'ell'], ['6', 'n'], ['›', 'n']]],
  ['Page=Last', [['‹', 'n'], ['1', 'n'], ['…', 'ell'], ['4', 'n'], ['5', 'n'], ['6', 'cur'], ['›', 'dis']]]]) {
  const c = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', gap: P + 'gap', children: list.map(([t, k]) => item(t, k)) }, host)
  c.findAll((n) => n.name === 'Item Disabled').forEach((n) => n.setBoundVariable('opacity', H.V.get(P + 'disabled-opacity')))
  comps.push(c)
}
return [H.variants(comps, 'Pagination', host)]
