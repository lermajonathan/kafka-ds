// Guidance for the field page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "Connects a label, a hint and an error to the control inside it.",
  "use": [
    "Around every Input, Textarea, Select, Slider, PinInput, TagInput or FileUpload."
  ],
  "avoid": [
    "Without a label: a placeholder is not a label.",
    "Hiding the label for looks: if the design cannot show it, name the control with `aria-label`."
  ],
  "accessibility": [
    "**Label:** a real `<label for>` pointing at the control, so clicking it focuses the field.",
    "**Description:** hint and error are linked with `aria-describedby`.",
    "**Invalid:** an error sets `aria-invalid` on the control and is announced politely (a live region). The error has an icon as well as colour.",
    "**Required:** the label says \"(obligatorio)\" in text and the control gets `aria-required`; an asterisk alone is not enough."
  ],
  "content": [
    "Say what to type, not what the field is: \"Te escribiremos aquí para confirmar\".",
    "Write the error as a fix: \"Escribe solo números, sin puntos.\""
  ],
  "related": [
    "Input",
    "Textarea",
    "Select"
  ]
}
