const S = 'Components/spinner/'
const comps = []
const px = { sm: 16, md: 24, lg: 32 }
for (const size of ['sm', 'md', 'lg']) {
  const c = await H.comp({ name: 'Size=' + size[0].toUpperCase() + size.slice(1), dir: 'HORIZONTAL', align: 'CENTER', justify: 'CENTER', width: px[size], height: px[size], wvar: S + 'size/' + size, hvar: S + 'size/' + size, children: [] }, host)
  c.layoutMode = 'NONE'; c.fills = []
  c.resize(px[size], px[size])
  const track = figma.createEllipse(); track.name = 'Track'; track.resize(px[size], px[size])
  track.arcData = { startingAngle: 0, endingAngle: Math.PI * 2, innerRadius: 0.78 }
  track.fills = [H.solid(S + 'track')]
  const arc = figma.createEllipse(); arc.name = 'Arc'; arc.resize(px[size], px[size])
  arc.arcData = { startingAngle: -Math.PI / 2, endingAngle: Math.PI * 0.25, innerRadius: 0.78 }
  arc.fills = [H.solid(S + 'arc')]
  c.appendChild(track); c.appendChild(arc); track.x = 0; track.y = 0; arc.x = 0; arc.y = 0
  track.setBoundVariable('width', H.V.get(S + 'size/' + size)); track.setBoundVariable('height', H.V.get(S + 'size/' + size))
  arc.setBoundVariable('width', H.V.get(S + 'size/' + size)); arc.setBoundVariable('height', H.V.get(S + 'size/' + size))
  comps.push(c)
}
return [H.variants(comps, 'Spinner', host)]
