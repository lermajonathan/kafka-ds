// Guidance for the panel page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Layout",
  "summary": "A card with a header, body, footer and optional collapse.",
  "use": [
    "Settings sections, grouped forms and any block that needs a title, actions or a footer.",
    "`collapsible` for secondary sections the reader may skip."
  ],
  "avoid": [
    "A plain wrapper: use Card.",
    "Several collapsible panels in a stack: use Accordion, which manages them as a group."
  ],
  "accessibility": [
    "**The title is a real heading**, level 3 by default; set `headingLevel` to fit the page outline.",
    "**Collapse:** the chevron is a 44 px button with `aria-expanded` and `aria-controls`, named by the title; Enter and Space toggle it and the body is hidden from everyone when collapsed.",
    "The header icon is decorative; status colours of the icon box are paired with the title text."
  ],
  "content": [
    "Title in two or three words; description says what the section controls. Put the main action last in the footer."
  ],
  "related": [
    "Card",
    "Accordion"
  ]
}
