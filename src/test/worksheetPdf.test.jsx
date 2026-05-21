import { describe, expect, test } from 'vitest'
import { WorksheetPdfDocument } from '../pdf/worksheetPdf'

function collectText(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(collectText).join('')
  return collectText(node.props?.children)
}

function collectElements(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return []
  if (typeof node === 'string' || typeof node === 'number') return []
  if (Array.isArray(node)) return node.flatMap(collectElements)
  return [node, ...collectElements(node.props?.children)]
}

function pdfTextForPages(pages) {
  return collectText(WorksheetPdfDocument({ pages, filenameLabel: 'test.pdf' }))
}

describe('worksheet PDF document', () => {
  test('uses default instructions when no override is set', () => {
    const text = pdfTextForPages([
      {
        kind: 'worksheet',
        config: { type: 'matching', theme: 'dogs', childName: '' },
        student: [{ word: 'dog', theme: 'dogs' }],
        answers: [{ word: 'dog', theme: 'dogs' }],
        standards: [],
      },
    ])

    expect(text).toContain('Draw a line to match each picture word to the same word on the right.')
  })

  test('renders worksheet content for PDF-only packet exports', () => {
    const pages = [
      {
        kind: 'worksheet',
        config: { type: 'matching', theme: 'dogs', childName: '' },
        student: [{ word: 'puppy', theme: 'dogs' }],
        answers: [{ word: 'puppy', theme: 'dogs' }],
        standards: [],
      },
      {
        kind: 'worksheet',
        config: { type: 'countingObjects', theme: 'dogs', childName: '' },
        student: [{ total: 5, theme: 'dogs' }],
        answers: [{ total: 5, theme: 'dogs' }],
        standards: [],
      },
      {
        kind: 'worksheet',
        config: { type: 'tenFrames', theme: 'dogs', childName: '' },
        student: [{ total: 7 }],
        answers: [{ total: 7 }],
        standards: [],
      },
      {
        kind: 'worksheet',
        config: { type: 'colorByNumber', theme: 'dogs', childName: '' },
        student: [{ n: 3, shape: '△' }],
        answers: null,
        standards: [],
      },
    ]
    const doc = WorksheetPdfDocument({ pages, filenameLabel: 'packet.pdf' })
    const text = collectText(doc)
    const elements = collectElements(doc)

    expect(text).toContain('puppy')
    expect(text).not.toContain('undefined')
    expect(text).toContain('Count the objects, then write the total.')
    expect(text).toContain('Count the dots in the ten-frame.')
    expect(text).toContain('Shape: triangle (△) — color with number 3.')
    expect(text).not.toContain('{"n":3')

    expect(elements.filter((element) => element.props?.style?.width === 14 && element.props?.style?.height === 14)).toHaveLength(5)
    expect(elements.filter((element) => element.props?.style?.width === 32 && element.props?.style?.height === 28)).toHaveLength(10)
  })
})
