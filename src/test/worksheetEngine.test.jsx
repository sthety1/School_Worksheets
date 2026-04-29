import {
  buildPacketConfigs,
  dolchPrePrimerWords,
  fryStarterWords,
  generateWorksheetData,
  getMaxProblems,
  getSightWordPool,
  parseCustomWords,
  pickUniqueWithRecent,
} from '../App'

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
      theme: 'animals',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      recentMemory: { numberTracing: [], letterTracing: [], sightWords: [], matching: [], phonics: [] },
      seed: 123,
    })
    expect(data.length).toBeLessThanOrEqual(getMaxProblems('numberTracing'))
    expect(new Set(data).size).toBe(data.length)
  })

  test('sight words use selected source and avoid recent memory', () => {
    const data = generateWorksheetData({
      type: 'sightWords',
      problems: 8,
      childName: '',
      theme: 'animals',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      recentMemory: {
        numberTracing: [],
        letterTracing: [],
        sightWords: ['a', 'and', 'away'],
        matching: [],
        phonics: [],
      },
      seed: 999,
    })
    expect(data.every((word) => dolchPrePrimerWords.includes(word))).toBe(true)
    expect(data.some((word) => ['a', 'and', 'away'].includes(word))).toBe(false)
  })

  test('deterministic generation with same seed and inputs', () => {
    const baseInput = {
      type: 'addition',
      problems: 10,
      childName: '',
      theme: 'animals',
      skillLevel: 'kEarly',
      sightWordSource: 'dolchPrePrimer',
      customWordList: '',
      recentMemory: { numberTracing: [], letterTracing: [], sightWords: [], matching: [], phonics: [] },
    }
    const a = generateWorksheetData({ ...baseInput, seed: 42 })
    const b = generateWorksheetData({ ...baseInput, seed: 42 })
    const c = generateWorksheetData({ ...baseInput, seed: 43 })
    expect(a).toEqual(b)
    expect(a).not.toEqual(c)
  })

  test('buildPacketConfigs returns five type-rotated pages', () => {
    const pages = buildPacketConfigs({
      baseConfig: {
        type: 'numberTracing',
        problems: 8,
        childName: 'Ava',
        theme: 'animals',
        skillLevel: 'kEarly',
        sightWordSource: 'dolchPrePrimer',
        customWordList: '',
      },
      template: 'mixed',
      pageCount: 5,
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
})
