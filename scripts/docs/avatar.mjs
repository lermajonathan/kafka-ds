// Guidance for the avatar page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Data display",
  "summary": "A person or entity as an image or initials, with an optional presence status. `AvatarGroup` overlaps several with a +N chip.",
  "use": [
    "To identify people in lists, comments and headers.",
    "`AvatarGroup` to show who takes part in something in a small space."
  ],
  "avoid": [
    "Decorative icons: use the icon itself.",
    "When people must be reachable one by one: use a list."
  ],
  "accessibility": [
    "**`name` is required:** it is the accessible name and the source of the initials. Set `decorative` when the name is already visible next to the avatar.",
    "If `src` fails to load, the initials show instead of a broken image.",
    "**Status is spoken in words** (\"En línea\", \"Ausente\"), so the dot is never the only cue; every dot is 3:1 against its ring.",
    "In a group each avatar is named and the +N chip reads \"2 más\"."
  ],
  "content": [
    "Use the person's full name; initials come from the first two words."
  ],
  "related": [
    "Badge",
    "Chip"
  ]
}
