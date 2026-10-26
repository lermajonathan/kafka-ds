// Guidance for the tooltip page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Overlays",
  "summary": "A short label that describes a control on focus or hover.",
  "use": [
    "To add a brief description to an icon button."
  ],
  "avoid": [
    "For essential information: put it in the page.",
    "For interactive content: use Popover.",
    "On touch-only features: hover doesn't exist there."
  ],
  "accessibility": [
    "**Pattern:** `role=\"tooltip\"` linked with `aria-describedby`, so it is read as a description.",
    "It shows on keyboard focus and after a short hover delay; Esc hides it; the pointer can move onto it (WCAG 1.4.13).",
    "It never holds links or buttons.",
    "**Arrow:** it always points at the centre of the control, on any side (`top`, `bottom`, `left`, `right`). When there is no room the tooltip flips to the opposite side and the arrow follows."
  ],
  "content": [
    "One short sentence, no full stop needed."
  ],
  "related": [
    "Icon button",
    "Popover"
  ]
}
