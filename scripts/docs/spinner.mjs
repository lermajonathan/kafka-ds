// Guidance for the spinner page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Feedback",
  "summary": "Progress with no known duration.",
  "use": [
    "A short wait whose length you can't tell: loading a section, saving.",
    "Inside a region that updates; use Skeleton when the layout is known."
  ],
  "avoid": [
    "When you know the percentage: use Progress.",
    "Inside a button: use the Button's loading state."
  ],
  "accessibility": [
    "**A `role=\"status\"` with a text name** (\"Cargando\"), so it is announced; pass `label` for something more specific.",
    "**Reduced motion:** it turns slowly instead of stopping, so it still reads as \"in progress\".",
    "The arc is 3:1 against the page and against a surface, in both modes."
  ],
  "content": [
    "The label says what is happening: \"Guardando tu inscripción…\"."
  ],
  "related": [
    "Progress",
    "Skeleton",
    "Button"
  ]
}
