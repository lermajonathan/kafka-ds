// Guidance for the divider page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Layout",
  "summary": "A line that separates content, with or without a label.",
  "use": [
    "To split two groups that belong to the same page: sections of a form, \"o continúa con\".",
    "Vertical between inline items such as \"Taller | Poesía | Jueves\"."
  ],
  "avoid": [
    "As spacing: use space, not a line.",
    "Between every item of a list: whitespace is quieter."
  ],
  "accessibility": [
    "**A real `<hr>`** when horizontal, so screen readers announce a separator. `decorative` removes the role when the line only adds ornament.",
    "With a `label` the two rules are hidden from assistive technology and the text is read as normal content.",
    "The rule is decorative contrast-wise (1 px, `border.default`); the meaning never depends on seeing it."
  ],
  "content": [
    "Labels are two or three words in lower case: \"o continúa con\"."
  ],
  "related": [
    "Card"
  ]
}
