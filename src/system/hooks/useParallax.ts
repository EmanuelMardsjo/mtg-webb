import { useEffect, useRef } from 'react'

function isReduced(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('force-reduced-motion')) return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

// Restrained per-layer translateY drift (px). No scale/rotate — brand motion guardrail.
const TEXT_DRIFT = -18
const FRAME_DRIFT = -28
const IMG_DRIFT = -40

/**
 * Smoothed 3-layer scroll parallax for an element (e.g. the FeatureSpotlight block root).
 * Subscribes to scroll/resize via a single rAF-throttled listener and writes restrained
 * translateY drift to --parallax-text/-frame/-img CSS custom properties directly on the
 * ref node; never calls setState, so there is no per-frame re-render. The CSS module is
 * expected to consume those vars (e.g. `transform: translate3d(0, var(--parallax-text, 0px), 0)`).
 *
 * Fully disabled under reduced motion (prefers-reduced-motion or the Storybook
 * `force-reduced-motion` class): no listener is attached and the vars are left unset, so the
 * CSS `0px` fallback applies and the block is static (REQ-04).
 */
export function useParallax() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isReduced()) return // REQ-04: no listener, zero offsets, fully static
    const el = ref.current
    if (!el) return

    let raf = 0
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const target = ref.current
        if (!target) return
        const rect = target.getBoundingClientRect()
        const vh = window.innerHeight || 1
        // 0 when element just enters from the bottom; 1 when its top reaches viewport top.
        const p = Math.min(1, Math.max(0, 1 - rect.top / vh))
        target.style.setProperty('--parallax-text', `${(p * TEXT_DRIFT).toFixed(2)}px`)
        target.style.setProperty('--parallax-frame', `${(p * FRAME_DRIFT).toFixed(2)}px`)
        target.style.setProperty('--parallax-img', `${(p * IMG_DRIFT).toFixed(2)}px`)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { ref }
}
