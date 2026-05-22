import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EditorialText } from './EditorialText'

describe('EditorialText', () => {
  it('renders the prose paragraphs', () => {
    render(<EditorialText content={{ paragraphs: ['Para A.', 'Para B.'] }} />)
    expect(screen.getByText('Para A.')).toBeInTheDocument()
    expect(screen.getByText('Para B.')).toBeInTheDocument()
  })

  it('renders heading when provided', () => {
    render(<EditorialText content={{ heading: 'A city of', paragraphs: ['x'] }} />)
    expect(screen.getByRole('heading')).toHaveTextContent('A city of')
  })

  it('renders pull quote when provided', () => {
    render(<EditorialText content={{ paragraphs: ['x'], pullQuote: 'Hello world.' }} />)
    expect(screen.getByText('Hello world.')).toBeInTheDocument()
  })
})
