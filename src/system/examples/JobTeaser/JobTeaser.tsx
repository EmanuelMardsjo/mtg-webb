// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Stack, Text, TextLink, Inline } from '@system/primitives'
import type { JobTeaserContent } from './types'

export type JobTeaserProps = { content: JobTeaserContent }

export function JobTeaser({ content }: JobTeaserProps) {
  return (
    <Stack gap="snug">
      {content.tag && <Text role="tag" tone="muted">{content.tag}</Text>}
      <Text role="h3" as="h3">{content.role}</Text>
      <Text role="body-sm" tone="muted">{content.location}</Text>
      {content.summary && <Text role="body">{content.summary}</Text>}
      {content.meta && (content.meta.company || content.meta.posted) && (
        <Inline gap="default">
          {content.meta.company && <Text role="meta">{content.meta.company}</Text>}
          {content.meta.posted && <Text role="meta" tone="muted">· {content.meta.posted}</Text>}
        </Inline>
      )}
      {content.cta && <TextLink href={content.cta.href} arrow>{content.cta.label}</TextLink>}
    </Stack>
  )
}
