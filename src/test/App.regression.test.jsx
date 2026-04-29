import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../AppNew'

describe('app regression coverage', () => {
  test('defaults to K End preset for new sessions', () => {
    const { container } = render(<App />)

    expect(screen.getByLabelText('Skill Preset')).toHaveValue('kEnd')
    // K End default for number tracing is 12 in the problem plan.
    const problemsInput = container.querySelector('input[type="number"]')
    expect(problemsInput).toBeTruthy()
    expect(problemsInput).toHaveValue(12)
  })

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

  test('placement flow recommends a preset and can apply it', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Mode'), 'packet')
    await user.selectOptions(screen.getByLabelText('Packet Template'), 'placement')
    await user.click(screen.getByRole('button', { name: 'Generate Placement Packet' }))

    expect(document.querySelectorAll('[data-page="worksheet"]').length).toBe(5)

    await user.clear(screen.getByLabelText('Letter tracing'))
    await user.type(screen.getByLabelText('Letter tracing'), '0')
    await user.clear(screen.getByLabelText('Phonics'))
    await user.type(screen.getByLabelText('Phonics'), '0')
    await user.clear(screen.getByLabelText('Counting'))
    await user.type(screen.getByLabelText('Counting'), '0')
    await user.clear(screen.getByLabelText('Number tracing'))
    await user.type(screen.getByLabelText('Number tracing'), '0')
    await user.clear(screen.getByLabelText('Addition'))
    await user.type(screen.getByLabelText('Addition'), '0')

    expect(screen.getByText(/Suggested starting preset: Pre-K/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Use this preset' }))
    expect(screen.getByLabelText('Skill Preset')).toHaveValue('preK')
  })

  test('reset to recommended defaults restores suggested problem count', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const problemsInput = container.querySelector('input[type="number"]')
    expect(problemsInput).toBeTruthy()
    await user.clear(problemsInput)
    await user.type(problemsInput, '4')
    await user.click(screen.getByRole('button', { name: /Reset worksheet to recommended defaults/i }))
    expect(container.querySelector('input[type="number"]')).toHaveValue(12)
  })

  test('use last packet settings starts disabled until a packet has been generated', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /Use last packet settings/i })).toBeDisabled()
  })

  test('print preview mode hides sidebar and can exit', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Print Preview' }))
    expect(screen.getByRole('button', { name: 'Exit Preview' })).toBeInTheDocument()
    // Sidebar is hidden, but the worksheet page still exists.
    expect(document.querySelector('[data-page="worksheet"]')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Exit Preview' }))
    expect(screen.queryByRole('button', { name: 'Exit Preview' })).not.toBeInTheDocument()
  })

  test('reroll packet page does not change page count', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Mode'), 'packet')
    await user.click(screen.getByRole('button', { name: 'Generate Weekly Packet' }))
    expect(document.querySelectorAll('[data-page="worksheet"]').length).toBe(5)

    await user.click(screen.getAllByRole('button', { name: 'Reroll this page' })[0])
    expect(document.querySelectorAll('[data-page="worksheet"]').length).toBe(5)
    expect(screen.getByText(/Packet page 1 regenerated\./)).toBeInTheDocument()
  })

  test('can import child profiles from JSON', async () => {
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

    const importBtn = screen.getByRole('button', { name: 'Import JSON' })
    expect(importBtn).toBeInTheDocument()

    const fileInput = document.querySelector('input[type="file"][accept="application/json"]')
    expect(fileInput).toBeTruthy()

    const file = new File(
      [
        JSON.stringify({
          version: 1,
          profiles: [
            {
              id: 'Imported One',
              name: 'Imported One',
              savedAt: Date.now(),
              config: { childName: 'Mia', skillLevel: 'kEarly', theme: 'dogs', sightWordSource: 'dolchPrePrimer', customWordList: '' },
            },
          ],
        }),
      ],
      'profiles.json',
      { type: 'application/json' },
    )

    await user.upload(fileInput, file)

    await user.selectOptions(screen.getByLabelText('Load profile'), 'Imported One')
    expect(screen.getByLabelText('Child Name')).toHaveValue('Mia')

    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    })
  })

  test('standards tags are hidden by default and appear when enabled', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByText(/Standards:/)).not.toBeInTheDocument()
    await user.click(screen.getByLabelText('Show Common Core standard codes on the page'))
    expect(screen.getByText(/Standards:/)).toBeInTheDocument()
  })

  test('answer key page appears when enabled for supported types', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'addition')
    await user.click(screen.getByLabelText('Include answer key on screen and when printing'))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(2)
    expect(screen.getAllByText(/Answer Key/).length).toBeGreaterThan(0)
  })

  test('ten-frames answer key page appears when enabled', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'tenFrames')
    await user.click(screen.getByLabelText('Include answer key on screen and when printing'))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(2)
  })

  test('cvc words answer key page appears when enabled', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'cvcWords')
    await user.click(screen.getByLabelText('Include answer key on screen and when printing'))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(2)
  })

  test('sentence tracing does not create an answer key page', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'sentenceTracing')
    await user.click(screen.getByLabelText('Include answer key on screen and when printing'))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(1)
  })

  test('patterns answer key page appears when enabled', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'patterns')
    await user.click(screen.getByLabelText('Include answer key on screen and when printing'))

    const pages = document.querySelectorAll('[data-page="worksheet"]')
    expect(pages.length).toBe(2)
  })

  test('new worksheet types render a worksheet frame', async () => {
    const user = userEvent.setup()
    render(<App />)

    const types = [
      { type: 'rhymeMatch', text: /Cue:/i },
      { type: 'syllableSort', text: /Word:/i },
      { type: 'numberBonds', text: /\+/ },
      { type: 'subitizing', text: /How many dots/i },
      { type: 'measurementCompare', text: /Which is/i },
      { type: 'numberLine', text: /Missing number/i },
    ]

    for (const item of types) {
      await user.selectOptions(screen.getByLabelText('Worksheet Type'), item.type)
      await user.click(screen.getByRole('button', { name: 'Generate Worksheet' }))
      const page = document.querySelector('[data-page="worksheet"]')
      expect(page).toBeTruthy()
      expect(page.textContent).toMatch(item.text)
    }
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

  test('custom sight words persist in saved profiles', async () => {
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

    await user.selectOptions(screen.getByLabelText('Worksheet Type'), 'sightWords')
    await user.selectOptions(screen.getByLabelText('Sight Word Source'), 'custom')
    await user.type(screen.getByLabelText('Custom Words (comma or new line)'), 'cat\ndog\nsun')

    await user.type(screen.getByLabelText('Profile name'), 'Custom Words Test')
    await user.click(screen.getByRole('button', { name: 'Save Profile' }))

    // Prove load restores it.
    await user.selectOptions(screen.getByLabelText('Sight Word Source'), 'dolchPrePrimer')
    expect(screen.queryByLabelText('Custom Words (comma or new line)')).not.toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Load profile'), 'Custom Words Test')
    expect(screen.getByLabelText('Sight Word Source')).toHaveValue('custom')
    expect(screen.getByLabelText('Custom Words (comma or new line)')).toHaveValue('cat\ndog\nsun')

    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    })
  })
})
