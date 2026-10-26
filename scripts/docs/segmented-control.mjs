// Guidance for the segmented-control page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A strip of two to five mutually exclusive options, one always selected: a view, a format, a period.",
  "use": [
    "To switch how the same content is shown: day / week / month, list / calendar.",
    "When the choice applies immediately and the options fit on one line.",
    "For a choice that is submitted with a form, use RadioGroup."
  ],
  "avoid": [
    "More than five options or long labels: use Select.",
    "Moving between pages or sections: use Tabs.",
    "Icon-only options: every option keeps its text."
  ],
  "accessibility": [
    "**A radio group:** `role=\"radiogroup\"` named by `label`, with `role=\"radio\"` and `aria-checked` on each option.",
    "**One Tab stop.** Arrow keys move and select (they wrap), Home and End jump to the first and last.",
    "**The active option is not only a colour:** it also gets a raised surface and a brand border.",
    "Options are 44 px high (`md`); `sm` is 32 px and meets the 24 px minimum for dense toolbars."
  ],
  "content": [
    "One or two words per option, in the same part of speech."
  ],
  "related": [
    "Tabs",
    "Radio",
    "ThemeToggle"
  ]
}
