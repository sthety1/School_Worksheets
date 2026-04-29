const clampScore = (value) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return Math.max(0, Math.min(5, num))
}

const presetLabel = (preset) => {
  if (preset === 'preK') return 'Pre-K'
  if (preset === 'kEarly') return 'K Early'
  if (preset === 'kMid') return 'K Mid'
  return 'K End'
}

export function recommendPlacementPreset(scores) {
  const letterTracing = clampScore(scores?.letterTracing)
  const phonics = clampScore(scores?.phonics)
  const countingObjects = clampScore(scores?.countingObjects)
  const numberTracing = clampScore(scores?.numberTracing)
  const addition = clampScore(scores?.addition)
  const extra = clampScore(scores?.extra)

  const literacy = letterTracing + phonics // 0–10
  const math = countingObjects + numberTracing + addition // 0–15
  const total = literacy + math + extra // 0–30

  let preset = 'kEnd'
  if (total <= 10) preset = 'preK'
  else if (total <= 16) preset = 'kEarly'
  else if (total <= 22) preset = 'kMid'

  const label = presetLabel(preset)
  const explanation = `Your scores add up to ${total} out of 30 (about ${literacy}/10 for reading routines, ${math}/15 for number work${
    extra ? `, plus ${extra}/5 optional` : ''
  }). Higher totals usually mean your child may be comfortable starting on a slightly higher preset.`

  return { preset, label, explanation, total, literacy, math, extra }
}

