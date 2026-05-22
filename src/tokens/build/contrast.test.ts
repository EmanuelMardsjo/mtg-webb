import { describe, it, expect } from 'vitest'
import { contrastRatio, passesAA } from './contrast'

describe('contrast', () => {
  it('reports max contrast for black vs white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0)
  })

  it('reports min contrast for identical colors', () => {
    expect(contrastRatio('#888888', '#888888')).toBeCloseTo(1, 1)
  })

  it('passes AA when ratio >= 4.5', () => {
    expect(passesAA('#0A1020', '#FBF8F3')).toBe(true)
  })

  it('fails AA when ratio < 4.5', () => {
    expect(passesAA('#999999', '#AAAAAA')).toBe(false)
  })
})
