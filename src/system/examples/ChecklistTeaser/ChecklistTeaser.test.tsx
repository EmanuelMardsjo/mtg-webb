import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChecklistTeaser } from './ChecklistTeaser'

const content = {
  heading: 'Pre-arrival',
  items: [
    { label: 'Apply for personnummer' },
    { label: 'Sort temporary housing' },
    { label: 'Translate key documents' }
  ]
}

describe('ChecklistTeaser', () => {
  it('renders heading + all items', () => {
    render(<ChecklistTeaser content={content} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Pre-arrival')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
