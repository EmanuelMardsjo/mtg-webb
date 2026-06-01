import type { Meta, StoryObj } from '@storybook/react'
import { Container, Section, Stack, Text } from '@system/primitives'
import s from './_internal/ImageBank.module.css'

const meta: Meta = { title: 'Foundations/Image Bank' }
export default meta

type S = StoryObj

type ImageBankAsset = {
  id: string
  sourceName: string
  nodeId: string
  src: string
  width: number
  height: number
  alt: string
}

type ImageBankGroup = {
  category: string
  sourceNodeId: string
  assets: readonly ImageBankAsset[]
}

const peopleImageBankAssets = [
  {
    id: 'mtg-image-44',
    sourceName: 'image 44',
    nodeId: '74:73',
    src: '/images/image-bank/mtg-image-44.webp',
    width: 1448,
    height: 1086,
    alt: 'Person laughing on a sofa in warm interior light.'
  },
  {
    id: 'mtg-image-20',
    sourceName: 'image 20',
    nodeId: '74:74',
    src: '/images/image-bank/mtg-image-20.webp',
    width: 1448,
    height: 1086,
    alt: 'Two people sharing food at a table.'
  },
  {
    id: 'mtg-image-19',
    sourceName: 'image 19',
    nodeId: '74:75',
    src: '/images/image-bank/mtg-image-19.webp',
    width: 1122,
    height: 1402,
    alt: 'Person in a yellow coat standing in a hallway.'
  },
  {
    id: 'mtg-image-25',
    sourceName: 'image 25',
    nodeId: '74:76',
    src: '/images/image-bank/mtg-image-25.webp',
    width: 1448,
    height: 1086,
    alt: 'Two people talking at home.'
  },
  {
    id: 'mtg-image-23',
    sourceName: 'image 23',
    nodeId: '74:77',
    src: '/images/image-bank/mtg-image-23.webp',
    width: 1122,
    height: 1402,
    alt: 'Person sitting at a kitchen counter.'
  },
  {
    id: 'mtg-image-24',
    sourceName: 'image 24',
    nodeId: '74:78',
    src: '/images/image-bank/mtg-image-24.webp',
    width: 1448,
    height: 1086,
    alt: 'Person sitting on a bed beside a yellow lamp.'
  },
  {
    id: 'mtg-image-26',
    sourceName: 'image 26',
    nodeId: '74:79',
    src: '/images/image-bank/mtg-image-26.webp',
    width: 1122,
    height: 1402,
    alt: 'People carrying moving boxes on a stairwell.'
  },
  {
    id: 'mtg-image-29',
    sourceName: 'image 29',
    nodeId: '74:80',
    src: '/images/image-bank/mtg-image-29.webp',
    width: 1448,
    height: 1086,
    alt: 'Person wearing headphones on public transport.'
  },
  {
    id: 'mtg-image-30',
    sourceName: 'image 30',
    nodeId: '74:81',
    src: '/images/image-bank/mtg-image-30.webp',
    width: 1448,
    height: 1086,
    alt: 'Person reading while a child rests on a sofa.'
  },
  {
    id: 'mtg-image-31',
    sourceName: 'image 31',
    nodeId: '74:82',
    src: '/images/image-bank/mtg-image-31.webp',
    width: 1402,
    height: 1122,
    alt: 'Two people looking at a phone over coffee.'
  },
  {
    id: 'mtg-image-42',
    sourceName: 'image 42',
    nodeId: '74:83',
    src: '/images/image-bank/mtg-image-42.webp',
    width: 1122,
    height: 1402,
    alt: 'Person watering plants on a balcony.'
  },
  {
    id: 'mtg-image-52',
    sourceName: 'image 52',
    nodeId: '74:84',
    src: '/images/image-bank/mtg-image-52.webp',
    width: 1448,
    height: 1086,
    alt: 'Friends gathered together outdoors.'
  },
  {
    id: 'mtg-image-50',
    sourceName: 'image 50',
    nodeId: '74:85',
    src: '/images/image-bank/mtg-image-50.webp',
    width: 1448,
    height: 1086,
    alt: 'Person smiling near the water.'
  },
  {
    id: 'mtg-image-51',
    sourceName: 'image 51',
    nodeId: '74:86',
    src: '/images/image-bank/mtg-image-51.webp',
    width: 1448,
    height: 1086,
    alt: 'People sitting together by the coast.'
  },
  {
    id: 'mtg-image-48',
    sourceName: 'image 48',
    nodeId: '74:87',
    src: '/images/image-bank/mtg-image-48.webp',
    width: 1672,
    height: 941,
    alt: 'Group of people talking outdoors.'
  },
  {
    id: 'mtg-image-53',
    sourceName: 'image 53',
    nodeId: '74:88',
    src: '/images/image-bank/mtg-image-53.webp',
    width: 1122,
    height: 1402,
    alt: 'Two people walking together in the city.'
  }
] satisfies ImageBankAsset[]

