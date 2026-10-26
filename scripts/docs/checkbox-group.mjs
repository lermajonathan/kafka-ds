// Guidance for the checkbox-group page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A list of checkboxes under one question, with an optional \"select all\" that shows the mixed state.",
  "use": [
    "When the reader may choose several options of the same kind: workshops, days, interests.",
    "`selectAll` when the list has four or more options and choosing all is common.",
    "Keep the list in your own state (an array of values); the group is controlled."
  ],
  "avoid": [
    "A single yes/no: use Checkbox.",
    "Exactly one choice: use RadioGroup.",
    "Settings that apply at once: use Switch."
  ],
  "accessibility": [
    "**A `fieldset` with a `legend`** names the group. Hint and error are tied to it with `aria-describedby`; the error is announced politely and has an icon, not only colour.",
    "**\"Seleccionar todos\" is a real checkbox** with the mixed state (`indeterminate`) when only some options are chosen. It skips disabled options.",
    "Each row is at least 44 px high; Space toggles the focused box and Tab goes through them in order.",
    "`required` adds \"(obligatorio)\" to the legend in words."
  ],
  "content": [
    "The legend is the question or the noun (\"Talleres de interés\"), not an instruction."
  ],
  "related": [
    "Checkbox",
    "RadioGroup",
    "Switch"
  ]
}
