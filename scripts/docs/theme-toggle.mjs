// Guidance for the theme-toggle page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "Light, dark or system. `ThemeProvider` decides which theme `<html>` wears; `ThemeToggle` is the control; `useTheme` reads and sets it.",
  "use": [
    "In the header or footer of any site that offers dark mode, so readers can choose at night.",
    "`ThemeProvider` once near the root; `themeInitScript()` inline in `<head>` to avoid a flash of the wrong theme.",
    "`storageKey={null}` when you do not want the choice remembered."
  ],
  "avoid": [
    "Two providers on one page: they fight over `data-theme`.",
    "Hiding the system option: it is the default most readers want.",
    "Reader settings that already include a theme control: `ReadingSettings` has its own."
  ],
  "accessibility": [
    "**The toggle is a SegmentedControl:** one Tab stop, arrows move and select, named \"Tema\".",
    "**Each option keeps its text** next to the icon; the icons are decorative.",
    "**\"Sistema\" follows `prefers-color-scheme`** and updates live when the device changes.",
    "Both themes pass contrast (text 4.5:1, reading 7:1, controls 3:1)."
  ],
  "content": [
    "Use the labels from `useLabels()` (\"Claro\", \"Oscuro\", \"Sistema\"); translate them with `KafkaProvider`."
  ],
  "related": [
    "SegmentedControl",
    "ReadingSettings"
  ]
}
