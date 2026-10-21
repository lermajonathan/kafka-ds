// Guidance for the author page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "A byline: portrait or initials, name, role and an optional bio.",
  "use": [
    "Under the title of an article and at the end of a text."
  ],
  "avoid": [
    "For members or contacts: it is for authorship.",
    "Adding a portrait that adds no recognition: initials are fine."
  ],
  "accessibility": [
    "**Portrait is decorative** (`alt=\"\"`): the name beside it carries the meaning. Initials are `aria-hidden`.",
    "**Link:** if `href` is given, the name is a real underlined link with `rel=\"author\"`.",
    "**Contrast:** all text is 4.5:1 or better."
  ],
  "content": [
    "Keep the role to one line."
  ],
  "related": [
    "ReadingTime"
  ]
}
