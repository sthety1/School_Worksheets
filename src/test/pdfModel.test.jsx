import { describe, expect, test } from 'vitest'
import { buildPdfPages } from '../pdf/pdfModel'
import { WorksheetPdfDocument } from '../pdf/worksheetPdf'

function collectText(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return []
  if (typeof node === 'string' || typeof node === 'number') return [String(node)]
  if (Array.isArray(node)) return node.flatMap(collectText)
  if (typeof node === 'object' && node.props) return collectText(node.props.children)
  return []
}

describe('pdf model builder', () => {
  test('builds packet pages and answer key pages deterministically', () => {
    const packetPages = [
      {
        type: 'addition',
        difficulty: 'easy',
        skillLevel: 'kEarly',
        problems: 10,
        theme: 'dogs',
        childName: 'Ava',
        sightWordSource: 'dolchPrePrimer',
        customWordList: '',
      },
      {
        type: 'countingObjects',
        difficulty: 'easy',
        skillLevel: 'kEarly',
        problems: 10,
        theme: 'dogs',
        childName: 'Ava',
        sightWordSource: 'dolchPrePrimer',
        customWordList: '',
      },
    ]

    const pages = buildPdfPages({
      mode: 'packet',
      config: packetPages[0],
      worksheetSeed: 123,
      packetPages,
      packetPageRerolls: [0, 1],
      generationId: 7,
      recentMemory: {},
      showAnswerKey: true,
      showStandardsTags: true,
    })

    // Each worksheet has an answer key for these two types.
    expect(pages).toHaveLength(4)
    expect(pages[0].kind).toBe('worksheet')
    expect(pages[1].kind).toBe('answerKey')
    expect(pages[2].kind).toBe('worksheet')
    expect(pages[3].kind).toBe('answerKey')

    // Standards tags should be included when enabled.
    expect(Array.isArray(pages[0].standards)).toBe(true)
  })

  test('placement packets append placement score recorder page', () => {
    const packetPages = [
      {
        type: 'letterTracing',
        skillLevel: 'kEarly',
        problems: 6,
        theme: 'dogs',
        childName: 'Leo',
        sightWordSource: 'dolchPrePrimer',
        customWordList: '',
      },
    ]
    const pages = buildPdfPages({
      mode: 'packet',
      config: packetPages[0],
      worksheetSeed: 1,
      packetPages,
      packetPageRerolls: [0],
      generationId: 1,
      recentMemory: {},
      showAnswerKey: false,
      showStandardsTags: false,
      packetTemplate: 'placement',
    })
    expect(pages.at(-1).kind).toBe('placementScoreSheet')
  })

  test('counting objects PDF rows include countable marks', () => {
    const doc = WorksheetPdfDocument({
      filenameLabel: 'counting-test',
      pages: [
        {
          kind: 'worksheet',
          config: { type: 'countingObjects', theme: 'dogs' },
          student: [{ total: 4, theme: 'dogs' }],
          answers: [{ total: 4 }],
          standards: [],
        },
      ],
    })

    expect(collectText(doc).join(' ')).toMatch(/1\s+\.\s+Count:\s+o o o o/)
  })

  test('matching PDF rows use generated words on both sides', () => {
    const doc = WorksheetPdfDocument({
      filenameLabel: 'matching-test',
      pages: [
        {
          kind: 'worksheet',
          config: { type: 'matching', theme: 'dogs' },
          student: [{ word: 'puppy', theme: 'dogs' }],
          answers: [{ word: 'puppy' }],
          standards: [],
        },
      ],
    })

    expect(collectText(doc).join(' ')).toMatch(/1\s+\.\s+puppy\s+--------\s+puppy/)
  })
})

