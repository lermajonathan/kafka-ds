// Guidance for the icon-button page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Actions",
  "summary": "A button with only an icon, 44 × 44 px, always named by a required label.",
  "use": [
    "For familiar, repeated actions: close, share, previous, next."
  ],
  "avoid": [
    "When the meaning is not obvious from the icon alone: use a Button with text.",
    "Without a `label`: the type requires it, because an unnamed button is unusable with a screen reader."
  ],
  "accessibility": [
    "**Name:** `label` becomes `aria-label`; the icon is `aria-hidden`.",
    "**Target:** 44 × 44 px, above the 24 px WCAG 2.5.8 minimum.",
    "**Focus ring** and the same variant colours as Button, with the same checked contrast.",
    "Disabled buttons leave the tab order."
  ],
  "content": [
    "Use a verb or a short phrase: \"Cerrar\", \"Compartir\"."
  ],
  "related": [
    "Button"
  ]
}
