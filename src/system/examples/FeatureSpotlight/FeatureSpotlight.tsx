// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { type CSSProperties } from 'react'
import { Section, Container, Stack, Text, Image, Icon } from '@system/primitives'
import { useReveal, useParallax } from '@system/hooks'
import type { FeatureSpotlightContent } from './types'
import s from './FeatureSpotlight.module.css'

export type FeatureSpotlightProps = { content: FeatureSpotlightContent }

export function FeatureSpotlight({ content }: FeatureSpotlightProps) {
  const { ref: revealRef, revealed } = useReveal()
  const { ref: parallaxRef } = useParallax()

  // Two hooks share one root node; inline the merged-ref callback (no shared utility).
  const mergedRef = (el: HTMLDivElement | null) => {
    revealRef.current = el
    parallaxRef.current = el
  }

  // Per-child entrance stagger via the documented inline custom-property idiom.
  const riseStyle = (d: number): CSSProperties => ({ '--rise-d': `${d}ms` } as CSSProperties)

  return (
    <div
      ref={mergedRef}
      className={[s.root, revealed && s.revealed].filter(Boolean).join(' ')}
      aria-label={content.headline}
    >
      <Section theme={content.theme ?? 'pink-soft'} spacing="lg">
        <Container size="default">
          <Stack gap="loose" align="center" className={s.editorial}>
            {/* Text does not accept `style`/`id` — carry the --rise-d stagger on a plain wrapper, the .rise class drives the transition. */}
            <div className={s.rise} style={riseStyle(0)}>
              <Text role="tag">{content.eyebrow}</Text>
            </div>
            <div className={s.rise} style={riseStyle(90)}>
              <Text role="display" as="h2">{content.headline}</Text>
            </div>
            <div className={s.rise} style={riseStyle(180)}>
              <Text role="lead">{content.lead}</Text>
            </div>
            <a href={content.cta.href} className={[s.cta, s.rise].join(' ')} style={riseStyle(270)}>
              <Text role="button" as="span">{content.cta.label}</Text>
              <Icon name="arrow-right" size="md" />
            </a>
          </Stack>
          <figure className={[s.frame, s.rise].join(' ')} style={riseStyle(360)}>
            <Image src={content.image.src} alt={content.image.alt} focalPoint="center" loading="lazy" />
          </figure>
        </Container>
      </Section>
    </div>
  )
}
