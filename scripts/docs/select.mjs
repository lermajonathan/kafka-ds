// Guidance for the select page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A native select with the Kafka field look.",
  "use": [
    "For choosing one of up to about a dozen known options."
  ],
  "avoid": [
    "For searchable or very long lists: use a combobox (H4).",
    "For two or three options: radios show them all at once."
  ],
  "accessibility": [
    "**Native:** keyboard, type-ahead and screen reader behaviour come from the platform; on phones it opens the system picker.",
    "**Target and border** as Input.",
    "The chevron is decorative and does not intercept clicks."
  ],
  "content": [
    "Start with a disabled placeholder option only if the field is required."
  ],
  "related": [
    "Field",
    "Radio"
  ]
}
