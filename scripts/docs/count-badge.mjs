// Guidance for the count-badge page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Data display",
  "summary": "A small number for pending items, such as unread notifications.",
  "use": [
    "On an icon button or a tab to show how many items need attention.",
    "Above `max` it shows \"9+\"; at zero it renders nothing."
  ],
  "avoid": [
    "As a status: use Badge.",
    "For large figures or measurements: show the number as text."
  ],
  "accessibility": [
    "**The count must be spoken:** when the badge sits on a button, put the count in the button's name (\"Notificaciones, 2 sin leer\") and hide the badge. Standing alone, pass `label` so the number says what it counts.",
    "Number and background are 4.5:1 in both modes."
  ],
  "content": [
    "Numbers only. Don't use it for text."
  ],
  "related": [
    "Badge",
    "NotificationCenter"
  ]
}
