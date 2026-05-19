import { describe, expect, test } from 'vitest'
import { buildPdfPages } from '../pdf/pdfModel'
import { getPdfCountingPrompt, getPdfMatchingPrompt } from '../pdf/worksheetPdf'
import { packetTemplateToTypes } from '../packetTemplates'

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

  test('placement packets append placement score recorder page only for matching placement pages', () => {
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
    expect(pages.at(-1).kind).toBe('worksheet')

    const placementPacketPages = packetTemplateToTypes.placement.map((type) => ({
      ...packetPages[0],
      type,
    }))
    const placementPages = buildPdfPages({
      mode: 'packet',
      config: placementPacketPages[0],
      worksheetSeed: 1,
      packetPages: placementPacketPages,
      packetPageRerolls: [0, 0, 0, 0, 0],
      generationId: 1,
      recentMemory: {},
      showAnswerKey: false,
      showStandardsTags: false,
      packetTemplate: 'placement',
    })
    expect(placementPages.at(-1).kind).toBe('placementScoreSheet')
  })

  test('pdf worksheet prompts include generated counting and matching data', () => {
    expect(getPdfCountingPrompt({ total: 4, theme: 'dogs' }, 0)).toBe('1. Count the objects: o o o o')
    expect(getPdfMatchingPrompt({ word: 'puppy', theme: 'dogs' }, 1)).toBe('2. puppy ------ puppy')
  })
})

