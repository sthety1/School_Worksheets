import { useEffect, useMemo, useRef, useState } from 'react'
import {
  generateWorksheetData,
  getMaxProblems,
  getStandardsTagsForType,
  sightWordSources,
  skillProfiles,
} from './worksheetEngine'
import { buildPacketConfigs, packetTemplates } from './packetTemplates'
import { ThemeIcon } from './themeIcons'
import { buildPdfPages } from './pdf/pdfModel'
import { WorksheetPdfDocument } from './pdf/worksheetPdf'
import { downloadPdfDocument } from './pdf/downloadPdf'
import { recommendPlacementPreset } from './placement'

const worksheetTypes = [
  { value: 'numberTracing', label: 'Number Tracing (1-20)' },
  { value: 'countingObjects', label: 'Counting Objects' },
  { value: 'letterTracing', label: 'Letter Tracing (A-Z)' },
  { value: 'sightWords', label: 'Sight Word Tracing' },
  { value: 'nameWriting', label: 'Name Writing Practice' },
  { value: 'shapes', label: 'Shapes Recognition' },
  { value: 'addition', label: 'Beginning Addition' },
  { value: 'subtraction', label: 'Beginning Subtraction' },
  { value: 'tenFrames', label: 'Ten-Frames' },
  { value: 'cvcWords', label: 'CVC Words' },
  { value: 'sentenceTracing', label: 'Sentence Tracing' },
  { value: 'patterns', label: 'Patterns' },
  { value: 'rhymeMatch', label: 'Rhyme Match' },
  { value: 'syllableSort', label: 'Syllable Sort (Tap Clap)' },
  { value: 'numberBonds', label: 'Number Bonds (within 10)' },
  { value: 'subitizing', label: 'Subitizing (Quick-Look Dots)' },
  { value: 'measurementCompare', label: 'Measurement / Compare' },
  { value: 'matching', label: 'Matching Pictures to Words' },
  { value: 'phonics', label: 'Beginning Sounds / Phonics' },
  { value: 'colorByNumber', label: 'Color by Number' },
]

const themeOptions = [
  { value: 'dogs', label: 'Dog' },
  { value: 'cats', label: 'Cat' },
  { value: 'princesses', label: 'Princess' },
  { value: 'cars', label: 'Cars' },
  { value: 'dinosaurs', label: 'Dinosaurs' },
  { value: 'unicorns', label: 'Unicorns' },
]

const skillPresets = [
  { value: 'preK', label: 'Pre-K' },
  { value: 'kEarly', label: 'K Early' },
  { value: 'kMid', label: 'K Mid' },
  { value: 'kEnd', label: 'K End' },
]

const problemPlanByType = {
  numberTracing: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  countingObjects: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  letterTracing: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  sightWords: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  nameWriting: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  shapes: { preK: 6, kEarly: 7, kMid: 7, kEnd: 7 },
  addition: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  subtraction: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  tenFrames: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  cvcWords: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  sentenceTracing: { preK: 6, kEarly: 8, kMid: 10, kEnd: 10 },
  patterns: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  rhymeMatch: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  syllableSort: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  numberBonds: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  subitizing: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  measurementCompare: { preK: 6, kEarly: 8, kMid: 10, kEnd: 12 },
  matching: { preK: 6, kEarly: 6, kMid: 6, kEnd: 6 },
  phonics: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  colorByNumber: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
}

const getPresetProblems = (type, skillLevel) => problemPlanByType[type]?.[skillLevel] ?? 10

const RECENT_MEMORY_KEY = 'worksheet_recent_memory_v1'
const PROFILES_KEY = 'worksheet_child_profiles_v1'
const UI_HINTS_KEY = 'worksheet_ui_hints_v1'
const LAST_PACKET_KEY = 'worksheet_last_packet_v1'

