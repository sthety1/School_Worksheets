import { useEffect, useMemo, useRef, useState } from 'react'

const worksheetTypes = [
  { value: 'numberTracing', label: 'Number Tracing (1-20)' },
  { value: 'countingObjects', label: 'Counting Objects' },
  { value: 'letterTracing', label: 'Letter Tracing (A-Z)' },
  { value: 'sightWords', label: 'Sight Word Tracing' },
  { value: 'nameWriting', label: 'Name Writing Practice' },
  { value: 'shapes', label: 'Shapes Recognition' },
  { value: 'addition', label: 'Beginning Addition' },
  { value: 'matching', label: 'Matching Pictures to Words' },
  { value: 'phonics', label: 'Beginning Sounds / Phonics' },
  { value: 'colorByNumber', label: 'Color by Number' },
]

const themes = ['animals', 'princesses', 'cars', 'dinosaurs', 'unicorns']
const skillPresets = [
  { value: 'preK', label: 'Pre-K' },
  { value: 'kEarly', label: 'K Early' },
  { value: 'kMid', label: 'K Mid' },
  { value: 'kEnd', label: 'K End' },
]
const sightWords = ['the', 'and', 'can', 'see', 'play', 'look', 'I', 'we', 'is', 'go']
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
const randomSightWordPool = [
  'sun',
  'run',
  'hat',
  'big',
  'red',
  'jump',
  'help',
  'find',
  'tree',
  'frog',
  'home',
  'milk',
]
const shapes = ['Circle', 'Square', 'Triangle', 'Rectangle', 'Star', 'Heart', 'Oval']
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const phonicsBank = [
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

const skillProfiles = {
  preK: { difficulty: 'easy', numberMax: 8, additionMax: 3, phonicsLetters: 8 },
  kEarly: { difficulty: 'easy', numberMax: 12, additionMax: 5, phonicsLetters: 14 },
  kMid: { difficulty: 'medium', numberMax: 16, additionMax: 7, phonicsLetters: 20 },
  kEnd: { difficulty: 'hard', numberMax: 20, additionMax: 9, phonicsLetters: 26 },
}

const problemPlanByType = {
  numberTracing: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  countingObjects: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  letterTracing: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  sightWords: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  nameWriting: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  shapes: { preK: 6, kEarly: 7, kMid: 7, kEnd: 7 },
  addition: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  matching: { preK: 6, kEarly: 6, kMid: 6, kEnd: 6 },
  phonics: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  colorByNumber: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
}

export const maxProblemsByType = {
  numberTracing: 20,
  countingObjects: 20,
  letterTracing: 26,
  sightWords: 20,
  nameWriting: 20,
  shapes: 7,
  addition: 20,
  matching: 6,
  phonics: 26,
  colorByNumber: 20,
}
const RECENT_MEMORY_KEY = 'worksheet_recent_memory_v1'
const PROFILES_KEY = 'worksheet_child_profiles_v1'

const packetTemplates = [
  { value: 'mixed', label: 'Mixed Review (5 pages)' },
  { value: 'handwriting', label: 'Handwriting Focus (5 pages)' },
  { value: 'math', label: 'Math Focus (5 pages)' },
]

const packetTemplateToTypes = {
  mixed: ['letterTracing', 'numberTracing', 'sightWords', 'addition', 'phonics'],
  handwriting: ['letterTracing', 'sightWords', 'nameWriting', 'shapes', 'phonics'],
  math: ['numberTracing', 'countingObjects', 'addition', 'colorByNumber', 'matching'],
}

const sampleWorksheets = [
  { type: 'numberTracing', difficulty: 'easy', problems: 8, theme: 'dinosaurs', childName: 'Ava' },
  { type: 'letterTracing', difficulty: 'medium', problems: 8, theme: 'unicorns', childName: 'Leo' },
  { type: 'addition', difficulty: 'easy', problems: 10, theme: 'cars', childName: 'Mia' },
  { type: 'colorByNumber', difficulty: 'easy', problems: 8, theme: 'animals', childName: 'Noah' },
]

const themeWords = {
  animals: ['cat', 'dog', 'fish', 'bird', 'frog', 'bear'],
  princesses: ['crown', 'castle', 'dress', 'wand', 'ring', 'shoe'],
  cars: ['car', 'bus', 'van', 'truck', 'jeep', 'taxi'],
  dinosaurs: ['dino', 'fossil', 'tail', 'roar', 'egg', 'claw'],
  unicorns: ['unicorn', 'horn', 'star', 'cloud', 'rainbow', 'mane'],
}

// Deterministic RNG helpers (seeded) for regression stability.
const hashStringToUint32 = (input) => {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const createRng = (seed) => {
  // Mulberry32: deterministic, fast, adequate for worksheet shuffling.
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
const vowels = ['a', 'e', 'i', 'o', 'u']
const consonants = 'bcdfghjklmnpqrstvwxyz'.split('')

const pickUniqueRandom = (source, count, rng) => {
  const copy = [...source]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randInt(rng, i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.min(count, copy.length))
}

const makeSimpleWord = (rng) => {
  const useBlend = randInt(rng, 2) === 0
  if (useBlend) {
    return `${consonants[randInt(rng, consonants.length)]}${vowels[randInt(rng, vowels.length)]}${consonants[randInt(rng, consonants.length)]}`
  }
  return `${consonants[randInt(rng, consonants.length)]}${vowels[randInt(rng, vowels.length)]}${consonants[randInt(rng, consonants.length)]}${consonants[randInt(rng, consonants.length)]}`
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
    return parsed.length > 0 ? parsed : sightWords
  }
  return [...randomSightWordPool, ...sightWords]
}

export const pickUniqueWithRecent = (source, count, recentItems = [], rng) => {
  const recentSet = new Set(recentItems)
  const freshPool = source.filter((item) => !recentSet.has(item))
  const firstPass = pickUniqueRandom(freshPool, count, rng)
  if (firstPass.length === count) return firstPass
  const fallbackPool = source.filter((item) => !firstPass.includes(item))
  return [...firstPass, ...pickUniqueRandom(fallbackPool, count - firstPass.length, rng)]
}

const readRecentMemory = () => {
  try {
    const storage = globalThis?.localStorage
    if (!storage || typeof storage.getItem !== 'function') return null
    return JSON.parse(storage.getItem(RECENT_MEMORY_KEY) || '{}')
  } catch {
    return null
  }
}

const writeRecentMemory = (value) => {
  try {
    const storage = globalThis?.localStorage
    if (!storage || typeof storage.setItem !== 'function') return
    storage.setItem(RECENT_MEMORY_KEY, JSON.stringify(value))
  } catch {
    // Ignore storage write failures in restricted environments.
  }
}

const readProfiles = () => {
  try {
    const storage = globalThis?.localStorage
    if (!storage || typeof storage.getItem !== 'function') return []
    const parsed = JSON.parse(storage.getItem(PROFILES_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeProfiles = (profiles) => {
  try {
    const storage = globalThis?.localStorage
    if (!storage || typeof storage.setItem !== 'function') return
    storage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  } catch {
    // Ignore storage write failures in restricted environments.
  }
}

export const buildPacketConfigs = ({ baseConfig, template, pageCount = 5 }) => {
  const types = packetTemplateToTypes[template] ?? packetTemplateToTypes.mixed
  return Array.from({ length: pageCount }, (_, idx) => {
    const type = types[idx % types.length]
    return {
      ...baseConfig,
      type,
      problems: Math.min(getPresetProblems(type, baseConfig.skillLevel), getMaxProblems(type)),
    }
  })
}

const ThemeIcon = ({ theme, className = 'h-7 w-7' }) => {
  if (theme === 'animals') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <circle cx="10" cy="10" r="4" fill="none" stroke="black" strokeWidth="2" />
        <circle cx="30" cy="10" r="4" fill="none" stroke="black" strokeWidth="2" />
        <circle cx="20" cy="17" r="5" fill="none" stroke="black" strokeWidth="2" />
        <ellipse cx="13" cy="28" rx="5" ry="6" fill="none" stroke="black" strokeWidth="2" />
        <ellipse cx="27" cy="28" rx="5" ry="6" fill="none" stroke="black" strokeWidth="2" />
      </svg>
    )
  }
  if (theme === 'princesses') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <path d="M6 30 L10 12 L20 22 L30 12 L34 30 Z" fill="none" stroke="black" strokeWidth="2" />
        <circle cx="10" cy="10" r="2" fill="black" />
        <circle cx="20" cy="8" r="2" fill="black" />
        <circle cx="30" cy="10" r="2" fill="black" />
      </svg>
    )
  }
  if (theme === 'cars') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <rect x="6" y="16" width="28" height="10" rx="2" fill="none" stroke="black" strokeWidth="2" />
        <path d="M12 16 L16 11 H26 L30 16" fill="none" stroke="black" strokeWidth="2" />
        <circle cx="14" cy="29" r="3" fill="none" stroke="black" strokeWidth="2" />
        <circle cx="26" cy="29" r="3" fill="none" stroke="black" strokeWidth="2" />
      </svg>
    )
  }
  if (theme === 'dinosaurs') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <path d="M8 28 Q12 18 22 20 Q30 20 33 26 Q28 30 20 30 Q12 31 8 28 Z" fill="none" stroke="black" strokeWidth="2" />
        <path d="M18 20 Q20 14 25 13" fill="none" stroke="black" strokeWidth="2" />
        <circle cx="26" cy="13" r="1.5" fill="black" />
        <line x1="13" y1="29" x2="13" y2="34" stroke="black" strokeWidth="2" />
        <line x1="21" y1="30" x2="21" y2="34" stroke="black" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d="M7 28 Q10 20 16 17 Q22 14 29 20" fill="none" stroke="black" strokeWidth="2" />
      <path d="M18 17 Q20 10 26 10 Q30 10 32 14 Q31 19 26 20 Q22 20 18 17 Z" fill="none" stroke="black" strokeWidth="2" />
      <path d="M27 10 L33 5" fill="none" stroke="black" strokeWidth="2" />
      <circle cx="26" cy="14" r="1.5" fill="black" />
    </svg>
  )
}

