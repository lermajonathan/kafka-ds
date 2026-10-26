// Guidance for the empty-state page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Feedback",
  "summary": "What to show when there is nothing to show yet: what is missing and the one next step.",
  "use": [
    "A list, search or section with no items: no enrollments yet, no results.",
    "With one action when there is something the reader can do about it."
  ],
  "avoid": [
    "As an error: if something failed, use Alert.",
    "Several actions: one next step is clearer.",
    "An icon as the only message."
  ],
  "accessibility": [
    "**The title is a real heading**, level 2 by default; set `headingLevel` so it fits the page outline.",
    "The icon is decorative and hidden from assistive technology; title and description carry the message (4.5:1 in both modes).",
    "The action is a normal button or link, with its 44 px target."
  ],
  "content": [
    "Title says what is missing (\"Aún no tienes inscripciones\"). Description says why and what happens next."
  ],
  "related": [
    "Alert",
    "Skeleton"
  ]
}
