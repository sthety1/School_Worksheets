import { describe, expect, test } from 'vitest'
import { buildPdfPages } from '../pdf/pdfModel'

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

  test('packet page rerolls only change the selected page data', () => {
    const packetPages = [
      {
        type: 'letterTracing',
        skillLevel: 'kEarly',
        problems: 6,
        theme: 'dogs',
        childName: '',
        sightWordSource: 'dolchPrePrimer',
        customWordList: '',
      },
      {
        type: 'addition',
        skillLevel: 'kEarly',
        problems: 6,
        theme: 'dogs',
        childName: '',
        sightWordSource: 'dolchPrePrimer',
        customWordList: '',
      },
    ]
    const base = {
      mode: 'packet',
      config: packetPages[0],
      worksheetSeed: 1,
      packetPages,
      generationId: 5,
      recentMemory: {},
      showAnswerKey: false,
      showStandardsTags: false,
    }

    const before = buildPdfPages({ ...base, packetPageRerolls: [0, 0] })
    const after = buildPdfPages({ ...base, packetPageRerolls: [1, 0] })

    expect(after[0].student).not.toEqual(before[0].student)
    expect(after[1].student).toEqual(before[1].student)
  })
})

