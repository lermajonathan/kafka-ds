// Guidance for the toc page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "A navigation list of the sections of a text, with the current one marked.",
  "use": [
    "For texts with three or more sections, beside or above the article."
  ],
  "avoid": [
    "For a short text: headings are enough.",
    "To navigate between pages: use the navigation of the site."
  ],
  "accessibility": [
    "**Landmark:** a `nav` named by its title, with an ordered list of links to `#id`.",
    "**Current section:** `aria-current=\"location\"` plus a gold marker and bold text (not colour alone). Follows the headings while scrolling, or is controlled with `activeId`.",
    "**Targets:** each link is at least 44 px tall.",
    "**Order:** the same as the headings, so the keyboard order matches the visual order."
  ],
  "content": [
    "Use the heading text, shortened if needed.",
    "Two levels at most."
  ],
  "related": [
    "Prose",
    "ReadingProgress"
  ]
}
