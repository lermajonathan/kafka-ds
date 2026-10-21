// Guidance for the prose page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "The reading column: styles paragraphs, headings, lists, links, block quotes and rules inside a 66-character line.",
  "use": [
    "For any text longer than a paragraph: articles, blog posts, programme descriptions, contest rules.",
    "As the container that the other reading components (epigraph, drop cap, pull quote, footnotes) live in."
  ],
  "avoid": [
    "For interface text such as labels and buttons: those use the UI type and the components themselves.",
    "With `fullWidth` on long texts: past 75 characters the eye loses its place when it returns to the margin.",
    "To style content you do not control by overriding it: change the content, or add a token."
  ],
  "accessibility": [
    "**Measure:** 66 characters by default (`measure.reading`), inside the 45–75 comfort range. `readingStyle()` narrows or widens it to 45 or 75.",
    "**Contrast:** text is held to 7:1 (WCAG AAA) on page and surface, in both modes.",
    "**Links** are always underlined (not distinguished by colour alone), with distinct hover and visited colours, all checked for contrast.",
    "**Headings** keep their native level (`h2`–`h4`); the visual size is separate from the level, so the outline stays correct. `text-wrap: balance` avoids one-word last lines.",
    "**Zoom and size:** sizes are relative to the reading size preference (`--kafka-reading-scale`), and text reflows up to 400 % zoom.",
    "Block quotes directly inside the column get the gold rule; `PullQuote` and `Epigraph` are figures and do not."
  ],
  "content": [
    "Write one idea per paragraph and let the paragraph break do the work of white space.",
    "Put the first heading at `h2`; the page title is the `h1`.",
    "Link text says where the link goes (\"programa del taller\"), never \"aquí\"."
  ],
  "related": [
    "DropCap",
    "PullQuote",
    "Footnotes",
    "ReadingSettings"
  ]
}
