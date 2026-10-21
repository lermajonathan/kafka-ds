// Guidance for the reading-settings page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "The reader's controls: text size, line width, typeface and theme.",
  "use": [
    "On long reads where comfort matters: articles, books, the library."
  ],
  "avoid": [
    "For site-wide preferences: this panel is about the text being read.",
    "With no way to save the choice: tell the user it will reset, or persist the object in your own storage."
  ],
  "accessibility": [
    "**Groups:** each choice is a `fieldset` with a `legend`; options are native radio inputs, so arrow keys and the group semantics are free.",
    "**Size:** minus and plus buttons with accessible names, disabled at the limits, and a live value (\"113%\").",
    "**Targets:** every option is at least 44 px tall.",
    "**Focus:** the ring shows on the visible option, not on the hidden input.",
    "**Theme** is reported but not applied by the component: apply it where you manage the page theme (`data-theme`)."
  ],
  "content": [
    "Keep labels to one or two words."
  ],
  "related": [
    "Prose"
  ]
}
