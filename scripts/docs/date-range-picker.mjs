// Guidance for the date-range-picker page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A field for a range of dates: a button with the chosen range that opens the calendar in a popover.",
  "use": [
    "Filters and forms that ask for \"from — to\": report periods, workshop dates, stays.",
    "Inside a `Field` so the label names the button.",
    "`presets` for ranges people choose often (this month, this season)."
  ],
  "avoid": [
    "A single date: use DatePicker, which can also be typed.",
    "Required precision to the day with the keyboard only: add two DatePickers."
  ],
  "accessibility": [
    "**The name carries the label and the value:** \"Fechas del taller: Del 10 de nov ... al 20 de nov ...\".",
    "**A button with `aria-haspopup=\"dialog\"`** that opens a non-modal popover: Escape closes it and returns focus to the button; a click outside closes it.",
    "**Half-picked is never saved:** `onValueChange` receives a complete range or an empty one.",
    "The calendar keeps all of RangeCalendar's keys and its announced status line. The button and presets are 44 px high.",
    "`invalid` and `Field` errors are tied to the button like any other control.",
    "**One line:** a long range is cut with an ellipsis, so the field never grows taller. When it is cut, a tooltip shows the whole text on hover and on keyboard focus (the accessible name always has it)."
  ],
  "content": [
    "The placeholder says the format of the answer (\"Elige las fechas\"), not an instruction to click."
  ],
  "related": [
    "RangeCalendar",
    "DatePicker",
    "Popover"
  ]
}
