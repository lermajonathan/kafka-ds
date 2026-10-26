// Guidance for the range-calendar page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A month grid for choosing a first and a last day.",
  "use": [
    "Inside a popover or a panel, to choose the dates of a stay, a workshop or a report.",
    "With `min` and `max` when only some dates are open.",
    "For a single date use Calendar; for a typed or picked date field use DatePicker."
  ],
  "avoid": [
    "Ranges longer than a few months: let the reader type the dates instead.",
    "Using it as the only way to enter a date a person already knows: add typed fields."
  ],
  "accessibility": [
    "**The same keys as Calendar:** arrows move by day and week, Home and End to the ends of the week, Page Up and Down by month (Shift for year), Enter or Space chooses.",
    "**Every day is a button named with its full date.** The first and last days of the range add \"inicio del rango\" and \"fin del rango\" to the name, and every day in the range is `aria-selected`.",
    "**A status line is announced** (`aria-live=\"polite\"`): \"Elige el primer día\", then \"Inicio: ..., elige el último día\", then \"Del ... al ...\". It also shows what is chosen.",
    "**The ends are not only a colour:** they use the strong selected fill and bold text; days in between use a softer band.",
    "Days are 44 px; disabled days are skipped by selection."
  ],
  "content": [
    "Dates are `YYYY-MM-DD` strings, never `Date` objects. Month and day names follow `locale`."
  ],
  "related": [
    "Calendar",
    "DatePicker",
    "DateRangePicker"
  ]
}
