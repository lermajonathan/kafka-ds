// Guidance for the split-button page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Actions",
  "summary": "A main action and an arrow that opens a menu of related actions.",
  "use": [
    "When one action is clearly the usual one and two or three others are variations of it.",
    "Primary for the one important action of a view; outline or soft elsewhere."
  ],
  "avoid": [
    "Equal actions: use a Menu or two buttons.",
    "Destructive actions in the menu next to a safe main action.",
    "More than five menu items."
  ],
  "accessibility": [
    "**Two buttons, not one.** The main button runs the action; the arrow is a separate 44 px button named \"Más acciones\" with `aria-haspopup=\"menu\"` and `aria-expanded`.",
    "**The menu is the Menu component:** Enter, Space or Down open it on the first item, arrows, Home, End and typing move, Esc closes and returns focus to the arrow.",
    "A small gap separates the two buttons, so each one keeps a full focus ring."
  ],
  "content": [
    "Main label is a verb. Menu items are verbs too, each different from the main one."
  ],
  "related": [
    "Menu",
    "Button",
    "ToggleButton"
  ]
}
