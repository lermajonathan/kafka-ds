import { useEffect, useRef, type ReactNode } from 'react'

/** The examples point at files served from the root (/portada.svg). The site lives under a base path, so prefix them. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
function prefix(root: HTMLElement) {
  for (const el of root.querySelectorAll<HTMLElement>('[src^="/"], [href^="/"]')) {
    for (const attr of ['src', 'href']) {
      const v = el.getAttribute(attr)
      if (v?.startsWith('/') && !v.startsWith('//') && !v.startsWith(BASE + '/')) el.setAttribute(attr, BASE + v)
    }
  }
}

/** A runnable example above the code that prints it. */
export function LiveExample({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    prefix(el)
    const watch = new MutationObserver(() => prefix(el)) // deferred embeds create their iframe on click
    watch.observe(el, { childList: true, subtree: true })
    return () => watch.disconnect()
  }, [])
  return <div ref={ref} data-live-example role="group" aria-label={`Ejemplo: ${title}`} className="live-example">{children}</div>
}
