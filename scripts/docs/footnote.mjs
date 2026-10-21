// Guidance for the footnote page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "A numbered call in the text, a list of notes at the end, and a link back from each note.",
  "use": [
    "For sources, asides and clarifications that would interrupt the sentence.",
    "In long texts that will be read on screen and cited."
  ],
  "avoid": [
    "For essential information: if the reader must know it, it belongs in the text.",
    "For many notes in a short text: the back-and-forth costs more than the note.",
    "Numbering by hand in two places: use the same `n` and `idPrefix` on the call and the item."
  ],
  "accessibility": [
    "**Call:** a link with an accessible name (\"Nota 1\") that jumps to the note. It is 24 px square, which meets WCAG 2.5.8 (inline links in a sentence are exempt from the 44 px target of other controls); its hover state is token-backed.",
    "**Note:** a `doc-endnotes` section named \"Notas\" (not an `aside`, which would nest a landmark inside the article), with an ordered list.",
    "**Back link:** each note ends with a 44 px link named \"Volver al texto\" that returns focus to the call.",
    "**Target:** the note you jumped to is highlighted (`:target`), with 7:1 contrast."
  ],
  "content": [
    "Put the call after the punctuation or the word it refers to, with no space before it.",
    "Keep each note to one or two sentences."
  ],
  "related": [
    "Prose"
  ]
}
