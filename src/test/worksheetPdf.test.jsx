import { describe, expect, test } from 'vitest'
import { WorksheetPdfDocument } from '../pdf/worksheetPdf.jsx'

const flattenText = (node) => {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenText).join('')
  if (node.props) return flattenText(node.props.children)
  return ''
}

describe('worksheet PDF rendering', () => {
  test('counting objects includes countable marks in the downloaded PDF body', () => {
    const body = WorksheetPdfDocument({
      filenameLabel: 'test.pdf',
      pages: [
        {
          kind: 'worksheet',
          title: 'Counting Objects',
          config: { type: 'countingObjects' },
          student: [{ total: 3, theme: 'dogs' }],
          standards: [],
        },
      ],
    })

    expect(flattenText(body)).toContain('Count: O O O')
  })

  test('matching PDF uses generated word fields instead of undefined pairs', () => {
    const body = WorksheetPdfDocument({
      filenameLabel: 'test.pdf',
      pages: [
        {
          kind: 'worksheet',
          title: 'Matching',
          config: { type: 'matching' },
          student: [{ word: 'puppy', theme: 'dogs' }],
          standards: [],
        },
      ],
    })
    const text = flattenText(body)

    expect(text).toContain('puppy')
    expect(text).not.toContain('undefined')
  })

  test('color by number renders worksheet instructions instead of raw JSON', () => {
    const body = WorksheetPdfDocument({
      filenameLabel: 'test.pdf',
      pages: [
        {
          kind: 'worksheet',
          title: 'Color by Number',
          config: { type: 'colorByNumber' },
          student: [{ n: 2, shape: 'circle' }],
          standards: [],
        },
      ],
    })
    const text = flattenText(body)

    expect(text).toContain('Color this shape with number 2')
    expect(text).toContain('Color key:')
    expect(text).not.toContain('{"n"')
  })
})
