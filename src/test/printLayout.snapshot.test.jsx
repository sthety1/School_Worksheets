import { fireEvent, render, screen } from '@testing-library/react'
import App from '../AppNew'

describe('print layout snapshots', () => {
  test('single worksheet page renders consistently', () => {
    const { container } = render(<App />)
    // Pin inputs so snapshots don't drift when defaults change.
    fireEvent.change(screen.getByLabelText('Skill Preset'), { target: { value: 'kEarly' } })
    const problemsInput = container.querySelector('input[type="number"]')
    expect(problemsInput).toBeTruthy()
    fireEvent.change(problemsInput, { target: { value: 10 } })
    const page = container.querySelector('[data-page="worksheet"]')
    expect(page).toBeTruthy()
    expect(page).toMatchSnapshot()
  })

  test('single worksheet page renders standards tags when enabled', () => {
    const { container } = render(<App />)
    fireEvent.change(screen.getByLabelText('Skill Preset'), { target: { value: 'kEarly' } })
    const problemsInput = container.querySelector('input[type="number"]')
    expect(problemsInput).toBeTruthy()
    fireEvent.change(problemsInput, { target: { value: 10 } })
    fireEvent.click(screen.getByLabelText('Show standards tags'))
    const page = container.querySelector('[data-page="worksheet"]')
    expect(page).toBeTruthy()
    expect(page).toMatchSnapshot()
  })

  test('single worksheet renders answer key page when enabled', () => {
    const { container } = render(<App />)
    fireEvent.change(screen.getByLabelText('Skill Preset'), { target: { value: 'kEarly' } })
    fireEvent.click(screen.getByLabelText('Show answer key'))
    fireEvent.change(screen.getByLabelText('Worksheet Type'), { target: { value: 'addition' } })
    const problemsInput = container.querySelector('input[type="number"]')
    expect(problemsInput).toBeTruthy()
    fireEvent.change(problemsInput, { target: { value: 10 } })
    const pages = Array.from(container.querySelectorAll('[data-page="worksheet"]'))
    expect(pages.length).toBe(2)
    expect(pages.map((p) => p.outerHTML).join('\n')).toMatchSnapshot()
  })
})

