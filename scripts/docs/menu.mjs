// Guidance for the menu page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Overlays",
  "summary": "A list of actions opened from a button.",
  "use": [
    "For three or more related actions that don't need to be always visible."
  ],
  "avoid": [
    "For navigation: use links or Breadcrumbs.",
    "For choosing a value: use Select or Combobox."
  ],
  "accessibility": [
    "**Pattern:** `menu` with `menuitem` entries; the button has `aria-haspopup=\"menu\"` and `aria-expanded`.",
    "**Keyboard:** Enter, Space, Down or Up open it; arrows, Home and End move; typing a letter jumps to a matching item; Esc closes and returns focus; Tab closes it.",
    "Items that navigate are links. Dangerous items use the danger colour and the label says what it does; disabled items stay in the list.",
    "Items are 44 px tall."
  ],
  "content": [
    "Start labels with a verb. Put the destructive action last, after a separator."
  ],
  "related": [
    "Popover",
    "Button"
  ]
}
