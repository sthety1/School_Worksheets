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
  rhymeMatch: 12,
  syllableSort: 12,
  numberBonds: 14,
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
  rhymeMatch: ['K.RF.A.2'],
  syllableSort: ['K.RF.A.2'],
  numberBonds: ['K.OA.A.3'],
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

const rhymeFamilies = [
  { key: 'at', words: ['hat', 'cat', 'bat'] },
  { key: 'an', words: ['can', 'pan', 'van'] },
  { key: 'ap', words: ['map', 'cap', 'tap'] },
  { key: 'og', words: ['dog', 'log', 'fog'] },
  { key: 'ug', words: ['bug', 'mug', 'rug'] },
  { key: 'un', words: ['sun', 'run', 'fun'] },
  { key: 'en', words: ['ten', 'pen', 'hen'] },
  { key: 'ip', words: ['lip', 'sip', 'tip'] },
  { key: 'it', words: ['sit', 'hit', 'bit'] },
  { key: 'ot', words: ['cot', 'hot', 'pot'] },
  { key: 'op', words: ['hop', 'top', 'mop'] },
  { key: 'ox', words: ['fox', 'box'] },
]

const pickThirdWord = (usedWord, rng) => {
  // Pick another short word unlikely to rhyme; keep it deterministic.
  const pool = [...randomSightWordPool, ...fallbackSightWords].filter((w) => w && w !== usedWord)
  return pool[randInt(rng, pool.length)] ?? 'zip'
}

const syllableProblems = [
  { word: 'rabbit', syllables: 2, correct: 'rab-bit', distractors: ['ra-bbit', 'rabb-it'] },
  { word: 'lion', syllables: 2, correct: 'li-on', distractors: ['lio-n', 'l-ion'] },
  { word: 'pencil', syllables: 2, correct: 'pen-cil', distractors: ['penc-il', 'pen-ci-l'] },
  { word: 'basket', syllables: 2, correct: 'bas-ket', distractors: ['ba-sket', 'bask-et'] },
  { word: 'puppet', syllables: 2, correct: 'pup-pet', distractors: ['pu-pet', 'puppe-t'] },
  { word: 'butterfly', syllables: 3, correct: 'but-ter-fly', distractors: ['bu-tterfly', 'butter-fly'] },
  { word: 'elephant', syllables: 3, correct: 'e-le-phant', distractors: ['el-e-phant', 'ele-phant'] },
  { word: 'animal', syllables: 3, correct: 'a-ni-mal', distractors: ['an-i-mal', 'ani-mal'] },
  { word: 'beautiful', syllables: 3, correct: 'beau-ti-ful', distractors: ['be-autiful', 'beau-tiful'] },
  { word: 'fantastic', syllables: 3, correct: 'fan-tas-tic', distractors: ['fant-astic', 'fan-tastic'] },
  { word: 'triangle', syllables: 3, correct: 'tri-an-gle', distractors: ['tri-ang-le', 'trian-gle'] },
  { word: 'dinosaur', syllables: 3, correct: 'di-no-saur', distractors: ['din-o-saur', 'dino-saur'] },
  { word: 'playground', syllables: 2, correct: 'play-ground', distractors: ['pla-yground', 'playg-round'] },
  { word: 'sunshine', syllables: 2, correct: 'sun-shine', distractors: ['sunsh-ine', 'su-nshine'] },
  { word: 'ladybug', syllables: 3, correct: 'la-dy-bug', distractors: ['lady-bug', 'lad-y-bug'] },
  { word: 'notebook', syllables: 2, correct: 'note-book', distractors: ['not-ebook', 'noteb-ook'] },
]

