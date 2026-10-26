// Catalog: filters on top, a row of cards, then pagination; below, the loading and empty states.
const card = (variant) => ({ inst: 'ProgramCard', variant })
const page = await H.mk({ name: 'Catalog page', dir: 'VERTICAL', gap: 32, width: 1216, p: 32, fill: 'Semantic/color/bg/page', radius: 'Semantic/radius/card', stroke: 'Semantic/color/border/default', sw: 1, children: [
  { text: 'Talleres', style: 'Reading/Title', fill: 'Semantic/color/fg/default' },
  { frame: true, name: 'Filters', dir: 'HORIZONTAL', gap: 16, align: 'CENTER', wrap: true, children: [
    { inst: 'SegmentedControl', variant: 'Size=Md, Active=Mes' },
    { inst: 'Chip', variant: 'State=Selected' }, { inst: 'Chip', variant: 'State=Default' }, { inst: 'Chip', variant: 'State=Default' },
    { inst: 'Select', variant: 'State=Default' }] },
  { frame: true, name: 'Results', dir: 'HORIZONTAL', gap: 24, align: 'MIN', children: [
    { frame: true, name: 'Card A', dir: 'VERTICAL', gap: 12, children: [{ inst: 'Badge', variant: 'Tone=Success' }, card('Highlight=Featured')] },
    { frame: true, name: 'Card B', dir: 'VERTICAL', gap: 12, children: [{ inst: 'Badge', variant: 'Tone=Warning' }, card('Highlight=None')] },
    { frame: true, name: 'Card C', dir: 'VERTICAL', gap: 12, children: [{ inst: 'Badge', variant: 'Tone=Neutral' }, card('Highlight=None')] }] },
  { inst: 'Pagination', variant: 'Page=Middle' },
  { frame: true, name: 'Other states', dir: 'HORIZONTAL', gap: 48, align: 'MIN', children: [
    { frame: true, name: 'Loading', dir: 'VERTICAL', gap: 12, width: 360, children: [{ text: 'Cargando', style: 'UI/Label', fill: 'Semantic/color/fg/muted' }, { inst: 'Skeleton', variant: 'Shape=Block' }] },
    { frame: true, name: 'No results', dir: 'VERTICAL', gap: 12, width: 520, children: [{ text: 'Sin resultados', style: 'UI/Label', fill: 'Semantic/color/fg/muted' }, { inst: 'EmptyState', variant: 'Action=With action' }] }] }] }, host)
return [page]
