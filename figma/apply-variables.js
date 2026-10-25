// Applies one chunk (figma/chunks/*.json) with `use_figma`. Idempotent: updates variables by name, creates the missing ones.
// Usage: paste the chunk JSON into DATA. Aliases to variables that do not exist yet come back in `missing`; run that chunk again once the others are in.
const DATA = /* paste chunk JSON here */ {}
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255, a: h.length > 7 ? parseInt(h.slice(7, 9), 16) / 255 : 1 })
const TYPES = { C: 'COLOR', F: 'FLOAT', S: 'STRING' }
const cols = await figma.variables.getLocalVariableCollectionsAsync()
let col = cols.find((c) => c.name === DATA.collection) ?? figma.variables.createVariableCollection(DATA.collection)
DATA.modes.forEach((m, i) => {
  if (col.modes[i]) { if (col.modes[i].name !== m) col.renameMode(col.modes[i].modeId, m) } else col.addMode(m)
})
const modeId = Object.fromEntries(col.modes.map((m) => [m.name, m.modeId]))
const all = await figma.variables.getLocalVariablesAsync()
const colName = Object.fromEntries(cols.map((c) => [c.id, c.name])); colName[col.id] = col.name
const byRef = new Map(all.map((v) => [`${colName[v.variableCollectionId]}/${v.name}`, v]))
const created = [], updated = [], missing = [], conflicts = []
for (const [name, t, scopes, light, dark, desc] of DATA.rows) {
  const ref = `${col.name}/${name}`
  let v = byRef.get(ref)
  if (v && v.resolvedType !== TYPES[t]) { conflicts.push(ref); continue }
  if (!v) { v = figma.variables.createVariable(name, col, TYPES[t]); byRef.set(ref, v); created.push(name) } else updated.push(name)
  v.scopes = scopes ? scopes.split(',') : []
  v.setVariableCodeSyntax('WEB', `var(--kafka-${name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/\//g, '-')})`)
  if (desc) v.description = desc
  const modes = DATA.modes
  const vals = [light, dark === null || dark === undefined ? light : dark]
  modes.forEach((m, i) => {
    const raw = vals[Math.min(i, 1)]
    if (typeof raw === 'string' && raw.startsWith('@')) {
      const target = byRef.get(raw.slice(1))
      if (!target) { missing.push(`${ref} → ${raw.slice(1)}`); return }
      v.setValueForMode(modeId[m], figma.variables.createVariableAlias(target))
    } else v.setValueForMode(modeId[m], t === 'C' ? hex(raw) : raw)
  })
}
return { collection: col.id, modes: col.modes.map((m) => m.name), created: created.length, updated: updated.length, missing, conflicts }
