// Guidance for the stepper page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Navigation",
  "summary": "Shows progress through a sequence of steps.",
  "use": [
    "Multi-step flows such as enrolment and checkout."
  ],
  "avoid": [
    "For free navigation between views: use Tabs."
  ],
  "accessibility": [
    "**Pattern:** an ordered list; the current step is `aria-current=\"step\"`.",
    "Each step has hidden text that says \"paso 2 de 4\" and whether it is done or current, so state is never only colour.",
    "It shows progress; it is not interactive."
  ],
  "content": [
    "Name steps with nouns (\"Pago\"), one or two words."
  ],
  "related": [
    "Tabs",
    "Progress"
  ]
}
