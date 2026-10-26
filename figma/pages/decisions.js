// Decisions: every card is lifted (Shadow/md = elevation.card) and the DDRs added since the page was built (013…019) are appended.
const effect = (await figma.getLocalEffectStylesAsync()).find((s) => s.name === 'Shadow/md')
if (!effect) throw new Error('missing effect style Shadow/md')
const page = figma.root.children.find((p) => p.name === 'Decisions')
await figma.setCurrentPageAsync(page)
const root = page.children.find((c) => c.name === 'Kafka · Decisiones')
root.clipsContent = false // a shadow reaches past the card: the page must not cut it
const grid = root.findOne((n) => n.type === 'FRAME' && n.name === 'Decisiones')
for (const c of grid.children.filter((c) => DATA.newDdrs.some((d) => d.id === c.name))) c.remove()
const base = grid.children[grid.children.length - 1]

const setText = async (node, text) => {
  for (const seg of node.getStyledTextSegments(['fontName'])) await figma.loadFontAsync(seg.fontName)
  node.characters = text; node.name = text.slice(0, 40)
}
const added = []
for (const d of DATA.newDdrs) {
  const card = base.clone(); grid.appendChild(card); card.name = d.id
  const meta = card.children[0]
  await setText(meta.children[0], d.id); await setText(meta.children[1], d.status)
  await setText(card.children[1], d.title); await setText(card.children[2], d.body); await setText(card.children[3], d.note)
  added.push(card.id)
}
let lifted = 0
for (const c of grid.children) { await c.setEffectStyleIdAsync(effect.id); lifted++ }
return { added: added.length, lifted, cards: grid.children.length, h: Math.round(root.height) }
