// Guidance for the input page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A one-line text field, 44 px tall, 16 px text and a 3:1 border.",
  "use": [
    "For short free text: names, emails, codes."
  ],
  "avoid": [
    "For long text: use Textarea.",
    "For choosing among known options: use Select, Radio or Checkbox.",
    "A placeholder as the label."
  ],
  "accessibility": [
    "**Size:** 44 px tall; 16 px text, so iOS does not zoom the page on focus.",
    "**Border:** 3:1 against the page in both modes (WCAG 1.4.11).",
    "**Invalid:** `aria-invalid` turns the border red; with a Field the error message appears too.",
    "**Autofill:** pass `autoComplete` and `type` (email, tel, search): they open the right keyboard and help password managers."
  ],
  "content": [
    "Placeholders show an example, never an instruction."
  ],
  "related": [
    "Field",
    "Textarea"
  ]
}
