// Guidance for the toggle-button page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Actions",
  "summary": "A button that stays pressed or not: follow, save, mute.",
  "use": [
    "For an on/off state that looks like an action: Seguir, Guardar, Silenciar.",
    "Controlled with `pressed` and `onPressedChange`, or uncontrolled with `defaultPressed`.",
    "`PressedIcon` to show the state also with an icon."
  ],
  "avoid": [
    "Changing the label with the state (\"Seguir\" / \"Dejar de seguir\"): the state is already announced.",
    "Settings that apply at once and read like a list: use Switch.",
    "Choosing between views: use SegmentedControl."
  ],
  "accessibility": [
    "**`aria-pressed`** carries the state, so the label stays the same: \"Seguir taller, pulsado\".",
    "**Pressed is not only a colour:** it is the filled primary variant, and with `PressedIcon` the icon changes too.",
    "It is a Button: 44 px, Enter and Space toggle, disabled works."
  ],
  "content": [
    "A verb or short noun phrase that stays true in both states."
  ],
  "related": [
    "Button",
    "Switch",
    "SegmentedControl"
  ]
}
