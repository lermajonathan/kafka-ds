// Guidance for the program-card page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Data display",
  "summary": "A program (workshop, masterclass, membership) with a cover, badges, price, details and one action.",
  "use": [
    "To list what can be enrolled in, in a grid of two or three.",
    "`highlight=\"featured\"` for the one program to push; `highlight=\"vip\"` for the membership."
  ],
  "avoid": [
    "More than one `vip` card in view: the shine stops meaning anything.",
    "A card without a way forward: always give it one action.",
    "Long descriptions: two sentences; the details go in the list."
  ],
  "accessibility": [
    "**The title is a real heading**, level 3 by default (`headingLevel`), and the card is an `article`.",
    "**The title stays readable on any image:** it sits on a scrim that reaches the darkest ink at the bottom (7:1 or better for the title, 4.5:1 for the subtitle).",
    "**Images need `image.alt`.** A generated cover or a broken image falls back to a decorative cover hidden from assistive technology.",
    "**VIP is said in words:** the crown badge reads \"Miembros\", the edge shine is CSS only and stands still under reduced motion, and the hover lift is removed too.",
    "The action is a normal 44 px button or link."
  ],
  "content": [
    "Title: the program's name. Subtitle: who leads it. Details: one line each, starting with the date."
  ],
  "related": [
    "Card",
    "Badge",
    "Button"
  ]
}
