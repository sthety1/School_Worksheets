import { describe, expect, test } from 'vitest'
import { WorksheetPdfDocument } from '../pdf/worksheetPdf'

const collectText = (node) => {
  if (node === null || node === undefined || typeof node === 'boolean') return []
  if (typeof node === 'string' || typeof node === 'number') return [String(node)]
  if (Array.isArray(node)) return node.flatMap(collectText)
  if (typeof node === 'object') return collectText(node.props?.children)
  return []
}

describe('worksheet PDF document', () => {
  test('renders color-by-number pages as worksheet instructions instead of raw data', () => {
    const doc = WorksheetPdfDocument({
      filenameLabel: 'math-packet.pdf',
      pages: [
        {
          kind: 'worksheet',
          config: {
            type: 'colorByNumber',
            theme: 'dogs',
            childName: '',
          },
          student: [
            { n: 1, shape: 'shape A' },
            { n: 2, shape: 'shape B' },
          ],
          answers: null,
          standards: [],
        },
      ],
    })

    const text = collectText(doc).join(' ')

    expect(text).toContain('Color by Number')
    expect(text).toContain('Color this shape with number 1')
    expect(text).toContain('Color key: 1-black')
    expect(text).not.toContain('{"n":1')
  })
})
