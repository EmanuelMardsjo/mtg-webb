// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, Image, TextLink } from '@system/primitives'
import type { StoryTeaserContent } from './types'

export type StoryTeaserProps = { content: StoryTeaserContent }

export function StoryTeaser({ content }: StoryTeaserProps) {
  return (
    <Section theme={content.theme} spacing="lg">
      <Container>
        <Grid>
          {content.image && (
            <Col span={{ sm: 1, md: 2, lg: 3 }}>
              <Image
                src={content.image.src}
                alt={content.image.alt}
                aspect="portrait"
                focalPoint={content.image.focalPoint}
                radius="md"
              />
            </Col>
          )}
          <Col span={{ sm: 1, md: 2, lg: 2 }}>
            <Stack gap="loose">
              {content.tag && <Text role="tag" tone="muted">{content.tag}</Text>}
              <Text role="h2" as="h2">{content.headline}</Text>
              {content.excerpt && <Text role="lead">{content.excerpt}</Text>}
              {content.byline && (
                <Text role="meta">
                  {content.byline.name}{content.byline.role && ` · ${content.byline.role}`}
                </Text>
              )}
              {content.cta && <TextLink href={content.cta.href} arrow>{content.cta.label}</TextLink>}
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
