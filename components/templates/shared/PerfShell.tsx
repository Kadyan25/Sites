import { useEffect, useRef, useState, type ReactNode } from 'react'

interface PerfShellProps {
  placeholder: ReactNode
  children: ReactNode
  minHeight?: string
  className?: string
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

/**
 * Wraps a heavy WebGL/animated hero: renders a static placeholder immediately
 * (satisfies LCP), then lazily mounts the real content only once scrolled
 * into view, and never mounts it at all under prefers-reduced-motion.
 */
export function PerfShell({ placeholder, children, minHeight = '100vh', className = '' }: PerfShellProps) {
  const [active, setActive] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    // If the hero is already on screen at mount (the common case — this is
    // usually the first thing on the page), activate immediately via a
    // synchronous geometry check rather than waiting on the observer's first
    // async callback.
    const rect = el.getBoundingClientRect()
    const viewportH = window.innerHeight || document.documentElement.clientHeight
    const viewportW = window.innerWidth || document.documentElement.clientWidth
    if (rect.top < viewportH + 200 && rect.bottom > -200 && rect.left < viewportW + 200 && rect.right > -200) {
      setActive(true)
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.1, rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const showActive = active && !reducedMotion

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ minHeight }}>
      {!showActive && <div className="absolute inset-0" style={{ zIndex: 0 }}>{placeholder}</div>}
      {showActive && (
        <div className="absolute inset-0" style={{ zIndex: 1 }}>{children}</div>
      )}
    </div>
  )
}
