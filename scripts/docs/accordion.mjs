// Guidance for the accordion page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Navigation",
  "summary": "Titles that expand and collapse their content in place.",
  "use": [
    "For FAQs and long secondary content the reader scans by title."
  ],
  "avoid": [
    "For content everyone needs to read: show it.",
    "For parallel views: use Tabs."
  ],
  "accessibility": [
    "**Pattern:** a heading containing a button with `aria-expanded` and `aria-controls`; the panel is a `region` labelled by its title.",
    "**Keyboard:** Enter and Space toggle; Up, Down, Home and End move between titles.",
    "Set `headingLevel` so the outline stays correct.",
    "The chevron is decorative; state is conveyed by `aria-expanded`."
  ],
  "content": [
    "Write titles as the question or topic, not as \"Más información\"."
  ],
  "related": [
    "Tabs"
  ]
}
