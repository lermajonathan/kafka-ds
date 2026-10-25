const F = 'Components/footnote/'
const call = await H.comp({ name: 'Kind=Call', width: 24, height: 24, wvar: F + 'ref-size', hvar: F + 'ref-size', radius: F + 'ref-radius', align: 'CENTER', justify: 'CENTER', dir: 'HORIZONTAL', children: [{ text: '1', style: 'UI/Caption', fill: F + 'ref-fg' }] }, host)
const row = (n, t) => ({ frame: { name: 'Note ' + n, dir: 'HORIZONTAL', gap: F + 'gap', align: 'CENTER', children: [
  { text: n + '.', style: 'Reading/Footnote', fill: F + 'text', w: 24 },
  { text: t, style: 'Reading/Footnote', fill: F + 'text', fillW: true },
  { icon: 'BackToText', size: 16, fill: F + 'ref-fg' } ] }, fillW: true })
const notes = await H.comp({ name: 'Kind=Notes', width: 520, pt: F + 'padding-top', gap: F + 'gap', stroke: F + 'rule', sw: { t: F + 'rule-width' }, children: [
  row(1, 'Los cuentos se envían por correo una semana antes de cada sesión.'),
  row(2, 'Los fragmentos se leen en voz alta durante la clase.') ] }, host)
return [H.variants([call, notes], 'Footnote', host)]
