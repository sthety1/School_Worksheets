import {
  dolchPrePrimerWords,
  fryStarterWords,
  generateWorksheetData,
  getMaxProblems,
  getSightWordPool,
  getStandardsTagsForType,
  parseCustomWords,
  pickUniqueWithRecent,
} from '../worksheetEngine'
import { buildPacketConfigs } from '../packetTemplates'

describe('worksheet engine regression', () => {
  test('parses custom words from comma/newline input', () => {
    const parsed = parseCustomWords('cat, dog\nsun ,run\ncat')
    expect(parsed).toEqual(['cat', 'dog', 'sun', 'run'])
  })

  test('selects Dolch and Fry sight word pools', () => {
    expect(getSightWordPool({ sightWordSource: 'dolchPrePrimer', customWordList: '' })).toEqual(
      dolchPrePrimerWords,
    )
    expect(getSightWordPool({ sightWordSource: 'fryFirst100', customWordList: '' })).toEqual(
      fryStarterWords,
    )
  })

  test('prefers values outside recent memory when possible', () => {
    const picked = pickUniqueWithRecent(['a', 'b', 'c', 'd'], 2, ['a', 'b'], () => 0.5)
    expect(picked).toEqual(expect.arrayContaining(['c', 'd']))
  })

  test('number tracing respects type max and uniqueness', () => {
    const data = generateWorksheetData({
      type: 'numberTracing',
      problems: 40,
      childName: '',
      theme: 'dogs',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      instructionOverride: '',
      objectiveOverride: '',
      recentMemory: { numberTracing: [], letterTracing: [], sightWords: [], matching: [], phonics: [] },
      seed: 123,
    })
    expect(data.student.length).toBeLessThanOrEqual(getMaxProblems('numberTracing'))
    expect(new Set(data.student).size).toBe(data.student.length)
    expect(data.answers).toBeNull()
  })

  test('sight words use selected source and avoid recent memory', () => {
    const data = generateWorksheetData({
      type: 'sightWords',
      problems: 8,
      childName: '',
      theme: 'dogs',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      instructionOverride: '',
      objectiveOverride: '',
      recentMemory: {
        numberTracing: [],
        letterTracing: [],
        sightWords: ['a', 'and', 'away'],
        matching: [],
        phonics: [],
      },
      seed: 999,
    })
    expect(data.student.every((word) => dolchPrePrimerWords.includes(word))).toBe(true)
    expect(data.student.some((word) => ['a', 'and', 'away'].includes(word))).toBe(false)
    expect(data.answers).toBeNull()
  })

  test('deterministic generation with same seed and inputs', () => {
    const baseInput = {
      type: 'addition',
      problems: 10,
      childName: '',
      theme: 'dogs',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      instructionOverride: '',
      objectiveOverride: '',
      recentMemory: { numberTracing: [], letterTracing: [], sightWords: [], matching: [], phonics: [] },
    }
    const a = generateWorksheetData({ ...baseInput, seed: 42 })
    const b = generateWorksheetData({ ...baseInput, seed: 42 })
    const c = generateWorksheetData({ ...baseInput, seed: 43 })
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  test('addition answer key includes computed sums', () => {
    const data = generateWorksheetData({
      type: 'addition',
      problems: 6,
      childName: '',
      theme: 'dogs',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      instructionOverride: '',
      objectiveOverride: '',
      recentMemory: { numberTracing: [], letterTracing: [], sightWords: [], matching: [], phonics: [] },
      seed: 1234,
    })
    expect(data.student).toHaveLength(6)
    expect(data.answers).toHaveLength(6)
    expect(data.answers.every((row, idx) => row.sum === data.student[idx].a + data.student[idx].b)).toBe(true)
  })

  test('subtraction answer key includes computed differences and non-negative results', () => {
    const data = generateWorksheetData({
      type: 'subtraction',
      problems: 10,
      childName: '',
      theme: 'dogs',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      instructionOverride: '',
      objectiveOverride: '',
      recentMemory: { numberTracing: [], letterTracing: [], sightWords: [], matching: [], phonics: [] },
      seed: 2026,
    })
    expect(data.student).toHaveLength(10)
    expect(data.answers).toHaveLength(10)
    expect(new Set(data.student.map((r) => `${r.a}-${r.b}`)).size).toBe(data.student.length)
    expect(data.answers.every((row, idx) => row.diff === data.student[idx].a - data.student[idx].b)).toBe(true)
    expect(data.answers.every((row) => row.diff >= 0)).toBe(true)
  })

  test('ten-frames answer key echoes totals (1-10)', () => {
    const data = generateWorksheetData({
      type: 'tenFrames',
      problems: 8,
      childName: '',
      theme: 'dogs',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      instructionOverride: '',
      objectiveOverride: '',
      recentMemory: { numberTracing: [], letterTracing: [], sightWords: [], matching: [], phonics: [] },
      seed: 55,
    })
    expect(data.student).toHaveLength(8)
    expect(data.answers).toHaveLength(8)
    expect(data.answers.map((r) => r.total)).toEqual(data.student.map((r) => r.total))
    expect(data.student.every((r) => r.total >= 1 && r.total <= 10)).toBe(true)
  })

  test('cvc words answer key echoes selected words and stays unique', () => {
    const data = generateWorksheetData({
      type: 'cvcWords',
      problems: 10,
      childName: '',
      theme: 'dogs',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      instructionOverride: '',
      objectiveOverride: '',
      recentMemory: { numberTracing: [], letterTracing: [], sightWords: [], matching: [], phonics: [] },
      seed: 77,
    })
    expect(new Set(data.student).size).toBe(data.student.length)
    expect(data.answers.map((r) => r.word)).toEqual(data.student)
  })

  test('patterns answer key returns next symbol', () => {
    const data = generateWorksheetData({
      type: 'patterns',
      problems: 6,
      childName: '',
      theme: 'dogs',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      instructionOverride: '',
      objectiveOverride: '',
      recentMemory: { numberTracing: [], letterTracing: [], sightWords: [], matching: [], phonics: [] },
      seed: 101,
    })
    expect(data.student).toHaveLength(6)
    expect(data.answers).toHaveLength(6)
    expect(data.student.every((r) => Array.isArray(r.sequence) && r.sequence.at(-1) === '__')).toBe(true)
    expect(data.answers.map((r) => r.next)).toEqual(data.student.map((r) => r.next))
  })

  test('counting objects answer key echoes totals', () => {
    const data = generateWorksheetData({
      type: 'countingObjects',
      problems: 5,
      childName: '',
      theme: 'dogs',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      instructionOverride: '',
      objectiveOverride: '',
      recentMemory: { numberTracing: [], letterTracing: [], sightWords: [], matching: [], phonics: [] },
      seed: 7,
    })
    expect(data.student).toHaveLength(5)
    expect(data.answers).toHaveLength(5)
    expect(data.answers.map((r) => r.total)).toEqual(data.student.map((r) => r.total))
  })

  test('buildPacketConfigs returns five type-rotated pages', () => {
    const pages = buildPacketConfigs({
      baseConfig: {
        type: 'numberTracing',
        problems: 8,
        childName: 'Ava',
        theme: 'dogs',
        skillLevel: 'kEarly',
        sightWordSource: 'dolchPrePrimer',
        customWordList: '',
        instructionOverride: '',
        objectiveOverride: '',
      },
      template: 'mixed',
      pageCount: 5,
      getPresetProblems: () => 8,
    })
    expect(pages).toHaveLength(5)
    expect(pages.map((p) => p.type)).toEqual([
      'letterTracing',
      'numberTracing',
      'sightWords',
      'addition',
      'phonics',
    ])
  })

  test('standards tags mapping is stable and optional', () => {
    expect(getStandardsTagsForType('addition')).toEqual(expect.arrayContaining(['K.OA.A.1']))
    expect(getStandardsTagsForType('phonics')).toEqual(expect.arrayContaining(['K.RF.A.2']))
    expect(getStandardsTagsForType('notARealType')).toEqual([])
  })
})
