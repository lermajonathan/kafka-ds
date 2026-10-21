// Guidance for the Button page. Props and examples are generated from the source; this file holds the human part.
export default {
  category: 'Actions',
  summary: 'Starts an action: sending a form, enrolling, moving to the next step. Gold primary, soft and outline variants, at least 44 px tall.',
  use: [
    'For the one action you most want the reader to take (primary), and for secondary actions next to it (soft, outline).',
    'For actions that happen on the page or submit a form. If it only navigates somewhere else, use a link.',
  ],
  avoid: [
    'More than one primary button in a view: when everything is loud, nothing is.',
    'As a link. Navigation is `<a>`; a button that changes the URL breaks the back button and "open in a new tab".',
    'Gold text on paper. The gold is a surface for the primary button (with ink text, 8.3:1), never a text colour on paper (1.98:1).',
  ],
  accessibility: [
    '**Native `<button>`.** Enter and Space activate it; `type="button"` by default so it never submits a form by accident.',
    '**Focus ring** on keyboard focus only: a 3 px solid outline, offset 2 px, from the `focus.*` tokens (3:1 against both page and surface).',
    '**Target size** of at least 44 px tall, above the 24 px WCAG 2.5.8 minimum.',
    '**Contrast** of every label, in every state and in both modes, is checked by `tests/contrast.mjs` (primary 8.3:1).',
    '**Disabled** buttons leave the tab order and drop to `opacity.disabled` (0.45). Do not use disabled to explain why something is unavailable: say it in text.',
    '**Loading** sets `aria-busy`, disables the button and appends a visually hidden "Loading" (localised through `KafkaProvider`). The label stays visible so the layout does not jump.',
    '**Icons** are decorative: they are `aria-hidden`, and the label carries the meaning.',
    '**Reduced motion:** the spinner slows down under `prefers-reduced-motion`.',
  ],
  content: [
    'Start with a verb: "Inscribirme", "Enviar relato", "Ver programa". Avoid "Aceptar" and "Click aquí".',
    'Keep it to one to three words; the surrounding text explains the rest.',
    'In Spanish, prefer the first person for commitments ("Inscribirme") and the imperative for neutral actions ("Ver programa").',
  ],
  related: [],
}
