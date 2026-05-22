// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, Image, TextLink } from '@system/primitives'
import type { ImageTextContent } from './types'

export type ImageTextProps = { content: ImageTextContent }

export function ImageText({ content }: ImageTextProps) {
  const r = content.reversed ?? false
  return (
    <Section theme={content.theme} spacing="lg" bleed={content.bleed}>
      <Container size={content.bleed ? 'bleed' : 'default'}>
        <Grid>
          <Col span={{ sm: 1, md: 2, lg: 3 }} start={r ? { lg: 3 } : undefined}>
            <Image
              src={content.image.src}
              alt={content.image.alt}
              aspect={content.image.aspect ?? 'wide'}
              focalPoint={content.image.focalPoint}
              radius="md"
            />
          </Col>
          <Col span={{ sm: 1, md: 2, lg: 2 }} start={r ? { lg: 1 } : undefined}>
            <Stack gap="loose">
              {content.eyebrow && <Text role="tag" tone="muted">{content.eyebrow}</Text>}
              <Text role="h2">{content.headline}</Text>
              {content.body && <Text role="body">{content.body}</Text>}
              {content.cta && <TextLink href={content.cta.href} arrow>{content.cta.label}</TextLink>}
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
