// Guidance for the modal page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Overlays",
  "summary": "A dialog that blocks the page until it is answered or closed.",
  "use": [
    "For a task or decision that needs the reader's full attention."
  ],
  "avoid": [
    "For information the reader can ignore: use Alert or Popover.",
    "For marketing prompts on page load."
  ],
  "accessibility": [
    "**Built on the native `<dialog>`:** the page behind is inert, focus stays inside, Esc closes.",
    "It is labelled by its title and described by its description; focus starts on the first control and returns to the opener on close.",
    "The page doesn't scroll while it's open. Motion is removed under reduced motion.",
    "The close button is 44 px."
  ],
  "content": [
    "Title says what the dialog is for. Primary action on the right."
  ],
  "related": [
    "Drawer",
    "Confirm dialog"
  ]
}
