import { useEffect, useState } from 'react'

/** '#/components/chip' → 'components/chip'. The home page is ''. */
export const routeOf = (hash: string) => hash.replace(/^#\/?/, '').replace(/\/+$/, '')

export function useRoute() {
  const [route, setRoute] = useState(() => routeOf(location.hash))
  useEffect(() => {
    const on = () => setRoute(routeOf(location.hash))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export const href = (route: string) => '#/' + route
export const navigate = (route: string) => { location.hash = href(route) }
