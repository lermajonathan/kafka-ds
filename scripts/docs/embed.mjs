// Guidance for the embed page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "A titled, sandboxed frame for third-party content (Genially, video, maps), with a link to open it on its own.",
  "use": [
    "For interactive pieces that cannot be reproduced in the page."
  ],
  "avoid": [
    "For content that is just text or an image.",
    "Without a title: an untitled frame is a silent box for screen reader users."
  ],
  "accessibility": [
    "**Title is required** and becomes the iframe `title`.",
    "**Sandbox:** scripts, forms, presentation and pop-ups are allowed; top navigation is not.",
    "**Privacy:** with `deferred`, nothing is requested from the provider until the reader clicks. Lazy loading and a strict referrer policy otherwise.",
    "**Escape hatch:** an \"Open in a new tab\" link, 44 px tall, for readers who cannot use the frame.",
    "**Keyboard:** focus enters and leaves the frame normally; the frame is not a trap."
  ],
  "content": [
    "Say in the caption what the piece is and what to do with it."
  ],
  "related": [
    "Figure"
  ]
}
