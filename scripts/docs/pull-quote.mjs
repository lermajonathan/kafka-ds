// Guidance for the pull-quote page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "A quotation set apart from the text with a gold rule, in the reading typeface and italic.",
  "use": [
    "To lift one memorable line out of a long text, or to quote a source at length.",
    "At most one or two per article; they are a pause, not a rhythm."
  ],
  "avoid": [
    "As a replacement for the original sentence: if it is only in the pull quote, a reader who skips it misses it. Repeat, do not move.",
    "For testimonials with a photo and a name: use a card.",
    "Gold text. The rule is gold (3:1 border gold); the words stay ink."
  ],
  "accessibility": [
    "**Semantics:** `figure` with a `blockquote`, and a `figcaption` for the attribution. `cite` carries the source URL.",
    "**Contrast:** quote and attribution are 7:1; the rule is 3:1 against the page (non-text contrast).",
    "Screen readers announce it as a figure with a caption; the dash before the author is decorative text and reads as a pause."
  ],
  "content": [
    "Keep it under about 20 words.",
    "Attribute with a name and, if useful, a work: \"Cuaderno de clase, 2026\"."
  ],
  "related": [
    "Prose",
    "Epigraph"
  ]
}
