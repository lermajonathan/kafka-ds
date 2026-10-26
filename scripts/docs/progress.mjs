// Guidance for the progress page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Feedback",
  "summary": "A bar showing how far a task has got.",
  "use": [
    "Uploads, imports and multi-step jobs where you know the percentage."
  ],
  "avoid": [
    "Unknown duration: use Spinner.",
    "Where the reader is in an article: use ReadingProgress.",
    "Steps the reader can go back to: use Stepper."
  ],
  "accessibility": [
    "**`role=\"progressbar\"`** with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. `label` is required: a bar without a name is just a number.",
    "`valueText` gives screen readers a readable value such as \"Paso 2 de 5\".",
    "The fill is 3:1 against the track in every tone and both modes; the tone never carries the meaning alone.",
    "The fill animates smoothly and snaps under reduced motion."
  ],
  "content": [
    "The label says what is progressing (\"Subiendo inscripciones.csv\"), not \"Progreso\"."
  ],
  "related": [
    "Spinner",
    "Stepper",
    "ReadingProgress"
  ]
}
