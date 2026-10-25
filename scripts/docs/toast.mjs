// Guidance for the toast page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Feedback",
  "summary": "A brief notice that appears without taking the reader away from what they were doing. `ToastStack` is the region that holds them.",
  "use": [
    "Immediate feedback on something the reader just did: saved, copied, sent.",
    "With one follow-up action such as Undo; pressing it also closes the toast.",
    "Render `ToastStack` once near the root and feed it the list your page owns."
  ],
  "avoid": [
    "Anything the reader must answer or can't afford to miss: use Alert or ConfirmDialog.",
    "Messages the reader will want to review later: use NotificationCenter.",
    "Several stacks on one page."
  ],
  "accessibility": [
    "**Announced on its own:** each toast is an atomic `role=\"status\"`; a `danger` toast is a `role=\"alert\"`. The stack is a labelled region, named \"Notificaciones\" by default.",
    "**Time to read (WCAG 2.2.1):** a toast stays until the reader closes it. `duration` is optional, pauses while the pointer is over the toast or focus is inside it, resumes with the time that was left, and is ignored for `danger`.",
    "**Not by colour alone:** every tone has an icon and a border. Title, body and action are 4.5:1 on the tint in both modes.",
    "The close button and the action are 44 px. The entrance fade is removed under reduced motion."
  ],
  "content": [
    "Title says what happened in a few words (\"Cambios guardados\"); the description says what to do if it matters. Keep the action to one verb."
  ],
  "related": [
    "Alert",
    "NotificationCenter",
    "ConfirmDialog"
  ]
}
