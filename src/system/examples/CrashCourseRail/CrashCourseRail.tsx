// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { type CSSProperties, useEffect, useRef, useState, useCallback } from 'react'
import { Section, Container, Stack, Text, Image, Icon } from '@system/primitives'
import { useReveal } from '@system/hooks'
import type { CrashCourseRailContent } from './types'
import s from './CrashCourseRail.module.css'

export type CrashCourseRailProps = { content: CrashCourseRailContent }

export function CrashCourseRail({ content }: CrashCourseRailProps) {
  const { ref: revealRef, revealed } = useReveal()

  // Per-child entrance stagger via the documented inline custom-property idiom.
  const riseStyle = (d: number): CSSProperties => ({ '--rise-d': `${d}ms` } as CSSProperties)

  // Component-local active-index tracking (D-5 — no new hook).
  const railRef = useRef<HTMLUListElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const cardCount = content.cards.length

  useEffect(() => {
    const rail = railRef.current
    if (!rail || typeof window === 'undefined') return

    function tick() {
      rafRef.current = null
      const el = railRef.current
      if (!el) return
      const first = el.firstElementChild as HTMLElement | null
      if (!first) return
      const second = el.children[1] as HTMLElement | null
      // Derive the per-cell step from layout, never hardcoded px.
      const step = second
        ? second.offsetLeft - first.offsetLeft
        : first.offsetWidth
      if (step <= 0) return
      const raw = Math.round(el.scrollLeft / step)
      const clamped = Math.max(0, Math.min(cardCount - 1, raw))
      setActiveIndex(clamped)
    }

    function onScroll() {
      if (rafRef.current !== null) return
      rafRef.current = window.requestAnimationFrame(tick)
    }

    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      rail.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [cardCount])

  const scrollToIndex = useCallback((i: number) => {
    const rail = railRef.current
    if (!rail) return
    const clamped = Math.max(0, Math.min(content.cards.length - 1, i))
    const cell = rail.children[clamped] as HTMLElement | undefined
    if (!cell) return
    const reduce = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rail.scrollTo({ left: cell.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
  }, [content.cards.length])

  const onRailKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        scrollToIndex(activeIndex + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        scrollToIndex(activeIndex - 1)
        break
      case 'Home':
        e.preventDefault()
        scrollToIndex(0)
        break
      case 'End':
        e.preventDefault()
        scrollToIndex(content.cards.length - 1)
        break
      default:
        break
    }
  }

  return (
    <Section theme={content.theme ?? 'yellow'} spacing="lg" aria-label={content.heading}>
      <Container size="default">
        {/* ---- editorial header (centered) ---- */}
        <div
          ref={revealRef}
          className={[s.head, revealed && s.revealed].filter(Boolean).join(' ')}
        >
          <Stack gap="loose" align="center">
            {/* Text does not accept `style`/`id` — carry the --rise-d stagger on a plain wrapper, the .rise class drives the transition. */}
            {content.eyebrow && (
              <div className={s.rise} style={riseStyle(0)}>
                <Text role="tag">{content.eyebrow}</Text>
              </div>
            )}
            <div className={s.rise} style={riseStyle(90)}>
              <Text role="display" as="h2">{content.heading}</Text>
            </div>
            {content.lead && (
              <div className={s.rise} style={riseStyle(180)}>
                <Text role="lead">{content.lead}</Text>
              </div>
            )}
          </Stack>
        </div>

        {content.cards.length > 0 && (
          <>
            {/* ---- scroll-snap rail ---- */}
            <ul
              ref={railRef}
              className={s.rail}
              tabIndex={0}
              aria-label={`${content.heading} — scrollable cards`}
              onKeyDown={onRailKeyDown}
            >
              {content.cards.map((card, i) => {
                const Tag = card.href ? 'a' : 'article'
                return (
                  <li key={i} className={s.cell}>
                    <Tag {...(card.href ? { href: card.href } : {})} className={s.card}>
                      <figure className={s.media}>
                        <Image
                          src={card.image.src}
                          alt={card.image.alt}
                          focalPoint="center"
                          loading="lazy"
                          radius="none"
                        />
                      </figure>
                      <span className={s.cap}>
                        <Text role="h3" as="span" className={s.cardTitle}>{card.title}</Text>
                        <Text role="body-sm" as="span" className={s.cardDesc}>{card.description}</Text>
                        {card.href && (
                          <span className={s.more}>
                            Read more <Icon name="arrow-right" size="sm" aria-hidden />
                          </span>
                        )}
                      </span>
                    </Tag>
                  </li>
                )
              })}
            </ul>

            {/* ---- control row: dots + prev/next ---- */}
            <div className={s.controls}>
              <nav className={s.dots} aria-label="Crash course pagination">
                {content.cards.map((card, i) => (
                  <button
                    type="button"
                    key={i}
                    className={[s.dot, i === activeIndex && s.dotActive].filter(Boolean).join(' ')}
                    aria-current={i === activeIndex ? 'true' : undefined}
                    aria-label={`Go to ${card.title}`}
                    onClick={() => scrollToIndex(i)}
                  />
                ))}
              </nav>
              <div className={s.nav}>
                <button
                  type="button"
                  className={s.navBtn}
                  aria-label="Previous"
                  disabled={activeIndex === 0}
                  onClick={() => scrollToIndex(activeIndex - 1)}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
                    <path
                      d="M15 6L9 12L15 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className={s.navBtn}
                  aria-label="Next"
                  disabled={activeIndex === content.cards.length - 1}
                  onClick={() => scrollToIndex(activeIndex + 1)}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </Container>
    </Section>
  )
}
