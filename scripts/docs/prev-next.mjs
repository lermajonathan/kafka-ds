// Guidance for the prev-next page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "Links to the texts before and after this one, with their titles.",
  "use": [
    "At the end of an article that belongs to a series or a sequence."
  ],
  "avoid": [
    "For \"related articles\": it is a sequence, not a recommendation."
  ],
  "accessibility": [
    "**Landmark:** a `nav` with an accessible name; give each one a different name if a page has several.",
    "**Links:** real `<a href>` with `rel=\"prev\"` and `rel=\"next\"`; the whole card is the link, at least 44 px tall.",
    "**Arrows** are decorative; the direction is in text."
  ],
  "content": [
    "Show the real title of the destination."
  ],
  "related": [
    "TableOfContents"
  ]
}
