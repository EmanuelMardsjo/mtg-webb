import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Grid } from './Grid'

describe('Grid', () => {
  it('renders a div with the grid class', () => {
    const { container } = render(<Grid>x</Grid>)
    expect(container.firstChild).toHaveClass('grid')
  })

  it('renders children', () => {
    const { getByText } = render(<Grid>hello</Grid>)
    expect(getByText('hello')).toBeInTheDocument()
  })
})
