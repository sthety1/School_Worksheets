import { describe, expect, test } from 'vitest'
import { renderWorksheetBody } from '../pdf/worksheetPdf.jsx'

const collectText = (node) => {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(collectText).join('')
  return collectText(node.props?.children)
}

const countKeysWithPrefix = (node, prefix) => {
  if (node == null || typeof node === 'boolean' || typeof node === 'string' || typeof node === 'number') return 0
  if (Array.isArray(node)) return node.reduce((total, child) => total + countKeysWithPrefix(child, prefix), 0)
  const self = String(node.key ?? '').startsWith(prefix) ? 1 : 0
  return self + countKeysWithPrefix(node.props?.children, prefix)
}

describe('PDF worksheet body rendering', () => {
  test('matching worksheets render generated words instead of undefined placeholders', () => {
    const tree = renderWorksheetBody({
      page: {
        config: { type: 'matching' },
        student: [{ word: 'dog', theme: 'dogs' }],
      },
    })

    const text = collectText(tree)
    expect(text).toContain('dog')
    expect(text).not.toContain('undefined')
  })

  test('counting objects PDFs include the count stimulus', () => {
    const tree = renderWorksheetBody({
      page: {
        config: { type: 'countingObjects' },
        student: [{ total: 4, theme: 'dogs' }],
      },
    })

    expect(collectText(tree)).toContain('Count the objects')
    expect(countKeysWithPrefix(tree, 'count-dot-0-')).toBe(4)
  })

  test('ten-frame PDFs include ten frame cells', () => {
    const tree = renderWorksheetBody({
      page: {
        config: { type: 'tenFrames' },
        student: [{ total: 6 }],
      },
    })

    expect(collectText(tree)).toContain('Count the ten-frame')
    expect(countKeysWithPrefix(tree, 'tf-cell-0-')).toBe(10)
  })

  test('color-by-number PDFs render worksheet instructions instead of raw JSON', () => {
    const tree = renderWorksheetBody({
      page: {
        config: { type: 'colorByNumber' },
        student: [{ n: 1, shape: 'Star' }],
      },
    })

    const text = collectText(tree)
    expect(text).toContain('color with number 1')
    expect(text).toContain('Color key')
    expect(text).not.toContain('{"n":1')
  })
})
