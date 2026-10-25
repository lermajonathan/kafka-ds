// Guidance for the nav-menu page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Navigation",
  "summary": "The vertical navigation of an app or dashboard: links with icons, groups that open, the current page marked.",
  "use": [
    "As the sidebar of the Altazor CRM or any app with more than five destinations.",
    "Two levels at most: a group and its pages.",
    "`onNavigate` for single-page apps; without it the links work as ordinary links."
  ],
  "avoid": [
    "The top navigation of a reading site: use plain links in a header.",
    "Deeper than two levels.",
    "Using it for steps (Stepper) or sections of one page (TableOfContents)."
  ],
  "accessibility": [
    "**A `nav` landmark** named by `label`; give each one a different name if the page has more than one.",
    "**Real links.** The current page has `aria-current=\"page\"`, a stronger fill and a brand-coloured marker on the left, so it is not only a colour.",
    "**Groups are disclosure buttons** with `aria-expanded` and `aria-controls`; Enter and Space open and close them. Tab visits every link in order; there is no roving focus to learn.",
    "Items are 44 px high. A disabled item is plain text with `aria-disabled`, outside the Tab order.",
    "**Collapsed:** the names remain in the page for screen readers and become a tooltip for the eye."
  ],
  "content": [
    "One or two words per item, nouns for places (\"Personas\"), not verbs."
  ],
  "related": [
    "Breadcrumbs",
    "Tabs",
    "Pagination"
  ]
}
