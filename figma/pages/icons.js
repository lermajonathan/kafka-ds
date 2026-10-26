// Icons: a visible link to the Phosphor library, in the intro ("Phosphor Icons" is a link) and as its own line under it.
const cols = await figma.variables.getLocalVariableCollectionsAsync()
const sem = cols.find((c) => c.name === 'Semantic')
const vars = (await figma.variables.getLocalVariablesAsync()).filter((v) => v.variableCollectionId === sem.id)
const paint = (n) => { const v = vars.find((x) => x.name === n); if (!v) throw new Error('missing variable ' + n); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', v) }
const styles = await figma.getLocalTextStylesAsync()
const label = styles.find((s) => s.name === 'UI/Label'); await figma.loadFontAsync(label.fontName)

const page = figma.root.children.find((p) => p.name === 'Icons')
await figma.setCurrentPageAsync(page)
const header = page.findOne((n) => n.type === 'FRAME' && n.name === 'Header')
for (const o of header.children.filter((c) => c.name === 'Phosphor link')) o.remove()

// 1. "Phosphor Icons" in the intro paragraph is a link
const intro = header.children.find((c) => c.type === 'TEXT' && c.characters.includes('Phosphor Icons'))
const at = intro.characters.indexOf('Phosphor Icons')
await figma.loadFontAsync(intro.getRangeFontName(at, at + 1))
intro.setRangeHyperlink(at, at + 'Phosphor Icons'.length, { type: 'URL', value: DATA.phosphor })

// 2. its own line, before the weights legend
const row = figma.createAutoLayout('HORIZONTAL'); row.name = 'Phosphor link'; row.itemSpacing = 8; row.counterAxisAlignItems = 'CENTER'; row.fills = []
const t = figma.createText(); t.textStyleId = label.id
const txt = 'Explorar los más de 1.000 íconos en phosphoricons.com'
t.characters = txt; t.fills = [paint('color/fg/link')]; t.textDecoration = 'UNDERLINE'
t.setRangeHyperlink(0, txt.length, { type: 'URL', value: DATA.phosphor })
row.appendChild(t)
const weights = header.children.findIndex((c) => c.name === 'Peso por uso')
header.insertChild(weights, row)
return { id: row.id, index: weights, link: DATA.phosphor }
