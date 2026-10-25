const C = 'Components/card/'
const B = 'Components/button/'
const FG = 'Semantic/color/fg/default'
const comps = []
const styles = await figma.getLocalEffectStylesAsync()
const eff = styles.find((s) => /^Shadow\/md$/.test(s.name))
for (const [name, hl, title, text] of [
  ['Highlight=None', 'none', 'Taller de poesía', 'Diez sesiones para escribir y revisar tus propios poemas.'],
  ['Highlight=Featured', 'featured', 'Taller de narrativa', 'Inscripciones abiertas hasta el viernes.'],
  ['Highlight=VIP', 'vip', 'Membresía anual', 'Acceso a todos los talleres y laboratorios del año.']]) {
  const vip = hl === 'vip', feat = hl === 'featured'
  const kids = [
    { text: title, style: 'Reading/Heading SM', fill: vip ? B + 'vip/fg' : FG, fillWidth: true },
    { text: text, style: 'Reading/Body', fill: vip ? B + 'vip/fg' : FG, fillWidth: true }]
  if (vip) kids.push({ frame: true, name: 'Action', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', px: B + 'padding-x', radius: B + 'radius', minHeight: 44, minHeightVar: B + 'min-height', fillWidth: true, fill: B + 'primary/bg', children: [{ text: 'Hacerme miembro', style: 'UI/Button', fill: B + 'primary/fg' }] })
  const c = await H.comp({ name, dir: 'VERTICAL', gap: C + 'gap', p: C + 'padding', radius: C + 'radius', width: 360, fill: vip ? B + 'vip/bg' : C + 'bg', stroke: feat ? C + 'featured/border' : C + 'border', sw: 1, swvar: feat ? C + 'featured/border-width' : C + 'border-width', children: kids }, host)
  if (eff) await c.setEffectStyleIdAsync(eff.id)
  comps.push(c)
}
return [H.variants(comps, 'Card', host)]
