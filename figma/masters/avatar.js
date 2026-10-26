const A = 'Components/avatar/'
const px = { sm: 32, md: 48, lg: 64 }
const style = { sm: 'UI/Caption', md: 'UI/Label', lg: 'Reading/Heading SM' }
// Portraits are generated once and their image hashes are kept in the file (shared plugin data), so rebuilding the page keeps them.
const HASHES = JSON.parse(figma.root.getSharedPluginData('kafka.ds', 'avatarPhotos') || '[]')
const photoFill = (i) => (HASHES[i] ? [{ type: 'IMAGE', imageHash: HASHES[i], scaleMode: 'FILL' }] : null)
const comps = []
const dot = (c, size, status) => {
  const d = figma.createEllipse(); d.name = 'Status'; d.resize(12, 12); c.appendChild(d)
  d.layoutPositioning = 'ABSOLUTE'; d.x = px[size] - 12; d.y = px[size] - 12
  d.fills = [H.solid(A + 'status-' + status)]; d.strokes = [H.solid(A + 'ring')]; d.strokeWeight = 2
  d.setBoundVariable('width', H.V.get(A + 'status-size')); d.setBoundVariable('height', H.V.get(A + 'status-size'))
}
const mk = async (name, size, square, status, photo) => {
  const c = await H.comp({ name, dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: px[size], height: px[size], wvar: A + 'size/' + size, hvar: A + 'size/' + size, fill: A + 'bg', radius: square ? A + 'radius-square' : 'Semantic/radius/pill', children: photo === undefined ? [{ text: 'CP', style: style[size], fill: A + 'fg' }] : [] }, host)
  c.clipsContent = true
  if (photo !== undefined) { const f = photoFill(photo); if (f) c.fills = f }
  if (status) dot(c, size, status)
  comps.push(c)
}
for (const s of ['sm', 'md', 'lg']) await mk('Size=' + s[0].toUpperCase() + s.slice(1), s, false, null)
await mk('Shape=Square', 'md', true, null)
for (const st of ['online', 'away', 'busy', 'offline']) await mk('Status=' + st[0].toUpperCase() + st.slice(1), 'md', false, st)
// Photos: three sizes, a square one for organisations, and a photo with presence
await mk('Photo=Small', 'sm', false, null, 0)
await mk('Photo=Medium', 'md', false, null, 1)
await mk('Photo=Large', 'lg', false, null, 2)
await mk('Photo=Online', 'md', false, 'online', 3)
// Group: overlapping photos with a +N chip, each with a ring in the page colour
const ring = (i, size) => ({ frame: true, name: 'Person ' + (i + 1), width: px[size], height: px[size], radius: 'Semantic/radius/pill', stroke: A + 'ring', sw: 2, fill: A + 'bg', children: [] })
const group = await H.comp({ name: 'Group=Photos', dir: 'HORIZONTAL', align: 'CENTER', children: [ring(0, 'md'), ring(1, 'md'), ring(2, 'md'), { frame: true, name: 'More', dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: 48, height: 48, radius: 'Semantic/radius/pill', stroke: A + 'ring', sw: 2, fill: A + 'overflow-bg', children: [{ text: '+2', style: 'UI/Label', fill: A + 'overflow-fg' }] }] }, host)
group.itemSpacing = -12
group.children.slice(0, 3).forEach((n, i) => { const f = photoFill(i); if (f) n.fills = f; n.clipsContent = true })
comps.push(group)
return [H.variants(comps, 'Avatar', host)]