const environmentImageBankAssets = [
  {
    id: 'mtg-environment-nhoy9ydqcew',
    sourceName: 'unsplash:nHOY9ydQcew',
    nodeId: '75:106',
    src: '/images/image-bank/mtg-environment-nhoy9ydqcew.webp',
    width: 1666,
    height: 2499,
    alt: 'A small boat on calm water at sunset.'
  },
  {
    id: 'mtg-environment-fwe4y2pgmtc',
    sourceName: 'unsplash:FWE4Y2PgMtc',
    nodeId: '75:103',
    src: '/images/image-bank/mtg-environment-fwe4y2pgmtc.webp',
    width: 1640,
    height: 2499,
    alt: 'A tall glass building catching soft evening light.'
  },
  {
    id: 'mtg-environment-ldh6pqxjzte',
    sourceName: 'unsplash:lDH6pQXjZTE',
    nodeId: '75:104',
    src: '/images/image-bank/mtg-environment-ldh6pqxjzte.webp',
    width: 1875,
    height: 2500,
    alt: 'Modern office buildings viewed from below.'
  },
  {
    id: 'mtg-environment-u5prxtqxf2a',
    sourceName: 'unsplash:U5PrXTqxF2A',
    nodeId: '75:105',
    src: '/images/image-bank/mtg-environment-u5prxtqxf2a.webp',
    width: 1875,
    height: 2500,
    alt: 'A quiet cobbled street between historic city buildings.'
  },
  {
    id: 'mtg-environment-p5krmynuw9e',
    sourceName: 'unsplash:p5KrMYNUW9E',
    nodeId: '75:107',
    src: '/images/image-bank/mtg-environment-p5krmynuw9e.webp',
    width: 2499,
    height: 1666,
    alt: 'A green meadow at the edge of a shaded woodland.'
  }
] satisfies ImageBankAsset[]

const imageBankGroups = [
  { category: 'People', sourceNodeId: '74:53', assets: peopleImageBankAssets },
  { category: 'Environment', sourceNodeId: '75:108', assets: environmentImageBankAssets }
] satisfies ImageBankGroup[]

function ImageAssetCard({ image }: { image: ImageBankAsset }) {
  return (
    <article className={s.assetCard}>
      <div className={s.imageFrame} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
        <img
          className={s.image}
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <Stack gap="snug">
        <Text role="h3" as="h2">{image.id}</Text>
        <div className={s.assetMeta}>
          <div className={s.metaRow}>
            <Text role="tag" tone="muted">Source</Text>
            <Text role="body-sm" className={s.metaValue}>{image.sourceName} - {image.nodeId}</Text>
          </div>
          <div className={s.metaRow}>
            <Text role="tag" tone="muted">Size</Text>
            <Text role="body-sm" className={s.metaValue}>{image.width} x {image.height}</Text>
          </div>
          <div className={s.metaRow}>
            <Text role="tag" tone="muted">Format</Text>
            <Text role="body-sm" className={s.metaValue}>WebP</Text>
          </div>
          <div className={s.metaRow}>
            <Text role="tag" tone="muted">Path</Text>
            <Text role="body-sm" className={s.metaValue}>{image.src}</Text>
          </div>
        </div>
      </Stack>
    </article>
  )
}

export const Assets: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Stack gap="snug" className={s.bankIntro}>
            <Text role="display" as="h1">Image bank</Text>
            <Text role="lead">Imported one by one from Figma and converted to WebP for local use.</Text>
          </Stack>

          {imageBankGroups.map(group => (
            <Stack key={group.category} gap="default" className={s.categorySection}>
              <div className={s.categoryHeader}>
                <Stack gap="tight">
                  <Text role="h2">{group.category}</Text>
                  <Text role="body" tone="muted">
                    Figma node {group.sourceNodeId} - {group.assets.length} WebP assets
                  </Text>
                </Stack>
              </div>
              <div className={s.assetGrid}>
                {group.assets.map(image => (
                  <ImageAssetCard key={image.id} image={image} />
                ))}
              </div>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Section>
  )
}
