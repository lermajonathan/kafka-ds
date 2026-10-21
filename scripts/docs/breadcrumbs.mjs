// Guidance for the breadcrumbs page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Navigation",
  "summary": "The path from the home page to where the reader is.",
  "use": [
    "On pages two or more levels deep."
  ],
  "avoid": [
    "As the only navigation, or on top-level pages."
  ],
  "accessibility": [
    "**Pattern:** `nav` labelled \"Ruta de navegación\" with an ordered list; the last item is `aria-current=\"page\"` and is not a link.",
    "Separators are decorative and hidden from screen readers.",
    "Each link is 44 px tall."
  ],
  "content": [
    "Use the page's short name, not its full title."
  ],
  "related": [
    "Link",
    "Pagination"
  ]
}
