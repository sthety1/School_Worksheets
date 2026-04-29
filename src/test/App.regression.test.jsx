import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

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
})
