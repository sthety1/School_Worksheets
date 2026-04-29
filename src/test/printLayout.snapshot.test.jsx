import { render } from '@testing-library/react'
import App from '../AppNew'

describe('print layout snapshots', () => {
  test('single worksheet page renders consistently', () => {
    const { container } = render(<App />)
    const page = container.querySelector('[data-page="worksheet"]')
    expect(page).toBeTruthy()
    expect(page).toMatchSnapshot()
  })
})

