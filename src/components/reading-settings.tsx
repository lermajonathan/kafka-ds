/* Kafka · ReadingSettings */
import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { IconMinus, IconPlus } from '../icons'
import { useLabels } from './labels'
import { cx, focus } from './shared'

export type ReadingWidth = 'narrow' | 'medium' | 'wide'
export type ReadingFont = 'serif' | 'sans'
export type ReadingTheme = 'system' | 'light' | 'dark'

export interface ReadingPreferences {
  /** Text size step, 0 to 4. 2 is the default size. */
  size: 0 | 1 | 2 | 3 | 4
  width: ReadingWidth
  font: ReadingFont
  theme: ReadingTheme
}

export const defaultReadingPreferences: ReadingPreferences = { size: 2, width: 'medium', font: 'serif', theme: 'system' }

// Multipliers of the body size: 87.5%, 100%, 112.5%, 125%, 150%. The default step is the 18 px body of the reading type scale.
const SCALES = [0.875, 1, 1.125, 1.25, 1.5] as const
export const READING_SIZE_STEPS = SCALES.length

/** CSS variables that `Prose` reads. Put the result on the element that wraps the text: `<Prose style={readingStyle(prefs)} />`.
 *  The theme is not included: apply it with `document.documentElement.dataset.theme` (or your own toggle), because it changes the whole page. */
export function readingStyle(p: ReadingPreferences): CSSProperties {
  const measure = { narrow: 'var(--kafka-measure-min)', medium: 'var(--kafka-measure-reading)', wide: 'var(--kafka-measure-max)' }[p.width]
  const style: Record<string, string | number> = { '--kafka-reading-scale': SCALES[p.size], '--kafka-reading-measure': measure }
  if (p.font === 'sans') style['--kafka-reading-family'] = 'var(--kafka-typography-ui-label-font-family)'
  return style as CSSProperties
}

export interface ReadingSettingsProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  value: ReadingPreferences
  onChange: (next: ReadingPreferences) => void
  /** Hide the theme group when the page already has its own toggle. */
  showTheme?: boolean
}

const optionClass =
  'kafka-type-reading-settings-option-type inline-flex min-h-(--kafka-reading-settings-option-min-height) cursor-pointer items-center justify-center rounded-(--kafka-reading-settings-option-radius) border-(length:--kafka-border-width-medium) border-(--kafka-reading-settings-option-border) bg-(--kafka-reading-settings-option-bg) px-(--kafka-reading-settings-option-padding-x) text-(--kafka-reading-settings-option-fg) hover:bg-(--kafka-reading-settings-option-hover-bg) peer-checked:border-(--kafka-reading-settings-option-selected-bg) peer-checked:bg-(--kafka-reading-settings-option-selected-bg) peer-checked:text-(--kafka-reading-settings-option-selected-fg) peer-focus-visible:outline-(length:--kafka-focus-width) peer-focus-visible:outline-offset-(--kafka-focus-offset) peer-focus-visible:outline-(--kafka-color-border-focus)'

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="kafka-type-reading-settings-legend-type mb-(--kafka-reading-settings-group-gap) text-(--kafka-reading-settings-legend)">{legend}</legend>
      <div className="flex flex-wrap gap-(--kafka-reading-settings-group-gap)">{children}</div>
    </fieldset>
  )
}

function Choice<T extends string>({ name, value, current, label, onPick }: { name: string; value: T; current: T; label: string; onPick: (v: T) => void }) {
  return (
    <label className="relative inline-flex">
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onPick(value)} className="peer sr-only" />
      <span className={optionClass}>{label}</span>
    </label>
  )
}

/** The reader's controls: text size, line width, typeface and theme. It only holds and reports choices; `readingStyle` turns them into the CSS `Prose` reads. */
export function ReadingSettings({ value, onChange, showTheme = true, className, ...rest }: ReadingSettingsProps) {
  const labels = useLabels()
  const uid = useId()
  const set = <K extends keyof ReadingPreferences>(k: K, v: ReadingPreferences[K]) => onChange({ ...value, [k]: v })
  const stepBtn = cx(
    focus,
    'inline-flex size-(--kafka-reading-settings-option-min-height) cursor-pointer items-center justify-center rounded-(--kafka-reading-settings-option-radius) border-(length:--kafka-border-width-medium) border-(--kafka-reading-settings-option-border) bg-(--kafka-reading-settings-option-bg) text-(--kafka-reading-settings-option-fg) hover:bg-(--kafka-reading-settings-option-hover-bg) disabled:cursor-not-allowed disabled:opacity-(--kafka-button-disabled-opacity)',
  )
  return (
    <section
      aria-labelledby={`${uid}-title`}
      className={cx('flex flex-col gap-(--kafka-reading-settings-gap) rounded-(--kafka-reading-settings-radius) border-(length:--kafka-reading-settings-border-width) border-(--kafka-reading-settings-border) bg-(--kafka-reading-settings-bg) p-(--kafka-reading-settings-padding)', className)}
      {...rest}
    >
      <h2 id={`${uid}-title`} className="kafka-type-reading-heading-sm">{labels.settingsTitle}</h2>
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="kafka-type-reading-settings-legend-type mb-(--kafka-reading-settings-group-gap) text-(--kafka-reading-settings-legend)">{labels.textSize}</legend>
        <div className="flex items-center gap-(--kafka-reading-settings-group-gap)">
          <button type="button" className={stepBtn} aria-label={labels.smaller} disabled={value.size === 0} onClick={() => set('size', (value.size - 1) as ReadingPreferences['size'])}>
            <IconMinus aria-hidden="true" className="size-(--kafka-size-icon-md)" />
          </button>
          <output aria-live="polite" className="kafka-type-reading-settings-option-type min-w-(--kafka-size-touch) text-center text-(--kafka-reading-settings-value-fg)">{Math.round(SCALES[value.size] * 100)}%</output>
          <button type="button" className={stepBtn} aria-label={labels.larger} disabled={value.size === SCALES.length - 1} onClick={() => set('size', (value.size + 1) as ReadingPreferences['size'])}>
            <IconPlus aria-hidden="true" className="size-(--kafka-size-icon-md)" />
          </button>
        </div>
      </fieldset>
      <Group legend={labels.lineWidth}>
        {(['narrow', 'medium', 'wide'] as const).map((w) => (
          <Choice key={w} name={`${uid}-width`} value={w} current={value.width} label={labels[w]} onPick={(v) => set('width', v)} />
        ))}
      </Group>
      <Group legend={labels.typeface}>
        {(['serif', 'sans'] as const).map((f) => (
          <Choice key={f} name={`${uid}-font`} value={f} current={value.font} label={labels[f]} onPick={(v) => set('font', v)} />
        ))}
      </Group>
      {showTheme && (
        <Group legend={labels.theme}>
          {([['system', labels.themeSystem], ['light', labels.themeLight], ['dark', labels.themeDark]] as const).map(([t, l]) => (
            <Choice key={t} name={`${uid}-theme`} value={t} current={value.theme} label={l} onPick={(v) => set('theme', v)} />
          ))}
        </Group>
      )}
    </section>
  )
}
