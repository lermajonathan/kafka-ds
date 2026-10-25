// Guidance for the notification-center page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Overlays",
  "summary": "A bell with an unread count that opens a list of notifications the reader can review later.",
  "use": [
    "App-level notifications that stay until the reader deals with them: payments confirmed, schedule changes.",
    "Controlled: the page owns the items, the read state and what dismissing means."
  ],
  "avoid": [
    "Feedback that must appear right now: use Toast.",
    "A long history: link to a page with \"Ver todas\" in the footer."
  ],
  "accessibility": [
    "**The bell's name includes the count** (\"Notificaciones, 2 sin leer\"); unread items say \"Sin leer\" in text, not only by weight and tint.",
    "**Built on Popover:** it is not modal. Opening moves focus inside; Esc closes and returns focus to the bell.",
    "**Focus is never lost:** marking an item read or dismissing it keeps focus inside the panel even when the item disappears.",
    "Each item has named buttons (\"Marcar como leída: Pago confirmado\", \"Descartar: …\"), both 44 px. Title, body and time are 4.5:1 on the panel and on the unread tint."
  ],
  "content": [
    "Titles say what happened; times arrive already formatted for the reader (\"Hace 5 min\")."
  ],
  "related": [
    "Toast",
    "Popover",
    "CountBadge"
  ]
}
