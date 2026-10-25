// Guidance for the alert page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Feedback",
  "summary": "A message inside the page that informs, confirms, warns or reports a problem, without interrupting.",
  "use": [
    "To tell the reader something about the page they are on: a schedule change, a confirmed payment, a form error summary.",
    "With one action when the reader can do something about it."
  ],
  "avoid": [
    "When the reader must answer before going on: use ConfirmDialog.",
    "For a message that disappears by itself: a message that vanishes can't be read at the reader's pace.",
    "Stacking several alerts: group them or keep the most important."
  ],
  "accessibility": [
    "**Polite by default:** `role=\"status\"` is announced when it changes, without interrupting. `urgent` switches to `role=\"alert\"`; use it only for what the reader must hear now.",
    "**Not by colour alone:** every tone has an icon and a border in the status colour (3:1 against the page). Title 4.5:1 on its tint, body text 4.5:1, in both modes.",
    "The close button is 44 px and named by the provider's `close` label. The alert does not move focus; the page decides where it goes after it closes."
  ],
  "content": [
    "Title in a few words that say what happened; the body says what to do next. No full stop in the title."
  ],
  "related": [
    "Badge",
    "Confirm dialog"
  ]
}
