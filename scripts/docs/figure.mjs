// Guidance for the figure page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "An image with a caption and a credit, cropped to a ratio.",
  "use": [
    "For photographs and illustrations that belong to the text."
  ],
  "avoid": [
    "For decorative images in the layout: use a CSS background, or `alt=\"\"`.",
    "For a screenshot of text: put the text in the page."
  ],
  "accessibility": [
    "**Alt text is required.** Say what the image shows; pass `\"\"` only if it is purely decorative.",
    "**Layout stability:** pass `width` and `height` or a ratio so the page does not jump while the image loads.",
    "**Loading:** lazy and async by default.",
    "The caption and the credit are text, 4.5:1 or better."
  ],
  "content": [
    "The caption says why the image is there; the alt text says what is in it.",
    "Credit the photographer or source."
  ],
  "related": [
    "Prose"
  ]
}
