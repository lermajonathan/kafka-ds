// Guidance for the drop-cap page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "A paragraph whose first letter is a large gold initial, made with CSS so the text stays one ordinary paragraph.",
  "use": [
    "Once, at the start of a long text, to mark the entrance."
  ],
  "avoid": [
    "More than once per text, or on short texts: it stops marking a beginning.",
    "On a paragraph that starts with a number or a symbol.",
    "Inside a narrow column (under about 30 characters): the initial takes too much of the line."
  ],
  "accessibility": [
    "**Assistive tech:** nothing is added or split: the paragraph reads exactly as written, because the initial is `::first-letter`, not a separate element.",
    "**Contrast:** the initial is 4.5:1 or better on the page (it is large text) in both modes.",
    "Opening quotes or dashes before the first letter are included in the initial by the browser."
  ],
  "content": [
    "Start with a full word, not a single-letter word, so the initial is not read as a word of its own."
  ],
  "related": [
    "Prose"
  ]
}
