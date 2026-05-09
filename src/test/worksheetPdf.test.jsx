import { describe, expect, test } from 'vitest'
import { WorksheetPdfDocument } from '../pdf/worksheetPdf'

function collectText(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(collectText).join('')
  if (typeof node !== 'object') return ''
  return collectText(node.props?.children)
}

describe('worksheet PDF rendering', () => {
  test('renders matching worksheet words from generated row shape', () => {
    const doc = WorksheetPdfDocument({
      filenameLabel: 'matching.pdf',
      pages: [
        {
          kind: 'worksheet',
          config: { type: 'matching', theme: 'dogs', childName: '' },
          student: [{ word: 'puppy', theme: 'dogs' }],
          answers: [{ word: 'puppy' }],
          standards: [],
        },
      ],
    })

    expect(collectText(doc)).toContain('1. puppy  ———————→  puppy')
  })

  test('renders color-by-number instructions instead of raw JSON', () => {
    const doc = WorksheetPdfDocument({
      filenameLabel: 'color.pdf',
      pages: [
        {
          kind: 'worksheet',
          config: { type: 'colorByNumber', theme: 'dogs', childName: '' },
          student: [{ shape: '*', n: 1 }],
          answers: null,
          standards: [],
        },
      ],
    })
    const text = collectText(doc)

    expect(text).toContain('1. * Color this shape with number 1')
    expect(text).toContain('Color key: 1-black')
    expect(text).not.toContain('{"shape":"*","n":1}')
  })
})
