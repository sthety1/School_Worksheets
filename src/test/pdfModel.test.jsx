import { describe, expect, test } from 'vitest'
import { buildPdfPages } from '../pdf/pdfModel'
import { WorksheetPdfDocument } from '../pdf/worksheetPdf.jsx'

const collectText = (node) => {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(collectText).join('')
  return collectText(node.props?.children)
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

  test('matching worksheet PDF renders generated row words', () => {
    const config = {
      type: 'matching',
      skillLevel: 'kEarly',
      problems: 6,
      theme: 'dogs',
      childName: 'Ava',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
    }
    const pages = buildPdfPages({
      mode: 'single',
      config,
      worksheetSeed: 5,
      packetPages: [],
      packetPageRerolls: [],
      generationId: 5,
      recentMemory: {},
      showAnswerKey: false,
      showStandardsTags: false,
    })

    const doc = WorksheetPdfDocument({ pages, filenameLabel: 'matching.pdf' })
    const text = collectText(doc)

    pages[0].student.forEach((row) => {
      expect(text).toContain(row.word)
    })
  })
})

