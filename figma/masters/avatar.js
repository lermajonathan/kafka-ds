const A = 'Components/avatar/'
const px = { sm: 32, md: 48, lg: 64 }
const style = { sm: 'UI/Caption', md: 'UI/Label', lg: 'Reading/Heading SM' }
const comps = []
const mk = async (name, size, square, status) => {
  const c = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: px[size], height: px[size], wvar: A + 'size/' + size, hvar: A + 'size/' + size, fill: A + 'bg', radius: square ? A + 'radius-square' : 'Semantic/radius/pill', children: [{ text: 'CP', style: style[size], fill: A + 'fg' }] }, host)
  if (status) {
    const d = figma.createEllipse(); d.name = 'Status'; d.resize(12, 12); c.appendChild(d)
    d.layoutPositioning = 'ABSOLUTE'; d.x = px[size] - 12; d.y = px[size] - 12
    d.fills = [H.solid(A + 'status-' + status)]; d.strokes = [H.solid(A + 'ring')]; d.strokeWeight = 2
    d.setBoundVariable('width', H.V.get(A + 'status-size')); d.setBoundVariable('height', H.V.get(A + 'status-size'))
  }
  comps.push(c)
}
for (const s of ['sm', 'md', 'lg']) await mk('Size=' + s[0].toUpperCase() + s.slice(1), s, false, null)
await mk('Shape=Square', 'md', true, null)
for (const st of ['online', 'away', 'busy', 'offline']) await mk('Status=' + st[0].toUpperCase() + st.slice(1), 'md', false, st)
return [H.variants(comps, 'Avatar', host)]
