const P = 'Components/prose/'
const c = await H.comp({ name: 'Prose', width: 660, gap: P + 'paragraph-gap', children: [
  { text: 'La arquitectura del texto', style: 'Reading/Heading LG', fill: P + 'text', fillW: true },
  { text: 'Un buen comienzo no explica: coloca al lector en una habitación y le deja ver qué hay en ella.', style: 'Reading/Lead', fill: P + 'text-secondary', fillW: true },
  { text: 'La medida de la línea importa tanto como la frase: entre 45 y 75 caracteres, el ojo vuelve al margen izquierdo sin perderse.', style: 'Reading/Body', fill: P + 'text', fillW: true },
  { text: 'Tres ejercicios', style: 'Reading/Heading MD', fill: P + 'text', fillW: true },
  { frame: { name: 'Block quote', pl: P + 'quote-padding', stroke: P + 'quote-rule', sw: { l: P + 'quote-rule-width' }, children: [{ text: 'La puntuación es la respiración del texto.', style: 'Reading/Quote', fill: P + 'text-secondary', fillW: true }] }, fillW: true },
  { frame: { name: 'List item', dir: 'HORIZONTAL', gap: P + 'list-gap', children: [{ text: '•', style: 'Reading/Body', fill: P + 'text' }, { text: 'Describe una cocina sin nombrar ningún objeto que se use para cocinar.', style: 'Reading/Body', fill: P + 'text', fillW: true }] }, fillW: true },
  { rect: true, name: 'Rule', w: 100, h: 1, fill: P + 'rule', fillW: true },
  { text: 'programa del taller', style: 'Reading/Body', fill: P + 'link', fillW: true },
] }, host)
return [c]
