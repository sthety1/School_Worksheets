import { describe, expect, test } from 'vitest'
import { buildPdfPages } from '../pdf/pdfModel'
import { formatColorByNumberPdfRow, formatMatchingPdfRow } from '../pdf/worksheetPdf'

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

  test('formats worksheet rows used by math packet PDFs without undefined or JSON dumps', () => {
    const packetPages = [
      {
        type: 'matching',
        skillLevel: 'kEarly',
        problems: 6,
        theme: 'dogs',
        childName: 'Mia',
        sightWordSource: 'dolchPrePrimer',
        customWordList: '',
      },
      {
        type: 'colorByNumber',
        skillLevel: 'kEarly',
        problems: 6,
        theme: 'dogs',
        childName: 'Mia',
        sightWordSource: 'dolchPrePrimer',
        customWordList: '',
      },
    ]

    const pages = buildPdfPages({
      mode: 'packet',
      config: packetPages[0],
      worksheetSeed: 3,
      packetPages,
      packetPageRerolls: [0, 0],
      generationId: 3,
      recentMemory: {},
      showAnswerKey: false,
      showStandardsTags: false,
      packetTemplate: 'math',
    })

    const matchingRow = formatMatchingPdfRow(pages[0].student[0])
    const colorByNumberRow = formatColorByNumberPdfRow(pages[1].student[0])

    expect(matchingRow).toContain(pages[0].student[0].word)
    expect(matchingRow).not.toContain('undefined')
    expect(colorByNumberRow).toContain(`number ${pages[1].student[0].n}`)
    expect(colorByNumberRow).not.toContain('{')
  })
})

