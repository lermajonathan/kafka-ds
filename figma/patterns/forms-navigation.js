// The frame around every screen: navigation on the left; breadcrumbs, tabs and the form on the right; notifications below.
const page = await H.mk({ name: 'Account settings', dir: 'VERTICAL', gap: 32, width: 1216, p: 32, fill: 'Semantic/color/bg/page', radius: 'Semantic/radius/card', stroke: 'Semantic/color/border/default', sw: 1, children: [
  { frame: true, name: 'Shell', dir: 'HORIZONTAL', gap: 48, align: 'MIN', children: [
    { inst: 'NavMenu', variant: 'State=Group open' },
    { frame: true, name: 'Main', dir: 'VERTICAL', gap: 24, width: 700, children: [
      { frame: true, name: 'Top bar', dir: 'HORIZONTAL', gap: 16, align: 'CENTER', justify: 'SPACE_BETWEEN', width: 700, children: [{ inst: 'Breadcrumbs', variant: 'Depth=3' }, { inst: 'ThemeToggle', variant: 'Mode=Sistema' }] },
      { inst: 'Tabs', variant: 'Selected=Resumen', fillW: true },
      { text: 'Verifica tu correo', style: 'Reading/Heading SM', fill: 'Semantic/color/fg/default' },
      { inst: 'Field', variant: 'State=Hint', fillW: true },
      { inst: 'PinInput', variant: 'State=Invalid' },
      { inst: 'FileUpload', variant: 'State=Default', fillW: true },
      { inst: 'ConfirmDialog', variant: 'Tone=Danger' }] }] },
  { frame: true, name: 'Notifications', dir: 'VERTICAL', gap: 12, children: [{ text: 'Novedades y recordatorios', style: 'UI/Label', fill: 'Semantic/color/fg/muted' }, { inst: 'NotificationCenter', variant: 'State=Unread' }] }] }, host)
return [page]
