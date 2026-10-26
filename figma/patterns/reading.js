// Reading an article: progress and path on top, reading column in the middle, tools in the side rail, next text at the end.
const page = await H.mk({ name: 'Article page', dir: 'VERTICAL', gap: 32, width: 1216, p: 32, fill: 'Semantic/color/bg/page', radius: 'Semantic/radius/card', stroke: 'Semantic/color/border/default', sw: 1, children: [
  { inst: 'ReadingProgress', variant: 'Progress=40', fillW: true },
  { inst: 'Breadcrumbs', variant: 'Depth=3' },
  { frame: true, name: 'Body', dir: 'HORIZONTAL', gap: 48, align: 'MIN', children: [
    { frame: true, name: 'Reading column', dir: 'VERTICAL', gap: 24, width: 660, children: [
      { text: 'La casa de los espejos', style: 'Reading/Title', fill: 'Semantic/color/fg/default', fillWidth: true },
      { frame: true, name: 'Byline', dir: 'HORIZONTAL', gap: 24, align: 'CENTER', children: [{ inst: 'Author', variant: 'Bio=No' }, { inst: 'ReadingTime' }] },
      { inst: 'Prose' },
      { inst: 'PullQuote', variant: 'Attribution=Yes', fillW: true },
      { inst: 'Footnote', variant: 'Kind=Notes', fillW: true },
      { inst: 'Divider', variant: 'Orientation=Horizontal', fillW: true },
      { inst: 'PrevNext', variant: 'Direction=Next, State=Default', fillW: true }] },
    { frame: true, name: 'Side rail', dir: 'VERTICAL', gap: 24, children: [{ inst: 'TableOfContents' }, { inst: 'ReadingSettings' }] }] }] }, host)
return [page]
