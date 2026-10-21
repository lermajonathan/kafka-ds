// Guidance for the pin-input page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A short code, one cell per character, with paste and autofill support.",
  "use": [
    "For verification codes and short PINs."
  ],
  "avoid": [
    "For passwords or long codes: use Input."
  ],
  "accessibility": [
    "**Names:** each cell is named \"Dígito 1 de 6\" and the group is named by the Field label.",
    "**Keyboard:** typing advances, Backspace goes back (and clears), arrows move, paste fills all cells.",
    "**Autofill:** the first cell is `autocomplete=\"one-time-code\"`; `mode=\"numeric\"` opens the number pad.",
    "**Target:** 48 px cells with 8 px gaps."
  ],
  "content": [
    "Say where the code came from in the hint."
  ],
  "related": [
    "Field",
    "Input"
  ]
}
