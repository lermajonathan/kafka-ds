// Guidance for the badge page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Data display",
  "summary": "A short label for a status or category, with an icon and a border on status tones.",
  "use": [
    "To tell the state of something: \"Inscripciones abiertas\", \"Agotado\", \"Miembros\"."
  ],
  "avoid": [
    "As a button: a badge is not interactive. Use Chip.",
    "For long text: keep it to two or three words.",
    "Colour as the only difference: status tones also carry an icon."
  ],
  "accessibility": [
    "**Not by colour alone:** info, success, warning and danger each have an icon and a 1 px border in the status colour (3:1 against the page).",
    "**Contrast:** text is 4.5:1 or better on its tint, in both modes.",
    "The icon is decorative; the text carries the meaning."
  ],
  "content": [
    "Two or three words, no full stop."
  ],
  "related": [
    "Chip"
  ]
}