const readJsonFromStorage = (key, fallback) => {
  try {
    const storage = globalThis?.localStorage
    if (!storage || typeof storage.getItem !== 'function') return fallback
    const raw = storage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJsonToStorage = (key, value) => {
  try {
    const storage = globalThis?.localStorage
    if (!storage || typeof storage.setItem !== 'function') return
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
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

const TracingGuide = ({ text, paperStyle }) => (
  <span className="handwriting-guide" data-paper-style={paperStyle}>
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
    subtraction: 'Solve each subtraction problem. Make sure your answer is not negative.',
    tenFrames: 'Count the dots in each ten-frame, then write the total.',
    cvcWords: 'Sound out each word, then write it on the line.',
    sentenceTracing: 'Trace each sentence neatly on the writing guides.',
    patterns: 'Look at the pattern. Write what comes next.',
    rhymeMatch:
      'Read each cue word aloud. Circle the word in the row that rhymes with the cue word. Say both words together to check the rhyme.',
    syllableSort: 'Say the word slowly. Tap each syllable. Circle how the word breaks into syllables.',
    numberBonds: 'Find two parts that make the whole. Write the missing part on the line.',
    subitizing:
      'Look at each group of dots quickly. Write how many you see. Try to tell without counting each dot one-by-one.',
    measurementCompare:
      'Read each question. Circle the picture or word that shows the longer, shorter, taller, heavier, or greater amount.',
    matching: 'Draw a line to match each picture word to the same word on the right.',
    phonics: 'Say the beginning sound, read the picture word, then trace the focus letter.',
    colorByNumber: 'Use the key to color each shape by number. Stay inside the lines.',
  }
  return instructions[type] ?? 'Complete each problem neatly.'
}

const getObjectiveByType = (type) => {
  const objectives = {
    numberTracing: 'I can write numbers neatly.',
    countingObjects: 'I can count objects and write the total.',
    letterTracing: 'I can write uppercase and lowercase letters on the lines.',
    sightWords: 'I can read and write sight words.',
    nameWriting: 'I can write my name neatly.',
    shapes: 'I can name basic shapes.',
    addition: 'I can solve simple addition problems.',
    subtraction: 'I can solve simple subtraction problems.',
    tenFrames: 'I can show numbers using a ten-frame.',
    cvcWords: 'I can read and write CVC words.',
    sentenceTracing: 'I can write a sentence neatly.',
    patterns: 'I can find and complete patterns.',
    rhymeMatch: 'I can listen for rhyming words.',
    syllableSort: 'I can separate a word into syllables.',
    numberBonds: 'I can break a number into two parts.',
    subitizing: 'I can recognize small groups of dots at a glance.',
    measurementCompare: 'I can compare length, height, weight, and capacity with words and pictures.',
    matching: 'I can match pictures and words.',
    phonics: 'I can say the first sound in a word.',
    colorByNumber: 'I can follow a key to color by number.',
  }
  return objectives[type] ?? 'I can practice carefully.'
}

function WorksheetBody({ config, data }) {
  switch (config.type) {
    case 'numberTracing':
      return (
        <div className="space-y-3">
          {data.map((n, idx) => (
            <div key={`${n}-${idx}`} className="trace-row">
              <span className="text-3xl font-bold">{n}</span>
              <TracingGuide text={`${n} ${n} ${n} ${n} ${n}`} paperStyle={config.paperStyle} />
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
              <TracingGuide
                text={`${letter} ${letter.toLowerCase()} ${letter} ${letter.toLowerCase()}`}
                paperStyle={config.paperStyle}
              />
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
              <TracingGuide text={`${word} ${word} ${word}`} paperStyle={config.paperStyle} />
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
              <TracingGuide text={`${name} ${name}`} paperStyle={config.paperStyle} />
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
                <TracingGuide text={shape} paperStyle={config.paperStyle} />
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
    case 'subtraction':
      return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {data.map((row, idx) => (
            <div key={`sub-${idx}`} className="text-2xl">
              {row.a} − {row.b} = __
            </div>
          ))}
        </div>
      )
    case 'tenFrames':
      return (
        <div className="space-y-5">
          {data.map((row, idx) => (
            <div key={`tf-${idx}`} className="trace-row items-start">
              <div className="grid w-[280px] grid-cols-5 gap-2">
                {Array.from({ length: 10 }, (_, dotIdx) => (
                  <div
                    key={`tf-dot-${idx}-${dotIdx}`}
                    className={`h-10 w-10 rounded-md border-2 border-black ${dotIdx < row.total ? 'bg-black' : 'bg-white'}`}
                  />
                ))}
              </div>
              <span className="answer-line">Total: ____</span>
            </div>
          ))}
        </div>
      )
    case 'cvcWords':
      return (
        <div className="space-y-4">
          {data.map((word, idx) => (
            <div key={`cvc-${idx}`} className="trace-row">
              <span className="text-2xl font-semibold capitalize">{word}</span>
              <span className="answer-line min-w-[14rem]">Write: __________</span>
            </div>
          ))}
        </div>
      )
    case 'sentenceTracing':
      return (
        <div className="space-y-4">
          {data.map((sentence, idx) => (
            <div key={`sent-${idx}`} className="trace-row">
              <span className="text-lg font-semibold">Sentence {idx + 1}</span>
              <TracingGuide text={sentence} paperStyle={config.paperStyle} />
            </div>
          ))}
        </div>
      )
    case 'patterns':
      return (
        <div className="space-y-6">
          {data.map((row, idx) => (
            <div key={`pat-${idx}`} className="rounded-lg border border-dashed border-black p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Pattern: {row.kind}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-4xl">
                {row.sequence.map((sym, symIdx) => (
                  <span key={`pat-sym-${idx}-${symIdx}`} className={sym === '__' ? 'px-4 py-1 border-2 border-dotted border-black' : ''}>
                    {sym === '__' ? '  ' : sym}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-lg">Next: ____</p>
            </div>
          ))}
        </div>
      )
    case 'rhymeMatch':
      return (
        <div className="space-y-6">
          {data.map((row, idx) => (
            <div key={`rhyme-${idx}`} className="rounded-lg border border-dashed border-black p-4">
              <div className="flex flex-wrap items-baseline gap-3 text-xl">
                <span className="font-bold">{idx + 1}.</span>
                <span>
                  Cue: <span className="font-extrabold capitalize">{row.cueWord}</span>
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-lg">
                {row.choices.map((choice) => (
                  <span key={`${row.cueWord}-${choice}`} className="rounded-md border border-black px-3 py-1 capitalize">
                    {choice}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-700">Circle the word that rhymes with the cue word.</p>
            </div>
          ))}
        </div>
      )
    case 'syllableSort':
      return (
        <div className="space-y-6">
          {data.map((row, idx) => (
            <div key={`syl-${idx}`} className="rounded-lg border border-dashed border-black p-4">
              <div className="flex flex-wrap items-baseline gap-3 text-xl">
                <span className="font-bold">{idx + 1}.</span>
                <span>
                  Word: <span className="font-extrabold">{row.word}</span>
                  <span className="ml-3 text-base text-slate-600"> ({row.syllables} syllables)</span>
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-lg">
                {row.options.map((opt) => (
                  <span key={`${row.word}-${opt}`} className="rounded-md border border-black px-3 py-1">
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    case 'numberBonds':
      return (
        <div className="grid grid-cols-1 gap-5">
          {data.map((row, idx) => (
            <div key={`bond-${idx}`} className="rounded-lg border border-dashed border-black p-4 text-3xl font-semibold">
              <span className="mr-3 font-bold">{idx + 1}.</span>
              <span>
                {typeof row.a === 'number' ? row.a : '__'}{' '}
              </span>
              <span className="mx-2">+</span>
              <span>
                {typeof row.b === 'number' ? row.b : '__'}{' '}
              </span>
              <span className="mx-2">=</span>
              <span>{row.total}</span>
            </div>
          ))}
        </div>
      )
    case 'subitizing':
      return (
        <div className="space-y-6">
          {data.map((row, idx) => {
            const filled = new Set(row.cells.map((c) => `${c.row},${c.col}`))
            return (
              <div key={`sub-${idx}`} className="trace-row flex-wrap items-start gap-6">
                <div className="grid w-[200px] grid-cols-5 gap-1 border border-black bg-white p-1">
                  {Array.from({ length: 25 }, (_, i) => {
                    const gridRow = Math.floor(i / 5)
                    const gridCol = i % 5
                    const on = filled.has(`${gridRow},${gridCol}`)
                    return (
                      <div
                        key={`sub-cell-${idx}-${i}`}
                        className="flex aspect-square max-h-10 items-center justify-center border border-neutral-800 bg-neutral-50"
                      >
                        {on ? <span className="h-3 w-3 rounded-full bg-black" aria-hidden /> : null}
                      </div>
                    )
                  })}
                </div>
                <span className="answer-line">How many dots? ____</span>
              </div>
            )
          })}
        </div>
      )
    case 'measurementCompare':
      return (
        <div className="space-y-6">
          {data.map((row, idx) => (
            <div key={`meas-${idx}`} className="rounded-lg border border-dashed border-black p-4">
              <div className="flex flex-wrap items-baseline gap-3 text-xl">
                <span className="font-bold">{idx + 1}.</span>
                <span className="font-semibold">{row.prompt}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-8 text-xl">
                <span className="rounded-md border-2 border-black px-4 py-2">A · {row.leftLabel}</span>
                <span className="rounded-md border-2 border-black px-4 py-2">B · {row.rightLabel}</span>
              </div>
              <p className="mt-3 text-sm text-slate-700">Circle the letter that answers the question.</p>
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
                <TracingGuide text={`${item.letter} ${item.letter} ${item.letter}`} paperStyle={config.paperStyle} />
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

function AnswerKeyBody({ config, answers }) {
  if (!answers) return null

  if (config.type === 'addition') {
    return (
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {answers.map((row, idx) => (
          <div key={`add-ak-${idx}`} className="text-2xl">
            {row.a} + {row.b} = <span className="font-bold">{row.sum}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'subtraction') {
    return (
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {answers.map((row, idx) => (
          <div key={`sub-ak-${idx}`} className="text-2xl">
            {row.a} − {row.b} = <span className="font-bold">{row.diff}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'countingObjects') {
    return (
      <div className="space-y-3">
        {answers.map((row, idx) => (
          <div key={`count-ak-${idx}`} className="text-2xl">
            {idx + 1}. <span className="font-bold">{row.total}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'matching') {
    return (
      <div className="space-y-2">
        {answers.map((row, idx) => (
          <div key={`match-ak-${idx}`} className="text-2xl">
            {idx + 1}. <span className="font-bold">{row.word}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'phonics') {
    return (
      <div className="space-y-3">
        {answers.map((row, idx) => (
          <div key={`ph-ak-${idx}`} className="text-2xl">
            {row.word} → <span className="font-bold">{row.letter}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'tenFrames') {
    return (
      <div className="space-y-3">
        {answers.map((row, idx) => (
          <div key={`tf-ak-${idx}`} className="text-2xl">
            {idx + 1}. <span className="font-bold">{row.total}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'cvcWords') {
    return (
      <div className="space-y-2">
        {answers.map((row, idx) => (
          <div key={`cvc-ak-${idx}`} className="text-2xl">
            {idx + 1}. <span className="font-bold">{row.word}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'patterns') {
    return (
      <div className="space-y-2">
        {answers.map((row, idx) => (
          <div key={`pat-ak-${idx}`} className="text-2xl">
            {idx + 1}. ({row.kind}) <span className="font-bold">{row.next}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'rhymeMatch') {
    return (
      <div className="space-y-2">
        {answers.map((row, idx) => (
          <div key={`rhyme-ak-${idx}`} className="text-2xl">
            {idx + 1}. {row.cueWord} rhymes with <span className="font-bold capitalize">{row.correctRhyme}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'syllableSort') {
    return (
      <div className="space-y-2">
        {answers.map((row, idx) => (
          <div key={`syl-ak-${idx}`} className="text-2xl">
            {idx + 1}. <span className="font-bold">{row.correct}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'numberBonds') {
    return (
      <div className="space-y-2">
        {answers.map((row, idx) => (
          <div key={`bond-ak-${idx}`} className="text-2xl">
            {idx + 1}. {row.a} + {row.b} = {row.total}
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'subitizing') {
    return (
      <div className="space-y-2">
        {answers.map((row, idx) => (
          <div key={`sub-ak-${idx}`} className="text-2xl">
            {idx + 1}. <span className="font-bold">{row.count}</span>
          </div>
        ))}
      </div>
    )
  }
  if (config.type === 'measurementCompare') {
    return (
      <div className="space-y-2">
        {answers.map((row, idx) => (
          <div key={`meas-ak-${idx}`} className="text-2xl">
            {idx + 1}. <span className="font-bold">{row.correctLabel}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default function AppNew() {
  const sheetRef = useRef(null)
  const packetContainerRef = useRef(null)
  const importFileRef = useRef(null)

  const [showStandardsTags, setShowStandardsTags] = useState(false)
  const [showAnswerKey, setShowAnswerKey] = useState(false)
  const [showObjectiveLine, setShowObjectiveLine] = useState(false)
  const [printPreviewMode, setPrintPreviewMode] = useState(false)

  const [config, setConfig] = useState({
    type: 'numberTracing',
    difficulty: 'easy',
    skillLevel: 'kEnd',
    problems: getPresetProblems('numberTracing', 'kEnd'),
    theme: 'dogs',
    childName: '',
    sightWordSource: 'dolchPrePrimer',
    customWordList: '',
    instructionOverride: '',
    objectiveOverride: '',
    paperStyle: 'baseline',
    traceOpacity: 0.9,
    traceFont: 'playwrite',
  })

  const [mode, setMode] = useState('single')
  const [packetTemplate, setPacketTemplate] = useState('mixed')
  const [packetPages, setPacketPages] = useState([])
  const [packetWarnings, setPacketWarnings] = useState([])
  const [packetPageRerolls, setPacketPageRerolls] = useState([])

  const [placementScores, setPlacementScores] = useState({
    letterTracing: 0,
    phonics: 0,
    countingObjects: 0,
    numberTracing: 0,
    addition: 0,
    extra: 0,
  })

  const [generationId, setGenerationId] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')

  const [uiHints, setUiHints] = useState(() => readJsonFromStorage(UI_HINTS_KEY, { packetFlowDismissed: false }))
  const [lastPacketSnapshot, setLastPacketSnapshot] = useState(() => readJsonFromStorage(LAST_PACKET_KEY, null))

  const [recentMemory, setRecentMemory] = useState(() => {
    const parsed = readJsonFromStorage(RECENT_MEMORY_KEY, {})
    return {
      numberTracing: parsed.numberTracing || [],
      letterTracing: parsed.letterTracing || [],
      sightWords: parsed.sightWords || [],
      matching: parsed.matching || [],
      phonics: parsed.phonics || [],
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
  const instruction = useMemo(() => {
    const override = (config.instructionOverride ?? '').trim()
    return override ? override : getInstructionByType(config.type)
  }, [config.instructionOverride, config.type])
  const objective = useMemo(() => {
    const override = (config.objectiveOverride ?? '').trim()
    return override ? override : getObjectiveByType(config.type)
  }, [config.objectiveOverride, config.type])
  const maxProblems = useMemo(() => getMaxProblems(config.type), [config.type])

  const buildConfigWithPreset = (currentConfig, nextType, nextSkill) => {
    const profile = skillProfiles[nextSkill] ?? skillProfiles.kEarly
    const suggestedProblems = getPresetProblems(nextType, nextSkill)
    return {
      ...currentConfig,
      type: nextType,
      skillLevel: nextSkill,
      difficulty: profile.difficulty,
      problems: Math.min(suggestedProblems, getMaxProblems(nextType)),
    }
  }

  const dismissPacketFlowHint = () => {
    setUiHints((prev) => {
      const next = { ...prev, packetFlowDismissed: true }
      writeJsonToStorage(UI_HINTS_KEY, next)
      return next
    })
  }

  const handleResetRecommendedDefaults = () => {
    setConfig((prev) => {
      const next = buildConfigWithPreset(prev, prev.type, prev.skillLevel)
      return {
        ...next,
        instructionOverride: '',
        objectiveOverride: '',
      }
    })
    setStatusMessage('Restored recommended problem count and defaults for this worksheet type and preset.')
  }

  const handleJumpToPrintPreview = () => {
    setPrintPreviewMode(true)
    setStatusMessage('Print preview opened—use Print, Save as PDF, or Download when ready.')
  }

  const handleRestoreLastPacketSettings = () => {
    if (!lastPacketSnapshot || typeof lastPacketSnapshot !== 'object') return
    const pt = lastPacketSnapshot.packetTemplate
    const toggles = lastPacketSnapshot.toggles ?? {}
    const base = lastPacketSnapshot.base
    setMode('packet')
    if (typeof pt === 'string') setPacketTemplate(pt)
    if (typeof toggles.showAnswerKey === 'boolean') setShowAnswerKey(toggles.showAnswerKey)
    if (typeof toggles.showStandardsTags === 'boolean') setShowStandardsTags(toggles.showStandardsTags)
    if (typeof toggles.showObjectiveLine === 'boolean') setShowObjectiveLine(toggles.showObjectiveLine)

    setConfig((prev) => {
      if (!base || typeof base !== 'object') return prev
      const nextType = typeof base.type === 'string' ? base.type : prev.type
      const nextSkill = typeof base.skillLevel === 'string' ? base.skillLevel : prev.skillLevel
      const cap = getMaxProblems(nextType)
      const profile = skillProfiles[nextSkill] ?? skillProfiles.kEarly
      return {
        ...prev,
        ...base,
        type: nextType,
        skillLevel: nextSkill,
        difficulty: profile.difficulty,
        problems: Math.max(4, Math.min(Number(base.problems) || getPresetProblems(nextType, nextSkill), cap)),
      }
    })

    setPacketPages([])
    setPacketWarnings([])
    setPacketPageRerolls([])
    setStatusMessage('Restored settings from your last generated packet. Click Generate to build new pages.')
  }

  const placementRecommendation = useMemo(() => recommendPlacementPreset(placementScores), [placementScores])

  const handleGenerate = () => {
    const memoryPatch = { ...recentMemory }
    if (config.type === 'numberTracing') memoryPatch.numberTracing = worksheetData.student.slice(-8)
    if (config.type === 'letterTracing') memoryPatch.letterTracing = worksheetData.student.slice(-10)
    if (config.type === 'sightWords') memoryPatch.sightWords = worksheetData.student.slice(-12)
    if (config.type === 'matching') memoryPatch.matching = worksheetData.student.map((item) => item.word).slice(-6)
    if (config.type === 'phonics') memoryPatch.phonics = worksheetData.student.slice(-10)
    setRecentMemory(memoryPatch)
    writeJsonToStorage(RECENT_MEMORY_KEY, memoryPatch)
    setGenerationId((id) => id + 1)
    setStatusMessage('Worksheet regenerated.')
  }

  const handleGeneratePacket = () => {
    const pages = buildPacketConfigs({
      baseConfig: config,
      template: packetTemplate,
      pageCount: 5,
      getPresetProblems,
    })
    setPacketPages(pages)
    setPacketPageRerolls(Array.from({ length: pages.length }, () => 0))
    setMode('packet')
    setPacketWarnings([])
    const snapshot = {
      packetTemplate,
      toggles: {
        showAnswerKey,
        showStandardsTags,
        showObjectiveLine,
      },
      base: {
        type: config.type,
        skillLevel: config.skillLevel,
        difficulty: config.difficulty,
        problems: config.problems,
        theme: config.theme,
        childName: config.childName,
        sightWordSource: config.sightWordSource,
        customWordList: config.customWordList,
        paperStyle: config.paperStyle,
        traceOpacity: config.traceOpacity,
        traceFont: config.traceFont,
        instructionOverride: config.instructionOverride,
        objectiveOverride: config.objectiveOverride,
      },
    }
    setLastPacketSnapshot(snapshot)
    writeJsonToStorage(LAST_PACKET_KEY, snapshot)
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

  const handlePrint = () => {
    setStatusMessage('Opening print dialog...')
    window.print()
  }

  const handleSaveAsPdf = async () => {
    setStatusMessage('Opening print dialog. Choose "Save as PDF" as destination.')
    window.print()
  }

  const safeFilenamePart = (value) =>
    String(value ?? '')
      .trim()
      .replace(/[^a-z0-9-_]+/gi, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '')

  const handleDownloadPdf = async () => {
    try {
      const now = new Date()
      const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      const child = safeFilenamePart(config.childName) || 'child'
      const filename = mode === 'packet' ? `weekly_packet_${child}_${date}.pdf` : `worksheet_${child}_${date}.pdf`

      if (mode === 'packet' && (!Array.isArray(packetPages) || packetPages.length === 0)) {
        setStatusMessage('Generate a weekly packet first, then download the packet PDF.')
        return
      }

      setStatusMessage('Building PDF…')
      const pages = buildPdfPages({
        mode,
        config,
        worksheetSeed: generationId,
        packetPages,
        packetPageRerolls,
        generationId,
        recentMemory,
        showAnswerKey,
        showStandardsTags,
      })

      const doc = <WorksheetPdfDocument pages={pages} filenameLabel={filename} />
      await downloadPdfDocument({ doc, filename })
      setStatusMessage('PDF downloaded.')
    } catch {
      setStatusMessage('Could not generate PDF. Use Print → Save as PDF as a fallback.')
    }
  }

  const handleRerollPacketPage = (idx) => {
    setPacketPageRerolls((prev) => {
      const next = Array.isArray(prev) ? [...prev] : []
      next[idx] = (next[idx] ?? 0) + 1
      return next
    })
    setGenerationId((id) => id + 1)
    setStatusMessage(`Packet page ${idx + 1} regenerated.`)
  }

  // Profiles
  const [profiles, setProfiles] = useState(() => readJsonFromStorage(PROFILES_KEY, []))
  const [profileName, setProfileName] = useState('')
  const [selectedProfileId, setSelectedProfileId] = useState('')

  const handleExportProfiles = () => {
    try {
      const payload = {
        version: 1,
        exportedAt: Date.now(),
        profiles: Array.isArray(profiles) ? profiles : [],
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'worksheet_profiles.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setStatusMessage('Profiles exported.')
    } catch {
      setStatusMessage('Could not export profiles.')
    }
  }

  const handleImportProfiles = async (file) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const incoming = Array.isArray(parsed) ? parsed : parsed?.profiles
      if (!Array.isArray(incoming)) {
        setStatusMessage('Invalid profile file.')
        return
      }
      const normalized = incoming
        .filter((p) => p && typeof p === 'object')
        .map((p) => ({
          id: String(p.id ?? p.name ?? '').trim(),
          name: String(p.name ?? p.id ?? '').trim(),
          savedAt: Number.isFinite(p.savedAt) ? p.savedAt : Date.now(),
          config: p.config ?? {},
        }))
        .filter((p) => p.id && p.name)

      const byId = new Map((Array.isArray(profiles) ? profiles : []).map((p) => [p.id, p]))
      for (const p of normalized) byId.set(p.id, p)
      const merged = Array.from(byId.values()).sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0))
      setProfiles(merged)
      writeJsonToStorage(PROFILES_KEY, merged)
      setStatusMessage(`Imported ${normalized.length} profile(s).`)
    } catch {
      setStatusMessage('Could not import profiles.')
    }
  }

  const handleSaveProfile = () => {
    const name = profileName.trim()
    if (!name) {
      setStatusMessage('Please enter a profile name.')
      return
    }
    const next = (Array.isArray(profiles) ? profiles : []).filter((p) => p.id !== name)
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
        instructionOverride: config.instructionOverride,
        objectiveOverride: config.objectiveOverride,
        paperStyle: config.paperStyle,
        traceOpacity: config.traceOpacity,
        traceFont: config.traceFont,
        showObjectiveLine,
        showStandardsTags,
        showAnswerKey,
        packetTemplate,
      },
    })
    setProfiles(next)
    writeJsonToStorage(PROFILES_KEY, next)
    setSelectedProfileId(name)
    setStatusMessage(`Saved profile: ${name}`)
  }

  const handleLoadProfile = (id) => {
    const found = (Array.isArray(profiles) ? profiles : []).find((p) => p.id === id)
    if (!found) return
    setConfig((prev) => ({
      ...prev,
      childName: found.config.childName ?? prev.childName,
      skillLevel: found.config.skillLevel ?? prev.skillLevel,
      theme: (found.config.theme === 'animals' ? 'dogs' : found.config.theme) ?? prev.theme,
      sightWordSource: found.config.sightWordSource ?? prev.sightWordSource,
      customWordList: found.config.customWordList ?? prev.customWordList,
      instructionOverride: found.config.instructionOverride ?? prev.instructionOverride,
      objectiveOverride: found.config.objectiveOverride ?? prev.objectiveOverride,
      paperStyle: found.config.paperStyle ?? prev.paperStyle,
      traceOpacity: typeof found.config.traceOpacity === 'number' ? found.config.traceOpacity : prev.traceOpacity,
      traceFont: found.config.traceFont ?? prev.traceFont,
      problems: Math.min(prev.problems, getMaxProblems(prev.type)),
    }))
    if (found.config.packetTemplate) setPacketTemplate(found.config.packetTemplate)
    if (typeof found.config.showObjectiveLine === 'boolean') setShowObjectiveLine(found.config.showObjectiveLine)
    if (typeof found.config.showStandardsTags === 'boolean') setShowStandardsTags(found.config.showStandardsTags)
    if (typeof found.config.showAnswerKey === 'boolean') setShowAnswerKey(found.config.showAnswerKey)
    setStatusMessage(`Loaded profile: ${found.name}`)
  }

  const handleDeleteProfile = (id) => {
    const next = (Array.isArray(profiles) ? profiles : []).filter((p) => p.id !== id)
    setProfiles(next)
    writeJsonToStorage(PROFILES_KEY, next)
    if (selectedProfileId === id) setSelectedProfileId('')
    setStatusMessage('Profile deleted.')
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-slate-50 p-4 text-slate-900 md:p-8 print:bg-white print:p-0">
      {printPreviewMode && (
        <div className="sticky top-0 z-20 mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm print:hidden">
          <div>
            <p className="text-sm font-bold">Print Preview</p>
            <p className="text-xs text-slate-600">Review pages, then print or save as PDF.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="action-btn-secondary" onClick={handlePrint}>Print</button>
            <button type="button" className="action-btn-secondary" onClick={handleSaveAsPdf}>Save as PDF</button>
            <button type="button" className="action-btn-secondary" onClick={handleDownloadPdf}>
              {mode === 'packet' ? 'Download Packet PDF' : 'Download PDF'}
            </button>
            <button type="button" className="action-btn" onClick={() => setPrintPreviewMode(false)}>Exit Preview</button>
          </div>
        </div>
      )}

      <div className={`grid gap-6 lg:grid-cols-[340px_1fr] print:block ${printPreviewMode ? 'lg:grid-cols-1' : ''}`}>
        <aside className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:hidden ${printPreviewMode ? 'hidden' : ''}`}>
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

            {mode === 'packet' && !uiHints.packetFlowDismissed && (
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-slate-800">
                <p className="font-bold text-sky-900">Weekly packet — three quick steps</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-700">
                  <li>Choose a template above (mixed review, math focus, and more).</li>
                  <li>Click Generate to build five pages in the preview area.</li>
                  <li>Open Print Preview, then Print or Download PDF for the full stack.</li>
                </ol>
                <button type="button" className="mt-3 text-xs font-bold text-sky-900 underline" onClick={dismissPacketFlowHint}>
                  Got it, hide this tip
                </button>
              </div>
            )}

            <label className="control-label">
              Worksheet Type
              <select
                className="control-input"
                value={config.type}
                onChange={(e) => setConfig((prev) => buildConfigWithPreset(prev, e.target.value, prev.skillLevel))}
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
                onChange={(e) => setConfig((prev) => buildConfigWithPreset(prev, prev.type, e.target.value))}
              >
                {skillPresets.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>

            {mode === 'packet' && packetTemplate === 'placement' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Placement check</p>
                <p className="mt-1 text-xs text-slate-600">
                  Print the packet and let your child work through it. Then, for each row below, enter a score from 0 (not yet) to
                  5 (strong). We add the scores to suggest a good starting skill preset—no grading rubric required.
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Letter tracing
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                      type="number"
                      min="0"
                      max="5"
                      value={placementScores.letterTracing}
                      onChange={(e) =>
                        setPlacementScores((prev) => ({ ...prev, letterTracing: Math.max(0, Math.min(5, Number(e.target.value))) }))
                      }
                    />
                  </label>
                  <label className="block text-xs font-semibold text-slate-700">
                    Phonics
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                      type="number"
                      min="0"
                      max="5"
                      value={placementScores.phonics}
                      onChange={(e) =>
                        setPlacementScores((prev) => ({ ...prev, phonics: Math.max(0, Math.min(5, Number(e.target.value))) }))
                      }
                    />
                  </label>
                  <label className="block text-xs font-semibold text-slate-700">
                    Counting
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                      type="number"
                      min="0"
                      max="5"
                      value={placementScores.countingObjects}
                      onChange={(e) =>
                        setPlacementScores((prev) => ({ ...prev, countingObjects: Math.max(0, Math.min(5, Number(e.target.value))) }))
                      }
                    />
                  </label>
                  <label className="block text-xs font-semibold text-slate-700">
                    Number tracing
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                      type="number"
                      min="0"
                      max="5"
                      value={placementScores.numberTracing}
                      onChange={(e) =>
                        setPlacementScores((prev) => ({ ...prev, numberTracing: Math.max(0, Math.min(5, Number(e.target.value))) }))
                      }
                    />
                  </label>
                  <label className="block text-xs font-semibold text-slate-700">
                    Addition
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                      type="number"
                      min="0"
                      max="5"
                      value={placementScores.addition}
                      onChange={(e) =>
                        setPlacementScores((prev) => ({ ...prev, addition: Math.max(0, Math.min(5, Number(e.target.value))) }))
                      }
                    />
                  </label>
                  <label className="block text-xs font-semibold text-slate-700">
                    Optional extra
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                      type="number"
                      min="0"
                      max="5"
                      value={placementScores.extra}
                      onChange={(e) =>
                        setPlacementScores((prev) => ({ ...prev, extra: Math.max(0, Math.min(5, Number(e.target.value))) }))
                      }
                    />
                  </label>
                </div>

                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs font-bold text-slate-700">Suggested starting preset: {placementRecommendation.label}</p>
                  <p className="mt-1 text-xs text-slate-600">{placementRecommendation.explanation}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="action-btn-secondary"
                      onClick={() => setConfig((prev) => buildConfigWithPreset(prev, prev.type, placementRecommendation.preset))}
                    >
                      Use this preset
                    </button>
                    <button
                      type="button"
                      className="action-btn-secondary"
                      onClick={() =>
                        setPlacementScores({
                          letterTracing: 0,
                          phonics: 0,
                          countingObjects: 0,
                          numberTracing: 0,
                          addition: 0,
                          extra: 0,
                        })
                      }
                    >
                      Reset scores
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                {themeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
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

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Printing &amp; curriculum</p>
              <p className="mt-1 text-xs text-slate-600">Optional—turn on only when you want parents or co-teachers to see extras.</p>
              <label className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold">
                <span className="pr-2">Include answer key (on screen and when printing)</span>
                <input
                  type="checkbox"
                  aria-label="Include answer key on screen and when printing"
                  checked={showAnswerKey}
                  onChange={(e) => setShowAnswerKey(e.target.checked)}
                  className="h-4 w-4 shrink-0 accent-slate-900"
                />
              </label>
              <label className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold">
                <span className="pr-2">Show standard codes (Common Core labels on the page)</span>
                <input
                  type="checkbox"
                  aria-label="Show Common Core standard codes on the page"
                  checked={showStandardsTags}
                  onChange={(e) => setShowStandardsTags(e.target.checked)}
                  className="h-4 w-4 shrink-0 accent-slate-900"
                />
              </label>
              <label className="mt-3 block text-sm font-semibold">
                Instruction text
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={config.instructionOverride}
                  placeholder="(Uses default if blank)"
                  onChange={(e) => setConfig({ ...config, instructionOverride: e.target.value })}
                />
              </label>
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-slate-700 underline"
                onClick={() => setConfig({ ...config, instructionOverride: '' })}
              >
                Use default instruction
              </button>

              <label className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold">
                <span className="pr-2">Show learning goal line (“I can…”)</span>
                <input
                  type="checkbox"
                  aria-label="Show learning goal line under the instructions"
                  checked={showObjectiveLine}
                  onChange={(e) => setShowObjectiveLine(e.target.checked)}
                  className="h-4 w-4 shrink-0 accent-slate-900"
                />
              </label>
              {showObjectiveLine && (
                <>
                  <label className="mt-2 block text-sm font-semibold">
                    Objective text
                    <input
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      value={config.objectiveOverride}
                      placeholder="(Uses default if blank)"
                      onChange={(e) => setConfig({ ...config, objectiveOverride: e.target.value })}
                    />
                  </label>
                  <button
                    type="button"
                    className="mt-2 text-xs font-semibold text-slate-700 underline"
                    onClick={() => setConfig({ ...config, objectiveOverride: '' })}
                  >
                    Use default objective
                  </button>
                </>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Handwriting options</p>
              <label className="mt-2 block text-sm font-semibold">
                Paper style
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={config.paperStyle}
                  onChange={(e) => setConfig({ ...config, paperStyle: e.target.value })}
                >
                  <option value="baseline">Baseline (simple)</option>
                  <option value="primary">Primary (3-line)</option>
                  <option value="wideRuled">Wide ruled</option>
                  <option value="blank">Blank</option>
                </select>
              </label>

              <label className="mt-3 block text-sm font-semibold">
                Tracing opacity
                <input
                  className="mt-2 w-full"
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.05"
                  value={config.traceOpacity}
                  onChange={(e) => setConfig({ ...config, traceOpacity: Number(e.target.value) })}
                />
                <span className="mt-1 block text-xs text-slate-600">{Math.round(config.traceOpacity * 100)}%</span>
              </label>

              <label className="mt-3 block text-sm font-semibold">
                Tracing font
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={config.traceFont}
                  onChange={(e) => setConfig({ ...config, traceFont: e.target.value })}
                >
                  <option value="playwrite">Playwrite NZ Basic Guides</option>
                  <option value="system">System print</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {mode === 'single' ? (
              <button type="button" className="action-btn" onClick={handleGenerate}>
                Generate Worksheet
              </button>
            ) : (
              <button type="button" className="action-btn" onClick={handleGeneratePacket}>
                {packetTemplate === 'placement' ? 'Generate Placement Packet' : 'Generate Weekly Packet'}
              </button>
            )}
            <button type="button" className="action-btn-secondary" onClick={handlePrint}>Print Worksheet</button>
            <button type="button" className="action-btn-secondary" onClick={handleSaveAsPdf}>Save as PDF</button>
            <button type="button" className="action-btn-secondary" onClick={handleDownloadPdf}>
              {mode === 'packet' ? 'Download Packet PDF' : 'Download PDF'}
            </button>
            <button type="button" className="action-btn-secondary" onClick={() => setPrintPreviewMode(true)}>
              Print Preview
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Quick actions</p>
            <div className="mt-3 flex flex-col gap-2">
              <button type="button" className="action-btn-secondary text-sm" onClick={handleResetRecommendedDefaults}>
                Reset worksheet to recommended defaults
              </button>
              <button type="button" className="action-btn-secondary text-sm" onClick={handleJumpToPrintPreview}>
                Jump to print preview
              </button>
              <button
                type="button"
                className="action-btn-secondary text-sm"
                disabled={!lastPacketSnapshot}
                onClick={handleRestoreLastPacketSettings}
              >
                Use last packet settings
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Reset clears custom instruction text and puts the problem count back in line with the skill preset.
              Last packet restores template and options from your most recently generated weekly packet (not placement).
            </p>
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
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" className="action-btn-secondary" onClick={handleExportProfiles}>
                Export JSON
              </button>
              <button type="button" className="action-btn-secondary" onClick={() => importFileRef.current?.click()}>
                Import JSON
              </button>
              <input
                ref={importFileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleImportProfiles(file)
                  // allow re-importing the same file after edits
                  e.target.value = ''
                }}
              />
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
                {(Array.isArray(profiles) ? profiles : []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </aside>

        {mode === 'single' ? (
          <section
            ref={sheetRef}
            className="worksheet-paper rounded-xl border border-slate-300 bg-white p-10 shadow-sm print:rounded-none print:border-none print:p-10 print:shadow-none"
            data-page="worksheet"
            style={{
              '--trace-opacity': config.traceOpacity,
              '--trace-font-family':
                config.traceFont === 'system' ? '"Avenir Next", "Segoe UI", Arial, sans-serif' : '"Playwrite NZ Basic Guides"',
            }}
          >
            <header className="mb-8 border-b border-slate-300 pb-4">
              <p className="text-sm uppercase tracking-widest text-slate-500">Printable Kindergarten Worksheet</p>
              <h2 className="text-4xl font-black">{title}</h2>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-black px-3 py-1 text-sm">
                <ThemeIcon theme={config.theme} className="h-5 w-5" />
                <span className="capitalize">{config.theme} theme</span>
              </div>
              <p className="mt-2 text-base">{instruction}</p>
              {showObjectiveLine && <p className="mt-1 text-base font-semibold">Objective: {objective}</p>}
              <p className="mt-2 text-xl">
                Name:{' '}
                <span className="inline-block min-w-64 border-b-2 border-solid border-black">
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
            <WorksheetBody config={config} data={worksheetData.student} />
            {showStandardsTags && getStandardsTagsForType(config.type).length > 0 && (
              <footer className="mt-6 border-t border-slate-300 pt-2 text-xs text-slate-700 print:text-black">
                <span className="font-semibold">Standards:</span> {getStandardsTagsForType(config.type).join(', ')}
              </footer>
            )}
          </section>
        ) : (
          <div ref={packetContainerRef} className="space-y-6 print:space-y-0">
            {packetPages.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 shadow-sm print:hidden">
                <h3 className="text-lg font-bold text-slate-900">No packet in the preview yet</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Each weekly packet builds five themed pages—letters, math, phonics—using your preset and theme selected in the left panel.
                </p>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-800">
                  <li>Pick a packet template above (try <strong>Mixed review</strong> for variety).</li>
                  <li>Click <strong>Generate Weekly Packet</strong> (or Generate Placement Packet for the placement flow).</li>
                  <li>Scroll this area to review every page, then use <strong>Print Preview</strong>, <strong>Print</strong>, or{' '}
                  <strong>Download PDF</strong>.</li>
                </ol>
                <div className="mt-5 flex flex-wrap gap-2 print:hidden">
                  <button type="button" className="action-btn-secondary text-sm" onClick={() => setPacketTemplate('mixed')}>
                    Use Mixed Review template
                  </button>
                  <button type="button" className="action-btn-secondary text-sm" onClick={() => setPacketTemplate('math')}>
                    Use Math Focus template
                  </button>
                  <button type="button" className="action-btn-secondary text-sm" onClick={() => setPacketTemplate('handwriting')}>
                    Use Handwriting Focus template
                  </button>
                  <button type="button" className="action-btn-secondary text-sm" onClick={handleJumpToPrintPreview}>
                    Jump to print preview
                  </button>
                </div>
              </div>
            )}
            {packetPages.map((pageConfig, idx) => {
              const pageTitle = worksheetTypes.find((t) => t.value === pageConfig.type)?.label ?? 'Worksheet'
              const pageInstruction = (pageConfig.instructionOverride ?? '').trim() || getInstructionByType(pageConfig.type)
              const pageObjective = (pageConfig.objectiveOverride ?? '').trim() || getObjectiveByType(pageConfig.type)
              const pageData = generateWorksheetData({
                ...pageConfig,
                recentMemory,
                seed: generationId + idx + 1 + (packetPageRerolls[idx] ?? 0) * 10000,
              })
              const overflow = packetWarnings[idx]
              return (
                <div key={`page-wrap-${idx}`} className="space-y-6 print:space-y-0">
                  <section
                    className="worksheet-paper rounded-xl border border-slate-300 bg-white p-10 shadow-sm print:rounded-none print:border-none print:p-10 print:shadow-none"
                    data-page="worksheet"
                    style={{
                      '--trace-opacity': pageConfig.traceOpacity ?? config.traceOpacity,
                      '--trace-font-family':
                        (pageConfig.traceFont ?? config.traceFont) === 'system'
                          ? '"Avenir Next", "Segoe UI", Arial, sans-serif'
                          : '"Playwrite NZ Basic Guides"',
                    }}
                  >
                    {overflow && (
                      <div className="mb-3 rounded-lg border border-black bg-white px-3 py-2 text-sm print:hidden">
                        <p className="font-semibold">This page may overflow a single sheet.</p>
                        <p className="mt-1 text-sm text-slate-700">
                          Try lowering the problem count, switching packet template, or changing the worksheet type for this page.
                        </p>
                      </div>
                    )}
                    <header className="mb-8 border-b border-slate-300 pb-4">
                      <p className="text-sm uppercase tracking-widest text-slate-500">
                        Weekly Packet — Page {idx + 1} of {packetPages.length}
                      </p>
                      <h2 className="text-4xl font-black">{pageTitle}</h2>
                      <div className="mt-2 flex items-center gap-2 print:hidden">
                        <button
                          type="button"
                          className="action-btn-secondary"
                          onClick={() => handleRerollPacketPage(idx)}
                        >
                          Reroll this page
                        </button>
                        <span className="text-xs text-slate-500">Regenerates only this page’s content.</span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-black px-3 py-1 text-sm">
                        <ThemeIcon theme={pageConfig.theme} className="h-5 w-5" />
                        <span className="capitalize">{pageConfig.theme} theme</span>
                      </div>
                      <p className="mt-2 text-base">{pageInstruction}</p>
                      {showObjectiveLine && <p className="mt-1 text-base font-semibold">Objective: {pageObjective}</p>}
                      <p className="mt-2 text-xl">
                        Name:{' '}
                        <span className="inline-block min-w-64 border-b-2 border-solid border-black">
                          {pageConfig.childName || '________________'}
                        </span>
                      </p>
                    </header>
                    <WorksheetBody config={pageConfig} data={pageData.student} />
                    {showStandardsTags && getStandardsTagsForType(pageConfig.type).length > 0 && (
                      <footer className="mt-6 border-t border-slate-300 pt-2 text-xs text-slate-700 print:text-black">
                        <span className="font-semibold">Standards:</span> {getStandardsTagsForType(pageConfig.type).join(', ')}
                      </footer>
                    )}
                  </section>

                  {showAnswerKey && pageData.answers && (
                    <section
                      className="worksheet-paper rounded-xl border border-slate-300 bg-white p-10 shadow-sm print:rounded-none print:border-none print:p-10 print:shadow-none"
                      data-page="worksheet"
                      style={{
                        '--trace-opacity': pageConfig.traceOpacity ?? config.traceOpacity,
                        '--trace-font-family':
                          (pageConfig.traceFont ?? config.traceFont) === 'system'
                            ? '"Avenir Next", "Segoe UI", Arial, sans-serif'
                            : '"Playwrite NZ Basic Guides"',
                      }}
                    >
                      <header className="mb-8 border-b border-slate-300 pb-4">
                        <p className="text-sm uppercase tracking-widest text-slate-500">
                          Weekly Packet — Answer Key (Page {idx + 1})
                        </p>
                        <h2 className="text-4xl font-black">{pageTitle} — Answer Key</h2>
                      </header>
                      <AnswerKeyBody config={pageConfig} answers={pageData.answers} />
                    </section>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {mode === 'single' && showAnswerKey && worksheetData.answers && (
          <section
            className="worksheet-paper rounded-xl border border-slate-300 bg-white p-10 shadow-sm print:rounded-none print:border-none print:p-10 print:shadow-none"
            data-page="worksheet"
            style={{
              '--trace-opacity': config.traceOpacity,
              '--trace-font-family':
                config.traceFont === 'system' ? '"Avenir Next", "Segoe UI", Arial, sans-serif' : '"Playwrite NZ Basic Guides"',
            }}
          >
            <header className="mb-8 border-b border-slate-300 pb-4">
              <p className="text-sm uppercase tracking-widest text-slate-500">Answer Key</p>
              <h2 className="text-4xl font-black">{title} — Answer Key</h2>
            </header>
            <AnswerKeyBody config={config} answers={worksheetData.answers} />
            {showStandardsTags && getStandardsTagsForType(config.type).length > 0 && (
              <footer className="mt-6 border-t border-slate-300 pt-2 text-xs text-slate-700 print:text-black">
                <span className="font-semibold">Standards:</span> {getStandardsTagsForType(config.type).join(', ')}
              </footer>
            )}
          </section>
        )}
      </div>
    </main>
  )
}

