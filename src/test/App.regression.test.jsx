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
})
