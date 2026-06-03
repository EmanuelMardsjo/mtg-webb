// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { type CSSProperties } from 'react'
import { Section, Container, Stack, Text, TextLink, Image, Icon } from '@system/primitives'
import { useReveal } from '@system/hooks'
import type { FooterCtaContent } from './types'
import s from './FooterCta.module.css'

export type FooterCtaProps = { content: FooterCtaContent }

export function FooterCta({ content }: FooterCtaProps) {
  const { ref: revealRef, revealed } = useReveal()

  // Per-child entrance stagger via the documented inline custom-property idiom.
  const riseStyle = (d: number): CSSProperties => ({ '--rise-d': `${d}ms` } as CSSProperties)

  return (
    <div className={s.root}>
      {/* RUNWAY — neutral lead-in */}
      <Section theme={content.runwayTheme ?? 'neutral'} spacing="lg">
        <Container size="default">
          <Stack gap="loose">
            <Text role="tag">{content.runway.eyebrow}</Text>
            <Text role="hero" as="h1">{content.runway.headline}</Text>
            <Text role="lead">{content.runway.lead}</Text>
          </Stack>
          {content.runway.media && (
            <figure className={s.runwayMedia}>
              <Image
                src={content.runway.media.src}
                alt={content.runway.media.alt}
                focalPoint="center"
                loading="lazy"
              />
            </figure>
          )}
        </Container>
      </Section>

      {/* FOOTER ZONE — amber end-state */}
      <Section theme={content.footerTheme ?? 'amber'} spacing="xl" aria-label={content.cta.title}>
        <Container size="default">
          {/* one dominant outlined CTA pill, reveal-staggered */}
          <div
            ref={revealRef}
            className={[s.ctaPill, revealed && s.revealed].filter(Boolean).join(' ')}
          >
            {/* Text does not accept `style`/`id` — carry the --rise-d stagger on a plain wrapper, the .rise class drives the transition. */}
            <div className={s.rise} style={riseStyle(0)}>
              <Text role="tag">{content.cta.eyebrow}</Text>
            </div>
            <div className={s.rise} style={riseStyle(90)}>
              <Text role="display" as="h2">{content.cta.title}</Text>
            </div>
            <div className={s.rise} style={riseStyle(180)}>
              <Text role="lead">{content.cta.lead}</Text>
            </div>
            <a
              href={content.cta.action.href}
              className={[s.ctaButton, s.rise].join(' ')}
              style={riseStyle(270)}
            >
              <Text role="button" as="span">{content.cta.action.label}</Text>
              <Icon name="arrow-right" size="md" />
            </a>
          </div>

          {/* footer chrome */}
          <a className={s.footWordmark} href="#" aria-label="Move to Gothenburg — home">
            <svg viewBox="0 0 220 24" fill="none" aria-hidden="true" focusable="false">
              <text
                x="0"
                y="19"
                fill="currentColor"
                fontFamily="var(--font-display)"
                fontWeight="800"
                fontSize="20"
                letterSpacing="-0.02em"
              >
                Move to Gothenburg
              </text>
            </svg>
          </a>
          <div className={s.footCols}>
            {content.footer.columns.map((col, i) => (
              <div key={i} className={s.footCol}>
                <Text role="meta" as="p">{col.tag}</Text>
                <ul>
                  {col.items.map((it, j) => (
                    <li key={j}>
                      {it.href ? (
                        <TextLink href={it.href}>{it.text}</TextLink>
                      ) : (
                        <Text role="body-sm" as="span">{it.text}</Text>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={s.footBar}>
            <Text role="meta" as="span">{content.footer.legal}</Text>
            {content.footer.coords && (
              <Text role="meta" as="span" className={s.coords}>{content.footer.coords}</Text>
            )}
          </div>
        </Container>
      </Section>
    </div>
  )
}
