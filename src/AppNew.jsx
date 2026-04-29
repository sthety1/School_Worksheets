import { useEffect, useMemo, useRef, useState } from 'react'
import {
  generateWorksheetData,
  getMaxProblems,
  sightWordSources,
  skillProfiles,
} from './worksheetEngine'
import { buildPacketConfigs, packetTemplates } from './packetTemplates'
import { ThemeIcon } from './themeIcons'

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
  matching: { preK: 6, kEarly: 6, kMid: 6, kEnd: 6 },
  phonics: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
  colorByNumber: { preK: 6, kEarly: 10, kMid: 10, kEnd: 12 },
}

const getPresetProblems = (type, skillLevel) => problemPlanByType[type]?.[skillLevel] ?? 10

const RECENT_MEMORY_KEY = 'worksheet_recent_memory_v1'
const PROFILES_KEY = 'worksheet_child_profiles_v1'

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

export default function AppNew() {
  const sheetRef = useRef(null)
  const packetContainerRef = useRef(null)

  const [config, setConfig] = useState({
    type: 'numberTracing',
    difficulty: 'easy',
    skillLevel: 'kEarly',
    problems: getPresetProblems('numberTracing', 'kEarly'),
    theme: 'dogs',
    childName: '',
    sightWordSource: 'dolchPrePrimer',
    customWordList: '',
  })

  const [mode, setMode] = useState('single')
  const [packetTemplate, setPacketTemplate] = useState('mixed')
  const [packetPages, setPacketPages] = useState([])
  const [packetWarnings, setPacketWarnings] = useState([])

  const [generationId, setGenerationId] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')

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
  const instruction = useMemo(() => getInstructionByType(config.type), [config.type])
  const maxProblems = useMemo(() => getMaxProblems(config.type), [config.type])

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

  const handleGenerate = () => {
    const memoryPatch = { ...recentMemory }
    if (config.type === 'numberTracing') memoryPatch.numberTracing = worksheetData.slice(-8)
    if (config.type === 'letterTracing') memoryPatch.letterTracing = worksheetData.slice(-10)
    if (config.type === 'sightWords') memoryPatch.sightWords = worksheetData.slice(-12)
    if (config.type === 'matching') memoryPatch.matching = worksheetData.map((item) => item.word).slice(-6)
    if (config.type === 'phonics') memoryPatch.phonics = worksheetData.slice(-10)
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

  const handlePrint = () => {
    setStatusMessage('Opening print dialog...')
    window.print()
  }

  const handleSaveAsPdf = async () => {
    setStatusMessage('Opening print dialog. Choose "Save as PDF" as destination.')
    window.print()
  }

  // Profiles
  const [profiles, setProfiles] = useState(() => readJsonFromStorage(PROFILES_KEY, []))
  const [profileName, setProfileName] = useState('')
  const [selectedProfileId, setSelectedProfileId] = useState('')

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
      problems: Math.min(prev.problems, getMaxProblems(prev.type)),
    }))
    if (found.config.packetTemplate) setPacketTemplate(found.config.packetTemplate)
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
                <p className="mt-1 text-sm text-slate-600">Choose a template, then click “Generate Weekly Packet”.</p>
              </div>
            )}
            {packetPages.map((pageConfig, idx) => {
              const pageTitle = worksheetTypes.find((t) => t.value === pageConfig.type)?.label ?? 'Worksheet'
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

