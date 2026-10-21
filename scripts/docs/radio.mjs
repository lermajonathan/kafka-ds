// Guidance for the radio page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A group of options of which one is chosen, with a fieldset and legend.",
  "use": [
    "When people must pick exactly one of two to five options."
  ],
  "avoid": [
    "For many options: use Select.",
    "Without a legend: the question is what names the group."
  ],
  "accessibility": [
    "**Group:** `fieldset` with `legend`; the description and error are read with the group.",
    "**Keyboard:** arrow keys move and select; Tab enters and leaves the group (native).",
    "**Target:** each row is at least 44 px tall.",
    "**Mark:** a filled dot, not only colour."
  ],
  "content": [
    "Make options mutually exclusive and complete."
  ],
  "related": [
    "Checkbox",
    "Select"
  ]
}
