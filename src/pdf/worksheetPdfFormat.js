export function getPdfCountingPrompt(row, idx) {
  const total = Math.max(0, Math.min(50, Number(row?.total) || 0))
  const marks = Array.from({ length: total }, () => 'o').join(' ')
  return `${idx + 1}. Count the objects: ${marks}`
}

export function getPdfMatchingPrompt(row, idx) {
  const word = String(row?.word ?? '').trim()
  return `${idx + 1}. ${word} ------ ${word}`
}
