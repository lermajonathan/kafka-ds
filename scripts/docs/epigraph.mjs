// Guidance for the epigraph page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "A short quotation that opens a text, set to the right in a softer tone.",
  "use": [
    "To open an essay, a story or a chapter with one or two lines from another writer."
  ],
  "avoid": [
    "For a quotation in the middle of the text: use `PullQuote` or a block quote.",
    "For more than two or three lines: it stops being an epigraph."
  ],
  "accessibility": [
    "**Semantics:** `figure`, `blockquote` and `figcaption`.",
    "**Contrast:** the text and the attribution are 4.5:1 or better in both modes (softer than body text, by design, and still passing).",
    "The softer tone is the only difference from body text; the size stays at the reading quote size."
  ],
  "content": [
    "Attribute with the author and, when it helps, the work.",
    "Credit the translator if the quotation is translated."
  ],
  "related": [
    "PullQuote",
    "Verse"
  ]
}
