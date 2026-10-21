// Guidance for the reading-time page. Props and examples are generated from the source; this file holds the human part.
export default {
  "category": "Reading",
  "summary": "Estimated reading time, calculated from the word count.",
  "use": [
    "Beside the date and author of an article, so readers can decide whether to start now."
  ],
  "avoid": [
    "For video or audio: it measures words.",
    "As a promise: it is an estimate."
  ],
  "accessibility": [
    "**Machine-readable:** the text is inside a `<time datetime=\"PT5M\">`.",
    "**Localised:** the phrase comes from `KafkaProvider` labels.",
    "**Icon** is decorative.",
    "Rounds up, never below one minute; 200 words per minute by default (a careful pace for literary Spanish)."
  ],
  "content": [
    "Compute it once at build time with `countWords` if the text is long."
  ],
  "related": [
    "Author"
  ]
}
