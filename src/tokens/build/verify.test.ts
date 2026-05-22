import { describe, it, expect } from 'vitest'
import { verifyThemeContrast } from './verify'

describe('verifyThemeContrast', () => {
  it('returns no errors when every theme passes AA', () => {
    const errors = verifyThemeContrast()
    expect(errors).toEqual([])
  })
})
