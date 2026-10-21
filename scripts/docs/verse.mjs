// Guidance for the verse page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "A poem: verse breaks and stanzas are kept, and long verses wrap with a hanging indent.",
  "use": [
    "For poems and song lyrics you have the right to publish, and for any text where line breaks are part of the meaning."
  ],
  "avoid": [
    "For prose with hard line breaks: it will not reflow on narrow screens.",
    "For an excerpt you do not have the rights to show.",
    "As a table of two columns: a poem is not a layout."
  ],
  "accessibility": [
    "**Structure:** one `p` per stanza and one block per verse, so screen readers pause between stanzas and verses.",
    "**Hanging indent:** a wrapped verse indents so it reads as one line, not two.",
    "**Contrast:** 7:1, in the reading typeface.",
    "Set `lang` on the component if the poem is not in the language of the page."
  ],
  "content": [
    "Pass the poem as plain text: a blank line between stanzas, one verse per line.",
    "Put the author and title in `attribution`, not in the text."
  ],
  "related": [
    "Epigraph"
  ]
}
