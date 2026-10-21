// Guidance for the link page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Actions",
  "summary": "An underlined link with a visible focus ring, distinct hover and visited colours, and a safe external variant.",
  "use": [
    "To go to another page, section or file."
  ],
  "avoid": [
    "To run an action on the page: use a Button.",
    "`external` as a default: opening a new tab takes control from the reader. Use it only when leaving would lose their work.",
    "Text such as \"aquí\" or \"ver más\"."
  ],
  "accessibility": [
    "**Never colour alone:** links are always underlined.",
    "**Contrast:** default, hover and visited colours are each checked against page and surface, in both modes.",
    "**External:** `target=\"_blank\"` with `rel=\"noopener noreferrer\"`, an icon, and visually hidden text \"(se abre en una pestaña nueva)\".",
    "**Target:** `standalone` links are at least 44 px tall; inline links follow the exception for links inside a sentence."
  ],
  "content": [
    "The link text says where it goes: \"bases del concurso\"."
  ],
  "related": [
    "Button"
  ]
}
