/* Registry of documented components. Add an entry here when a component ships. */
import type { Example } from './types'
import { examples as button } from './button'
import { examples as prose } from './prose'
import { examples as pull_quote } from './pull-quote'
import { examples as footnote } from './footnote'
import { examples as verse } from './verse'
import { examples as epigraph } from './epigraph'
import { examples as drop_cap } from './drop-cap'
import { examples as reading_progress } from './reading-progress'
import { examples as toc } from './toc'
import { examples as reading_settings } from './reading-settings'
import { examples as prev_next } from './prev-next'
import { examples as figure } from './figure'
import { examples as author } from './author'
import { examples as reading_time } from './reading-time'
import { examples as embed } from './embed'

export interface ComponentEntry {
  /** Name as exported from the library. */
  name: string
  /** Source file in src/components. */
  file: string
  examples: Example[]
}

export const registry: Record<string, ComponentEntry> = {
  button: { name: 'Button', file: 'button.tsx', examples: button },
  'prose': { name: 'Prose', file: 'prose.tsx', examples: prose },
  'pull-quote': { name: 'PullQuote', file: 'pull-quote.tsx', examples: pull_quote },
  'footnote': { name: 'Footnote', file: 'footnote.tsx', examples: footnote },
  'verse': { name: 'Verse', file: 'verse.tsx', examples: verse },
  'epigraph': { name: 'Epigraph', file: 'epigraph.tsx', examples: epigraph },
  'drop-cap': { name: 'DropCap', file: 'drop-cap.tsx', examples: drop_cap },
  'reading-progress': { name: 'ReadingProgress', file: 'reading-progress.tsx', examples: reading_progress },
  'toc': { name: 'TableOfContents', file: 'toc.tsx', examples: toc },
  'reading-settings': { name: 'ReadingSettings', file: 'reading-settings.tsx', examples: reading_settings },
  'prev-next': { name: 'PrevNext', file: 'prev-next.tsx', examples: prev_next },
  'figure': { name: 'Figure', file: 'figure.tsx', examples: figure },
  'author': { name: 'Author', file: 'author.tsx', examples: author },
  'reading-time': { name: 'ReadingTime', file: 'reading-time.tsx', examples: reading_time },
  'embed': { name: 'Embed', file: 'embed.tsx', examples: embed },
}
