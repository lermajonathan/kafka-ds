// Guidance for the tabs page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Navigation",
  "summary": "Switches between related panels of content in the same place.",
  "use": [
    "To split one subject into 2–6 parallel views that the reader compares or picks between."
  ],
  "avoid": [
    "For steps in a sequence: use Stepper.",
    "For navigating to other pages: use links or Breadcrumbs.",
    "When the reader needs to see two panels at once."
  ],
  "accessibility": [
    "**Pattern:** `tablist` / `tab` / `tabpanel`, with `aria-selected` and `aria-controls`.",
    "**Keyboard:** Left and Right (and Home, End) move and activate; only the selected tab is in the Tab order; Tab then goes into the panel.",
    "**Target:** each tab is 44 px tall; the selected tab is shown by an underline and bold weight, not by colour alone."
  ],
  "content": [
    "Keep tab labels to one or two words.",
    "Do not hide essential content in a tab the reader may never open."
  ],
  "related": [
    "Accordion",
    "Stepper"
  ]
}
