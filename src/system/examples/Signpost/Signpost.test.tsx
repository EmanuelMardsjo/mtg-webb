import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Signpost } from './Signpost'

const content = {
  heading: 'Start where you are',
  items: [
    { label: 'Career', href: '/career' },
    { label: 'Family', href: '/family' },
    { label: 'Community', href: '/community' }
  ]
}

describe('Signpost', () => {
  it('renders the heading', () => {
    render(<Signpost content={content} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Start where you are')
  })

  it('renders one link per item', () => {
    render(<Signpost content={content} />)
    expect(screen.getAllByRole('link')).toHaveLength(3)
  })
})
