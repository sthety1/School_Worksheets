import { generatorInputSchema } from './worksheetSchema'

export const sightWordSources = [
  { value: 'dolchPrePrimer', label: 'Dolch Pre-Primer' },
  { value: 'dolchPrimer', label: 'Dolch Primer' },
  { value: 'fryFirst100', label: 'Fry Top 100 (Starter Set)' },
  { value: 'custom', label: 'Custom Word List' },
  { value: 'mixedRandom', label: 'Mixed Random Phonics' },
]

export const dolchPrePrimerWords = [
  'a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down', 'find', 'for', 'fun', 'go', 'help', 'here', 'I', 'in', 'is', 'it', 'jump', 'little',
]
export const dolchPrimerWords = [
  'all', 'am', 'are', 'at', 'ate', 'be', 'black', 'brown', 'but', 'came', 'did', 'do', 'eat', 'four', 'get', 'good', 'have', 'he', 'into', 'like',
]
export const fryStarterWords = [
  'the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I',
]

const fallbackSightWords = ['the', 'and', 'can', 'see', 'play', 'look', 'I', 'we', 'is', 'go']
const randomSightWordPool = ['sun', 'run', 'hat', 'big', 'red', 'jump', 'help', 'find', 'tree', 'frog', 'home', 'milk']

export const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
export const shapes = ['Circle', 'Square', 'Triangle', 'Rectangle', 'Star', 'Heart', 'Oval']

export const phonicsBank = [
  { letter: 'A', word: 'apple' },
  { letter: 'B', word: 'ball' },
  { letter: 'C', word: 'cat' },
  { letter: 'D', word: 'dog' },
  { letter: 'E', word: 'egg' },
  { letter: 'F', word: 'fish' },
  { letter: 'G', word: 'goat' },
  { letter: 'H', word: 'hat' },
  { letter: 'I', word: 'igloo' },
  { letter: 'J', word: 'jam' },
  { letter: 'K', word: 'kite' },
  { letter: 'L', word: 'lion' },
  { letter: 'M', word: 'moon' },
  { letter: 'N', word: 'nest' },
  { letter: 'O', word: 'octopus' },
  { letter: 'P', word: 'pig' },
  { letter: 'Q', word: 'queen' },
  { letter: 'R', word: 'rabbit' },
  { letter: 'S', word: 'sun' },
  { letter: 'T', word: 'turtle' },
  { letter: 'U', word: 'umbrella' },
  { letter: 'V', word: 'van' },
  { letter: 'W', word: 'whale' },
  { letter: 'X', word: 'xylophone' },
  { letter: 'Y', word: 'yo-yo' },
  { letter: 'Z', word: 'zebra' },
]

export const skillProfiles = {
  preK: { difficulty: 'easy', numberMax: 8, additionMax: 3, phonicsLetters: 8 },
  kEarly: { difficulty: 'easy', numberMax: 12, additionMax: 5, phonicsLetters: 14 },
  kMid: { difficulty: 'medium', numberMax: 16, additionMax: 7, phonicsLetters: 20 },
  kEnd: { difficulty: 'hard', numberMax: 20, additionMax: 9, phonicsLetters: 26 },
}

export const maxProblemsByType = {
  numberTracing: 20,
  countingObjects: 20,
  letterTracing: 26,
  sightWords: 20,
  nameWriting: 20,
  shapes: 7,
  addition: 20,
  subtraction: 20,
  matching: 6,
  phonics: 26,
  colorByNumber: 20,
  tenFrames: 20,
  cvcWords: 20,
  sentenceTracing: 20,
  patterns: 20,
}

export const getMaxProblems = (type) => maxProblemsByType[type] ?? 20

