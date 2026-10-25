// Guidance for the input-group page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "An input with fixed text, an icon or one button attached to its sides: units, prefixes, a search action.",
  "use": [
    "Units and fixed text the reader should not type: \"https://\", \"COP\", \"por persona\".",
    "One action that belongs to the field: Buscar, Copiar, Aplicar.",
    "Always inside a `Field`, so the label names the input."
  ],
  "avoid": [
    "Instructions or the field's name in the addon: that is the label's job.",
    "More than one button.",
    "Addons that change meaning (a currency picker): use a Select next to the field."
  ],
  "accessibility": [
    "**The `Field` label names the input;** text addons are plain visible text read in order, icon addons are hidden from assistive technology.",
    "**One focus ring.** The input keeps its own focus ring and rises above the addons so it is never clipped.",
    "The group is 44 px high and the border between parts is a single line with 3:1 contrast. The action is a normal 44 px button.",
    "Addon text meets 4.5:1 on its tinted background in both modes."
  ],
  "content": [
    "Short: one or two words. Put units after the number, symbols before."
  ],
  "related": [
    "Input",
    "Field",
    "Button"
  ]
}
