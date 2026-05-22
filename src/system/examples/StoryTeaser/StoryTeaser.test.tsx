import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoryTeaser } from './StoryTeaser'

const base = {
  tag: 'Stories',
  headline: 'Building a life by the archipelago',
  excerpt: 'Sara moved from Madrid in 2024.',
  image: { src: '/x.jpg', alt: 'Sara' },
  byline: { name: 'Sara P.', role: 'Researcher' },
  cta: { label: 'Read', href: '/stories/sara' }
}

describe('StoryTeaser', () => {
  it('renders headline + byline', () => {
    render(<StoryTeaser content={base} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Building a life by the archipelago')
    expect(screen.getByText(/Sara P\./)).toBeInTheDocument()
  })

  it('omits image when content.image is absent', () => {
    const { container } = render(<StoryTeaser content={{ ...base, image: undefined }} />)
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders headline alone when only headline supplied', () => {
    render(<StoryTeaser content={{ headline: 'Just a headline' }} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Just a headline')
  })
})
