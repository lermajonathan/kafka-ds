// Guidance for the button-group page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Actions",
  "summary": "Buttons that belong together, with consistent spacing and a name for assistive technology.",
  "use": [
    "For two or more related actions, or a set of toggles such as chips."
  ],
  "avoid": [
    "For unrelated buttons that happen to be close.",
    "As a toolbar with arrow-key navigation: a toolbar is a different pattern."
  ],
  "accessibility": [
    "**Role:** `group` with a required `aria-label`, so screen readers announce what the buttons share.",
    "Tab order follows the DOM; each button keeps its own focus ring.",
    "Wraps instead of overflowing on narrow screens. A joined group does not wrap: keep it to two to four short labels."
  ],
  "content": [
    "Name the group by what it does: \"Acciones de la inscripción\"."
  ],
  "related": [
    "Button",
    "Chip"
  ]
}
