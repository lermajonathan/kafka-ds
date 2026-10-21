// Guidance for the combobox page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A text field with a filtered list of options.",
  "use": [
    "For long lists (countries, cities) where typing is faster than scrolling."
  ],
  "avoid": [
    "For short lists: use Select or Radio."
  ],
  "accessibility": [
    "**Pattern:** `role=\"combobox\"` input with a `listbox`; the active option is exposed through `aria-activedescendant`, so focus stays in the field.",
    "**Keyboard:** typing filters (accents ignored); Down and Up move; Enter chooses; Esc closes.",
    "A polite status announces how many results are available, or that there are none.",
    "Options are 44 px tall; selection is shown by a check as well as colour."
  ],
  "content": [
    "Show a \"no results\" message rather than an empty list."
  ],
  "related": [
    "Select",
    "Field"
  ]
}
