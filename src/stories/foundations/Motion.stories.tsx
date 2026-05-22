import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, Image } from '@system/primitives'
import { useReveal, useScrollFade } from '@system/hooks'
import { duration, easing } from '@tokens/primitives/motion'

const meta: Meta = { title: 'Foundations/Motion' }
export default meta

type S = StoryObj

export const Tokens: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Text role="display" as="h1">Motion tokens</Text>

          <Stack gap="default">
            <Text role="h2">Durations</Text>
            {Object.entries(duration).map(([k, v]) => (
              <Stack key={k} gap="tight">
                <Text role="meta">--duration-{k} · {v as string}</Text>
                <div style={{
                  height: '24px',
                  width: '40%',
                  background: 'var(--color-accent-line)',
                  borderRadius: 'var(--radius-sm)',
                  animation: `slide ${v as string} var(--easing-standard) infinite alternate`
                }} />
              </Stack>
            ))}
          </Stack>

          <Stack gap="default">
            <Text role="h2">Easings</Text>
            {Object.entries(easing).map(([k, v]) => (
              <Stack key={k} gap="tight">
                <Text role="meta">--easing-{k}</Text>
                <Text role="caption" tone="muted">{v as string}</Text>
              </Stack>
            ))}
          </Stack>

          <style>{`
            @keyframes slide {
              from { transform: translateX(0); }
              to   { transform: translateX(60%); }
            }
          `}</style>
        </Stack>
      </Container>
    </Section>
  )
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