export const standardsTagsByType = {
  numberTracing: ['K.CC.A.3'],
  countingObjects: ['K.CC.B.4'],
  letterTracing: ['K.L.1'],
  sightWords: ['K.RF.A.3'],
  nameWriting: ['K.L.1'],
  shapes: ['K.G.A.2'],
  addition: ['K.OA.A.1'],
  subtraction: ['K.OA.A.1'],
  matching: ['K.RF.A.3'],
  phonics: ['K.RF.A.2'],
  colorByNumber: ['K.CC.B.4', 'K.CC.A.3'],
  tenFrames: ['K.CC.B.4'],
  cvcWords: ['K.RF.A.2'],
  sentenceTracing: ['K.RF.A.3'],
  patterns: ['K.OA.A.1'],
}

export const getStandardsTagsForType = (type) => standardsTagsByType[type] ?? []

// Deterministic RNG helpers (seeded) for regression stability.
export const hashStringToUint32 = (input) => {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export const createRng = (seed) => {
  let t = (seed >>> 0) || 1
  return () => {
    t += 0x6d2b79f5
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

const randInt = (rng, maxExclusive) => Math.floor(rng() * maxExclusive)

const pickUniqueRandom = (source, count, rng) => {
  const copy = [...source]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randInt(rng, i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.min(count, copy.length))
}

export const parseCustomWords = (text) =>
  Array.from(
    new Set(
      text
        .split(/[\n,]/)
        .map((word) => word.trim().toLowerCase())
        .filter(Boolean),
    ),
  )

export const getSightWordPool = (config) => {
  if (config.sightWordSource === 'dolchPrePrimer') return dolchPrePrimerWords
  if (config.sightWordSource === 'dolchPrimer') return dolchPrimerWords
  if (config.sightWordSource === 'fryFirst100') return fryStarterWords
  if (config.sightWordSource === 'custom') {
    const parsed = parseCustomWords(config.customWordList)
    return parsed.length > 0 ? parsed : fallbackSightWords
  }
  return [...randomSightWordPool, ...fallbackSightWords]
}

export const pickUniqueWithRecent = (source, count, recentItems = [], rng) => {
  const recentSet = new Set(recentItems)
  const freshPool = source.filter((item) => !recentSet.has(item))
  const firstPass = pickUniqueRandom(freshPool, count, rng)
  if (firstPass.length === count) return firstPass
  const fallbackPool = source.filter((item) => !firstPass.includes(item))
  return [...firstPass, ...pickUniqueRandom(fallbackPool, count - firstPass.length, rng)]
}

const vowels = ['a', 'e', 'i', 'o', 'u']
const consonants = 'bcdfghjklmnpqrstvwxyz'.split('')
const makeSimpleWord = (rng) => {
  const useBlend = randInt(rng, 2) === 0
  if (useBlend) {
    return `${consonants[randInt(rng, consonants.length)]}${vowels[randInt(rng, vowels.length)]}${consonants[randInt(rng, consonants.length)]}`
  }
  return `${consonants[randInt(rng, consonants.length)]}${vowels[randInt(rng, vowels.length)]}${consonants[randInt(rng, consonants.length)]}${consonants[randInt(rng, consonants.length)]}`
}

const cvcWordPool = [
  'cat', 'dog', 'pig', 'hen', 'hat', 'bat', 'rat', 'map', 'cap', 'sun', 'run', 'fun', 'cup', 'bug', 'hug', 'mug', 'fan', 'van', 'bed', 'red',
  'pen', 'ten', 'fin', 'pin', 'sit', 'hit', 'lip', 'log', 'fog', 'hop', 'top', 'cot', 'fox', 'box',
]

export const generateWorksheetData = (input) => {
  const parsed = generatorInputSchema.parse(input)

  const safeProblems = Math.max(4, Math.min(getMaxProblems(parsed.type), Number(parsed.problems)))
  const skillProfile = skillProfiles[parsed.skillLevel] ?? skillProfiles.kEarly
  const numberCeiling = skillProfile.numberMax
  const additionMax = skillProfile.additionMax

  const baseSeed = (Number.isFinite(parsed.seed) ? parsed.seed : 0) >>> 0
  const cfgSeed = hashStringToUint32(
    JSON.stringify({
      ...parsed,
      problems: safeProblems,
    }),
  )
  const rng = createRng(baseSeed ^ cfgSeed)

  const buildStudent = () => {
    if (parsed.type === 'numberTracing') {
      const numberPool = Array.from({ length: numberCeiling }, (_, i) => (i + 1).toString())
      return pickUniqueWithRecent(numberPool, safeProblems, parsed.recentMemory.numberTracing, rng)
    }
    if (parsed.type === 'countingObjects') {
      return Array.from({ length: safeProblems }, () => {
        const total = randInt(rng, numberCeiling) + 1
        return { total, theme: parsed.theme }
      })
    }
    if (parsed.type === 'letterTracing') {
      return pickUniqueWithRecent(letters, safeProblems, parsed.recentMemory.letterTracing, rng)
    }
    if (parsed.type === 'sightWords') {
      if (parsed.sightWordSource === 'mixedRandom') {
        const uniqueWords = new Set()
        while (uniqueWords.size < safeProblems && uniqueWords.size < 20) {
          if (uniqueWords.size % 2 === 0) {
            uniqueWords.add(randomSightWordPool[randInt(rng, randomSightWordPool.length)])
          } else {
            uniqueWords.add(makeSimpleWord(rng))
          }
        }
        return Array.from(uniqueWords)
      }
      const selectedPool = getSightWordPool(parsed)
      const baseWords = pickUniqueWithRecent(selectedPool, safeProblems, parsed.recentMemory.sightWords, rng)
      if (baseWords.length === safeProblems || selectedPool.length >= safeProblems) return baseWords
      const fillWords = pickUniqueWithRecent(
        randomSightWordPool.filter((word) => !baseWords.includes(word)),
        safeProblems - baseWords.length,
        [],
        rng,
      )
      return [...baseWords, ...fillWords]
    }
    if (parsed.type === 'nameWriting') {
      return Array.from({ length: safeProblems }, () => parsed.childName || 'Write your name')
    }
    if (parsed.type === 'shapes') {
      return pickUniqueRandom(shapes, safeProblems, rng)
    }
    if (parsed.type === 'addition') {
      return Array.from({ length: safeProblems }, () => {
        const a = randInt(rng, additionMax) + 1
        const b = randInt(rng, additionMax) + 1
        return { a, b }
      })
    }
    if (parsed.type === 'subtraction') {
      const seen = new Set()
      const rows = []
      let safety = 0
      while (rows.length < safeProblems && safety < safeProblems * 40) {
        safety += 1
        const a = randInt(rng, additionMax) + 1
        const b = randInt(rng, additionMax) + 1
        const hi = Math.max(a, b)
        const lo = Math.min(a, b)
        const key = `${hi}-${lo}`
        if (seen.has(key)) continue
        seen.add(key)
        rows.push({ a: hi, b: lo })
      }
      while (rows.length < safeProblems) rows.push({ a: additionMax, b: 1 })
      return rows
    }
    if (parsed.type === 'matching') {
      const themeWords = {
        // 'animals' kept for backwards compatibility with saved profiles.
        animals: ['dog', 'cat', 'fish', 'bird', 'frog', 'bear'],
        dogs: ['dog', 'puppy', 'bone', 'bark', 'leash', 'paw'],
        cats: ['cat', 'kitten', 'whisker', 'meow', 'purr', 'tail'],
        princesses: ['crown', 'castle', 'dress', 'wand', 'ring', 'shoe'],
        cars: ['car', 'bus', 'van', 'truck', 'jeep', 'taxi'],
        dinosaurs: ['dino', 'fossil', 'tail', 'roar', 'egg', 'claw'],
        unicorns: ['unicorn', 'horn', 'star', 'cloud', 'rainbow', 'mane'],
      }
      const normalizedTheme = parsed.theme === 'animals' ? 'dogs' : parsed.theme
      const basePool = themeWords[normalizedTheme] ?? themeWords.dogs
      return pickUniqueWithRecent(basePool, safeProblems, parsed.recentMemory.matching, rng).map((word) => ({
        word,
        theme: normalizedTheme,
      }))
    }
    if (parsed.type === 'phonics') {
      return pickUniqueWithRecent(
        phonicsBank.slice(0, skillProfile.phonicsLetters),
        safeProblems,
        parsed.recentMemory.phonics,
        rng,
      )
    }

    if (parsed.type === 'tenFrames') {
      return Array.from({ length: safeProblems }, () => ({
        total: randInt(rng, Math.min(numberCeiling, 10)) + 1,
      }))
    }

    if (parsed.type === 'cvcWords') {
      return pickUniqueRandom(cvcWordPool, safeProblems, rng)
    }

    if (parsed.type === 'sentenceTracing') {
      const themeWordByTheme = {
        dogs: 'dog',
        cats: 'cat',
        princesses: 'crown',
        cars: 'car',
        dinosaurs: 'dino',
        unicorns: 'unicorn',
        animals: 'dog',
      }
      const t = themeWordByTheme[parsed.theme] ?? 'cat'
      const bank = [
        `I see a ${t}.`,
        `I can see the ${t}.`,
        `I like my ${t}.`,
        `The ${t} can run.`,
        'I can write neatly.',
        'I can read this.',
      ]
      return pickUniqueRandom(bank, safeProblems, rng)
    }

    if (parsed.type === 'patterns') {
      const symbols = ['●', '■', '▲', '★']
      const patternKinds = ['AB', 'AAB', 'ABB', 'ABC']
      return Array.from({ length: safeProblems }, () => {
        const kind = patternKinds[randInt(rng, patternKinds.length)]
        const picked = pickUniqueRandom(symbols, kind === 'ABC' ? 3 : 2, rng)
        const a = picked[0]
        const b = picked[1]
        const c = picked[2]
        const seq =
          kind === 'AB'
            ? [a, b, a, b]
            : kind === 'AAB'
              ? [a, a, b, a, a]
              : kind === 'ABB'
                ? [a, b, b, a, b]
                : [a, b, c, a, b]
        const next =
          kind === 'AB'
            ? a
            : kind === 'AAB'
              ? b
              : kind === 'ABB'
                ? b
                : c
        return { kind, sequence: [...seq, '__'], next }
      })
    }

    // colorByNumber
    return Array.from({ length: safeProblems }, (_, i) => ({
      n: (i % 6) + 1,
      shape: ['⬡', '◯', '△', '□', '☆', '♡'][i % 6],
    }))
  }

  const student = buildStudent()
  const answers = (() => {
    // Most tracing-style worksheets don't need an answer key.
    if (parsed.type === 'numberTracing') return null
    if (parsed.type === 'letterTracing') return null
    if (parsed.type === 'sightWords') return null
    if (parsed.type === 'nameWriting') return null
    if (parsed.type === 'shapes') return null
    if (parsed.type === 'colorByNumber') return null
    if (parsed.type === 'sentenceTracing') return null

    if (parsed.type === 'addition') {
      return student.map((row) => ({ ...row, sum: row.a + row.b }))
    }
    if (parsed.type === 'subtraction') {
      return student.map((row) => ({ ...row, diff: row.a - row.b }))
    }
    if (parsed.type === 'countingObjects') {
      return student.map((row) => ({ total: row.total }))
    }
    if (parsed.type === 'matching') {
      return student.map((row) => ({ word: row.word }))
    }
    if (parsed.type === 'phonics') {
      return student.map((row) => ({ letter: row.letter, word: row.word }))
    }
    if (parsed.type === 'tenFrames') {
      return student.map((row) => ({ total: row.total }))
    }
    if (parsed.type === 'cvcWords') {
      return student.map((word) => ({ word }))
    }
    if (parsed.type === 'patterns') {
      return student.map((row) => ({ kind: row.kind, next: row.next }))
    }
    return null
  })()

  return { student, answers }
}

