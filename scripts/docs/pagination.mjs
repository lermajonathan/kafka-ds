// Guidance for the pagination page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Navigation",
  "summary": "Moves between numbered pages of a long list.",
  "use": [
    "For lists that are split into pages, such as the blog or the programme archive."
  ],
  "avoid": [
    "For short lists: show them all.",
    "For endless feeds: use a \"load more\" button."
  ],
  "accessibility": [
    "**Pattern:** `nav` labelled \"Paginación\" with the current page `aria-current=\"page\"`.",
    "With `hrefFor` the items are real links, so pages are addressable and work without scripts; with `onPageChange` they are buttons.",
    "Previous and next say where they go; they are disabled at the ends.",
    "Every item is 44×44 px."
  ],
  "content": [
    "Show at most seven items; the rest collapse into an ellipsis."
  ],
  "related": [
    "Breadcrumbs"
  ]
}
