// Guidance for the confirm-dialog page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Overlays",
  "summary": "Asks the reader to confirm an action.",
  "use": [
    "Before actions that are hard to undo."
  ],
  "avoid": [
    "For routine actions that can be undone."
  ],
  "accessibility": [
    "Built on Modal.",
    "In the `danger` tone focus starts on Cancel and a click outside does not close it, so the destructive action takes a deliberate step.",
    "The confirm button repeats the action (\"Eliminar relato\"), not \"Aceptar\"."
  ],
  "content": [
    "Say what will be lost."
  ],
  "related": [
    "Modal"
  ]
}