const ShapePreview = ({ shapeName }) => {
  if (shapeName === 'Circle') return <div className="shape-circle" />
  if (shapeName === 'Square') return <div className="shape-square" />
  if (shapeName === 'Triangle') return <div className="shape-triangle" />
  if (shapeName === 'Rectangle') return <div className="shape-rectangle" />
  if (shapeName === 'Star') return <div className="shape-star">★</div>
  if (shapeName === 'Heart') return <div className="shape-heart">❤</div>
  return <div className="shape-oval" />
}

const TracingGuide = ({ text }) => (
  <span className="handwriting-guide">
    <span className="trace-text trace-dots">{text}</span>
  </span>
)

const getInstructionByType = (type) => {
  const instructions = {
    numberTracing: 'Trace each number with your pencil. Say each number aloud as you write.',
    countingObjects: 'Count the objects carefully, then write the number on each line.',
    letterTracing: 'Trace each uppercase and lowercase letter. Keep letters on the writing lines.',
    sightWords: 'Trace each sight word three times, then read the word out loud.',
    nameWriting: 'Trace your name on each line. Try to keep letters neat and on the guides.',
    shapes: 'Say each shape name, then trace the word neatly on the writing guides.',
    addition: 'Solve each addition problem. Use your fingers or draw dots if needed.',
    matching: 'Draw a line to match each picture word to the same word on the right.',
    phonics: 'Say the beginning sound, read the picture word, then trace the focus letter.',
    colorByNumber: 'Use the key to color each shape by number. Stay inside the lines.',
  }
  return instructions[type] ?? 'Complete each problem neatly.'
}

