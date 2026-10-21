/* Kafka · built-in strings. English by default so the library has no opinion on language;
   pass `labelsEs` (or your own) to `KafkaProvider`. The library never imports an i18n or router package. */
import { createContext, useContext, type ReactNode } from 'react'

export interface Labels {
  /** Announced by screen readers while a button is busy. */
  loading: string
  /** Accessible name of the reading progress bar. */
  readingProgress: string
  /** Heading of the table of contents. */
  tocTitle: string
  /** Heading of the footnotes list. */
  notes: string
  /** Accessible name of a footnote call in the text, for example "Note 3". */
  noteRef: (n: number | string) => string
  /** Accessible name of the link that goes from a footnote back to the text. */
  backToText: string
  /** "Previous" and "Next" captions of the article pager, and its accessible name. */
  previous: string
  next: string
  articleNav: string
  /** Reading time text for a number of minutes. */
  readingTime: (minutes: number) => string
  /** Embed: button that loads the content, and the link that opens it in a new tab. */
  loadEmbed: string
  openEmbed: string
  /** Reading settings panel. */
  settingsTitle: string
  textSize: string
  smaller: string
  larger: string
  lineWidth: string
  narrow: string
  medium: string
  wide: string
  typeface: string
  serif: string
  sans: string
  theme: string
  themeSystem: string
  themeLight: string
  themeDark: string
}

export const labelsEn: Labels = {
  loading: 'Loading',
  readingProgress: 'Reading progress',
  tocTitle: 'On this page',
  notes: 'Notes',
  noteRef: (n) => `Note ${n}`,
  backToText: 'Back to the text',
  previous: 'Previous',
  next: 'Next',
  articleNav: 'More to read',
  readingTime: (m) => `${m} min read`,
  loadEmbed: 'Load interactive content',
  openEmbed: 'Open in a new tab',
  settingsTitle: 'Reading settings',
  textSize: 'Text size',
  smaller: 'Smaller text',
  larger: 'Larger text',
  lineWidth: 'Line width',
  narrow: 'Narrow',
  medium: 'Medium',
  wide: 'Wide',
  typeface: 'Typeface',
  serif: 'Serif',
  sans: 'Sans',
  theme: 'Theme',
  themeSystem: 'System',
  themeLight: 'Light',
  themeDark: 'Dark',
}

export const labelsEs: Labels = {
  loading: 'Cargando',
  readingProgress: 'Progreso de lectura',
  tocTitle: 'En esta página',
  notes: 'Notas',
  noteRef: (n) => `Nota ${n}`,
  backToText: 'Volver al texto',
  previous: 'Anterior',
  next: 'Siguiente',
  articleNav: 'Para seguir leyendo',
  readingTime: (m) => `${m} min de lectura`,
  loadEmbed: 'Cargar contenido interactivo',
  openEmbed: 'Abrir en una pestaña nueva',
  settingsTitle: 'Ajustes de lectura',
  textSize: 'Tamaño del texto',
  smaller: 'Texto más pequeño',
  larger: 'Texto más grande',
  lineWidth: 'Ancho de línea',
  narrow: 'Estrecho',
  medium: 'Medio',
  wide: 'Ancho',
  typeface: 'Tipografía',
  serif: 'Con serifa',
  sans: 'Sin serifa',
  theme: 'Tema',
  themeSystem: 'Sistema',
  themeLight: 'Claro',
  themeDark: 'Oscuro',
}

const LabelsContext = createContext<Labels>(labelsEn)

/** Provides the built-in strings. Partial overrides are merged over English. */
export function KafkaProvider({ labels, children }: { labels?: Partial<Labels>; children: ReactNode }) {
  return <LabelsContext.Provider value={{ ...labelsEn, ...labels }}>{children}</LabelsContext.Provider>
}

export const useLabels = () => useContext(LabelsContext)
