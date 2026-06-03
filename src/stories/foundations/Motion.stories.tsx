import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, Image } from '@system/primitives'
import { useReveal, useScrollFade } from '@system/hooks'
import { duration, easing } from '@tokens/primitives/motion'

const meta: Meta = { title: 'Foundations/Motion' }
export default meta

type S = StoryObj

function TokensDemo() {
  const [playCount, setPlayCount] = useState(0)

  return (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Text role="display" as="h1">Motion tokens</Text>

          <Stack gap="default" align="start">
            <Text role="h2">Durations</Text>
            <button type="button" className="motion-token-play" onClick={() => setPlayCount(c => c + 1)}>
              Play
            </button>
            {Object.entries(duration).map(([k, v]) => (
              <Stack key={k} gap="tight">
                <Text role="meta">--duration-{k} · {v as string}</Text>
                <div className="motion-duration-track">
                  <div
                    key={`${k}-${playCount}`}
                    className="motion-duration-bar"
                    style={{
                      animation: playCount > 0
                        ? `motion-token-slide ${v as string} var(--easing-standard) 1 both`
                        : undefined
                    }}
                  />
                </div>
              </Stack>
            ))}
          </Stack>

          <Stack gap="default">
            <Text role="h2">Easing</Text>
            {Object.entries(easing).map(([k, v]) => (
              <Stack key={k} gap="tight">
                <Text role="meta">--easing-{k}</Text>
                <Text role="caption" tone="muted">{v as string}</Text>
              </Stack>
            ))}
          </Stack>

          <style>{`
            .motion-token-play {
              min-height: 40px;
              padding: var(--space-3) var(--space-4);
              border: var(--border-hairline) solid var(--color-border-default);
              border-radius: var(--radius-sm);
              background: var(--color-surface-raised);
              color: var(--color-text-default);
              font-family: var(--font-display);
              font-size: var(--fs-md);
              line-height: var(--lh-button);
              font-weight: var(--fw-display-ultrabold);
              transition:
                background-color var(--motion-hover-duration) var(--motion-hover-easing),
                color var(--motion-hover-duration) var(--motion-hover-easing),
                border-color var(--motion-hover-duration) var(--motion-hover-easing);
            }

            .motion-token-play:hover {
              border-color: var(--color-accent-line);
              background: var(--color-surface-page);
            }

            .motion-duration-track {
              width: min(100%, 560px);
              padding-block: var(--space-2);
            }

            .motion-duration-bar {
              height: 24px;
              width: 40%;
              background: var(--color-accent-line);
              border-radius: var(--radius-sm);
              transform: translateX(0);
            }

            @keyframes motion-token-slide {
              from { transform: translateX(0); }
              to   { transform: translateX(60%); }
            }
          `}</style>
        </Stack>
      </Container>
    </Section>
  )
}

export const Tokens: S = {
  render: () => <TokensDemo />
}

function RevealDemo() {
  const { ref, revealed } = useReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity var(--motion-reveal-duration) var(--motion-reveal-easing), transform var(--motion-reveal-duration) var(--motion-reveal-easing)`
      }}
    >
      <Text role="hero" as="h2">Scroll-revealed text.</Text>
    </div>
  )
}

export const Reveal: S = {
  render: () => (
    <>
      <Section spacing="xl"><Container><Text role="body">Scroll down…</Text></Container></Section>
      <Section spacing="xl"><Container><Text role="body">…and a little more…</Text></Container></Section>
      <Section spacing="xl"><Container><RevealDemo /></Container></Section>
    </>
  )
}

function ScrollFadeDemo() {
  const { ref, progress } = useScrollFade()
  return (
    <div ref={ref} style={{ opacity: 1 - progress * 0.7 }}>
      <Image src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1600" alt="Coastal forest" aspect="cinematic" radius="md" />
    </div>
  )
}

export const ScrollFade: S = {
  render: () => (
    <>
      <Section spacing="xl"><Container><ScrollFadeDemo /></Container></Section>
      <Section spacing="xl"><Container><Text role="body">Scroll the image up — opacity follows scroll progress.</Text></Container></Section>
    </>
  )
}
