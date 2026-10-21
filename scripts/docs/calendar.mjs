// Guidance for the calendar page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A month grid for choosing a date.",
  "use": [
    "When the reader needs to see the date in context of the month."
  ],
  "avoid": [
    "For birth dates and far dates: let them type (see Date picker)."
  ],
  "accessibility": [
    "**Pattern:** `grid` with one roving tab stop; each day is a button labelled with its full date (\"jueves, 21 de octubre de 2026\").",
    "**Keyboard:** arrows move by day and week; Home and End go to the week's ends; Page Up and Down change the month (Shift = year).",
    "Today is marked with a border, the selected day with a filled shape; neither relies on colour alone.",
    "Days are 44 px; days outside `min` and `max` are disabled."
  ],
  "content": [
    "Dates are ISO strings (`YYYY-MM-DD`) so there is no time zone."
  ],
  "related": [
    "Date picker"
  ]
}
