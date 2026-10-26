// Guidance for the skeleton page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Feedback",
  "summary": "A placeholder shaped like the content that is loading.",
  "use": [
    "When content takes more than a moment and its shape is known: lists, cards, an article.",
    "Compose lines, blocks and circles so the layout does not jump when the content arrives."
  ],
  "avoid": [
    "For waits shorter than a moment: show nothing.",
    "When the shape is unknown or the wait is long: use a message that says what is happening.",
    "For an action in progress: use the Button's loading state."
  ],
  "accessibility": [
    "**One announcement:** the group is `role=\"status\"` with `aria-busy=\"true\"` and reads \"Cargando\" once; the shapes are hidden from assistive technology.",
    "**Reduced motion:** the shimmer stops and the shapes stay still.",
    "The shapes are decorative placeholders, not content, so they have no text-contrast requirement. They still have to be seen: tests hold them at 1.4:1 against the page and against a card, in light and dark."
  ],
  "content": [
    "Replace the whole group when the content loads; never leave it next to the real content."
  ],
  "related": [
    "Button",
    "Empty state"
  ]
}
