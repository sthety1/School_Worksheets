export function formatPdfCountingRow(row, idx) {
  const total = Number(row?.total)
  const count = Number.isFinite(total) ? Math.max(0, Math.min(20, Math.trunc(total))) : 0
  const markers = count > 0 ? Array.from({ length: count }, () => 'O').join(' ') : 'objects'
  return `${idx + 1}. Count: ${markers}   Total: ______`
}

export function formatPdfMatchingRow(row, idx) {
  const left = row?.wordLeft ?? row?.word ?? ''
  const right = row?.wordRight ?? row?.word ?? ''
  return `${idx + 1}. ${left}  ------  ${right}`
}
