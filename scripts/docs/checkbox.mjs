// Guidance for the checkbox page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A native checkbox with a Kafka box and mark, an optional description and an indeterminate state.",
  "use": [
    "For independent yes/no choices and for choosing several from a list."
  ],
  "avoid": [
    "For an immediate setting: use Switch.",
    "For choosing one of several: use Radio."
  ],
  "accessibility": [
    "**Native input:** Space toggles; it is a real form control.",
    "**Target:** the whole row is the label, at least 44 px tall; the box itself is 24 px.",
    "**Mark:** a check or dash icon, never colour alone.",
    "**Indeterminate:** set on the DOM element, announced as \"mixed\".",
    "**Invalid:** `aria-invalid` and a red border; a message belongs in the surrounding text."
  ],
  "content": [
    "Write the label as the statement the person agrees to."
  ],
  "related": [
    "Radio",
    "Switch"
  ]
}
