// Guidance for the card page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Layout",
  "summary": "A bordered surface with a resting shadow for grouping related content.",
  "use": [
    "To group related content that sits on the page background: a program, an announcement, a profile.",
    "`highlight=\"featured\"` for the one card that should stand out; `highlight=\"vip\"` for the membership card."
  ],
  "avoid": [
    "Nesting cards inside cards.",
    "Content that needs a header and actions: use Panel.",
    "Making the whole card a link without a real link inside it."
  ],
  "accessibility": [
    "**Presentational:** the card has no role and is not focusable. Put a heading inside so the section has a name.",
    "`featured` uses the brand-coloured border (1.5 px instead of 1 px); it only adds emphasis, so no meaning depends on it.",
    "**VIP:** gold background with dark text. Its edge shine is CSS only and stands still under reduced motion.",
    "The border is decorative against the page; the content (text 4.5:1) is what has to be readable."
  ],
  "content": [
    "Start with a heading. One idea per card."
  ],
  "related": [
    "Panel",
    "Divider"
  ]
}
