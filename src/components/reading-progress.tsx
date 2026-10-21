/* Kafka · ReadingProgress */
import { useEffect, useState, type RefObject } from 'react'
import { useLabels } from './labels'
import { cx } from './shared'

export interface ReadingProgressProps {
  /** Progress from 0 to 100. When omitted, the bar follows the scroll position through `targetRef` (or the whole page). */
  value?: number
  /** The element being read. Progress is how far its content has scrolled past the top of the viewport. */
  targetRef?: RefObject<HTMLElement | null>
  /** `fixed` sticks to the top of the viewport; `static` sits in the flow (for layouts that place it themselves). */
  position?: 'fixed' | 'static'
  /** Accessible name. Defaults to the localised "Reading progress". */
  label?: string
  className?: string
}

const clamp = (n: number) => Math.min(100, Math.max(0, n))

/** A thin bar that fills as the reader moves through the text. It is a `progressbar`, and it is never the only way to know where you are. */
export function ReadingProgress({ value, targetRef, position = 'fixed', label, className }: ReadingProgressProps) {
  const labels = useLabels()
  const [scroll, setScroll] = useState(0)
  useEffect(() => {
    if (value !== undefined) return
    let raf = 0
    const update = () => {
      raf = 0
      const el = targetRef?.current
      if (el) {
        const r = el.getBoundingClientRect()
        const total = r.height - window.innerHeight
        setScroll(total <= 0 ? (r.bottom <= window.innerHeight ? 100 : 0) : clamp((-r.top / total) * 100))
      } else {
        const total = document.documentElement.scrollHeight - window.innerHeight
        setScroll(total <= 0 ? 0 : clamp((window.scrollY / total) * 100))
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [value, targetRef])
  const now = Math.round(clamp(value ?? scroll))
  return (
    <div
      role="progressbar"
      aria-label={label ?? labels.readingProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={now}
      className={cx(
        'h-(--kafka-reading-progress-height) w-full bg-(--kafka-reading-progress-track)',
        position === 'fixed' && 'fixed inset-x-0 top-0 z-(--kafka-reading-progress-z)',
        className,
      )}
    >
      <div
        className="kafka-progress-fill h-full origin-left bg-(--kafka-reading-progress-fill) transition-[width] duration-(--kafka-reading-progress-duration)"
        style={{ width: `${now}%` }}
      />
    </div>
  )
}
