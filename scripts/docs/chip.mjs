// Guidance for the chip page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A toggle for filtering a list: a button with `aria-pressed` and a check when selected.",
  "use": [
    "For filters and quick choices that toggle on and off."
  ],
  "avoid": [
    "For navigation: use links or tabs.",
    "For choosing one of several: use a radio group or a segmented control."
  ],
  "accessibility": [
    "**State:** `aria-pressed` is announced as \"pressed\"; a selected chip also shows a check, so it does not depend on colour.",
    "**Target:** at least 44 px tall.",
    "**Focus ring** and contrast for every state, in both modes.",
    "Group several in a `ButtonGroup` with a label."
  ],
  "content": [
    "One or two words."
  ],
  "related": [
    "ButtonGroup",
    "Badge"
  ]
}
