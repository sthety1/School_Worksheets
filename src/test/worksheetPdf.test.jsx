import { describe, expect, test } from 'vitest'
import { formatPdfCountingRow, formatPdfMatchingRow } from '../pdf/worksheetPdfRows'

describe('worksheet PDF renderer helpers', () => {
  test('counting rows include visible count markers from worksheet data', () => {
    expect(formatPdfCountingRow({ total: 4, theme: 'dogs' }, 0)).toBe('1. Count: O O O O   Total: ______')
  })

  test('matching rows use the worksheet engine word field', () => {
    const row = formatPdfMatchingRow({ word: 'puppy', theme: 'dogs' }, 1)

    expect(row).toBe('2. puppy  ------  puppy')
    expect(row).not.toContain('undefined')
  })
})
