import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export type RevealOptions = {
  /** Margin around the root in IntersectionObserver. */
  rootMargin?: string
  /** Threshold (0-1). */
  threshold?: number
}

// Default reveal margin: trigger when the element is 10% inside the viewport bottom edge.
const DEFAULT_ROOT_MARGIN = '0% 0% -10% 0%'

export function useReveal({ rootMargin = DEFAULT_ROOT_MARGIN, threshold = 0.15 }: RevealOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null)
  // Honor prefers-reduced-motion at mount: skip the observer dance entirely.
  const [revealed, setRevealed] = useState<boolean>(() => prefersReducedMotion())

  useEffect(() => {
    if (revealed) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin, threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [revealed, rootMargin, threshold])

  return { ref, revealed }
}
