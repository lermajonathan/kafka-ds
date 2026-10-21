// Guidance for the file-upload page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Forms",
  "summary": "A zone to choose or drop files, with the native file input inside.",
  "use": [
    "For documents the person must send: a story, a certificate, a photo."
  ],
  "avoid": [
    "For large uploads that need progress and retry: they need a different component.",
    "Without rules shown up front: say the types and size in the hint."
  ],
  "accessibility": [
    "**Native input:** Enter or Space opens the file dialog from the keyboard; screen readers announce it as a file button.",
    "**Focus:** the whole zone shows the focus ring when the input is focused.",
    "**Rules:** accepted types, size and count are validated; each refusal names the file and the reason, in a polite live region.",
    "**Dropping** is an extra, never the only way.",
    "**Remove:** each file has a 44 px button named \"Quitar archivo.pdf\"."
  ],
  "content": [
    "State the accepted types and the maximum size in the hint."
  ],
  "related": [
    "Field"
  ]
}
