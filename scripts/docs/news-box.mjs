// Guidance for the news-box page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Feedback",
  "summary": "A small box of community news: events, congratulations, notices and open calls. It can float in a corner of the screen.",
  "use": [
    "To tell the community what is happening without taking over the page: up to three items at a time.",
    "Four kinds: `evento`, `felicitacion`, `aviso`, `convocatoria`. Each has an icon and a name in words.",
    "`floating` for the corner of the screen; leave it off to place the box inside the page."
  ],
  "avoid": [
    "Anything urgent or that needs an answer: use Alert or ConfirmDialog.",
    "More than one box per page.",
    "Long titles: one line of news, the details go in the list or on the page it links to."
  ],
  "accessibility": [
    "**A labelled region** (\"Novedades\"), not a dialog: it does not trap focus or block the page. Use `label` if a page ever has more than one box.",
    "**It never rotates by itself.** The dots change the item, and the change is announced politely. They are real buttons (\"Ver noticia 2 de 3\") with `aria-current` on the active one.",
    "**The kind is said in words**, not only by the icon.",
    "The close button is 44 px and its name includes the title. Closing removes the item and the next one takes its place; when the last one is closed the box disappears, so move focus somewhere sensible in `onDismiss`.",
    "The entrance animation is removed under reduced motion."
  ],
  "content": [
    "Title: what happened, in one line. Details: the date first, then the place or the group."
  ],
  "related": [
    "NotificationCenter",
    "Toast",
    "Alert"
  ]
}
