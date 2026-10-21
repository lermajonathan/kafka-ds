// Guidance for the tag-input page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "Free-form tags that are typed and removed, each with its own button.",
  "use": [
    "For a list of short free-text values: genres, topics, keywords."
  ],
  "avoid": [
    "For choosing from a closed list: use checkboxes or a select."
  ],
  "accessibility": [
    "**Keyboard:** Enter or comma adds, Backspace on an empty field removes the last, Tab reaches each remove button.",
    "**Announcements:** additions and removals are read through a polite live region.",
    "**Targets:** each tag and its remove button are 44 px tall.",
    "**Names:** remove buttons say \"Quitar poesía\", not just \"Quitar\"."
  ],
  "content": [
    "Tell people which keys add a tag."
  ],
  "related": [
    "Field",
    "Chip"
  ]
}
