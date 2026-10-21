// Guidance for the date-picker page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A date field that can be typed or picked from a calendar.",
  "use": [
    "Whenever a date is needed."
  ],
  "avoid": [
    "For a date range: use two fields."
  ],
  "accessibility": [
    "The field accepts typing in day/month/year order and validates on blur; the calendar button opens a Popover.",
    "The button has its own name (\"Abrir calendario\"); choosing a day closes it and returns focus to the button.",
    "Put it inside a Field so it has a label, hint and error."
  ],
  "content": [
    "Tell the reader the expected format in the hint."
  ],
  "related": [
    "Calendar",
    "Field",
    "Popover"
  ]
}
