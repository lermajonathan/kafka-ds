// Guidance for the popover page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Overlays",
  "summary": "A small non-modal panel anchored to a button.",
  "use": [
    "For extra controls or information that belong to one button, such as filters."
  ],
  "avoid": [
    "For anything that must be answered first: use Modal.",
    "For a short hint: use Tooltip.",
    "For a list of actions: use Menu."
  ],
  "accessibility": [
    "**Pattern:** the button gets `aria-expanded` and `aria-controls`; the panel is `role=\"dialog\"` in the top layer.",
    "**Keyboard:** opening moves focus to the first control; Esc closes and returns focus to the button; moving focus out closes it.",
    "A click outside closes it without stealing focus."
  ],
  "content": [
    "Keep it short; if it needs scrolling, use a Drawer."
  ],
  "related": [
    "Menu",
    "Modal",
    "Tooltip"
  ]
}
