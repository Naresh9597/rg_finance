import { useEffect, useState, useSyncExternalStore } from 'react'

function subscribeQuery(query) {
  return (cb) => {
    const mql = window.matchMedia(query)
    mql.addEventListener('change', cb)
    return () => mql.removeEventListener('change', cb)
  }
}

export function useMediaQuery(query) {
  return useSyncExternalStore(
    subscribeQuery(query),
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

// Tracks whether an element is in the viewport. `once` stops observing after first entry.
export function useInView(ref, { once = false, rootMargin = '0px', threshold = 0 } = {}) {
  // Without IntersectionObserver support, treat everything as visible.
  const [inView, setInView] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) io.disconnect()
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, rootMargin, threshold])
  return inView
}

// Highlights the nav link for whichever section currently sits in the upper part of the viewport.
export function useActiveSection(ids) {
  const [active, setActive] = useState('')
  const key = ids.join(',')
  useEffect(() => {
    const els = key.split(',').map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
  return active
}
