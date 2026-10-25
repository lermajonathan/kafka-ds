// Guidance for the radio-card page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A single choice presented as cards, each with a title, a description, an icon and an optional badge. `RadioCardGroup` holds them; `RadioCard` is one card.",
  "use": [
    "To pick a plan, a modality or a ticket, where each option needs a sentence of explanation.",
    "Two to four options, in a column on narrow screens.",
    "A badge such as \"Más elegido\" to point at one option; do not use it on all of them."
  ],
  "avoid": [
    "Plain short options: use RadioGroup.",
    "A view switch: use SegmentedControl.",
    "Making the whole card a link: it is a form control."
  ],
  "accessibility": [
    "**Native radios** inside a `fieldset` with a `legend`: arrow keys move and select, Tab leaves the group, and the checked card is the only Tab stop.",
    "**The name is the title.** The description is attached with `aria-describedby`, so it is read after the name, not as part of it.",
    "**The selected card is not only a colour:** the dot is filled and the border is the brand colour.",
    "Each card is at least 44 px high and the whole card is the target. Icons are decorative.",
    "Error and hint are read with the group and the error has an icon."
  ],
  "content": [
    "Title in one to three words; description in one sentence; badge in one or two words."
  ],
  "related": [
    "RadioGroup",
    "SegmentedControl",
    "Card"
  ]
}
