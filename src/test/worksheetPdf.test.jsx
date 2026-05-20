import { describe, expect, test } from 'vitest'
import { renderWorksheetBody } from '../pdf/worksheetPdf.jsx'

const flattenText = (node) => {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenText).join('')
  if (node.props) return flattenText(node.props.children)
  return ''
}

describe('worksheet PDF rendering', () => {
  test('counting objects includes countable marks in the downloaded PDF body', () => {
    const body = renderWorksheetBody({
      page: {
        config: { type: 'countingObjects' },
        student: [{ total: 3, theme: 'dogs' }],
      },
    })

    expect(flattenText(body)).toContain('Count: O O O')
  })

  test('matching PDF uses generated word fields instead of undefined pairs', () => {
    const body = renderWorksheetBody({
      page: {
        config: { type: 'matching' },
        student: [{ word: 'puppy', theme: 'dogs' }],
      },
    })
    const text = flattenText(body)

    expect(text).toContain('puppy')
    expect(text).not.toContain('undefined')
  })

  test('color by number renders worksheet instructions instead of raw JSON', () => {
    const body = renderWorksheetBody({
      page: {
        config: { type: 'colorByNumber' },
        student: [{ n: 2, shape: 'circle' }],
      },
    })
    const text = flattenText(body)

    expect(text).toContain('Color this shape with number 2')
    expect(text).toContain('Color key:')
    expect(text).not.toContain('{"n"')
  })
})
