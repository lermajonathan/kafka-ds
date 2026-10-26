// Enrollment: stepper on top; the form on the left; a recap of the workshop and the actions on the right.
const kids = [
  { inst: 'Stepper', variant: 'Current=3', fillW: true },
  { frame: true, name: 'Content', dir: 'HORIZONTAL', gap: 48, align: 'MIN', children: [
    { frame: true, name: 'Form', dir: 'VERTICAL', gap: 24, width: 600, children: [
      { text: 'Pago', style: 'Reading/Heading SM', fill: 'Semantic/color/fg/default' },
      { inst: 'Alert', variant: 'Tone=Warning', fillW: true },
      { inst: 'Field', variant: 'State=Error', fillW: true },
      { text: 'Método de pago', style: 'UI/Label', fill: 'Semantic/color/fg/default' },
      { inst: 'RadioCardGroup', variant: 'State=Selected', fillW: true },
      { inst: 'RadioCardGroup', variant: 'State=Unselected', fillW: true },
      { inst: 'ButtonGroup', variant: 'Orientation=Horizontal' }] },
    { frame: true, name: 'Recap', dir: 'VERTICAL', gap: 24, children: [
      { text: 'Tu taller', style: 'Reading/Heading SM', fill: 'Semantic/color/fg/default' },
      { inst: 'ProgramCard', variant: 'Highlight=Featured, Status=Last spots' }] }] },
  { frame: true, name: 'Feedback', dir: 'HORIZONTAL', gap: 32, align: 'MIN', children: [
    { frame: true, name: 'Toast', dir: 'VERTICAL', gap: 12, children: [{ text: 'Al guardar un paso', style: 'UI/Label', fill: 'Semantic/color/fg/muted' }, { inst: 'Toast', variant: 'Tone=Success' }] },
    { frame: true, name: 'Confirm', dir: 'VERTICAL', gap: 12, children: [{ text: 'Antes de enviar', style: 'UI/Label', fill: 'Semantic/color/fg/muted' }, { inst: 'ConfirmDialog', variant: 'Tone=Default' }] }] }]
const page = await H.mk({ name: 'Enrollment step 3 · Payment', dir: 'VERTICAL', gap: 32, width: 1120, p: 32, fill: 'Semantic/color/bg/page', radius: 'Semantic/radius/card', stroke: 'Semantic/color/border/default', sw: 1, children: kids }, host)
return [page]
