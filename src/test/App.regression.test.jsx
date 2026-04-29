import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../AppNew'

describe('app regression coverage', () => {
  test('shows sight word source controls when sight words are selected', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'sightWords')

    expect(screen.getByLabelText('Sight Word Source')).toBeInTheDocument()
  })

  test('reshuffle updates status message', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Reshuffle Problems' }))

    expect(screen.getByText('Worksheet regenerated.')).toBeInTheDocument()
  })

  test('print action invokes browser print', async () => {
    const user = userEvent.setup()
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Print Worksheet' }))

    expect(printSpy).toHaveBeenCalledTimes(1)
    printSpy.mockRestore()
  })

  test('can save and load a child profile', async () => {
    const user = userEvent.setup()
    const store = new Map()
    const originalLocalStorage = globalThis.localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (k) => store.get(k) ?? null,
        setItem: (k, v) => store.set(k, String(v)),
        removeItem: (k) => store.delete(k),
        clear: () => store.clear(),
      },
      configurable: true,
    })

    render(<App />)

    await user.type(screen.getByLabelText('Child Name'), 'Ava')
    await user.type(screen.getByLabelText('Profile name'), 'Ava (K Early)')
    await user.click(screen.getByRole('button', { name: 'Save Profile' }))

    // Clear current name to prove load works.
    await user.clear(screen.getByLabelText('Child Name'))
    expect(screen.getByLabelText('Child Name')).toHaveValue('')

    await user.selectOptions(screen.getByLabelText('Load profile'), 'Ava (K Early)')
    expect(screen.getByLabelText('Child Name')).toHaveValue('Ava')

    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    })
  })

  test('packet mode generates 5 pages', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Mode'), 'packet')
    await user.click(screen.getByRole('button', { name: 'Generate Weekly Packet' }))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(5)
  })

  test('standards tags are hidden by default and appear when enabled', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByText(/Standards:/)).not.toBeInTheDocument()
    await user.click(screen.getByLabelText('Show standards tags'))
    expect(screen.getByText(/Standards:/)).toBeInTheDocument()
  })

  test('answer key page appears when enabled for supported types', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'addition')
    await user.click(screen.getByLabelText('Show answer key'))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(2)
    expect(screen.getAllByText(/Answer Key/).length).toBeGreaterThan(0)
  })

  test('ten-frames answer key page appears when enabled', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'tenFrames')
    await user.click(screen.getByLabelText('Show answer key'))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(2)
  })

  test('cvc words answer key page appears when enabled', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'cvcWords')
    await user.click(screen.getByLabelText('Show answer key'))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(2)
  })

  test('sentence tracing does not create an answer key page', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'sentenceTracing')
    await user.click(screen.getByLabelText('Show answer key'))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(1)
  })

  test('patterns answer key page appears when enabled', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'patterns')
    await user.click(screen.getByLabelText('Show answer key'))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(2)
  })

  test('instruction override persists in saved profiles', async () => {
    const user = userEvent.setup()
    const store = new Map()
    const originalLocalStorage = globalThis.localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (k) => store.get(k) ?? null,
        setItem: (k, v) => store.set(k, String(v)),
        removeItem: (k) => store.delete(k),
        clear: () => store.clear(),
      },
      configurable: true,
    })

    render(<App />)

    await user.type(screen.getByLabelText('Instruction text'), 'Circle the correct answers.')
    await user.type(screen.getByLabelText('Profile name'), 'Override Test')
    await user.click(screen.getByRole('button', { name: 'Save Profile' }))

    await user.clear(screen.getByLabelText('Instruction text'))
    expect(screen.getByLabelText('Instruction text')).toHaveValue('')

    await user.selectOptions(screen.getByLabelText('Load profile'), 'Override Test')
    expect(screen.getByLabelText('Instruction text')).toHaveValue('Circle the correct answers.')

    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    })
  })
})
