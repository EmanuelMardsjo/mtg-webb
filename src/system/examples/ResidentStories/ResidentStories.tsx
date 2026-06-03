// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { type CSSProperties, useEffect, useState } from 'react'
import { Section, Text, Image, Icon } from '@system/primitives'
import { useScrollSections } from '@system/hooks'
import type { ResidentStoriesContent } from './types'
import s from './ResidentStories.module.css'

export type ResidentStoriesProps = { content: ResidentStoriesContent }

export function ResidentStories({ content }: ResidentStoriesProps) {
  const { stories } = content
  const ids = stories.map((_, i) => `story-${i}`)

  // Active story derived solely from useScrollSections (D-2) — the viewport
  // settle option is intentionally omitted so the editorial sequence stays
  // un-jacked; no manual scroll listener / rAF math either.
  const { activeId, register } = useScrollSections<string>(ids)
  const activeIndex = Math.max(0, ids.indexOf(activeId))

  // Per-piece entrance stagger via the documented inline custom-property idiom.
  const riseStyle = (d: number): CSSProperties => ({ '--rise-d': `${d}ms` } as CSSProperties)

  // POST-MOUNT LIVE GATE (SC#2, the React-idiomatic `.is-live` equivalent):
  // pre-mount / no-JS there is NO `data-live`, so 04-02's CSS keeps the base
  // state a readable in-flow stack (all stories visible). Only after this effect
  // runs does `data-live` appear, unlocking the absolute cross-fade hidden states.
  const [live, setLive] = useState(false)
  useEffect(() => {
    // Intentional one-shot mount flag — flips the data-live gate exactly once
    // after mount (the MTGCompanion setMounted precedent), not a sync state loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLive(true)
  }, [])

  return (
    <Section
      theme={content.theme ?? 'pink-soft'}
      spacing="sm"
      aria-label={content.heading ?? 'Stories from people who made the move'}
    >
      <div className={s.block} {...(live ? { 'data-live': '' } : {})}>
        {/* ---- sticky stage: one viewport every story shares ---- */}
        <div className={s.stage}>
          {/* progress indicator — decorative by default (D-4); --progress drives
              the CSS scaleY fill in 04-02, never a per-frame JS height write. */}
          <div
            className={s.progress}
            aria-hidden
            style={{ ['--progress']: (activeIndex + 1) / stories.length } as CSSProperties}
          >
            <span className={s.progressFill} />
          </div>

          {stories.map((story, i) => {
            const isActive = ids[i] === activeId
            const Tag = story.href ? 'a' : 'article'
            return (
              <Tag
                key={i}
                {...(story.href ? { href: story.href } : {})}
                className={[s.story, isActive && s.storyActive].filter(Boolean).join(' ')}
                data-side={story.side ?? (i % 2 ? 'left' : 'right')}
              >
                <div className={s.inner}>
                  <div className={s.text}>
                    {/* Text accepts no style/id — carry the --rise-d stagger on a
                        plain wrapper, the .rise class drives the transition. */}
                    <div className={s.rise} style={riseStyle(0)}>
                      <Text role="tag">{story.eyebrow}</Text>
                    </div>
                    <div className={s.quote}>
                      {/* decorative giant open-quote glyph (ornamental type, not an Icon) */}
                      <span className={s.mark} aria-hidden>{'“'}</span>
                      {/* D-9: role h2 → display-800 visual, as="h3" keeps outline level → <h3> */}
                      <div className={s.rise} style={riseStyle(90)}>
                        <Text role="h2" as="h3">{story.headline}</Text>
                      </div>
                    </div>
                    <div className={s.rise} style={riseStyle(180)}>
                      <Text role="body" as="p">{story.attribution}</Text>
                    </div>
                    {story.href && (
                      <span className={s.more}>
                        Read story <Icon name="arrow-right" size="sm" aria-hidden />
                      </span>
                    )}
                  </div>
                  <figure className={s.media}>
                    <Image
                      src={story.image.src}
                      alt={story.image.alt}
                      focalPoint="center"
                      loading="lazy"
                      radius="none"
                    />
                  </figure>
                </div>
              </Tag>
            )
          })}
        </div>

        {/* ---- tall scroll track: one full viewport per story drives activeId ----
            aria-hidden — the anchors are pure scroll-distance scaffolding; the
            readable content lives in the stage panels (MTGNeighborhoods precedent). */}
        <div className={s.track} aria-hidden>
          {stories.map((_, i) => (
            <div key={i} ref={register(ids[i])} className={s.anchor} />
          ))}
        </div>
      </div>
    </Section>
  )
}
