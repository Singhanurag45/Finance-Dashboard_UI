import { useEffect, useState } from 'react'

/**
 * Tracks whether a CSS media query currently matches.
 * Example: useMediaQuery('(min-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = () =>
    typeof window !== 'undefined' && window.matchMedia(query).matches

  const [matches, setMatches] = useState(getMatches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
