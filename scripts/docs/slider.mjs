// Guidance for the slider page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A value in a range, on the native range input.",
  "use": [
    "For approximate values where precision does not matter: a number of sessions, a size."
  ],
  "avoid": [
    "For exact numbers: use an Input.",
    "Without showing the value."
  ],
  "accessibility": [
    "**Native:** arrow keys, Page Up/Down, Home and End work; `aria-valuetext` reads the formatted value.",
    "**Contrast:** the rail, the filled part and the thumb are each 3:1 or better against the page. The fill is a redundant cue (the thumb position and the printed value carry the meaning), because ink on the rail is only 2.6:1 apart.",
    "**Target:** 44 px tall touch area.",
    "The value is also shown as text next to the slider."
  ],
  "content": [
    "Format the value with its unit: \"4 sesiones\"."
  ],
  "related": [
    "Field",
    "Input"
  ]
}