const shuffleOptions = (options, rng) => {
  const copy = [...options]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randInt(rng, i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

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
      if (rows.length < safeProblems) {
        // Fill remaining slots with unused unique pairs (deterministic order),
        // so we avoid duplicates unless uniqueness is mathematically impossible.
        for (let hi = additionMax; hi >= 1 && rows.length < safeProblems; hi -= 1) {
          for (let lo = 1; lo <= hi && rows.length < safeProblems; lo += 1) {
            const key = `${hi}-${lo}`
            if (seen.has(key)) continue
            seen.add(key)
            rows.push({ a: hi, b: lo })
          }
        }

        // If still short, we've exhausted unique pairs in this range.
        // Repeat deterministically from the start.
        if (rows.length === 0) {
          // Defensive: avoid modulo-by-zero edge cases.
          // This should be unreachable with normal presets (additionMax >= 1),
          // but keeps the generator safe even if config changes later.
          const a = Math.max(1, additionMax)
          rows.push({ a, b: 1 })
        }
        for (let i = 0; rows.length < safeProblems; i += 1) {
          rows.push(rows[i % rows.length])
        }
      }
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

    if (parsed.type === 'rhymeMatch') {
      const usedFamilies = new Set()
      const rows = []
      let attempts = 0
      while (rows.length < safeProblems && attempts < safeProblems * 50) {
        attempts += 1
        const fam = rhymeFamilies[randInt(rng, rhymeFamilies.length)]
        if (usedFamilies.has(fam.key)) continue

        const w1 = fam.words[randInt(rng, fam.words.length)]
        let w2 = fam.words[randInt(rng, fam.words.length)]
        while (w2 === w1 && fam.words.length > 1) {
          w2 = fam.words[randInt(rng, fam.words.length)]
        }

        let foil = ''
        let foilSafety = 0
        while (foilSafety < 20) {
          foilSafety += 1
          const candidate = pickThirdWord(w1, rng)
          if (!fam.words.includes(candidate)) {
            foil = candidate
            break
          }
        }
        if (!foil) {
          foil = 'zip'
        }

        usedFamilies.add(fam.key)
        rows.push({
          cueWord: w1,
          choices: shuffleOptions([w1, w2, foil], rng),
        })
      }

      if (rows.length > 0) {
        while (rows.length < safeProblems) {
          rows.push(rows[rows.length % rows.length])
        }
      }

      return rows
    }

    if (parsed.type === 'syllableSort') {
      const rows = []
      while (rows.length < safeProblems) {
        const p = syllableProblems[randInt(rng, syllableProblems.length)]
        const uniq = Array.from(new Set([p.correct, ...p.distractors]))
        while (uniq.length < 3) {
          uniq.push(`${p.correct}-${uniq.length}`)
        }
        const finalOptions = shuffleOptions(uniq.slice(0, 3), rng)
        rows.push({
          word: p.word,
          syllables: p.syllables,
          options: finalOptions.slice(0, 3),
        })
      }
      return rows
    }

    if (parsed.type === 'numberBonds') {
      const maxBondTotal = Math.min(10, numberCeiling)
      const minBondTotal =
        parsed.skillLevel === 'preK' ? 5 : parsed.skillLevel === 'kEarly' ? 5 : parsed.skillLevel === 'kMid' ? 6 : 6

      const pickPairForTotal = (total) => {
        const pairs = []
        for (let a = 1; a < total; a += 1) {
          const b = total - a
          if (b >= 1) pairs.push({ a, b })
        }
        return pairs
      }

      return Array.from({ length: safeProblems }, () => {
        const span = Math.max(1, maxBondTotal - minBondTotal + 1)
        const total = randInt(rng, span) + minBondTotal // totals within [minBondTotal..maxBondTotal], capped by number ceiling for the preset
        const pairs = pickPairForTotal(total)
        const pair = pairs[randInt(rng, pairs.length)]
        const variant = randInt(rng, 3) // hide a, b, or neither (but still practice bonds)
        if (variant === 0) {
          return {
            total,
            a: '__',
            b: pair.b,
          }
        }
        if (variant === 1) {
          return {
            total,
            a: pair.a,
            b: '__',
          }
        }
        return {
          total,
          a: pair.a,
          b: pair.b,
        }
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
    if (parsed.type === 'rhymeMatch') {
      return student.map((row) => {
        const rhymeGroup = rhymeFamilies.find((fam) => fam.words.includes(row.cueWord))
        const rhymeKey = rhymeGroup?.key ?? ''
        const correct =
          row.choices.find((w) => {
            const group = rhymeFamilies.find((fam) => fam.words.includes(w))
            return group && group.key === rhymeKey
          }) ?? row.cueWord
        return { cueWord: row.cueWord, correctRhyme: correct }
      })
    }

    if (parsed.type === 'syllableSort') {
      return student.map((row) => {
        const canonical = syllableProblems.find((p) => p.word === row.word)
        return { correct: canonical?.correct ?? row.options[0] }
      })
    }

    if (parsed.type === 'numberBonds') {
      return student.map((row) => {
        const solvedA = typeof row.a === 'number' ? row.a : row.total - row.b
        const solvedB = typeof row.b === 'number' ? row.b : row.total - row.a
        return {
          total: row.total,
          a: solvedA,
          b: solvedB,
          sumCheck: solvedA + solvedB,
        }
      })
    }
    return null
  })()

  return { student, answers }
}