const getPresetProblems = (type, skillLevel) =>
  problemPlanByType[type]?.[skillLevel] ?? 8

export const getMaxProblems = (type) => maxProblemsByType[type] ?? 20

export const generateWorksheetData = ({
  type,
  problems,
  childName,
  theme,
  skillLevel,
  sightWordSource,
  customWordList,
  recentMemory,
  seed,
}) => {
  const safeProblems = Math.max(4, Math.min(getMaxProblems(type), Number(problems)))
  const skillProfile = skillProfiles[skillLevel] ?? skillProfiles.kEarly
  const numberCeiling = skillProfile.numberMax
  const additionMax = skillProfile.additionMax
  const baseSeed = (Number.isFinite(seed) ? seed : 0) >>> 0
  const cfgSeed = hashStringToUint32(
    JSON.stringify({
      type,
      problems: safeProblems,
      childName,
      theme,
      skillLevel,
      sightWordSource,
      customWordList,
      recentMemory,
    }),
  )
  const rng = createRng(baseSeed ^ cfgSeed)

  if (type === 'numberTracing') {
    const numberPool = Array.from({ length: numberCeiling }, (_, i) => (i + 1).toString())
    return pickUniqueWithRecent(numberPool, safeProblems, recentMemory.numberTracing, rng)
  }
  if (type === 'countingObjects') {
    return Array.from({ length: safeProblems }, () => {
      const total = randInt(rng, numberCeiling) + 1
      return { total, theme }
    })
  }
  if (type === 'letterTracing') {
    return pickUniqueWithRecent(letters, safeProblems, recentMemory.letterTracing, rng)
  }
  if (type === 'sightWords') {
    if (sightWordSource === 'mixedRandom') {
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
    const selectedPool = getSightWordPool({ sightWordSource, customWordList })
    const baseWords = pickUniqueWithRecent(selectedPool, safeProblems, recentMemory.sightWords, rng)
    if (baseWords.length === safeProblems || selectedPool.length >= safeProblems) return baseWords
    const fillWords = pickUniqueWithRecent(
      randomSightWordPool.filter((word) => !baseWords.includes(word)),
      safeProblems - baseWords.length,
      [],
      rng,
    )
    return [...baseWords, ...fillWords]
  }
  if (type === 'nameWriting') {
    return Array.from({ length: safeProblems }, () => childName || 'Write your name')
  }
  if (type === 'shapes') {
    return pickUniqueRandom(shapes, safeProblems, rng)
  }
  if (type === 'addition') {
    return Array.from({ length: safeProblems }, () => {
      const a = randInt(rng, additionMax) + 1
      const b = randInt(rng, additionMax) + 1
      return { a, b }
    })
  }
  if (type === 'matching') {
    return pickUniqueWithRecent(themeWords[theme], safeProblems, recentMemory.matching, rng).map((word) => {
      return { word, theme }
    })
  }
  if (type === 'phonics') {
    return pickUniqueWithRecent(
      phonicsBank.slice(0, skillProfile.phonicsLetters),
      safeProblems,
      recentMemory.phonics,
      rng,
    )
  }
  return Array.from({ length: safeProblems }, (_, i) => ({
    n: (i % 6) + 1,
    shape: ['⬡', '◯', '△', '□', '☆', '♡'][i % 6],
  }))
}

function WorksheetBody({ config, data }) {
  switch (config.type) {
    case 'numberTracing':
      return (
        <div className="space-y-3">
          {data.map((n, idx) => (
            <div key={`${n}-${idx}`} className="trace-row">
              <span className="text-3xl font-bold">{n}</span>
              <TracingGuide text={`${n} ${n} ${n} ${n} ${n}`} />
            </div>
          ))}
        </div>
      )
    case 'countingObjects':
      return (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={`count-${idx}`} className="trace-row">
              <span className="flex flex-wrap items-center gap-1.5">
                {Array.from({ length: item.total }, (_, iconIdx) => (
                  <ThemeIcon key={`count-icon-${idx}-${iconIdx}`} theme={item.theme} />
                ))}
              </span>
              <span className="answer-line">Count: ____</span>
            </div>
          ))}
        </div>
      )
    case 'letterTracing':
      return (
        <div className="space-y-3">
          {data.map((letter, idx) => (
            <div key={`letter-${idx}`} className="trace-row">
              <span className="text-3xl font-bold">{letter}</span>
              <TracingGuide text={`${letter} ${letter.toLowerCase()} ${letter} ${letter.toLowerCase()}`} />
            </div>
          ))}
        </div>
      )
    case 'sightWords':
      return (
        <div className="space-y-3">
          {data.map((word, idx) => (
            <div key={`word-${idx}`} className="trace-row">
              <span className="text-2xl font-semibold capitalize">{word}</span>
              <TracingGuide text={`${word} ${word} ${word}`} />
            </div>
          ))}
        </div>
      )
    case 'nameWriting':
      return (
        <div className="space-y-3">
          {data.map((name, idx) => (
            <div key={`name-${idx}`} className="trace-row">
              <span className="text-xl font-semibold">{name}</span>
              <TracingGuide text={`${name} ${name}`} />
            </div>
          ))}
        </div>
      )
    case 'shapes':
      return (
        <div className="grid grid-cols-2 gap-5">
          {data.map((shape, idx) => (
            <div key={`shape-${idx}`} className="rounded-lg border border-dashed border-black p-4">
              <div className="mb-3"><ShapePreview shapeName={shape} /></div>
              <p className="text-lg">This is a: ________</p>
              <div className="mt-2">
                <TracingGuide text={shape} />
              </div>
            </div>
          ))}
        </div>
      )
    case 'addition':
      return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {data.map((sum, idx) => (
            <div key={`add-${idx}`} className="text-2xl">
              {sum.a} + {sum.b} = __
            </div>
          ))}
        </div>
      )
    case 'matching':
      return (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={`match-${idx}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <span className="flex items-center gap-2 text-xl">
                <ThemeIcon theme={item.theme} />
                {item.word}
              </span>
              <span className="text-xl">------</span>
              <span className="text-xl">{item.word}</span>
            </div>
          ))}
        </div>
      )
    case 'phonics':
      return (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={`ph-${idx}`} className="rounded-lg border border-dashed border-black p-3">
              <p className="text-lg font-semibold">
                {item.letter} is for {item.word}
              </p>
              <p className="text-base">Say the beginning sound, then trace the letter:</p>
              <div className="mt-2 max-w-[420px]">
                <TracingGuide text={`${item.letter} ${item.letter} ${item.letter}`} />
              </div>
            </div>
          ))}
        </div>
      )
    default:
      return (
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={`cbn-${idx}`} className="trace-row">
              <span className="text-4xl">{item.shape}</span>
              <span className="text-xl">Color this shape with number {item.n}</span>
            </div>
          ))}
          <p className="text-lg">Color key: 1-black, 2-light gray, 3-dark gray, 4-stripes, 5-dots, 6-outline</p>
        </div>
      )
  }
}

function App() {
  const sheetRef = useRef(null)
  const packetContainerRef = useRef(null)
  const [config, setConfig] = useState({
    type: 'numberTracing',
    difficulty: 'easy',
    skillLevel: 'kEarly',
    problems: getPresetProblems('numberTracing', 'kEarly'),
    theme: 'animals',
    childName: '',
    sightWordSource: 'dolchPrePrimer',
    customWordList: '',
  })
  const [mode, setMode] = useState('single') // single | packet
  const [packetTemplate, setPacketTemplate] = useState('mixed')
  const [packetPages, setPacketPages] = useState([])
  const [packetWarnings, setPacketWarnings] = useState([])
  const [generationId, setGenerationId] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [recentMemory, setRecentMemory] = useState(() => {
    const parsed = readRecentMemory()
    return {
      numberTracing: parsed?.numberTracing || [],
      letterTracing: parsed?.letterTracing || [],
      sightWords: parsed?.sightWords || [],
      matching: parsed?.matching || [],
      phonics: parsed?.phonics || [],
    }
  })
  const worksheetData = useMemo(
    () => generateWorksheetData({ ...config, seed: generationId, recentMemory }),
    [config, generationId, recentMemory],
  )

  const title = useMemo(
    () => worksheetTypes.find((type) => type.value === config.type)?.label ?? 'Worksheet',
    [config.type],
  )
  const instruction = useMemo(() => getInstructionByType(config.type), [config.type])
  const maxProblems = useMemo(() => getMaxProblems(config.type), [config.type])

  const handleGenerate = () => {
    const memoryPatch = { ...recentMemory }
    if (config.type === 'numberTracing') memoryPatch.numberTracing = worksheetData.slice(-8)
    if (config.type === 'letterTracing') memoryPatch.letterTracing = worksheetData.slice(-10)
    if (config.type === 'sightWords') memoryPatch.sightWords = worksheetData.slice(-12)
    if (config.type === 'matching') memoryPatch.matching = worksheetData.map((item) => item.word).slice(-6)
    if (config.type === 'phonics') memoryPatch.phonics = worksheetData.slice(-10)
    setRecentMemory(memoryPatch)
    writeRecentMemory(memoryPatch)
    setGenerationId((id) => id + 1)
    setStatusMessage('Worksheet regenerated.')
  }

  const [profiles, setProfiles] = useState(() => readProfiles())
  const [profileName, setProfileName] = useState('')
  const [selectedProfileId, setSelectedProfileId] = useState('')

  const handleSaveProfile = () => {
    const name = profileName.trim()
    if (!name) {
      setStatusMessage('Please enter a profile name.')
      return
    }
    const next = profiles.filter((p) => p.id !== name)
    next.unshift({
      id: name,
      name,
      savedAt: Date.now(),
      config: {
        childName: config.childName,
        skillLevel: config.skillLevel,
        theme: config.theme,
        sightWordSource: config.sightWordSource,
        customWordList: config.customWordList,
        packetTemplate,
      },
    })
    setProfiles(next)
    writeProfiles(next)
    setSelectedProfileId(name)
    setStatusMessage(`Saved profile: ${name}`)
  }

  const handleLoadProfile = (id) => {
    const found = profiles.find((p) => p.id === id)
    if (!found) return
    setConfig((prev) => ({
      ...prev,
      childName: found.config.childName ?? prev.childName,
      skillLevel: found.config.skillLevel ?? prev.skillLevel,
      theme: found.config.theme ?? prev.theme,
      sightWordSource: found.config.sightWordSource ?? prev.sightWordSource,
      customWordList: found.config.customWordList ?? prev.customWordList,
      problems: Math.min(prev.problems, getMaxProblems(prev.type)),
    }))
    if (found.config.packetTemplate) setPacketTemplate(found.config.packetTemplate)
    setStatusMessage(`Loaded profile: ${found.name}`)
  }

  const handleDeleteProfile = (id) => {
    const next = profiles.filter((p) => p.id !== id)
    setProfiles(next)
    writeProfiles(next)
    if (selectedProfileId === id) setSelectedProfileId('')
    setStatusMessage('Profile deleted.')
  }

  const handleGeneratePacket = () => {
    const pages = buildPacketConfigs({ baseConfig: config, template: packetTemplate, pageCount: 5 })
    setPacketPages(pages)
    setMode('packet')
    setPacketWarnings([])
    setStatusMessage('Packet generated.')
  }

  useEffect(() => {
    if (mode !== 'packet') return
    const container = packetContainerRef.current
    if (!container) return
    const frames = Array.from(container.querySelectorAll('[data-page="worksheet"]'))
    const warnings = frames.map((el) => el.scrollHeight > el.clientHeight + 2)
    setPacketWarnings(warnings)
  }, [mode, packetPages, generationId])

  const updateWithPreset = (nextType, nextSkill) => {
    const profile = skillProfiles[nextSkill] ?? skillProfiles.kEarly
    const suggestedProblems = getPresetProblems(nextType, nextSkill)
    return {
      ...config,
      type: nextType,
      skillLevel: nextSkill,
      difficulty: profile.difficulty,
      problems: Math.min(suggestedProblems, getMaxProblems(nextType)),
    }
  }

  const handlePrint = () => {
    setStatusMessage('Opening print dialog...')
    window.print()
  }

  const handleSaveAsPdf = async () => {
    setStatusMessage('Opening print dialog. Choose "Save as PDF" as destination.')
    window.print()
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-slate-50 p-4 text-slate-900 md:p-8 print:bg-white print:p-0">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr] print:block">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
          <h1 className="text-2xl font-bold">Kindergarten Worksheet Generator</h1>
          <p className="mt-1 text-sm text-slate-600">Create printable black-and-white practice pages in seconds.</p>

          <div className="mt-5 space-y-4">
            <label className="control-label">
              Mode
              <select className="control-input" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="single">Single Worksheet</option>
                <option value="packet">Weekly Packet</option>
              </select>
            </label>

            {mode === 'packet' && (
              <label className="control-label">
                Packet Template
                <select
                  className="control-input"
                  value={packetTemplate}
                  onChange={(e) => setPacketTemplate(e.target.value)}
                >
                  {packetTemplates.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="control-label">
              Worksheet Type
              <select
                className="control-input"
                value={config.type}
                onChange={(e) => setConfig(updateWithPreset(e.target.value, config.skillLevel))}
                disabled={mode === 'packet'}
              >
                {worksheetTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="control-label">
              Skill Preset
              <select
                className="control-input"
                value={config.skillLevel}
                onChange={(e) => setConfig(updateWithPreset(config.type, e.target.value))}
              >
                {skillPresets.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="control-label">
              Number of Problems
              <input
                className="control-input"
                type="number"
                min="4"
                max={maxProblems}
                value={config.problems}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    problems: Math.max(4, Math.min(maxProblems, Number(e.target.value))),
                  })
                }
                disabled={mode === 'packet'}
              />
              <span className="text-xs text-slate-500">Max for this worksheet: {maxProblems}</span>
            </label>

            <label className="control-label">
              Theme
              <select className="control-input" value={config.theme} onChange={(e) => setConfig({ ...config, theme: e.target.value })}>
                {themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </label>

            <label className="control-label">
              Child Name
              <input className="control-input" placeholder="Enter your child's name" value={config.childName} onChange={(e) => setConfig({ ...config, childName: e.target.value })} />
            </label>
            {config.type === 'sightWords' && (
              <>
                <label className="control-label">
                  Sight Word Source
                  <select
                    className="control-input"
                    value={config.sightWordSource}
                    onChange={(e) => setConfig({ ...config, sightWordSource: e.target.value })}
                  >
                    {sightWordSources.map((source) => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                </label>
                {config.sightWordSource === 'custom' && (
                  <label className="control-label">
                    Custom Words (comma or new line)
                    <textarea
                      className="control-input min-h-24"
                      placeholder="cat, dog, sun, run"
                      value={config.customWordList}
                      onChange={(e) => setConfig({ ...config, customWordList: e.target.value })}
                    />
                  </label>
                )}
              </>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {mode === 'single' ? (
              <button type="button" className="action-btn" onClick={handleGenerate}>
                Generate Worksheet
              </button>
            ) : (
              <button type="button" className="action-btn" onClick={handleGeneratePacket}>
                Generate Weekly Packet
              </button>
            )}
            <button type="button" className="action-btn-secondary" onClick={handlePrint}>Print Worksheet</button>
            <button type="button" className="action-btn-secondary" onClick={handleSaveAsPdf}>Save as PDF</button>
          </div>
          {statusMessage && <p className="mt-3 text-xs font-semibold text-slate-600">{statusMessage}</p>}

          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Child profiles</h2>
            <label className="control-label">
              Profile name
              <input
                className="control-input"
                placeholder="e.g. Ava (K Early)"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" className="action-btn-secondary" onClick={handleSaveProfile}>
                Save Profile
              </button>
              <button
                type="button"
                className="action-btn-secondary"
                onClick={() => selectedProfileId && handleDeleteProfile(selectedProfileId)}
                disabled={!selectedProfileId}
              >
                Delete
              </button>
            </div>
            <label className="control-label mt-3">
              Load profile
              <select
                className="control-input"
                value={selectedProfileId}
                onChange={(e) => {
                  setSelectedProfileId(e.target.value)
                  if (e.target.value) handleLoadProfile(e.target.value)
                }}
              >
                <option value="">Select…</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Sample worksheets</h2>
            <div className="space-y-2">
              {sampleWorksheets.map((sample, idx) => (
                <button
                  type="button"
                  key={`sample-${idx}`}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={() => {
                    const nextConfig = {
                      ...updateWithPreset(sample.type, 'kEarly'),
                      ...sample,
                      skillLevel: sample.skillLevel ?? 'kEarly',
                    }
                    nextConfig.problems = Math.min(
                      nextConfig.problems,
                      getMaxProblems(nextConfig.type),
                    )
                    setConfig(nextConfig)
                    setGenerationId((id) => id + 1)
                  }}
                >
                  {worksheetTypes.find((type) => type.value === sample.type)?.label} - {sample.theme}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {mode === 'single' ? (
          <section
            ref={sheetRef}
            className="worksheet-paper rounded-xl border border-slate-300 bg-white p-10 shadow-sm print:rounded-none print:border-none print:p-10 print:shadow-none"
            data-page="worksheet"
          >
            <header className="mb-8 border-b border-slate-300 pb-4">
              <p className="text-sm uppercase tracking-widest text-slate-500">Printable Kindergarten Worksheet</p>
              <h2 className="text-4xl font-black">{title}</h2>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-black px-3 py-1 text-sm">
                <ThemeIcon theme={config.theme} className="h-5 w-5" />
                <span className="capitalize">{config.theme} theme</span>
              </div>
              <p className="mt-2 text-base">{instruction}</p>
              <p className="mt-2 text-xl">
                Name:{' '}
                <span className="inline-block min-w-64 border-b-2 border-dotted border-black">
                  {config.childName || '________________'}
                </span>
              </p>
            </header>
            <div className="mb-4 flex items-center gap-2 print:hidden">
              <button type="button" className="action-btn-secondary" onClick={handleGenerate}>
                Reshuffle Problems
              </button>
              <span className="text-xs text-slate-500">Keeps settings, refreshes worksheet content only.</span>
            </div>
            <WorksheetBody config={config} data={worksheetData} />
          </section>
        ) : (
          <div ref={packetContainerRef} className="space-y-6 print:space-y-0">
            {packetPages.length === 0 && (
              <div className="rounded-xl border border-slate-300 bg-white p-10 shadow-sm print:hidden">
                <p className="text-lg font-semibold">Generate a packet to preview pages here.</p>
                <p className="mt-1 text-sm text-slate-600">
                  Choose a template, then click “Generate Weekly Packet”.
                </p>
              </div>
            )}

            {packetPages.map((pageConfig, idx) => {
              const pageTitle =
                worksheetTypes.find((t) => t.value === pageConfig.type)?.label ?? 'Worksheet'
              const pageInstruction = getInstructionByType(pageConfig.type)
              const pageData = generateWorksheetData({
                ...pageConfig,
                recentMemory,
                seed: generationId + idx + 1,
              })
              const overflow = packetWarnings[idx]
              return (
                <section
                  key={`page-${idx}`}
                  className="worksheet-paper rounded-xl border border-slate-300 bg-white p-10 shadow-sm print:rounded-none print:border-none print:p-10 print:shadow-none"
                  data-page="worksheet"
                >
                  {overflow && (
                    <div className="mb-3 rounded-lg border border-black bg-white px-3 py-2 text-sm print:hidden">
                      This page looks too tall to print on one sheet. Try fewer problems or a different template.
                    </div>
                  )}
                  <header className="mb-8 border-b border-slate-300 pb-4">
                    <p className="text-sm uppercase tracking-widest text-slate-500">
                      Weekly Packet — Page {idx + 1} of {packetPages.length}
                    </p>
                    <h2 className="text-4xl font-black">{pageTitle}</h2>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-black px-3 py-1 text-sm">
                      <ThemeIcon theme={pageConfig.theme} className="h-5 w-5" />
                      <span className="capitalize">{pageConfig.theme} theme</span>
                    </div>
                    <p className="mt-2 text-base">{pageInstruction}</p>
                    <p className="mt-2 text-xl">
                      Name:{' '}
                      <span className="inline-block min-w-64 border-b-2 border-dotted border-black">
                        {pageConfig.childName || '________________'}
                      </span>
                    </p>
                  </header>
                  <WorksheetBody config={pageConfig} data={pageData} />
                </section>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export default App
