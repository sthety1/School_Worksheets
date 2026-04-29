import { describe, expect, test } from 'vitest'
import { recommendPlacementPreset } from '../placement'

describe('placement recommendation', () => {
  test('recommends Pre-K for low totals', () => {
    const rec = recommendPlacementPreset({
      letterTracing: 1,
      phonics: 1,
      countingObjects: 1,
      numberTracing: 1,
      addition: 1,
      extra: 0,
    })
    expect(rec.preset).toBe('preK')
  })

  test('recommends K Mid for mid totals', () => {
    const rec = recommendPlacementPreset({
      letterTracing: 4,
      phonics: 4,
      countingObjects: 3,
      numberTracing: 3,
      addition: 3,
      extra: 0,
    })
    expect(rec.total).toBe(17)
    expect(rec.preset).toBe('kMid')
  })

  test('recommends K End for high totals', () => {
    const rec = recommendPlacementPreset({
      letterTracing: 5,
      phonics: 5,
      countingObjects: 5,
      numberTracing: 5,
      addition: 5,
      extra: 5,
    })
    expect(rec.total).toBe(30)
    expect(rec.preset).toBe('kEnd')
  })
})

