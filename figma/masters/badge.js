const B = 'Components/badge/'
const comps = []
const rows = [['Neutral', null, 'Taller'], ['Brand', 'Crown', 'Miembros'], ['Info', 'Info', 'Próximamente'], ['Success', 'Success', 'Inscripciones abiertas'], ['Warning', 'Warning', 'Últimos cupos'], ['Danger', 'Danger', 'Agotado']]
for (const [tone, icon, label] of rows) {
  const t = tone.toLowerCase()
  const bordered = ['info', 'success', 'warning', 'danger'].includes(t)
  comps.push(await H.comp({ name: 'Tone=' + tone, dir: 'HORIZONTAL', align: 'CENTER', gap: B + 'gap', px: B + 'padding-x', py: B + 'padding-y', radius: B + 'radius', fill: B + t + '/bg', stroke: bordered ? B + t + '/border' : null, sw: 1, swvar: B + 'border-width',
    children: [...(icon ? [{ icon, size: 14, fill: B + t + '/fg' }] : []), { text: label, style: 'UI/Caption', fill: B + t + '/fg' }] }, host))
}
return [H.variants(comps, 'Badge', host)]
