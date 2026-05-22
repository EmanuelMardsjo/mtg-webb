import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobTeaser } from './JobTeaser'

const content = {
  tag: 'Engineering',
  role: 'Senior Software Engineer',
  location: 'Gothenburg · Hybrid',
  summary: 'Help build the future of automotive software.',
  meta: { company: 'Volvo Cars', posted: 'Posted 3 days ago' },
  cta: { label: 'See role', href: '/jobs/123' }
}

describe('JobTeaser', () => {
  it('renders role headline', () => {
    render(<JobTeaser content={content} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Senior Software Engineer')
  })

  it('renders location and meta', () => {
    render(<JobTeaser content={content} />)
    expect(screen.getByText('Gothenburg · Hybrid')).toBeInTheDocument()
    expect(screen.getByText(/Volvo Cars/)).toBeInTheDocument()
  })

  it('renders only role when meta+summary+cta omitted', () => {
    render(<JobTeaser content={{ role: 'Engineer', location: 'Gothenburg' }} />)
    expect(screen.getByText('Engineer')).toBeInTheDocument()
  })
})
