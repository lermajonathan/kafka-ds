// Guidance for the inline-edit page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A short text that is edited in place: it looks like text, becomes a field on click and goes back when saved.",
  "use": [
    "To rename or retitle one thing in a page: a draft, a list, a profile line.",
    "Short single-line values.",
    "When saving is cheap and can be undone by editing again."
  ],
  "avoid": [
    "Long or multi-line text: use Textarea in a form.",
    "Several related fields: use a form with a save button.",
    "Values that must be validated before saving, unless the page validates in `onChange`."
  ],
  "accessibility": [
    "**A real button first.** It shows the value and carries a hidden \"Editar {campo}\" so screen readers know what it does.",
    "**Enter saves, Escape cancels, and focus returns to the button.** Leaving the field with Tab or a click also saves.",
    "**The pencil is always visible,** not only on hover, so touch and keyboard users see that it edits.",
    "The field is named by `label`. The button and the field are at least 44 px high."
  ],
  "content": [
    "`label` names what is edited (\"Título del relato\"). It is read, not shown."
  ],
  "related": [
    "Input",
    "Field",
    "Textarea"
  ]
}
