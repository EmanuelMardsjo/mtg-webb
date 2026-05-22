// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Stack, Text } from '@system/primitives'
import type { EditorialTextContent } from './types'

export type EditorialTextProps = { content: EditorialTextContent }

export function EditorialText({ content }: EditorialTextProps) {
  return (
    <Section theme={content.theme} spacing="lg">
      <Container size="prose">
        <Stack gap="loose">
          {content.heading && <Text role="h2">{content.heading}</Text>}
          {content.paragraphs.map((p, i) => (
            <Text role="body" key={i}>{p}</Text>
          ))}
          {content.pullQuote && <Text role="quote">{content.pullQuote}</Text>}
        </Stack>
      </Container>
    </Section>
  )
}
