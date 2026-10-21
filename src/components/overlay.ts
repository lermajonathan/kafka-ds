/* Kafka · overlay helpers: position a floating panel next to its anchor, and dismiss it.
   Panels use the native Popover API (`popover="manual"`) so they live in the top layer: no z-index wars, never clipped by an
   ancestor's overflow. Dismissal (Escape, click outside) is handled here so every overlay behaves the same. */
import { useEffect, useLayoutEffect, type RefObject } from 'react'

export type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'top' | 'bottom'

/** Opens and closes a `popover="manual"` element from state. */
export function usePopoverState(panel: RefObject<HTMLElement | null>, open: boolean) {
  useLayoutEffect(() => {
    const el = panel.current
    if (!el || typeof el.showPopover !== 'function') return
    const isOpen = el.matches(':popover-open')
    if (open && !isOpen) el.showPopover()
    else if (!open && isOpen) el.hidePopover()
  }, [open, panel])
}

/** Places the panel next to the anchor with `position: fixed` coordinates, flips when it does not fit, and follows scroll and resize. */
export function useAnchoredPosition(
  anchor: RefObject<HTMLElement | null>,
  panel: RefObject<HTMLElement | null>,
  open: boolean,
  { placement = 'bottom-start', offset = 8, matchWidth = false }: { placement?: Placement; offset?: number; matchWidth?: boolean } = {},
) {
  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const a = anchor.current, p = panel.current
      if (!a || !p) return
      const ar = a.getBoundingClientRect()
      p.style.position = 'fixed'; p.style.inset = 'auto'; p.style.margin = '0'
      if (matchWidth) p.style.width = `${ar.width}px`
      const pr = p.getBoundingClientRect()
      const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight
      const below = placement.startsWith('bottom')
      let top = below ? ar.bottom + offset : ar.top - pr.height - offset
      if (below && top + pr.height > vh && ar.top - pr.height - offset >= 0) top = ar.top - pr.height - offset
      else if (!below && top < 0 && ar.bottom + pr.height + offset <= vh) top = ar.bottom + offset
      let left = placement.endsWith('end') ? ar.right - pr.width : placement === 'top' || placement === 'bottom' ? ar.left + (ar.width - pr.width) / 2 : ar.left
      left = Math.max(8, Math.min(left, vw - pr.width - 8))
      p.style.top = `${Math.max(0, top)}px`; p.style.left = `${left}px`
    }
    place()
    window.addEventListener('resize', place); window.addEventListener('scroll', place, true)
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [open, anchor, panel, placement, offset, matchWidth])
}

/** Escape and outside pointer presses call `onDismiss`. Presses inside any of `inside` do not. */
export type DismissReason = 'escape' | 'outside'
export function useDismiss(open: boolean, inside: Array<RefObject<HTMLElement | null>>, onDismiss: (reason: DismissReason) => void) {
  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onDismiss('escape') } }
    const down = (e: PointerEvent) => { if (!inside.some((r) => r.current?.contains(e.target as Node))) onDismiss('outside') }
    document.addEventListener('keydown', key, true)
    document.addEventListener('pointerdown', down, true)
    return () => { document.removeEventListener('keydown', key, true); document.removeEventListener('pointerdown', down, true) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onDismiss])
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
export const focusableIn = (root: HTMLElement | null) => (root ? Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)) : [])
