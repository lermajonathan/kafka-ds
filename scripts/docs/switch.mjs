// Guidance for the switch page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "An on/off control for settings that apply immediately.",
  "use": [
    "For preferences that take effect when toggled: notifications, display options."
  ],
  "avoid": [
    "In a form that is submitted later: use Checkbox.",
    "To open something: use a button or disclosure."
  ],
  "accessibility": [
    "**Role:** `switch` on a native checkbox; Space toggles.",
    "**State:** the thumb shows a check when on, and the track fills: two signals besides colour.",
    "**Contrast:** track border and thumb are 3:1 or better against their surroundings in every state.",
    "**Target:** the row is at least 44 px tall.",
    "**Reduced motion:** the thumb transition is removed."
  ],
  "content": [
    "Label what it controls (\"Recordatorios por correo\"), not the action."
  ],
  "related": [
    "Checkbox"
  ]
}
