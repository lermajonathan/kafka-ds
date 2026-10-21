// Guidance for the reading-progress page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "A thin bar that fills as the reader moves through the text.",
  "use": [
    "At the top of long reads (more than a few screens) to show how much is left."
  ],
  "avoid": [
    "As the only way to know where you are: a table of contents or headings also help.",
    "On short pages.",
    "To show progress of a task such as a form: it is for reading position."
  ],
  "accessibility": [
    "**Role:** `progressbar` with an accessible name, `aria-valuemin`, `aria-valuemax` and `aria-valuenow` (rounded).",
    "**Contrast:** the gold fill is 3:1 against the page (non-text contrast).",
    "**Reduced motion:** the width transition is removed under `prefers-reduced-motion`.",
    "**Performance:** scroll updates are throttled to one per animation frame, with passive listeners."
  ],
  "content": [
    "Give it an accessible name that says what it measures (\"Progreso de lectura\")."
  ],
  "related": [
    "TableOfContents"
  ]
}
