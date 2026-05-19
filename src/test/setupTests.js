import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

beforeEach(() => {
  globalThis.localStorage?.clear?.()
  globalThis.sessionStorage?.clear?.()
})
